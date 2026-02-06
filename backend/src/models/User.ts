import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Role from './Role';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  roleId: number;
  status: 'active' | 'inactive';
  profileImg?: string | null;

  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'status' | 'profileImg'> { }

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public mobile!: string;
  public password!: string;
  public roleId!: number;
  public status!: 'active' | 'inactive';
  public profileImg!: string | null;

  public resetToken!: string | null;
  public resetTokenExpiry!: Date | null;

  public toJSON(): Omit<this, 'password'> {
    const attributes: any = { ...this.get() };
    delete attributes.password;
    return attributes;
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
  }
);

export default User;
