import { Request, Response, NextFunction } from 'express';
import BlacklistedToken from '../models/BlacklistedToken';

export const checkBlacklistedToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });

    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is blacklisted. Please login again.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error while checking token' });
  }
};
