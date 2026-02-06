import { Request, Response } from 'express';
import Role from '../../models/Role';
import { Op } from 'sequelize';

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;

    let whereClause: any = {};

    if (role === 1) {
      whereClause = { roleId: { [Op.in]: [2, 3] } };
    } else {
      whereClause = { roleId: 3 };
    }

    const roles = await Role.findAll({ where: whereClause });

    if (!roles)
      return res.status(404).json({ success: false, message: 'Roles not found' });

    res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};