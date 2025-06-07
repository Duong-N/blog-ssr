// routes/adminBlogRoutes.js
import { Router } from 'express';
import { createBlog, getBlogForm, deleteBlogById } from '../controller/blog.controller';
import upload from '../Middleware/upload';

const router = Router();

// Hiển thị form đăng bài và danh sách bài viết
router.get('/', getBlogForm);

// Tạo bài viết mới
router.post('/', upload.single('image'), createBlog);

// Xóa bài viết
router.delete('/:id', deleteBlogById);

export default router;