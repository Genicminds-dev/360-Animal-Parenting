import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface AnimalAttributes {
    id: number;
    uid: string;

    age: number;
    weight: number;
    breed?: string | null;
    animalType?: string | null;

    numberOfPregnancy: number;
    pregnancyStatus: string;
    milkData: number;

    dob: Date;
    pricing?: number | null;

    earTagId: string;
    snb_id?: string | null;

    calfEarTagId: string;
    calfDob?: Date | null;
    calfGender: string;

    photoFront: string;
    photoBack: string;
    photoSide: string;
    video?: string | null;

    calfImage?: string | null;
    calfVideo?: string | null;

    vendorId: number;
    quarantineId: number;
    vendorPay: boolean;

    createdBy: number;
    updatedBy: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface AnimalCreationAttributes
    extends Optional<
        AnimalAttributes,
        | "id"
        | "breed"
        | "animalType"
        | "pricing"
        | "calfDob"
        | "video"
        | "calfImage"
        | "calfVideo"
        | "snb_id"
        | "vendorPay"
    > { }

class Animal
    extends Model<AnimalAttributes, AnimalCreationAttributes>
    implements AnimalAttributes {

    public id!: number;
    public uid!: string;

    public age!: number;
    public weight!: number;
    public breed!: string | null;
    public animalType!: string | null;

    public numberOfPregnancy!: number;
    public pregnancyStatus!: string;
    public milkData!: number;

    public dob!: Date;
    public pricing!: number | null;

    public earTagId!: string;
    public snb_id!: string | null;

    public calfEarTagId!: string;
    public calfDob!: Date | null;
    public calfGender!: string;

    public photoFront!: string;
    public photoBack!: string;
    public photoSide!: string;
    public video!: string | null;

    public calfImage!: string | null;
    public calfVideo!: string | null;

    public vendorId!: number;
    public quarantineId!: number;
    public vendorPay!: boolean;

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

        age: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        breed: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        animalType: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        numberOfPregnancy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        pregnancyStatus: {
            type: DataTypes.ENUM("pregnant", "not_pregnant"),
            allowNull: false,
        },

        milkData: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        pricing: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },

        calfEarTagId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        calfDob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        calfGender: {
            type: DataTypes.ENUM("male", "female"),
            allowNull: false,
        },

        photoFront: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        photoBack: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        photoSide: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        video: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        calfImage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        calfVideo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        vendorId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "vendors",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        quarantineId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "holdingStation",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        earTagId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        snb_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        vendorPay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
