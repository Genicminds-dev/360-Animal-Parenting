import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BlacklistedTokenAttributes {
  id: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

interface BlacklistedTokenCreationAttributes extends Optional<BlacklistedTokenAttributes, 'id' | 'createdAt'> {}

class BlacklistedToken
  extends Model<BlacklistedTokenAttributes, BlacklistedTokenCreationAttributes>
  implements BlacklistedTokenAttributes
{
  public id!: number;
  public token!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

BlacklistedToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'blacklisted_tokens',
    timestamps: false,
  }
);

export default BlacklistedToken;