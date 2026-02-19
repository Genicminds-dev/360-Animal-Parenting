import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HandoverAttributes {
    id: number;
    procurementId: number;

    handoverOfficer?: number | null;
    beneficiaryId?: string | null;
    beneficiaryLocation?: string | null;
    handoverPhoto?: string | null;
    handoverDocument?: string | null;
    handoverDate?: Date | null;
    handoverTime?: string | null;

    createdAt?: Date;
    updatedAt?: Date;
}

interface HandoverCreationAttributes
    extends Optional<
        HandoverAttributes,
        "id" | "beneficiaryId" | "beneficiaryLocation" |
        "handoverPhoto" | "handoverDocument" |
        "handoverDate" | "handoverTime"
    > { }

class Handover
    extends Model<HandoverAttributes, HandoverCreationAttributes>
    implements HandoverAttributes {

    public id!: number;
    public procurementId!: number;
    public handoverOfficer!: number | null;
    public beneficiaryId!: string | null;
    public beneficiaryLocation!: string | null;
    public handoverPhoto!: string | null;
    public handoverDocument!: string | null;
    public handoverDate!: Date | null;
    public handoverTime!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Handover.init(
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

        handoverOfficer: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        beneficiaryId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        beneficiaryLocation: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        handoverPhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        handoverDocument: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        handoverDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        handoverTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "handover",
        timestamps: true,
    }
);

export default Handover;
