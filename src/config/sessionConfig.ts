import MongoStore from 'connect-mongo';

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your_default_secret', // Khóa bí mật cho session
  resave: false, // Không lưu lại session nếu không thay đổi
  saveUninitialized: false, // Không lưu lại session nếu chưa thay đổi
  store: MongoStore.create({
    mongoUrl: `${process.env.MONGO_URI}/${process.env.MONGO_DB}`, // Kết nối MongoDB
    collectionName: 'sessions', // Tên collection lưu session
    ttl: 14 * 24 * 60 * 60, // Thời gian sống của session (14 ngày)
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Thời gian hết hạn của cookie (1 ngày)
    httpOnly: true, // Không cho phép JavaScript truy cập cookie
    secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS nếu môi trường là production
    sameSite: 'strict' as 'strict', // Sử dụng 'strict' thay vì string
  },
};
