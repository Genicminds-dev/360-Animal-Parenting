import { Request, Response } from 'express';
import User from '../../models/User';
import Role from '../../models/Role';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Op } from 'sequelize';
import BlacklistedToken from '../../models/BlacklistedToken';
import crypto from 'crypto';
import { sendResetEmail } from '../../utils/email';


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username / email and password are required",
      });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      },
      include: [{ model: Role }]
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact administrator.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid password' });

    const secret = process.env.JWT_SECRET as Secret;
    const expiresIn = process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] ?? '1h';

    const token = jwt.sign(
      { id: user.id, role: user.roleId, email: user.email },
      secret,
      { expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user?.id,
        role: user?.roleId,
        email: user?.email
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to login user" });
  }
};


export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(400).json({ success: false, message: 'No token provided' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    const decoded: any = jwt.verify(token, secret);
    const expiresAt = new Date(decoded.exp * 1000);
    await BlacklistedToken.create({ token, expiresAt });

    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Cannot reset password.",
      });
    }

    if (user.resetTokenExpiry) {
      const now = new Date();

      const lastRequestTime = new Date(
        user.resetTokenExpiry.getTime() - 60 * 60 * 1000
      );

      const diffSeconds = Math.floor(
        (now.getTime() - lastRequestTime.getTime()) / 1000
      );

      const cooldownSeconds = 5 * 60;

      if (diffSeconds < cooldownSeconds) {
        const remainingSeconds = cooldownSeconds - diffSeconds;
        const remainingMinutes = Math.ceil(remainingSeconds / 60);

        return res.status(429).json({
          success: false,
          message: `Please try again after ${remainingMinutes} minute(s)`,
        });
      }
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendResetEmail(user.email, token, user.firstName || "User");

    return res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to send reset link. Please try again later.",
    });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};