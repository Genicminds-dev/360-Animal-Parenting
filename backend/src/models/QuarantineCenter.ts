import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface QuarantineCenterAttributes {
    id: number;
    procurementId: number;

    quarantineCenter?: string | null;
    quarantineCenterPhoto?: string | null;
    quarantineHealthRecord?: string | null;
    finalHealthClearance?: string | null;

    createdAt?: Date;
    updatedAt?: Date;
}

interface QuarantineCenterCreationAttributes
    extends Optional<
        QuarantineCenterAttributes,
        "id" | "quarantineCenter" | "quarantineCenterPhoto" |
        "quarantineHealthRecord" | "finalHealthClearance"
    > { }

class QuarantineCenter
    extends Model<QuarantineCenterAttributes, QuarantineCenterCreationAttributes>
    implements QuarantineCenterAttributes {

    public id!: number;
    public procurementId!: number;
    public quarantineCenter!: string| null;
    public quarantineCenterPhoto!: string | null;
    public quarantineHealthRecord!: string | null;
    public finalHealthClearance!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

QuarantineCenter.init(
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

        quarantineCenter: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        quarantineCenterPhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        quarantineHealthRecord: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        finalHealthClearance: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "quarantine_center",
        timestamps: true,
    }
);

export default QuarantineCenter;
