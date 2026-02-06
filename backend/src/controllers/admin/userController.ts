import { Request, Response } from 'express';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { Role } from '../../models';
import { Op } from 'sequelize';
import path from 'path';
import fs from "fs";


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;

    let whereClause: any = {};

    if (role === 1) {
      whereClause = { roleId: { [Op.in]: [2, 3] } };
    } else {
      whereClause = { roleId: 3 };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: {
        exclude: ["resetToken", "resetTokenExpiry", "updatedAt", "deletedAt"]
      },
      include: [{ model: Role }]
    });

    if (!users)
      return res.status(404).json({ success: false, message: 'Users not found' });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const loggedInUser = req.user?.id;
    const targetUserId = Number(req.params.id);

    const user = await User.findByPk(targetUserId, {
      attributes: {
        exclude: ["resetToken", "resetTokenExpiry", "updatedAt", "deletedAt"]
      },
      include: [{ model: Role }]
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (role === 2) {
      if (user.id !== loggedInUser && user.roleId !== 3) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not authorized to access this profile"
        });
      }
    }

    if (role === 3 && user.id !== loggedInUser) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only access your own profile"
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user by Id" });
  }
};


export const createUser = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const { firstName, lastName, email, mobile, password, roleId, status } = req.body;

    if (role === 2 && roleId !== 3) {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin can create only Admin users"
      });
    }

    if (roleId === 1) {
      return res.status(403).json({
        success: false,
        message: "MasterAdmin cannot be created"
      });
    }

    const username = email.split('@')[0];

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(400).json({ success: false, message: "User with this email already exists" });
      return;
    }

    const existingMobile = await User.findOne({ where: { mobile } });
    if (existingMobile) {
      res.status(400).json({ success: false, message: "User with this mobile number already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      mobile,
      password: hashedPassword,
      roleId,
      status,
    });

    const createdUser = await User.findByPk(user.id, {
      include: [{ model: Role }]
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser
    });

  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = Object.keys(error.fields || {})[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to add user"
    });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.roleId === 1) {
      return res.status(403).json({
        success: false,
        message: "MasterAdmin cannot be updated"
      });
    }

    if (role === 2 && user.roleId !== 3) {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin can update only Admin users"
      });
    }

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({
        where: {
          email: req.body.email,
          id: { [Op.ne]: user.id },
        },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      req.body.username = req.body.email.split("@")[0];
    }

    if (req.body.mobile && req.body.mobile !== user.mobile) {
      const mobileExists = await User.findOne({
        where: {
          mobile: req.body.mobile,
          id: { [Op.ne]: user.id },
        },
      });

      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message: "User with this mobile number already exists",
        });
      }
    }

    if (req.body.roleId) {
      if (role === 2 && req.body.roleId !== 3) {
        return res.status(403).json({
          success: false,
          message: "SuperAdmin cannot change role to SuperAdmin or MasterAdmin"
        });
      }

      if (req.body.roleId === 1) {
        return res.status(403).json({
          success: false,
          message: "MasterAdmin role cannot be assigned"
        });
      }
    }

    await user.update(req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });

  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = Object.keys(error.fields || {})[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const user = await User.findByPk(req.params.id, {
      paranoid: false,
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.roleId === 1) {
      return res.status(403).json({ success: false, message: "MasterAdmin cannot be deleted" })
    }

    if (role === 2 && user.roleId !== 3) {
      return res.status(403).json({ success: false, message: "SuperAdmin can delete only Admin users" })
    }

    const forceDelete = req.query.status === "true";

    if (forceDelete && role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Only MasterAdmin can permanently delete users"
      });
    }

    await user.destroy({ force: forceDelete });
    return res.status(200).json({
      success: true,
      message: forceDelete
        ? "User permanently deleted"
        : "User soft deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// Users can change their own details

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { firstName, lastName, mobile } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (mobile && mobile !== user.mobile) {
      const mobileExists = await User.findOne({
        where: {
          mobile,
          id: { [Op.ne]: user.id },
        },
      });

      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message: "User with this mobile number already exists",
        });
      }
    }

    const updatedPayload: any = {
      firstName,
      lastName,
      mobile,
    };

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (files?.profileImg?.[0]) {
      const file = files.profileImg[0];

      const newPath = file.path.replace(/\\/g, "/").replace("public", "");

      const oldPath = user.profileImg
        ? path.join("public", user.profileImg)
        : null;

      if (oldPath && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      updatedPayload.profileImg = newPath;
    }

    await user.update(updatedPayload);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });

  } catch (error: any) {
    if (req.files) {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      Object.values(files)
        .flat()
        .forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = Object.keys(error.fields || {})[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// Users can change their own password

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword.trim(), user.password);

    if (!isOldPasswordCorrect) {
      res.status(400).json({ success: false, message: 'Old password is incorrect' });
      return;
    }

    const isSameAsOld = await bcrypt.compare(newPassword.trim(), user.password);
    if (isSameAsOld) {
      res.status(400).json({ success: false, message: 'New password must be different from old password' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = Object.keys(error.fields || {})[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      });
    }
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};


// Edit Password - Only MasterAdmin

export const editPassword = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id',
      });
    }

    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password both are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.roleId === 1) {
      return res.status(403).json({
        success: false,
        message: 'Master Admin password cannot be changed',
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update password',
    });
  }
};