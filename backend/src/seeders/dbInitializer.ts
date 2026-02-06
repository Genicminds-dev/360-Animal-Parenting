import User from "../models/User";
import Role from "../models/Role";
import bcrypt from 'bcryptjs';
import sequelize from "../config/database";

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    await initializeRoles();
    await initializeInitialUsers();

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const initializeRoles = async () => {
  const roles = [
    { roleId: 1, name: "MasterAdmin" },
    { roleId: 2, name: "SuperAdmin" },
    { roleId: 3, name: "Admin" }
  ];

  for (const role of roles) {
    await Role.findOrCreate({
      where: { roleId: role.roleId },
      defaults: role
    });
  }
};

const initializeInitialUsers = async () => {
  const masterAdminData = {
    firstName: "Master",
    lastName: "Admin",
    username: "masteradmin",
    email: "masteradmin@nddb.com",
    mobile: "9999XXXXXX",
    password: await bcrypt.hash("Masteradmin@123", 10),
    roleId: 1,
    status: "active" as const
  };

  const [masterAdmin, masterCreated] = await User.findOrCreate({
    where: { email: masterAdminData.email },
    defaults: masterAdminData
  });

  if (masterCreated) console.log("MasterAdmin created:", masterAdmin.email);
  else console.log("MasterAdmin already exists:", masterAdmin.email);

  const superAdminData = {
    firstName: "Super",
    lastName: "Admin",
    username: "superadmin",
    email: "superadmin@nddb.com",
    mobile: "8888XXXXXX",
    password: await bcrypt.hash("Superadmin@123", 10),
    roleId: 2,
    status: "active" as const
  };

  const [superAdmin, superCreated] = await User.findOrCreate({
    where: { email: superAdminData.email },
    defaults: superAdminData
  });

  if (superCreated) console.log("Superadmin created:", superAdmin.email);
  else console.log("Superadmin already exists:", superAdmin.email);
};
