import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface AnimalAttributes {
    id: number;
    uid: string;

    sellerId: number;

    earTagId: string;
    animalType: string;
    breed: string;
    pricing: string;
    pregnancyStatus: string;
    calfEarTagId?: string | null;

    totalPregnancies?: number | null;
    ageYears?: number | null;
    ageMonths?: number | null;
    weight?: number | null;
    milkPerDay?: number | null;
    calfAgeYears?: number | null;
    calfAgeMonths?: number | null;
    agentId?: number | null;

    frontPhoto?: string | null;
    sidePhoto?: string | null;
    backPhoto?: string | null;
    animalVideo?: string | null;
    calfPhoto?: string | null;
    calfVideo?: string | null;

    createdBy: number;
    updatedBy: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface AnimalCreationAttributes
    extends Optional<AnimalAttributes, "id" | "calfEarTagId" | "totalPregnancies" |
        "ageYears" | "ageMonths" | "weight" | "milkPerDay" |
        "calfAgeYears" | "calfAgeMonths" | "agentId" |
        "frontPhoto" | "sidePhoto" | "backPhoto" |
        "animalVideo" | "calfPhoto" | "calfVideo"> { }

class Animal
    extends Model<AnimalAttributes, AnimalCreationAttributes>
    implements AnimalAttributes {

    public id!: number;
    public uid!: string;

    public sellerId!: number;

    public earTagId!: string;
    public animalType!: string;
    public breed!: string;
    public pricing!: string;
    public pregnancyStatus!: string;
    public calfEarTagId!: string | null;

    public totalPregnancies!: number | null;
    public ageYears!: number | null;
    public ageMonths!: number | null;
    public weight!: number | null;
    public milkPerDay!: number | null;
    public calfAgeYears!: number | null;
    public calfAgeMonths!: number | null;
    public agentId!: number | null;

    public frontPhoto!: string | null;
    public sidePhoto!: string | null;
    public backPhoto!: string | null;
    public animalVideo!: string | null;
    public calfPhoto!: string | null;
    public calfVideo!: string | null;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Animal.init(
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
        sellerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "sellers",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        earTagId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        animalType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pricing: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pregnancyStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        calfEarTagId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        totalPregnancies: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ageYears: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ageMonths: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        milkPerDay: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        calfAgeYears: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        calfAgeMonths: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        agentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: "commission_agent",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        frontPhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sidePhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        backPhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        animalVideo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        calfPhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        calfVideo: {
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
        tableName: "animals",
        timestamps: true,
        paranoid: true,
    }
);

export default Animal;
