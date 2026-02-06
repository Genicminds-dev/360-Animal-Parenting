import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface VendorAttributes {
    id: number;
    uid: string;

    name: string;
    email?: string | null;
    phone: string;
    gender?: string | null;
    status: string;

    firmName: string;
    firmType: string;
    supplierType: string;

    profileImg?: string | null;

    pincode: string;
    state?: string | null;
    city?: string | null;
    district?: string | null;
    block?: string | null;
    tehsil?: string | null;
    postOffice?: string | null;
    addressLine: string;
    landmark?: string | null;

    aadhaar: string;
    aadhaarFile: string;
    pan: string;
    panFile: string;
    gst: string;
    gstFile: string;

    msmeCertificateNo?: string | null;
    msmeFile?: string | null;

    bankName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifsc: string;
    branch?: string | null;
    upiId?: string | null;

    createdBy: number;
    updatedBy: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface VendorCreationAttributes
    extends Optional<
        VendorAttributes,
        | "id"
        | "email"
        | "gender"
        | "profileImg"
        | "state"
        | "city"
        | "district"
        | "block"
        | "tehsil"
        | "postOffice"
        | "landmark"
        | "msmeCertificateNo"
        | "msmeFile"
        | "branch"
        | "upiId"
    > { }
class Vendor
    extends Model<VendorAttributes, VendorCreationAttributes>
    implements VendorAttributes {
    public id!: number;
    public uid!: string;

    public name!: string;
    public email!: string | null;
    public phone!: string;
    public gender!: string | null;
    public status!: string;

    public firmName!: string;
    public firmType!: string;
    public supplierType!: string;

    public profileImg!: string | null;

    public pincode!: string;
    public state!: string | null;
    public city!: string | null;
    public district!: string | null;
    public block!: string | null;
    public tehsil!: string | null;
    public postOffice!: string | null;
    public addressLine!: string;
    public landmark!: string | null;

    public aadhaar!: string;
    public aadhaarFile!: string;
    public pan!: string;
    public panFile!: string;
    public gst!: string;
    public gstFile!: string;

    public msmeCertificateNo!: string | null;
    public msmeFile!: string | null;

    public bankName!: string;
    public accountNumber!: string;
    public confirmAccountNumber!: string;
    public ifsc!: string;
    public branch!: string | null;
    public upiId!: string | null;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Vendor.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firmName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firmType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        supplierType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profileImg: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        district: { type: DataTypes.STRING, allowNull: true },
        block: { type: DataTypes.STRING, allowNull: true },
        tehsil: { type: DataTypes.STRING, allowNull: true },
        postOffice: { type: DataTypes.STRING, allowNull: true },
        addressLine: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        landmark: { type: DataTypes.STRING, allowNull: true },
        aadhaar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        aadhaarFile: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        pan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        panFile: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        gst: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gstFile: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        msmeCertificateNo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        msmeFile: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        confirmAccountNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ifsc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        branch: {
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
        tableName: "vendors",
        timestamps: true,
        paranoid: true,
    }
);

export default Vendor;
