import { Request, Response } from "express";
import { Animal, HoldingStation, sequelize } from "../../models";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import HoldingStationCaretaker from "../../models/HoldingStationCaretaker";
import HoldingStationIncharge from "../../models/HoldingStationIncharge";
import path from "path";
import { Op, Sequelize } from "sequelize";


export const getHoldingStation = async (req: Request, res: Response) => {
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

        const { rows, count: filteredCount } = await HoldingStation.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
            include: [
                {
                    model: HoldingStationIncharge,
                    as: "centerIncharge"
                },
                {
                    model: HoldingStationCaretaker,
                    as: "caretakerDetails"
                },
            ]
        });

        const totalCenters = await HoldingStation.count();

        const summary = await HoldingStation.findAll({
            attributes: [
                [
                    sequelize.fn(
                        "COUNT",
                        sequelize.literal(`CASE WHEN status = 'active' THEN 1 END`)
                    ),
                    "status"
                ],
                [sequelize.fn("SUM", sequelize.col("currentOccupancy")), "currentOccupancy"]
            ],
            raw: true,
        });

        const activeCenters = Number(summary[0].status) || 0;
        const totalAnimals = Number(summary[0].currentOccupancy) || 0;

        const [caretakerCount, inchargeCount] = await Promise.all([
            HoldingStationCaretaker.count({
                include: [
                    {
                        model: HoldingStation,
                        as: "holdingStation",
                        where: whereClause,
                        attributes: [],
                    }
                ]
            }),
            HoldingStationIncharge.count({
                include: [
                    {
                        model: HoldingStation,
                        as: "holdingStation",
                        where: whereClause,
                        attributes: [],
                    }
                ]
            })
        ]);

        const totalStaff = caretakerCount + inchargeCount;

        res.status(200).json({
            success: true,
            message: "Holding Station fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit: limit,
            },
            summary: {
                totalCenters,
                activeCenters,
                totalAnimals,
                totalStaff,
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get Holding station",
            error: error.message,
        });
    }
};


export const getHoldingStationById = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const center = await HoldingStation.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"]
            },
            include: [
                {
                    model: HoldingStationIncharge,
                    as: "centerIncharge",
                    attributes: ["name", "phone", "email", "gender"]
                },
                {
                    model: HoldingStationCaretaker,
                    as: "caretakerDetails",
                    attributes: ["name", "phone", "aadharNumber"]
                },
                {
                    model: Animal,
                    as: "animals",
                    attributes: ["uid", "earTagId", "breed"]
                },
            ]
        });

        if (!center) {
            return res.status(400).json({
                success: false,
                message: "Holding station not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Holding station by uid fetched successfully",
            data: center,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get Holding station by uid",
            error: error.message,
        });
    }
}

