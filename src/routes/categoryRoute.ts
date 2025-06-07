// routes/categoryRoutes.js
import { Router } from 'express';
import { createCategory, DeleteById, FindAllCategory } from '../controller/category.controller';

const router = Router();

// Hiển thị danh sách danh mục
router.get('/', FindAllCategory);

// Tạo danh mục mới
router.post('/', createCategory);

// Xóa danh mục
router.delete('/:id', DeleteById);

export default router;