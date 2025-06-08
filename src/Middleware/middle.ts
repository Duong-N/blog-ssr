import { Request, Response, NextFunction } from 'express';
import userModel from '../module/userModel';

export function checkLogin(req: Request, res: Response, next: NextFunction) {
  const user = (req.session as { user?: SessionUser }).user;
  if (user) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

export function checkadmin(req: Request, res: Response, next: NextFunction) {
  const user = (req.session as { user?: SessionUser }).user;
  console.log('Session user:', user);
  if (user?.role === 'admin') {
    console.log(user.role);
    return next();
  } else {
    return res.redirect('/');
  }
}

export function injectUserToView(req: Request, res: Response, next: NextFunction) {
  res.locals.user = (req.session as { user?: SessionUser }).user || null;
  next();
}

export const setUser = async (req: Request, res: Response, next: NextFunction) => {
  const sessionUser = (req.session as { user?: SessionUser }).user;
  if (sessionUser) {
    try {
      const dbUser = await userModel.findOne({ email: sessionUser.email }).select('fullname email avatar').lean();
      res.locals.user = dbUser
        ? {
            fullname: dbUser.fullname,
            email: dbUser.email,
            avatar: dbUser.avatar || '/images/default-avatar.png',
          }
        : null;
    } catch (error) {
      console.error('Error setting user:', error);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};
