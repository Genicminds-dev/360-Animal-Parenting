import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CommissionAgentAttributes {
    id: number;
    uid: string;

    name: string;
    phone: string;
    aadhaarNumber?: string | null;
    profileImg?: string | null;
    aadhaarFile?: string | null;

    createdBy: number;
    updatedBy: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface CommissionAgentCreationAttributes
    extends Optional<
        CommissionAgentAttributes,
        | "id"
        | "aadhaarNumber"
        | "profileImg"
        | "aadhaarFile"
        | "createdAt"
        | "updatedAt"
    > { }

class CommissionAgent
    extends Model<
        CommissionAgentAttributes,
        CommissionAgentCreationAttributes
    >
    implements CommissionAgentAttributes {

    public id!: number;
    public uid!: string;

    public name!: string;
    public phone!: string;
    public aadhaarNumber!: string | null;
    public profileImg!: string | null;
    public aadhaarFile!: string | null;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CommissionAgent.init(
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
        aadhaarNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profileImg: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        aadhaarFile: {
            type: DataTypes.TEXT,
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
        tableName: "commission_agent",
        timestamps: true,
        paranoid: true,
    }
);

export default CommissionAgent;
