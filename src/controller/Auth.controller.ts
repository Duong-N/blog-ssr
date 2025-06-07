import { Request, Response } from 'express';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import userModel from '../module/userModel';
import { comPare, hashPassword } from '../helper/hashPassword';
import { loginDTO } from '../dto/loginDTO';
import { validateDTO } from '../helper/validateDTO';

export const register = async (req: Request, res: Response) => {
  const userData = await validateDTO(CreateUserDTO, req.body, res, 'register');
  // If validation fails, the helper already rendered the view, so we can return
  if (!userData) return;
  try {
    // Kiểm tra email đã tồn tại
    const checkExist = await userModel.findOne({ email: userData.email });
    if (checkExist) {
      return res.render('register', { error: 'Tài khoản đã tồn tại' });
    }

    // Hash password
    const hash = await hashPassword(userData.password);

    // Tạo user mới
    const { password, ...restUserData } = userData;
    const newUserData = { ...restUserData, password: hash };
    const newUser = new userModel(newUserData);
    await newUser.save();
    return res.render('register', { message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.render('register', { error: 'Có lỗi xảy ra trong quá trình đăng ký' });
  }
};
export const login = async (req: Request, res: Response) => {
  const userData = await validateDTO(loginDTO, req.body, res, 'register');
  if (!userData) return;
  try {
    const checkExist = await userModel.findOne({ email: userData.email });
    if (!checkExist) {
      return res.render('login', { error: 'Người dùng không tồn tại' });
    }
    const comparePass = await comPare(userData.password, checkExist.password);

    if (comparePass) {
      (req.session as { user?: SessionUser }).user = {
        email: checkExist.email,
        role: checkExist.role || 'user',
      };
      return res.render('login', { message: 'Đăng nhập thành công' });
    }
    return res.render('login', { error: 'Sai tài khoản hoặc mật khẩu ' });
  } catch (error) {
    console.error(error);
    return res.render('login', { error: 'Lỗi server' });
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Lỗi khi huỷ session:', err);
      return res.status(500).json({ message: 'Logout fail' });
    }
    res.clearCookie('connect.sid'); // Xoá cookie session nếu dùng
    return res.redirect('/');
  });
};
