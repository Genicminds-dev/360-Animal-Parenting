import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ProcuredAnimalAttributes {
  id: number;
  procurementId: number;

  tagId: string;
  breed?: string | null;
  ageYears?: number | null;
  ageMonths?: number | null;
  milkingCapacity?: number | null;
  isCalfIncluded?: boolean | null;
  physicalCheck?: string | null;

  fmdDisease?: boolean | null;
  lsdDisease?: boolean | null;

  animalPhotoFront?: string | null;
  animalPhotoSide?: string | null;
  animalPhotoRear?: string | null;

  healthRecord?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

interface ProcuredAnimalCreationAttributes
  extends Optional<
    ProcuredAnimalAttributes,
    | "id"
    | "breed"
    | "ageYears"
    | "ageMonths"
    | "milkingCapacity"
    | "isCalfIncluded"
    | "physicalCheck"
    | "animalPhotoFront"
    | "animalPhotoSide"
    | "animalPhotoRear"
    | "healthRecord"
  > {}

class ProcuredAnimal
  extends Model<
    ProcuredAnimalAttributes,
    ProcuredAnimalCreationAttributes
  >
  implements ProcuredAnimalAttributes {

  public id!: number;
  public procurementId!: number;

  public tagId!: string;
  public breed!: string | null;
  public ageYears!: number | null;
  public ageMonths!: number | null;
  public milkingCapacity!: number | null;
  public isCalfIncluded!: boolean | null;
  public physicalCheck!: string | null;

  public fmdDisease!: boolean | null;
  public lsdDisease!: boolean | null;

  public animalPhotoFront!: string | null;
  public animalPhotoSide!: string | null;
  public animalPhotoRear!: string | null;

  public healthRecord!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProcuredAnimal.init(
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

    tagId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    breed: {
      type: DataTypes.STRING,
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

    milkingCapacity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    isCalfIncluded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    physicalCheck: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fmdDisease: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    lsdDisease: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    animalPhotoFront: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    animalPhotoSide: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    animalPhotoRear: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    healthRecord: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "procured_animal",
    timestamps: true,
  }
);

export default ProcuredAnimal;
