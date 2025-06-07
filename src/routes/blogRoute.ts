// routes/blogRoutes.js
import { Router } from 'express';
import { AllBlog, getBlogById } from '../controller/blog.controller';

const router = Router();
// Xem tất cả bài viết
router.get('/blog',AllBlog);


// Chi tiết bài viết
router.get('/blog/post/:id', getBlogById);
export default router;