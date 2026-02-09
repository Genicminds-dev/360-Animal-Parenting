import { Request, Response } from "express";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import { CommissionAgent } from "../../models";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";
import { cleanupFiles } from "../../middlewares/multerMiddleWare";


export const getCommissionAgents = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { search } = req.query;

        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { uid: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { aadhaarNumber: { [Op.like]: `%${search}%` } },
            ];
        }

        const { rows, count: filteredCount } = await CommissionAgent.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const totalAgents = await CommissionAgent.count();

        res.status(200).json({
            success: true,
            message: "Commission agents fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit: limit,
            },
            summary: {
                totalAgents
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get commission agents",
            error: error.message,
        });
    }
};


export const getCommissionAgentByUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const agent = await CommissionAgent.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"]
            },
        });

        if (!agent) {
            return res.status(400).json({
                success: false,
                message: "Commission agent not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Commission agent by uid fetched successfully",
            data: agent,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get commission agent by uid",
            error: error.message,
        });
    }
}

export const getCommissionAgentList = async (req: Request, res: Response) => {
    try {
        const agents = await CommissionAgent.findAll({
            attributes: [
                "id",
                "uid",
                "name",
                "phone",
            ],
            order: [["uid", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Commission agent list fetched successfully",
            data: agents,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch commission agent list",
            error: error.message,
        });
    }
};


export const createCommissionAgent = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const duplicate = await checkDuplicateGeneric({
            model: CommissionAgent,
            payload: req.body,
            fields: [
                "phone",
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
            uid = await generateUID({ table: CommissionAgent, prefix: "AGT", start: 100001, end: 999999 });
            const record = await CommissionAgent.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file ? file.path.replace(/\\/g, "/").replace("public", "") : null;

        const payload = {
            ...req.body,
            uid,
            profileImg: normalizePath(files.profileImg?.[0]),
            aadhaarFile: normalizePath(files.aadhaarFile?.[0])
        };

        const agent = await CommissionAgent.create(payload);

        return res.status(201).json({
            success: true,
            message: "Commission agent registered successfully",
            data: agent,
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to register commission agent",
            error: error.message,
        });
    }
};


export const updateCommissionAgent = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const { uid } = req.params;

        const agent = await CommissionAgent.findOne({
            where: { uid },
        });

        if (!agent) {
            if (files) cleanupFiles(req);
            return res.status(404).json({
                success: false,
                message: "Commission agent not found",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: CommissionAgent,
            payload: req.body,
            fields: ["phone", "aadhaarNumber"],
            ignoreValue: agent.uid,
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

        if (files?.profileImg?.[0] && agent.profileImg) {
            deleteOldFile(agent.profileImg);
        }

        if (req.body.profileImg === "" && agent.profileImg) {
            deleteOldFile(agent.profileImg);
        }

        if (files?.aadhaarFile?.[0] && agent.aadhaarFile) {
            deleteOldFile(agent.aadhaarFile);
        }

        if (req.body.aadhaarFile === "" && agent.aadhaarFile) {
            deleteOldFile(agent.aadhaarFile);
        }

        const payload = {
            ...req.body,

            profileImg: files?.profileImg?.[0]
                ? normalizePath(files.profileImg[0])
                : req.body.profileImg === ""
                    ? null
                    : agent.profileImg,

            aadhaarFile: files?.aadhaarFile?.[0]
                ? normalizePath(files.aadhaarFile[0])
                : req.body.aadhaarFile === ""
                    ? null
                    : agent.aadhaarFile,
        };

        await agent.update(payload);

        return res.status(200).json({
            success: true,
            message: "Commission agent updated successfully",
            data: agent,
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to update commission agent",
            error: error.message,
        });
    }
};


export const deleteCommissionAgent = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const forceDelete = req.query.status === "true";

        const agent = await CommissionAgent.findOne({
            where: { uid },
            paranoid: false,
        });

        if (!agent) {
            return res.status(400).json({
                success: false,
                message: "Commission agent not found",
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

            deleteFile(agent.profileImg);
            deleteFile(agent.aadhaarFile);
        }

        await agent.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Commission agent permanently deleted"
                : "Commission agent soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete commission agent",
            error: error.message,
        });
    }
};
