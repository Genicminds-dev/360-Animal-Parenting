import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

type GenderType = "male" | "female" | "other" | "";

interface HoldingStationInchargeAttributes {
    id: number;
    holdingStationId: number;

    name: string;
    phone: string;
    email?: string | null;
    gender?: GenderType | null;

    createdAt?: Date;
    updatedAt?: Date;
}

interface HoldingStationInchargeCreationAttributes
    extends Optional<
        HoldingStationInchargeAttributes,
        "id" | "email" | "gender" | "createdAt" | "updatedAt"
    > { }

class HoldingStationIncharge
    extends Model<
        HoldingStationInchargeAttributes,
        HoldingStationInchargeCreationAttributes
    >
    implements HoldingStationInchargeAttributes {

    public id!: number;
    public holdingStationId!: number;

    public name!: string;
    public phone!: string;
    public email!: string | null;
    public gender!: GenderType | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

HoldingStationIncharge.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        holdingStationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "holdingStation",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Name is required",
                },
                isValid(value: string) {
                    if (value.trim().length === 0) {
                        return;
                    }

                    if (!/^[A-Za-z\s]+$/.test(value)) {
                        throw new Error("Name can contain only alphabets and spaces");
                    }

                    if (value.length < 3 || value.length > 50) {
                        throw new Error("Name must be between 3 and 50 characters");
                    }
                },
            },
        },
        phone: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Phone number is required",
                },
                isValid(value: string) {
                    if (value.trim().length === 0) {
                        return;
                    }

                    if (!/^[6-9][0-9]{9}$/.test(value)) {
                        throw new Error(
                            "Phone number must be a valid 10-digit Indian mobile number"
                        );
                    }
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "",
            set(value: string | null) {
                this.setDataValue("email", value ?? "");
            },
            validate: {
                isEmailOrEmpty(value: string) {
                    if (value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        throw new Error("Invalid email format");
                    }
                },
            },
        },

        gender: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: "",
            set(value: GenderType | null) {
                this.setDataValue("gender", value ?? "");
            },
            validate: {
                isValidGender(value: GenderType) {
                    if (value !== "" && !["male", "female", "other"].includes(value)) {
                        throw new Error("Gender must be male, female, other or empty");
                    }
                },
            },
        },
    },
    {
        sequelize,
        tableName: "holding_station_incharges",
        timestamps: true,
    }
);

export default HoldingStationIncharge;
