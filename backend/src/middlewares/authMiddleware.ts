import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/BlacklistedToken';
import { User } from '../models';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, error: 'Token missing' });

  try {

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (user.status !== 'active') {
      const expiresAt = new Date(decoded.exp * 1000);

      await BlacklistedToken.findOrCreate({
        where: { token },
        defaults: { token, expiresAt },
      });

      return res.status(403).json({
        success: false,
        forceLogout: true,
        message:
          "Your account has been deactivated by the administrator. Please contact support.",
      });
    }

    const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });
    if (isBlacklisted) {
      return res.status(401).json({ success: false, error: 'Token is blacklisted' });
    }

    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, error: 'Token is invalid or expired' });
  }
};