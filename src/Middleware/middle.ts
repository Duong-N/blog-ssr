import { Request, Response, NextFunction } from 'express';

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
