import sequelize from '../config/database';
import User from './User';
import Role from './Role';
import BlacklistedToken from './BlacklistedToken';
import CommissionAgent from './CommissionAgent';
import Seller from './Seller';
import Animal from './Animal';
import SourceVisit from './SourceVisit';
import ProcuredAnimal from './ProcuredAnimal';
import Logistic from './Logistic';
import QuarantineCenter from './QuarantineCenter';
import Handover from './Handover';

export function setupAssociations() {
  User.belongsTo(Role, { foreignKey: 'roleId' });
  Role.hasMany(User, { foreignKey: 'roleId' });

  Animal.belongsTo(CommissionAgent, { foreignKey: "agentId", as: "commission_agents" });
  CommissionAgent.hasMany(Animal, { foreignKey: "agentId", as: "animals" });

  Animal.belongsTo(Seller, { foreignKey: "sellerId", as: "sellers" });
  Seller.hasMany(Animal, { foreignKey: "sellerId", as: "animals" });

  SourceVisit.belongsTo(User, { foreignKey: "procurementOfficer", as: "users" });
  User.hasMany(SourceVisit, { foreignKey: "procurementOfficer", as: "source_visit" });

  SourceVisit.hasMany(ProcuredAnimal, { foreignKey: "procurementId", as: "procured_animal" });
  ProcuredAnimal.belongsTo(SourceVisit, { foreignKey: "procurementId", as: "source_visit" });

  SourceVisit.hasMany(Logistic, { foreignKey: "procurementId", as: "logistic" });
  Logistic.belongsTo(SourceVisit, { foreignKey: "procurementId", as: "source_visit" });

  SourceVisit.hasMany(QuarantineCenter, { foreignKey: "procurementId", as: "quarantine_center" });
  QuarantineCenter.belongsTo(SourceVisit, { foreignKey: "procurementId", as: "source_visit" });

  SourceVisit.hasMany(Handover, { foreignKey: "procurementId", as: "handover" });
  Handover.belongsTo(SourceVisit, { foreignKey: "procurementId", as: "source_visit" });

  Handover.belongsTo(User, { foreignKey: "handoverOfficer", as: "users" });
  User.hasMany(Handover, { foreignKey: "handoverOfficer", as: "handover" });
}

export {
  sequelize,
  User,
  Role,
  BlacklistedToken,
  CommissionAgent,
  Seller,
  Animal,
  SourceVisit,
  ProcuredAnimal,
  Logistic,
  QuarantineCenter,
  Handover
};
