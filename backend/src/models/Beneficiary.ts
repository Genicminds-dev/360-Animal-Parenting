import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface BeneficiaryAttributes {
    id: number;
    uid: string;

    name: string;
    gender: string;
    mobile: string;
    dob: Date;

    address: string;
    state: string;
    city: string;
    pincode: string;

    createdBy: number;
    updatedBy: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface BeneficiaryCreationAttributes
    extends Optional<BeneficiaryAttributes, "id" | "createdAt" | "updatedAt"> { }

class Beneficiary
    extends Model<BeneficiaryAttributes, BeneficiaryCreationAttributes>
    implements BeneficiaryAttributes {

    public id!: number;
    public uid!: string;

    public name!: string;
    public gender!: string;
    public mobile!: string;
    public dob!: Date;

    public address!: string;
    public state!: string;
    public city!: string;
    public pincode!: string;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Beneficiary.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "beneficiary",
        timestamps: true,
        paranoid: true,
    }
);

export default Beneficiary;
