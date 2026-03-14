import { Request, Response } from "express";
import { generateUID } from "../../utils/generateUID";
import { col, fn, Op, where } from "sequelize";
import { Beneficiary } from "../../models";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";


export const getBeneficiaries = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { search, gender, state, fromDate, toDate } = req.query;

        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { uid: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { state: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
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

        const { rows, count: filteredCount } = await Beneficiary.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const totalBeneficiaries = await Beneficiary.count();

        res.status(200).json({
            success: true,
            message: "Beneficiaries fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit: limit,
            },
            summary: {
                totalBeneficiaries
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get beneficiaries",
            error: error.message,
        });
    }
};


export const getBeneficiaryByUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const beneficiary = await Beneficiary.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"]
            },
        });

        if (!beneficiary) {
            return res.status(400).json({
                success: false,
                message: "Beneficiary not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Beneficiary by uid fetched successfully",
            data: beneficiary,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get beneficiary by uid",
            error: error.message,
        });
    }
}

export const getBeneficiaryList = async (req: Request, res: Response) => {
    try {
        const beneficiaries = await Beneficiary.findAll({
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
            message: "Beneficiary list fetched successfully",
            data: beneficiaries,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch beneficiary list",
            error: error.message,
        });
    }
};


export const createBeneficiary = async (req: Request, res: Response) => {
    try {
        const duplicate = await checkDuplicateGeneric({
            model: Beneficiary,
            payload: req.body,
            fields: [
                "mobile"
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
            uid = await generateUID({ table: Beneficiary, prefix: "BNF", start: 100001, end: 999999 });
            const record = await Beneficiary.findOne({ where: { uid } });
            exists = !!record;
        }

        const beneficiary = await Beneficiary.create({
            ...req.body,
            uid
        });

        return res.status(201).json({
            success: true,
            message: "Beneficiary registered successfully",
            data: beneficiary
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to register beneficiary",
            error: error.message,
        });
    }
};


export const updateBeneficiary = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const beneficiary = await Beneficiary.findOne({
            where: { uid },
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: Beneficiary,
            payload: req.body,
            fields: ["mobile"],
            ignoreCol: "uid",
            ignoreValue: beneficiary.uid,
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        await beneficiary.update({ ...req.body });

        return res.status(200).json({
            success: true,
            message: "Beneficiary updated successfully",
            data: beneficiary,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to update beneficiary",
            error: error.message,
        });
    }
};


export const deleteBeneficiary = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const forceDelete = req.query.status === "true";

        const beneficiary = await Beneficiary.findOne({
            where: { uid },
            paranoid: false,
        });

        if (!beneficiary) {
            return res.status(400).json({
                success: false,
                message: "Beneficiary not found",
            });
        }

        await beneficiary.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Beneficiary permanently deleted"
                : "Beneficiary soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete beneficiary",
            error: error.message,
        });
    }
};
