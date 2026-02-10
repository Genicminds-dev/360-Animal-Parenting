import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface SellerAttributes {
    id: number;
    uid: string;

    name: string;
    phone: string;
    gender: string;
    aadhaarNumber?: string | null;
    profileImg?: string | null;

    address: string;
    state: string;
    district?: string | null;
    pincode?: string | null;
    town?: string | null;

    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    upiId?: string | null;

    createdBy: number;
    updatedBy: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface SellerCreationAttributes
    extends Optional<
        SellerAttributes,
        | "id"
        | "aadhaarNumber"
        | "profileImg"
        | "district"
        | "pincode"
        | "town"
        | "bankName"
        | "accountNumber"
        | "ifscCode"
        | "upiId"
    > { }
class Seller
    extends Model<SellerAttributes, SellerCreationAttributes>
    implements SellerAttributes {
    public id!: number;
    public uid!: string;

    public name!: string;
    public phone!: string;
    public gender!: string;
    public aadhaarNumber!: string | null;
    public profileImg!: string | null;

    public address!: string;
    public state!: string;
    public district!: string | null;
    public pincode!: string | null;
    public town!: string | null;

    public bankName!: string | null;
    public accountNumber!: string | null;
    public ifscCode!: string | null;
    public upiId!: string | null;

    public createdBy!: number;
    public updatedBy!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Seller.init(
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        aadhaarNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profileImg: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        town: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ifscCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        upiId: {
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
        tableName: "sellers",
        timestamps: true,
        paranoid: true,
    }
);

export default Seller;
