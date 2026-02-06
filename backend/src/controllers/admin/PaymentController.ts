import { Request, Response } from "express";
import Payment from "../../models/Payment";
import { Animal, sequelize } from "../../models";
import { generateUID } from "../../utils/generateUID";
import { col, fn, literal, Op } from "sequelize";
import path from "path";
import fs from "fs";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";

const normalizeEmptyStrings = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === "") {
            obj[key] = null;
        }
    });
};


interface PaymentSummary {
    totalPayments: number | string;
    totalVendorCount: number | string;
    totalTransportCount: number | string;
    totalAmount: number | string;
}

export const getPayment = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const whereClause: any = {};

        if (req.query.status) {
            whereClause.status = req.query.status;
        }

        if (req.query.paymentMode) {
            whereClause.paymentMode = req.query.paymentMode;
        }

        if (req.query.paymentFor) {
            whereClause.paymentFor = req.query.paymentFor;
        }

        if (req.query.fromDate && req.query.toDate) {
            const fromDate = new Date(req.query.fromDate as string);
            const toDate = new Date(req.query.toDate as string);

            if (fromDate > toDate) {
                return res.status(400).json({
                    success: false,
                    message: "fromDate cannot be greater than toDate",
                });
            }

            toDate.setHours(23, 59, 59, 999);

            whereClause.date = {
                [Op.between]: [fromDate, toDate],
            };
        }
        else if (req.query.fromDate) {
            whereClause.date = {
                [Op.gte]: new Date(req.query.fromDate as string),
            };
        }
        else if (req.query.toDate) {
            return res.status(400).json({
                success: false,
                message: "fromDate is required when using toDate",
            });
        }

        const { rows, count: filteredCount } = await Payment.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const summary = await Payment.findOne({
            attributes: [
                [fn("COUNT", col("id")), "totalPayments"],
                [
                    fn("SUM", literal(`CASE WHEN paymentFor = 'vendor' THEN 1 ELSE 0 END`)),
                    "totalVendorCount",
                ],
                [
                    fn("SUM", literal(`CASE WHEN paymentFor = 'transport' THEN 1 ELSE 0 END`)),
                    "totalTransportCount",
                ],
                [fn("SUM", col("amount")), "totalAmount"],
            ],
            raw: true,
        }) as unknown as PaymentSummary | null;

        const totalPayments = await Payment.count();

        res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit,
            },
            summary: {
                totalPayments,
                totalVendorCount: Number(summary?.totalVendorCount || 0),
                totalTransportCount: Number(summary?.totalTransportCount || 0),
                totalAmount: Number(summary?.totalAmount || 0),
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get Payment",
            error: error.message,
        });
    }
};


export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findOne({ where: { uid: req.params.uid }, attributes: { exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"] } });

        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "Payment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment by uid fetched successfully",
            data: payment,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Payment by uid",
            error: error.message,
        });
    }
}


export const createPayment = async (req: Request, res: Response) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "Required file is missing",
            });
        }

        if (req.body.animalId && typeof req.body.animalId === "string") {
            req.body.animalId = req.body.animalId
                .split(",")
                .map((id: string) => Number(id.trim()));
        }

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        if (
            !files.paySlip
        ) {
            return res.status(400).json({
                success: false,
                message: "Payslip file required",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: Payment,
            payload: req.body,
            fields: [
                "transactionId",
                "invoiceNumber",
            ],
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        let uid;
        let exists = true;

        while (exists) {
            uid = await generateUID({ table: Payment, prefix: "PAY", start: 100001, end: 999999 });
            const record = await Payment.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file
                ? file.path.replace(/\\/g, "/").replace("public", "")
                : null;

        const payload = {
            ...req.body,
            uid,
            paySlip: normalizePath(files.paySlip[0]),
        };

        const payment = await Payment.create(payload);

        if (payment.paymentFor === "vendor" && Array.isArray(req.body.animalId)) {
            await Animal.update(
                { vendorPay: true },
                { where: { id: req.body.animalId } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment,
        });

    } catch (error: any) {
        if (req.files) {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            Object.values(files).flat().forEach((file) => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create payment",
            error: error.message,
        });
    }
};


export const updatePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findOne({
            where: { uid: req.params.uid },
        });

        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "Payment not found",
            });
        }

        let updatedPayload: any = { ...req.body };
        if (updatedPayload.animalId && typeof updatedPayload.animalId === "string") {
            updatedPayload.animalId = updatedPayload.animalId.split(",").map((id: string) => Number(id.trim()));
        }
        normalizeEmptyStrings(updatedPayload);

        const duplicate = await checkDuplicateGeneric({
            model: Payment,
            payload: updatedPayload,
            fields: [
                "transactionId",
                "invoiceNumber",
            ],
            ignoreValue: payment.uid,
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        const files = req.files as
            | {
                [fieldname: string]: Express.Multer.File[];
            }
            | undefined;

        const updateFile = (
            field: keyof typeof payment,
            file?: Express.Multer.File
        ) => {
            if (!file) return;

            const newPath = file.path
                .replace(/\\/g, "/")
                .replace("public", "");

            const oldPath = (payment as any)[field]
                ? path.join("public", (payment as any)[field])
                : null;

            if (oldPath && fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            updatedPayload[field] = newPath;
        };

        if (files) {
            updateFile("paySlip", files.paySlip?.[0]);
        }

        await payment.update(updatedPayload);

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to update Payment",
            error: error.message,
        });
    }
};


export const deletePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findOne({
            where: { uid: req.params.uid },
            paranoid: false,
        });

        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "Payment not found",
            });
        }

        const forceDelete = req.query.status === "true";

        let animalIds: number[] = [];

        if (payment.paymentFor === "vendor" && payment.animalId) {
            if (Array.isArray(payment.animalId)) {
                animalIds = payment.animalId;
            } else if (typeof payment.animalId === "string") {
                try {
                    animalIds = JSON.parse(payment.animalId);
                } catch (e) {
                    animalIds = [];
                }
            }

            if (animalIds.length > 0) {
                await Animal.update(
                    { vendorPay: false },
                    {
                        where: {
                            id: animalIds,
                        },
                    }
                );
            }
        }

        if (forceDelete) {
            const files = [
                payment.paySlip,
            ];

            files.forEach((filePath) => {
                if (filePath) {
                    const fullPath = path.join("public", filePath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                }
            });
        }

        await payment.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Payment permanently deleted"
                : "Payment soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete payment",
            error: error.message,
        });
    }
};
