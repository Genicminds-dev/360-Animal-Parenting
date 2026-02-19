import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import ProcuredAnimal from "./ProcuredAnimal";
import Logistic from "./Logistic";
import QuarantineCenter from "./QuarantineCenter";
import Handover from "./Handover";

interface SourceVisitAttributes {
    id: number;
    uid: string;

    procurementOfficer: number;
    sourceType: string;
    sourceLocation: string;
    visitDate: Date;
    visitTime: string;
    breederName: string;
    breederContact: string;

    createdBy: number;
    updatedBy: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface SourceVisitCreationAttributes
    extends Optional<SourceVisitAttributes, "id"> { }

class SourceVisit
    extends Model<SourceVisitAttributes, SourceVisitCreationAttributes>
    implements SourceVisitAttributes {

    public id!: number;
    public uid!: string;

    public procurementOfficer!: number;
    public sourceType!: string;
    public sourceLocation!: string;
    public visitDate!: Date;
    public visitTime!: string;
    public breederName!: string;
    public breederContact!: string;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly procured_animal?: ProcuredAnimal[];
    public readonly logistic?: Logistic[];
    public readonly quarantine_center?: QuarantineCenter[];
    public readonly handover?: Handover[];
}

SourceVisit.init(
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

        procurementOfficer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        sourceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        sourceLocation: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        visitDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        visitTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        breederName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        breederContact: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: "source_visit",
        timestamps: true,
        paranoid: true,
    }
);

export default SourceVisit;
