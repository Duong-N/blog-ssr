import { Request, Response, Router } from 'express';
import { login, logout, register } from '../controller/Auth.controller';

const router = Router();
//Register
router.get('/register', (req: Request, res: Response) => {
  res.render('register', { error: null });
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng ký' });
  }
});
//Login
router.get('/login', (req: Request, res: Response) => {
  res.render('login', { error: null });
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    await login(req, res);
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng nhập' });
  }
});

router.get('/logout', async (req: Request, res: Response) => {
  try {
    await logout(req, res);
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng nhập' });
  }
});

export default router;
