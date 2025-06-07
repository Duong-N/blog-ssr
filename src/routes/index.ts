// routes/index.js
import { Router } from 'express';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import blogRoutes from './blogRoute';
import { checkadmin } from '../Middleware/middle';
import homeRoute from './homeRoute';

const router = Router();

// Gắn các route con
router.use(authRoutes); // /register, /login
router.use('/admin', checkadmin, adminRoutes); // Route admin
router.use(blogRoutes); // /, /blog/post/:id, /blog/category/:name
router.use(homeRoute);

export default router;