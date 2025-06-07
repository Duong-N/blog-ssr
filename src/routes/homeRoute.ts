import { Router } from 'express';
import { getHomePage } from '../controller/home.controller';

const router = Router();
router.get('/', getHomePage);
export default router;