// routes/blogRoutes.js
import { Router } from 'express';
import { AllBlog, getBlogById } from '../controller/blog.controller';

const router = Router();
// Xem tất cả bài viết
router.get('/blog',AllBlog);
router.get('/search', AllBlog); // Route tìm kiếm


// Chi tiết bài viết
router.get('/blog/post/:id', getBlogById);
export default router;