import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: number;
        email: string;
      };
    }
  }
}


export const checkRole = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRoleId = req.user?.role;

    if (!userRoleId || !allowedRoles.includes(userRoleId)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied',
      });
      return;
    }

    next();
  };
};
