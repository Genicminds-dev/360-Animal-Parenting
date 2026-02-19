import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface LogisticAttributes {
  id: number;
  procurementId: number;

  vehicleNo?: string | null;
  driverName?: string | null;
  driverDesignation?: string | null;
  driverMobile?: string | null;
  driverAadhar?: string | null;
  drivingLicense?: string | null;
  licenseCertificate?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

interface LogisticCreationAttributes
  extends Optional<
    LogisticAttributes,
    "id" | 
    "vehicleNo" | 
    "driverName" | 
    "driverDesignation" | 
    "driverMobile" | 
    "driverAadhar" | 
    "drivingLicense" | 
    "licenseCertificate"
  > {}

class Logistic
  extends Model<LogisticAttributes, LogisticCreationAttributes>
  implements LogisticAttributes {

  public id!: number;
  public procurementId!: number;

  public vehicleNo!: string | null;
  public driverName!: string | null;
  public driverDesignation!: string | null;
  public driverMobile!: string | null;
  public driverAadhar!: string | null;
  public drivingLicense!: string | null;
  public licenseCertificate!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Logistic.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    procurementId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "source_visit",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    vehicleNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    driverName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    driverDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    driverMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    driverAadhar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    drivingLicense: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    licenseCertificate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "logistic",
    timestamps: true,
  }
);

export default Logistic;
