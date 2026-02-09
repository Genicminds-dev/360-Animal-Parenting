import sequelize from '../config/database';
import User from './User';
import Role from './Role';
import BlacklistedToken from './BlacklistedToken';
import CommissionAgent from './CommissionAgent';
import Seller from './Seller';

export function setupAssociations() {
  User.belongsTo(Role, { foreignKey: 'roleId' });
  Role.hasMany(User, { foreignKey: 'roleId' });
}

export {
  sequelize,
  User,
  Role,
  BlacklistedToken,
  CommissionAgent,
  Seller,
};
