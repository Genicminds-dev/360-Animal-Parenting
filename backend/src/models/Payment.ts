import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PaymentAttributes {
    id: number;
    uid: string;

    paymentFor: string;
    vendorId: number | null;
    transportId: number | null;
    animalId: number[] | null;
    amount: number;
    paymentMode: string;
    transactionId: string;
    status: string;
    remark?: string | null;
    invoiceNumber: string;
    date?: Date | null;
    paySlip: string;

    createdBy: number;
    updatedBy: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

interface PaymentCreationAttributes
    extends Optional<
        PaymentAttributes,
        "id" | "remark" | "date" | "createdAt" | "updatedAt"
    > { }

class Payment
    extends Model<PaymentAttributes, PaymentCreationAttributes>
    implements PaymentAttributes {
    public id!: number;
    public uid!: string;
    public paymentFor!: string;
    public vendorId!: number | null;
    public transportId!: number | null;
    public animalId!: number[] | null;
    public amount!: number;
    public paymentMode!: string;
    public transactionId!: string;
    public status!: string;
    public remark!: string | null;
    public invoiceNumber!: string;
    public date!: Date | null;
    public paySlip!: string;

    public createdBy!: number;
    public updatedBy!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Payment.init(
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
        paymentFor: {
            type: DataTypes.ENUM("vendor", "transport"),
            allowNull: false,
        },
        vendorId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: "vendors",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        transportId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        animalId: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        paymentMode: {
            type: DataTypes.ENUM("cash", "debit card", "credit card", "upi", "net banking", "cheque"),
            allowNull: false,

        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "failed", "refunded", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        invoiceNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paySlip: {
            type: DataTypes.TEXT,
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
        tableName: "payment",
        timestamps: true,
        paranoid: true,
        validate: {
            paymentForValidation(this: Payment) {

                // ✅ soft delete ke time validation skip
                if (this.changed("deletedAt")) {
                    return;
                }

                if (this.paymentFor === "vendor") {
                    if (!this.vendorId) {
                        throw new Error("vendorId is required for vendor payment");
                    }
                    if (!Array.isArray(this.animalId) || this.animalId.length === 0) {
                        throw new Error("animalId is required for vendor payment");
                    }
                }

                if (this.paymentFor === "transport") {
                    if (!this.transportId) {
                        throw new Error("transportId is required for transport payment");
                    }
                    if (this.animalId) {
                        throw new Error("animalId must be null for transport payment");
                    }
                }
            },
        },
    }
);

export default Payment;
