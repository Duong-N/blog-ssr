// routes/adminRoutes.js
import { Router } from 'express';
import categoryRoutes from './categoryRoute';
import adminBlogRoutes from './adminBlogRoutes';

const router = Router();

// Trang admin chính
router.get('/', (req, res) => {
    res.render('admin', { error: null, partialContent: null });
});

// Gắn các route con
router.use('/category', categoryRoutes);
router.use('/blog', adminBlogRoutes);

export default router;