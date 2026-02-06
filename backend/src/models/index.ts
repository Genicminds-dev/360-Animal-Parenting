import sequelize from '../config/database';
import User from './User';
import Role from './Role';
import BlacklistedToken from './BlacklistedToken';
import HoldingStation from './HoldingStation';
import Vendor from './Vendor';
import Animal from './Animal';
import Payment from './Payment';
import HoldingStationCaretaker from './HoldingStationCaretaker';
import HoldingStationIncharge from './HoldingStationIncharge';

export function setupAssociations() {
  User.belongsTo(Role, { foreignKey: 'roleId' });
  Role.hasMany(User, { foreignKey: 'roleId' });
  Animal.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });
  Vendor.hasMany(Animal, { foreignKey: "vendorId", as: "animals" });
  Animal.belongsTo(HoldingStation, { foreignKey: "quarantineId", as: "holdingStation" });
  HoldingStation.hasMany(Animal, { foreignKey: "quarantineId", as: "animals" });
  HoldingStation.hasMany(HoldingStationIncharge, { foreignKey: "holdingStationId", as: "centerIncharge", onDelete: "CASCADE" });
  HoldingStationIncharge.belongsTo(HoldingStation, { foreignKey: "holdingStationId", as: "holdingStation" });
  HoldingStation.hasMany(HoldingStationCaretaker, { foreignKey: "holdingStationId", as: "caretakerDetails", onDelete: "CASCADE" });
  HoldingStationCaretaker.belongsTo(HoldingStation, { foreignKey: "holdingStationId", as: "holdingStation" });
  Payment.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });
  Vendor.hasMany(Payment, { foreignKey: "vendorId", as: "payment" });
}

export {
  sequelize,
  User,
  Role,
  BlacklistedToken,
  HoldingStation,
  HoldingStationCaretaker,
  HoldingStationIncharge,
  Vendor,
  Animal,
  Payment,
};
