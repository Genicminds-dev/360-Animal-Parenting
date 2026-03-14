import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface BrokerAttributes {
    id: number;
    uid: string;
    name: string;
    mobile: string;
    aadhaarNumber?: string | null;
    profilePhoto?: string | null;
    aadhaarFile?: string | null;

    createdAt?: Date;
    updatedAt?: Date;

    createdBy: number;
    updatedBy: number;
}

interface BrokerCreationAttributes
    extends Optional<
        BrokerAttributes,
        | "id"
        | "aadhaarNumber"
        | "profilePhoto"
        | "aadhaarFile"
        | "createdAt"
        | "updatedAt"
    > { }

class Broker
    extends Model<
        BrokerAttributes,
        BrokerCreationAttributes
    >
    implements BrokerAttributes {

    public id!: number;
    public uid!: string;

    public name!: string;
    public mobile!: string;
    public aadhaarNumber!: string | null;
    public profilePhoto!: string | null;
    public aadhaarFile!: string | null;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Broker.init(
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
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        aadhaarNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profilePhoto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        aadhaarFile: {
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
        tableName: "broker",
        timestamps: true,
        paranoid: true,
    }
);

export default Broker;