export const getHoldingStationDropdown = async (req: Request, res: Response) => {
    try {
        const centers = await HoldingStation.findAll({
            attributes: [
                "id",
                "uid",
                "pincode",
                "city",
                "state"
            ],
            where: {
                currentOccupancy: {
                    [Op.lt]: Sequelize.col("totalCapacity"),
                },
            },
            order: [["uid", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Available holding stations fetched successfully",
            data: centers,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch holding station dropdown",
            error: error.message,
        });
    }
};


export const createHoldingStation = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

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
            !files.centerImg
        ) {
            return res.status(400).json({
                success: false,
                message: "Center image is required",
            });
        }

        let uid;
        let exists = true;

        while (exists) {
            uid = await generateUID({ table: HoldingStation, prefix: "HS", start: 10001, end: 99999 });
            const record = await HoldingStation.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file
                ? file.path.replace(/\\/g, "/").replace("public", "")
                : null;

        if (req.body.centerVideo === "") {
            req.body.centerVideo = null;
        }

        const centerIncharge = req.body.centerIncharge
            ? JSON.parse(req.body.centerIncharge)
            : [];

        const caretakerDetails = req.body.caretakerDetails
            ? JSON.parse(req.body.caretakerDetails)
            : [];

        const validCaretakers = caretakerDetails.filter((c: any) =>
            c.name?.trim() || c.phone?.trim() || c.aadharNumber?.trim()
        );

        if (!Array.isArray(centerIncharge) || !centerIncharge.length) {
            return res.status(400).json({
                success: false,
                message: "At least one center incharge is required",
            });
        }

        const inchargePhones = centerIncharge.map((i: any) => i.phone).filter(Boolean);
        const inchargeEmails = centerIncharge.map((i: any) => i.email).filter(Boolean);

        const existingIncharge = await HoldingStationIncharge.findOne({
            where: {
                [Op.or]: [
                    { phone: { [Op.in]: inchargePhones } },
                    { email: { [Op.in]: inchargeEmails } },
                ],
            },
            transaction,
        });

        if (existingIncharge) {
            return res.status(409).json({
                success: false,
                message: "Center incharge phone or email already exists in system",
            });
        }

        const caretakerPhones = validCaretakers.map((c: any) => c.phone).filter(Boolean);
        const caretakerAadhar = validCaretakers.map((c: any) => c.aadharNumber).filter(Boolean);

        const existingCaretaker = await HoldingStationCaretaker.findOne({
            where: {
                [Op.or]: [
                    { phone: { [Op.in]: caretakerPhones } },
                    { aadharNumber: { [Op.in]: caretakerAadhar } },
                ],
            },
            transaction,
        });

        if (existingCaretaker) {
            return res.status(409).json({
                success: false,
                message: "Caretaker phone or aadhar number already exists in system",
            });
        }

        const station = await HoldingStation.create(
            {
                ...req.body,
                uid,
                totalCapacity: Number(req.body.totalCapacity),
                centerImg: normalizePath(files.centerImg[0]),
                centerVideo: normalizePath(files.centerVideo?.[0]),
            },
            { transaction }
        );

        await HoldingStationIncharge.bulkCreate(
            centerIncharge.map((i: any) => ({
                name: i.name,
                phone: i.phone,
                email: i.email,
                gender: i.gender,
                holdingStationId: station.id,
            })),
            {
                transaction,
                validate: true,
            }
        );

        if (Array.isArray(validCaretakers) && validCaretakers.length > 0) {
            await HoldingStationCaretaker.bulkCreate(
                validCaretakers.map((c: any) => ({
                    name: c.name,
                    phone: c.phone,
                    aadharNumber: c.aadharNumber,
                    holdingStationId: station.id,
                })),
                {
                    transaction,
                    validate: true,
                }
            );
        }

        await transaction.commit();

        const fullData = {
            id: station.id,
            uid: station.uid,
            status: station.status,

            pincode: station.pincode,
            state: station.state,
            city: station.city,
            district: station.district,
            block: station.block,
            tehsil: station.tehsil,
            postOffice: station.postOffice,
            addressLine: station.addressLine,
            landmark: station.landmark,

            totalCapacity: station.totalCapacity,
            currentOccupancy: station.currentOccupancy,

            centerImg: station.centerImg,
            centerVideo: station.centerVideo,

            centerIncharge: centerIncharge.map((i: any) => ({
                name: i.name,
                phone: i.phone,
                email: i.email,
                gender: i.gender,
            })),

            caretakerDetails: validCaretakers.map((c: any) => ({
                name: c.name,
                phone: c.phone,
                aadharNumber: c.aadharNumber,
            })),

            createdBy: station.createdBy,
            updatedBy: station.updatedBy,
            createdAt: station.createdAt,
            updatedAt: station.updatedAt,
        };

        return res.status(201).json({
            success: true,
            message: "Holding station created successfully",
            data: fullData,
        });

    } catch (error: any) {
        await transaction.rollback();

        if (error.name === "AggregateError" && Array.isArray(error.errors)) {
            const validationErrors = error.errors.flatMap((bulkErr: any) => {

                let source = "unknown";

                if (bulkErr?.record) {
                    if ("name" in bulkErr.record || "phone" in bulkErr.record || "email" in bulkErr.record || "gender" in bulkErr.record) {
                        source = "centerIncharge";
                    } else {
                        source = "caretakerDetails";
                    }
                }

                if (bulkErr?.errors?.errors && bulkErr.errors.errors.length) {
                    return bulkErr.errors.errors.map((e: any) => ({
                        source,
                        field: e.path,
                        message: e.message,
                    }));
                } else if (source !== "unknown") {
                    return [{
                        source,
                        field: Object.keys(bulkErr.record).join(", "),
                        message: "Invalid or incomplete data",
                    }];
                }

                return [];
            });

            if (validationErrors.length) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors,
                });
            }
        }

        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map((e: any) => ({
                    source: "holdingStation",
                    field: e.path,
                    message: e.message,
                })),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create holding station",
            error: error.message || "Internal server error",
        });
    }
};


