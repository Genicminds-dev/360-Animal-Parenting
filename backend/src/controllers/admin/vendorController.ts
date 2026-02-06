import { Request, Response } from "express";
import { Animal, Payment, Vendor, sequelize } from "../../models";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import { col, fn, Op } from "sequelize";
import path from "path";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";

const normalizeEmptyStrings = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === "") {
            obj[key] = null;
        }
    });
};

interface PaymentSummary {
    totalPayments?: string | null;
    totalTransactions?: string | null;
}

export const getVendor = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const whereClause: any = {};

        if (req.query.status) {
            whereClause.status = req.query.status;
        }

        if (req.query.state) {
            whereClause.state = req.query.state;
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

            whereClause.createdAt = {
                [Op.between]: [fromDate, toDate],
            };
        }
        else if (req.query.fromDate) {
            whereClause.createdAt = {
                [Op.gte]: new Date(req.query.fromDate as string),
            };
        }
        else if (req.query.toDate) {
            return res.status(400).json({
                success: false,
                message: "fromDate is required when using toDate",
            });
        }

        const { rows, count: filteredCount } = await Vendor.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const statusSummary = await Vendor.findAll({
            attributes: [
                "status",
                [sequelize.fn("COUNT", sequelize.col("status")), "count"],
            ],
            group: ["status"],
            raw: true,
        });

        const totalVendors = await Vendor.count();

        let activeVendors = 0;
        let inactiveVendors = 0;

        statusSummary.forEach((item: any) => {
            if (item.status === "active") {
                activeVendors = Number(item.count);
            }
            if (item.status === "inactive") {
                inactiveVendors = Number(item.count);
            }
        });

        const topStateData: any = await Vendor.findOne({
            attributes: [
                "state",
                [sequelize.fn("COUNT", sequelize.col("state")), "count"],
            ],
            where: {
                state: {
                    [Op.ne]: null
                }
            },
            group: ["state"],
            order: [[sequelize.literal("count"), "DESC"]],
            raw: true,
        });

        const topState = topStateData?.state || null;

        res.status(200).json({
            success: true,
            message: "Vendors fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit,
            },
            summary: {
                totalVendors,
                activeVendors,
                inactiveVendors,
                topState,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendors",
            error: error.message,
        });
    }
};


