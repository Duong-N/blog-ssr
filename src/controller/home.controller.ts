import { Request, Response } from 'express';
import blogModel from '../module/blogModel';

export const getHomePage = async (req: Request, res: Response) => {
  try {
    const blogs = await blogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    res.render('home', {
      blogs,
      user: res.locals.user,
      error: null,
    });
  } catch (error) {
    console.error('Lỗi khi tải trang home:', error);
    res.render('home', {
      blogs: [],
      user: res.locals.user,
      error: 'Lỗi server',
    });
  }
};