import { Request, Response } from "express";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import path from "path";
import { col, fn, Op, where } from "sequelize";
import { Seller, sequelize } from "../../models";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";
import { cleanupFiles } from "../../middlewares/multerMiddleWare";


export const getSellers = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { search, gender, state, transactionId, fromDate, toDate } = req.query;

        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { uid: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { upiId: { [Op.like]: `%${search}%` } },
            ];
        }

        if (gender) {
            whereClause.gender = where(
                fn("LOWER", col("gender")),
                gender.toString().toLowerCase()
            );
        }

        if (state) {
            whereClause.state = where(
                fn("LOWER", col("state")),
                state.toString().toLowerCase()
            );
        }

        if (transactionId && transactionId.toString().toLowerCase() === "yes") {
            whereClause.upiId = {
                [Op.and]: [
                    { [Op.ne]: null },
                    { [Op.ne]: "" },
                ],
            };
        }
        else if (transactionId && transactionId.toString().toLowerCase() === "no") {
            whereClause[Op.or] = [
                { upiId: null },
                { upiId: "" },
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

        const { rows, count: filteredCount } = await Seller.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const genderSummary = await Seller.findAll({
            attributes: [
                "gender",
                [sequelize.fn("COUNT", sequelize.col("gender")), "count"],
            ],
            group: ["gender"],
            raw: true,
        });

        const totalVendors = await Seller.count();

        let maleSellers = 0;
        let femaleSellers = 0;

        genderSummary.forEach((item: any) => {
            if (item.gender === "Male") {
                maleSellers = Number(item.count);
            }
            if (item.gender === "Female") {
                femaleSellers = Number(item.count);
            }
        });

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
                maleSellers,
                femaleSellers,
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

export const getSellerByUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const seller = await Seller.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"]
            },
        });

        if (!seller) {
            return res.status(400).json({
                success: false,
                message: "Seller not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Seller by uid fetched successfully",
            data: seller,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to seller by uid",
            error: error.message,
        });
    }
}

export const getSellerList = async (req: Request, res: Response) => {
    try {
        const sellers = await Seller.findAll({
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
            message: "Seller list fetched successfully",
            data: sellers,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch seller list",
            error: error.message,
        });
    }
};


export const createSeller = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const duplicate = await checkDuplicateGeneric({
            model: Seller,
            payload: req.body,
            fields: [
                "phone",
                "aadhaarNumber",
                "accountNumber",
                "upiId",
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
            uid = await generateUID({ table: Seller, prefix: "SLR", start: 100001, end: 999999 });
            const record = await Seller.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file ? file.path.replace(/\\/g, "/").replace("public", "") : null;

        const payload = {
            ...req.body,
            uid,
            profileImg: normalizePath(files.profileImg?.[0]),
        };

        const seller = await Seller.create(payload);

        return res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            data: seller,
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to register seller",
            error: error.message,
        });
    }
};


export const updateSeller = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const { uid } = req.params;

        const seller = await Seller.findOne({
            where: { uid },
        });

        if (!seller) {
            if (files) cleanupFiles(req);
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: Seller,
            payload: req.body,
            fields: ["phone", "aadhaarNumber", "accountNumber", "upiId"],
            ignoreValue: seller.uid,
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

        if (files?.profileImg?.[0] && seller.profileImg) {
            deleteOldFile(seller.profileImg);
        }

        if (req.body.profileImg === "" && seller.profileImg) {
            deleteOldFile(seller.profileImg);
        }

        const payload = {
            ...req.body,

            profileImg: files?.profileImg?.[0]
                ? normalizePath(files.profileImg[0])
                : req.body.profileImg === ""
                    ? null
                    : seller.profileImg,
        };

        await seller.update(payload);

        return res.status(200).json({
            success: true,
            message: "Seller updated successfully",
            data: seller,
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to update seller",
            error: error.message,
        });
    }
};


export const deleteSeller = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const forceDelete = req.query.status === "true";

        const seller = await Seller.findOne({
            where: { uid },
            paranoid: false,
        });

        if (!seller) {
            return res.status(400).json({
                success: false,
                message: "Seller not found",
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

            deleteFile(seller.profileImg);
        }

        await seller.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Seller permanently deleted"
                : "Seller soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete seller",
            error: error.message,
        });
    }
};