export const updateHoldingStation = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        const { uid } = req.params;

        const station = await HoldingStation.findOne({ where: { uid } });

        if (!station) {
            return res.status(404).json({
                success: false,
                message: "Holding station not found",
            });
        }

        const updatedPayload: any = { ...req.body };

        const files = req.files as
            | {
                [fieldname: string]: Express.Multer.File[];
            }
            | undefined;

        const updateFile = (
            field: keyof typeof station,
            file?: Express.Multer.File
        ) => {
            if (!file) return;

            const newPath = file.path
                .replace(/\\/g, "/")
                .replace("public", "");

            const oldPath = (station as any)[field]
                ? path.join("public", (station as any)[field])
                : null;

            if (oldPath && fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            updatedPayload[field] = newPath;
        };

        if (files) {
            updateFile("centerImg", files.centerImg?.[0]);
            updateFile("centerVideo", files.centerVideo?.[0]);
        }

        if (updatedPayload.centerVideo === "") {
            updatedPayload.centerVideo = null;
        }

        if (updatedPayload.totalCapacity) {
            const newCapacity = Number(updatedPayload.totalCapacity);
            if (newCapacity < station.currentOccupancy) {
                return res.status(400).json({
                    success: false,
                    message: `Total capacity (${newCapacity}) cannot be less than current occupancy (${station.currentOccupancy})`,
                });
            }
            updatedPayload.totalCapacity = newCapacity;
        }

        await station.update(updatedPayload, { transaction });

        const centerIncharge = req.body.centerIncharge ? JSON.parse(req.body.centerIncharge) : [];
        if (Array.isArray(centerIncharge)) {
            await HoldingStationIncharge.destroy({ where: { holdingStationId: station.id }, transaction });

            if (centerIncharge.length) {
                await HoldingStationIncharge.bulkCreate(
                    centerIncharge.map((i: any) => ({
                        name: i.name,
                        phone: i.phone,
                        email: i.email,
                        gender: i.gender,
                        holdingStationId: station.id,
                    })),
                    { transaction, validate: true }
                );
            }
        }

        const caretakerDetails = req.body.caretakerDetails ? JSON.parse(req.body.caretakerDetails) : [];
        const validCaretakers = caretakerDetails.filter((c: any) =>
            c.name?.trim() || c.phone?.trim() || c.aadharNumber?.trim()
        );
        if (Array.isArray(validCaretakers)) {
            await HoldingStationCaretaker.destroy({ where: { holdingStationId: station.id }, transaction });

            if (validCaretakers.length > 0) {
                await HoldingStationCaretaker.bulkCreate(
                    validCaretakers.map((c: any) => ({
                        name: c.name,
                        phone: c.phone,
                        aadharNumber: c.aadharNumber,
                        holdingStationId: station.id,
                    })),
                    { transaction, validate: true }
                );
            }
        }

        await transaction.commit();

        const fullData = {
            uid: station.uid,
            status: station.status,

            pincode: station.pincode,
            state: station.state,
            city: station.city,
            district: station.district,
            block: station.block,
            tehsil: station.tehsil,
            postOffice: station.postOffice,
            addressLine: station.addressLine,
            landmark: station.landmark,

            totalCapacity: station.totalCapacity,
            currentOccupancy: station.currentOccupancy,

            centerImg: station.centerImg,
            centerVideo: station.centerVideo,

            centerIncharge: centerIncharge.map((i: any) => ({
                name: i.name,
                phone: i.phone,
                email: i.email,
                gender: i.gender,
            })),

            caretakerDetails: validCaretakers.map((c: any) => ({
                name: c.name,
                phone: c.phone,
                aadharNumber: c.aadharNumber,
            })),

            createdBy: station.createdBy,
            updatedBy: station.updatedBy,
            createdAt: station.createdAt,
            updatedAt: station.updatedAt,
        };

        return res.status(200).json({
            success: true,
            message: "Holding station updated successfully",
            data: fullData
        });
    } catch (error: any) {
        await transaction.rollback();

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            Object.values(files)
                .flat()
                .forEach((file) => {
                    try {
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    } catch {
                        // ignore file deletion errors
                    }
                });
        }

        if (error.name === "AggregateError" && Array.isArray(error.errors)) {
            const validationErrors = error.errors.flatMap((bulkErr: any) => {

                let source = "unknown";

                if (bulkErr?.record) {
                    if ("aadharNumber" in bulkErr.record) {
                        source = "caretakerDetails";
                    } else if ("name" in bulkErr.record && "phone" in bulkErr.record) {
                        source = "caretakerDetails";
                    } else {
                        source = "centerIncharge";
                    }
                }

                if (bulkErr?.errors?.errors && bulkErr.errors.errors.length) {
                    return bulkErr.errors.errors.map((e: any) => ({
                        source,
                        field: e.path,
                        message: e.message,
                    }));
                } else if (source !== "unknown") {
                    return [{
                        source,
                        field: Object.keys(bulkErr.record).join(", "),
                        message: "Invalid or incomplete data",
                    }];
                }

                return [];
            });

            if (validationErrors.length) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors,
                });
            }
        }

        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map((e: any) => ({
                    source: "holdingStation",
                    field: e.path,
                    message: e.message,
                })),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update holding station",
            error: error.message || "Internal server error",
        });
    }
};


export const deleteHoldingStation = async (req: Request, res: Response) => {
    try {
        const center = await HoldingStation.findOne({
            where: { uid: req.params.uid },
            paranoid: false,
        });

        if (!center) {
            return res.status(400).json({
                success: false,
                message: "Holding station not found",
            });
        }

        const assignedAnimals = await Animal.findAll({
            where: {
                quarantineId: center.id,
            },
            attributes: ["uid"],
        });

        if (assignedAnimals.length > 0) {
            const animalUids = assignedAnimals.map(a => a.uid).join(", ");

            return res.status(400).json({
                success: false,
                message: `Holding station is assigned to active animals (${animalUids}). Please change holding station or delete those animals first.`,
            });
        }

        const forceDelete = req.query.status === "true";

        await center.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Holding station permanently deleted"
                : "Holding station soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete Holding station",
            error: error.message,
        });
    }
};
