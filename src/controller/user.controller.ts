import { Request, Response } from 'express';
import userModel from '../module/userModel';
import { hashPassword } from '../helper/hashPassword';
import { validateDTO } from '../helper/validateDTO';
import { UpdateUserDTO } from '../dto/UpdateDto';


export const getProfile = async (req: Request, res: Response) => {
  const sessionUser = (req.session as { user?: SessionUser }).user;
  if (!sessionUser) {
    return res.redirect('/login');
  }

  try {
    const user = await userModel.findOne({ email: sessionUser.email });
    if (!user) {
      return res.render('login', { error: 'Người dùng không tồn tại' });
    }
    res.render('profile', {
      user: {
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar || '',
      },
      message: req.query.message,
      error: req.query.error,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin profile:', error);
    res.render('profile', { error: 'Có lỗi xảy ra khi tải profile' });
  }
};

// Xử lý cập nhật profile
export const updateProfile = async (req: Request, res: Response) => {
  const sessionUser = (req.session as { user?: SessionUser }).user;
  if (!sessionUser) {
    return res.redirect('/login');
  }

  // Validate DTO
  const userData = await validateDTO(UpdateUserDTO, req.body, res, 'profile');
  if (!userData) return;

  try {
    const user = await userModel.findOne({ email: sessionUser.email });
    if (!user) {
      return res.render('profile', { error: 'Người dùng không tồn tại' });
    }

    // Kiểm tra email mới có bị trùng không
    if (userData.email !== sessionUser.email) {
      const checkExist = await userModel.findOne({ email: userData.email });
      if (checkExist) {
        return res.render('profile', { error: 'Email đã được sử dụng' });
      }
    }

    // Xử lý avatar từ file upload
    let avatar = user.avatar; // Giữ avatar cũ nếu không upload
    if (req.file) {
      avatar = `/uploads/${req.file.filename}`;
    }

    // Xử lý password
    const updateData: any = {
      fullname: userData.fullname,
      email: userData.email,
      avatar,
    };

    if (userData.password) {
      updateData.password = await hashPassword(userData.password);
    }

    // Cập nhật thông tin
    await userModel.updateOne(
      { email: sessionUser.email },
      { $set: updateData }
    );

    // Cập nhật session nếu email thay đổi
    if (userData.email !== sessionUser.email) {
      (req.session as unknown as { user: SessionUser }).user!.email = userData.email;
    }

    res.redirect('/profile?message=Cập nhật profile thành công');
  } catch (error: any) {
    console.error('Lỗi khi cập nhật profile:', error);
    // Nếu lỗi từ multer (ví dụ file không đúng định dạng)
    const errorMessage = error.message.includes('Chỉ chấp nhận file ảnh')
      ? error.message
      : 'Có lỗi xảy ra trong quá trình cập nhật';
    res.render('profile', {
      error: errorMessage,
      user: req.body, // Giữ dữ liệu form
    });
  }
};