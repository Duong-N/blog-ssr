import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongodb_URI = process.env.MONGO_URI;
const mongodb_Name = process.env.MONGO_DB;

export const connectDB = async () => {
  try {
    // Kiểm tra biến môi trường
    if (!mongodb_URI || !mongodb_Name) {
      throw new Error('MONGO_URI or MONGO_DB is not defined in .env file');
    }

    console.log('MONGO_URI:', mongodb_URI);
    console.log('MONGO_DB:', mongodb_Name);

    // Kết nối MongoDB với các tùy chọn
    await mongoose.connect(`${mongodb_URI}/${mongodb_Name}`);

    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message); // Log lỗi chi tiết
    process.exit(1);
  }
};

// Lắng nghe sự kiện kết nối
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
