import { Request, Response } from "express";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import { Broker } from "../../models";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";
import { cleanupFiles } from "../../middlewares/multerMiddleWare";


export const getBrokers = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { search, fromDate, toDate } = req.query;

        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { uid: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { mobile: { [Op.like]: `%${search}%` } },
                { aadhaarNumber: { [Op.like]: `%${search}%` } },
            ];
        }

        if (fromDate && toDate) {
            const startDate = new Date(fromDate as string);
            const endDate = new Date(toDate as string);

            if (startDate > endDate) {
                return res.status(400).json({
                    success: false,
                    message: "fromDate cannot be greater than toDate",
                });
            }

            endDate.setHours(23, 59, 59, 999);

            whereClause.createdAt = {
                [Op.between]: [startDate, endDate],
            };
        }
        else if (fromDate) {
            whereClause.createdAt = {
                [Op.gte]: new Date(fromDate as string),
            };
        }
        else if (toDate) {
            return res.status(400).json({
                success: false,
                message: "fromDate is required when using toDate",
            });
        }

        const { rows, count: filteredCount } = await Broker.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const totalBrokers = await Broker.count();

        res.status(200).json({
            success: true,
            message: "Brokers fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit: limit,
            },
            summary: {
                totalBrokers
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get brokers",
            error: error.message,
        });
    }
};


export const getBrokerByUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const broker = await Broker.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"]
            },
        });

        if (!broker) {
            return res.status(400).json({
                success: false,
                message: "Broker not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Broker by uid fetched successfully",
            data: broker,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get broker by uid",
            error: error.message,
        });
    }
}

export const getBrokerList = async (req: Request, res: Response) => {
    try {
        const brokers = await Broker.findAll({
            attributes: [
                "id",
                "uid",
                "name",
                "mobile",
            ],
            order: [["uid", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Broker list fetched successfully",
            data: brokers,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch broker list",
            error: error.message,
        });
    }
};


export const createBroker = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const duplicate = await checkDuplicateGeneric({
            model: Broker,
            payload: req.body,
            fields: [
                "mobile",
                "aadhaarNumber",
            ],
        });

        if (duplicate) {
            if (files) cleanupFiles(req);
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        let uid;
        let exists = true;

        while (exists) {
            uid = await generateUID({ table: Broker, prefix: "BRK", start: 100001, end: 999999 });
            const record = await Broker.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file ? file.path.replace(/\\/g, "/").replace("public", "") : null;

        const payload = {
            ...req.body,
            uid,
            profilePhoto: normalizePath(files.profilePhoto?.[0]),
            aadhaarFile: normalizePath(files.aadhaarFile?.[0])
        };

        const broker = await Broker.create(payload);

        return res.status(201).json({
            success: true,
            message: "Broker registered successfully",
            data: broker
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to register broker",
            error: error.message,
        });
    }
};


export const updateBroker = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const { uid } = req.params;

        const broker = await Broker.findOne({
            where: { uid },
        });

        if (!broker) {
            if (files) cleanupFiles(req);
            return res.status(404).json({
                success: false,
                message: "Broker not found",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: Broker,
            payload: req.body,
            fields: ["mobile", "aadhaarNumber"],
            ignoreCol: "uid",
            ignoreValue: broker.uid,
        });

        if (duplicate) {
            if (files) cleanupFiles(req);
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file ? file.path.replace(/\\/g, "/").replace("public", "") : null;

        const deleteOldFile = (filePath?: string | null) => {
            if (!filePath) return;
            const fullPath = path.join("public", filePath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        };

        if (files?.profilePhoto?.[0] && broker.profilePhoto) {
            deleteOldFile(broker.profilePhoto);
        }

        if (req.body.profilePhoto === "" && broker.profilePhoto) {
            deleteOldFile(broker.profilePhoto);
        }

        if (files?.aadhaarFile?.[0] && broker.aadhaarFile) {
            deleteOldFile(broker.aadhaarFile);
        }

        if (req.body.aadhaarFile === "" && broker.aadhaarFile) {
            deleteOldFile(broker.aadhaarFile);
        }

        const payload = {
            ...req.body,

            profilePhoto: files?.profilePhoto?.[0]
                ? normalizePath(files.profilePhoto[0])
                : req.body.profilePhoto === ""
                    ? null
                    : broker.profilePhoto,

            aadhaarFile: files?.aadhaarFile?.[0]
                ? normalizePath(files.aadhaarFile[0])
                : req.body.aadhaarFile === ""
                    ? null
                    : broker.aadhaarFile,
        };

        await broker.update(payload);

        return res.status(200).json({
            success: true,
            message: "Broker updated successfully",
            data: broker,
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to update broker",
            error: error.message,
        });
    }
};


export const deleteBroker = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const forceDelete = req.query.status === "true";

        const broker = await Broker.findOne({
            where: { uid },
            paranoid: false,
        });

        if (!broker) {
            return res.status(400).json({
                success: false,
                message: "Broker not found",
            });
        }

        if (forceDelete) {
            const deleteFile = (filePath?: string | null) => {
                if (!filePath) return;

                const fullPath = path.join("public", filePath);

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            };

            deleteFile(broker.profilePhoto);
            deleteFile(broker.aadhaarFile);
        }

        await broker.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Broker permanently deleted"
                : "Broker soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete broker",
            error: error.message,
        });
    }
};
