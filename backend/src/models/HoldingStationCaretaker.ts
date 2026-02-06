import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HoldingStationCaretakerAttributes {
    id: number;
    holdingStationId: number;

    name?: string | null;
    phone?: string | null;
    aadharNumber?: string | null;

    createdAt?: Date;
    updatedAt?: Date;
}

interface HoldingStationCaretakerCreationAttributes
    extends Optional<
        HoldingStationCaretakerAttributes,
        "id" | "name" | "phone" | "aadharNumber" | "createdAt" | "updatedAt"
    > { }

class HoldingStationCaretaker
    extends Model<
        HoldingStationCaretakerAttributes,
        HoldingStationCaretakerCreationAttributes
    >
    implements HoldingStationCaretakerAttributes {

    public id!: number;
    public holdingStationId!: number;

    public name!: string | null;
    public phone!: string | null;
    public aadharNumber!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

HoldingStationCaretaker.init(
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
            allowNull: true,
            validate: {
                isValid(value: string | null) {
                    if (value) {
                        if (!/^[A-Za-z\s]+$/.test(value)) {
                            throw new Error("Name can contain only alphabets and spaces");
                        }
                        if (value.length < 3 || value.length > 50) {
                            throw new Error("Name must be between 3 and 50 characters");
                        }
                    }
                },
            },
        },
        phone: {
            type: DataTypes.STRING(10),
            allowNull: true,
            validate: {
                isValid(value: string | null) {
                    if (value && !/^[6-9][0-9]{9}$/.test(value)) {
                        throw new Error("Phone number must be a valid 10-digit Indian mobile number");
                    }
                },
            },
        },
        aadharNumber: {
            type: DataTypes.STRING(12),
            allowNull: true,
            validate: {
                isValid(value: string | null) {
                    if (value && !/^[2-9][0-9]{11}$/.test(value)) {
                        throw new Error("Aadhaar number must be a valid 12-digit Indian Aadhaar number");
                    }
                },
            },
        },
    },
    {
        sequelize,
        tableName: "holding_station_caretakers",
        timestamps: true,
    }
);

export default HoldingStationCaretaker;
