import express from 'express';
import { engine } from 'express-handlebars';
import { resolve } from 'path';
import router from './routes';
import { connectDB } from './config/database';
import session from 'express-session';
import { sessionConfig } from './config/sessionConfig';
import { injectUserToView } from './Middleware/middle';
import { loadCategoriesForHeader } from './controller/category.controller';
import methodOverride from 'method-override';

const app = express();
connectDB();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, '..', 'public'))); // Đảm bảo trỏ đúng tới public
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
      stringify: (obj: any) => JSON.stringify(obj, null, 2), // Helper hiện có
      truncate: (text: string, length: number, suffix: string = '...') => {
        if (typeof text !== 'string') return text;
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
      },
      formatDate: (date: Date | string, format: string = 'DD/MM/YYYY') => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return ''; // Kiểm tra ngày hợp lệ
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = d.getFullYear();
        if (format === 'DD/MM/YYYY') {
          return `${day}/${month}/${year}`;
        }
        // Có thể thêm các định dạng khác nếu cần
        return d.toLocaleDateString();
      },
    },
  })
);
app.use(loadCategoriesForHeader);
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.set('view engine', '.handlebars');
app.set('views', resolve(__dirname, '..', 'src', 'views'));
app.use(injectUserToView);
// Routes
app.use('/', router);

export default app;

// Debug log
console.log('Đường dẫn public:', resolve(__dirname, '..', 'public'));
