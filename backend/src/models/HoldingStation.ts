import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface HoldingStationAttributes {
    id: number;
    uid: string;

    status: "active" | "inactive" | "maintenance";

    pincode: string;
    state: string;
    city: string;
    district: string;
    block?: string | null;
    tehsil?: string | null;
    postOffice?: string | null;
    addressLine: string;
    landmark?: string | null;

    totalCapacity: number;
    currentOccupancy: number;

    centerImg: string;
    centerVideo?: string | null;

    createdBy: number;
    updatedBy: number;

    createdAt?: Date;
    updatedAt?: Date;
}

interface HoldingStationCreationAttributes
    extends Optional<
        HoldingStationAttributes,
        | "id"
        | "block"
        | "tehsil"
        | "postOffice"
        | "landmark"
        | "centerVideo"
        | "createdAt"
        | "updatedAt"
    > { }

class HoldingStation
    extends Model<
        HoldingStationAttributes,
        HoldingStationCreationAttributes
    >
    implements HoldingStationAttributes {

    public id!: number;
    public uid!: string;

    public status!: "active" | "inactive" | "maintenance";

    public pincode!: string;
    public state!: string;
    public city!: string;
    public district!: string;
    public block!: string | null;
    public tehsil!: string | null;
    public postOffice!: string | null;
    public addressLine!: string;
    public landmark!: string | null;

    public totalCapacity!: number;
    public currentOccupancy!: number;

    public centerImg!: string;
    public centerVideo!: string | null;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

HoldingStation.init(
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
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
            allowNull: false,
            defaultValue: 'active',
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false
        },
        block: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tehsil: {
            type: DataTypes.STRING,
            allowNull: true
        },
        postOffice: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addressLine: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currentOccupancy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true,
                min: 0,
                notGreaterThanCapacity(this: any, value: number) {
                    if (value > this.totalCapacity) {
                        throw new Error("Current occupancy cannot exceed total capacity");
                    }
                },
            },
        },
        centerImg: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        centerVideo: {
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
        tableName: "holdingStation",
        timestamps: true,
        paranoid: true,
    }
);

export default HoldingStation;