export const getVendorById = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const vendor = await Vendor.findOne({
            where: { uid },
            attributes: {
                exclude: ["createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
            include: [
                {
                    model: Animal,
                    as: "animals",
                    attributes: ["uid", "earTagId", "animalType", "breed", "createdAt", "pregnancyStatus"],
                },
                {
                    model: Payment,
                    as: "payment",
                    where: {
                        paymentFor: "vendor",
                    },
                    required: false,
                    attributes: [
                        "uid",
                        "amount",
                        "paymentMode",
                        "status",
                        "date",
                        "transactionId",
                    ],
                },
            ],
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        const paymentSummary = await Payment.findOne({
            where: {
                vendorId: vendor.id,
                paymentFor: "vendor",
            },
            attributes: [
                [fn("SUM", col("amount")), "totalPayments"],
                [fn("COUNT", col("id")), "totalTransactions"],
            ],
            raw: true,
        }) as PaymentSummary | null;

        const { id, ...vendorData } = vendor.toJSON();

        res.status(200).json({
            success: true,
            message: "Vendor by uid fetched successfully",
            data: vendorData,
            paymentSummary: {
                totalPayments: Number(paymentSummary?.totalPayments || 0),
                totalTransactions: Number(paymentSummary?.totalTransactions || 0),
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor by uid",
            error: error.message,
        });
    }
};


export const getVendorDropdown = async (req: Request, res: Response) => {
    try {
        const vendors = await Vendor.findAll({
            attributes: ["id", "uid", "name"],
            order: [["name", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Vendor dropdown fetched successfully",
            data: vendors,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch vendor dropdown",
            error: error.message,
        });
    }
};


export const createVendor = async (req: Request, res: Response) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "Required files are missing",
            });
        }

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        if (
            !files.aadhaarFile ||
            !files.panFile ||
            !files.gstFile
        ) {
            return res.status(400).json({
                success: false,
                message: "Aadhaar, PAN and GST files are required",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: Vendor,
            payload: req.body,
            fields: [
                "email",
                "phone",
                "firmName",
                "aadhaar",
                "pan",
                "gst",
                "msmeCertificateNo",
                "upiId",
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
            uid = await generateUID({ table: Vendor, prefix: "VEN", start: 10001, end: 99999 });
            const record = await Vendor.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file
                ? file.path.replace(/\\/g, "/").replace("public", "")
                : null;

        const payload = {
            ...req.body,
            uid,

            profileImg: normalizePath(files.profileImg?.[0]),
            aadhaarFile: normalizePath(files.aadhaarFile[0]),
            panFile: normalizePath(files.panFile[0]),
            gstFile: normalizePath(files.gstFile[0]),
            msmeFile: normalizePath(files.msmeFile?.[0]),
        };

        const vendor = await Vendor.create(payload);

        return res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: vendor,
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
            message: "Failed to create vendor",
            error: error.message,
        });
    }
};


export const updateVendor = async (req: Request, res: Response) => {
    try {
        const vendor = await Vendor.findOne({
            where: { uid: req.params.uid },
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        let updatedPayload: any = { ...req.body };
        normalizeEmptyStrings(updatedPayload);

        const duplicate = await checkDuplicateGeneric({
            model: Vendor,
            payload: updatedPayload,
            fields: [
                "email",
                "phone",
                "firmName",
                "aadhaar",
                "pan",
                "gst",
                "msmeCertificateNo",
                "upiId",
            ],
            ignoreValue: vendor.uid,
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
            field: keyof typeof vendor,
            file?: Express.Multer.File
        ) => {
            if (!file) return;

            const newPath = file.path
                .replace(/\\/g, "/")
                .replace("public", "");

            const oldPath = (vendor as any)[field]
                ? path.join("public", (vendor as any)[field])
                : null;

            if (oldPath && fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            updatedPayload[field] = newPath;
        };

        if (files) {
            updateFile("profileImg", files.profileImg?.[0]);
            updateFile("aadhaarFile", files.aadhaarFile?.[0]);
            updateFile("panFile", files.panFile?.[0]);
            updateFile("gstFile", files.gstFile?.[0]);
            updateFile("msmeFile", files.msmeFile?.[0]);
        }

        await vendor.update(updatedPayload);

        return res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
        });
    } catch (error: any) {
        if (req.files) {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            Object.values(files)
                .flat()
                .forEach((file) => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update vendor",
            error: error.message,
        });
    }
};


export const deleteVendor = async (req: Request, res: Response) => {
    try {
        const vendor = await Vendor.findOne({
            where: { uid: req.params.uid },
            paranoid: false,
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        const assignedAnimals = await Animal.findAll({
            where: {
                vendorId: vendor.id,
            },
            attributes: ["uid"],
        });

        if (assignedAnimals.length > 0) {
            const animalUids = assignedAnimals.map(a => a.uid).join(", ");

            return res.status(400).json({
                success: false,
                message: `Vendor is assigned to active animals (${animalUids}). Please change vendor or delete those animals first.`,
            });
        }

        const forceDelete = req.query.status === "true";

        if (forceDelete) {
            const files = [
                vendor.profileImg,
                vendor.aadhaarFile,
                vendor.panFile,
                vendor.gstFile,
                vendor.msmeFile,
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

        await vendor.destroy({ force: forceDelete });

        return res.status(200).json({
            success: true,
            message: forceDelete
                ? "Vendor permanently deleted"
                : "Vendor soft deleted",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete vendor",
            error: error.message,
        });
    }
};