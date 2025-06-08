import { Router } from 'express';
import { getProfile, updateProfile } from '../controller/user.controller';
import upload from '../Middleware/upload';
import { checkLogin } from '../Middleware/middle';

const router = Router();

router.get('/profile', checkLogin, getProfile);
router.post('/profile/update', checkLogin, upload.single('avatar'), updateProfile);

export default router;