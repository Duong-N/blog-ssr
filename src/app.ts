import express from 'express';
import { engine } from 'express-handlebars';
import { resolve } from 'path';
import router from './routes';
import { connectDB } from './config/database';
import session from 'express-session';
import { sessionConfig } from './config/sessionConfig';
import { injectUserToView } from './Middleware/middle';
import { loadCategoriesForHeader } from './controller/category.controller';

const app = express();
connectDB();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, '..', 'public'))); // Đảm bảo trỏ đúng tới public
app.use(express.json()); // Thêm để hỗ trợ JSON request từ fetch

// View engine setup
app.engine(
  '.handlebars',
  engine({
    extname: '.handlebars',
    partialsDir: resolve(__dirname, '..', 'src', 'views', 'partials'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      stringify: (obj: any) => JSON.stringify(obj, null, 2),
      truncate: (text: any, length: number, suffix: string = '...') => {
              if (text === null || text === undefined) return '';
              if (typeof text !== 'string') text = String(text); // Chuyển đổi thành chuỗi
              if (text.length <= length) return text;
               return text.substring(0, length) + suffix;
              },
      formatDate: (date: Date | string, format: string = 'DD/MM/YYYY') => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        if (format === 'DD/MM/YYYY') {
          return `${day}/${month}/${year}`;
        }
        return d.toLocaleDateString();
      },
    },
  })
);
app.use(loadCategoriesForHeader);
app.use(session(sessionConfig));
app.set('view engine', '.handlebars');
app.set('views', resolve(__dirname, '..', 'src', 'views'));
app.use(injectUserToView);

// Routes
app.use('/', router);
app.use('/admin/blog', router); // Đảm bảo mount đúng prefix cho admin routes

// Debug log
console.log('Đường dẫn public:', resolve(__dirname, '..', 'public'));

export default app;