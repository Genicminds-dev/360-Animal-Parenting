import { Request, Response } from "express";
import { Animal, HoldingStation, sequelize, Vendor } from "../../models";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import { Op } from "sequelize";
import path from "path";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";

const normalizeEmptyStrings = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === "") {
            obj[key] = null;
        }
    });
};

export const getAnimal = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const whereClause: any = {};

        if (req.query.breed) {
            whereClause.breed = req.query.breed;
        }

        if (req.query.pregnancyStatus) {
            whereClause.pregnancyStatus = req.query.pregnancyStatus;
        }

        if (req.query.animalType) {
            whereClause.animalType = req.query.animalType;
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

        const { rows, count: filteredCount } = await Animal.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
        });

        const totalBreeds = await Animal.count({
            distinct: true,
            col: "breed",
            where: {
                breed: {
                    [Op.ne]: null,
                },
            },
        });

        const totalAnimals = await Animal.count();

        const activePregnant = await Animal.count({
            where: {
                pregnancyStatus: "pregnant",
            },
        });

        const lastAddedAnimal = await Animal.findOne({
            attributes: ["createdAt"],
            order: [["createdAt", "DESC"]],
            raw: true,
        });

        res.status(200).json({
            success: true,
            message: "Animals fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit,
            },
            summary: {
                totalAnimals,
                totalBreeds,
                activePregnant,
                lastAddedDate: lastAddedAnimal?.createdAt || null,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch animals",
            error: error.message,
        });
    }
};



export const getAnimalById = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const animal = await Animal.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "updatedAt", "createdBy", "updatedBy", "deletedAt"],
            },
            include: [
                {
                    model: Vendor,
                    as: "vendor",
                    attributes: ["uid", "name", "phone", "status", "firmType"],
                },
                {
                    model: HoldingStation,
                    as: "holdingStation",
                    attributes: ["uid"],
                },
            ],
        });

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: "Animal not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Animal fetched successfully",
            data: animal,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch animal by uid",
            error: error.message,
        });
    }
};


export const createAnimal = async (req: Request, res: Response) => {
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
            !files?.photoFront ||
            !files?.photoBack ||
            !files?.photoSide
        ) {
            return res.status(400).json({
                success: false,
                message: "Front, back and side photos are required",
            });
        }

        if (
            req.body.earTagId &&
            req.body.calfEarTagId &&
            req.body.earTagId === req.body.calfEarTagId
        ) {
            return res.status(400).json({
                success: false,
                message: "Ear tag ID and calf ear tag ID cannot be the same",
            });
        }

        const { quarantineId } = req.body;

        const holdingStation = await HoldingStation.findOne({
            where: { id: quarantineId },
        });

        if (!holdingStation) {
            return res.status(404).json({
                success: false,
                message: "Holding station not found",
            });
        }

        if (holdingStation.currentOccupancy >= holdingStation.totalCapacity) {
            return res.status(409).json({
                success: false,
                message: "Holding station capacity full",
            });
        }

        const duplicate = await checkDuplicateGeneric({
            model: Animal,
            payload: req.body,
            fields: [
                "calfEarTagId",
                "earTagId",
                "snb_id",
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
            uid = await generateUID({ table: Animal, prefix: "ANI", start: 1000001, end: 9999999 });
            const record = await Animal.findOne({ where: { uid } });
            exists = !!record;
        }

        const normalizePath = (file?: Express.Multer.File) =>
            file
                ? file.path.replace(/\\/g, "/").replace("public", "")
                : null;

        const payload = {
            ...req.body,
            uid,

            photoFront: normalizePath(files.photoFront[0]),
            photoBack: normalizePath(files.photoBack[0]),
            photoSide: normalizePath(files.photoSide[0]),
            video: normalizePath(files.video?.[0]),
            calfImage: normalizePath(files.calfImage?.[0]),
            calfVideo: normalizePath(files.calfVideo?.[0]),
        };

        const animal = await Animal.create(payload);

        await holdingStation.increment("currentOccupancy", { by: 1 });

        return res.status(201).json({
            success: true,
            message: "Animal created successfully",
            data: animal,
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
            message: "Failed to create animal",
            error: error.message,
        });
    }
};


export const updateAnimal = async (req: Request, res: Response) => {
    try {
        const animal = await Animal.findOne({
            where: { uid: req.params.uid },
        });

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: "Animal not found",
            });
        }

        let updatedPayload: any = { ...req.body };
        normalizeEmptyStrings(updatedPayload);

        const duplicate = await checkDuplicateGeneric({
            model: Animal,
            payload: updatedPayload,
            fields: [
                "calfEarTagId",
                "earTagId",
                "snb_id",
            ],
            ignoreValue: animal.uid,
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        } | undefined;

        const updateFile = (
            field: keyof Animal,
            file?: Express.Multer.File
        ) => {
            if (!file) return;

            const newPath = file.path
                .replace(/\\/g, "/")
                .replace("public", "");

            const oldPath = (animal as any)[field]
                ? path.join("public", (animal as any)[field])
                : null;

            if (oldPath && fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            updatedPayload[field] = newPath;
        };

        if (files) {
            updateFile("photoFront", files.photoFront?.[0]);
            updateFile("photoBack", files.photoBack?.[0]);
            updateFile("photoSide", files.photoSide?.[0]);
            updateFile("video", files.video?.[0]);
            updateFile("calfImage", files.calfImage?.[0]);
            updateFile("calfVideo", files.calfVideo?.[0]);
        }

        const finalEarTagId =
            updatedPayload.earTagId ?? animal.earTagId;

        const finalCalfEarTagId =
            updatedPayload.calfEarTagId ?? animal.calfEarTagId;

        if (
            finalEarTagId &&
            finalCalfEarTagId &&
            finalEarTagId === finalCalfEarTagId
        ) {
            return res.status(400).json({
                success: false,
                message: "Ear tag ID and calf ear tag ID cannot be the same",
            });
        }

        if (
            updatedPayload.quarantineId &&
            updatedPayload.quarantineId !== animal.quarantineId
        ) {
            const oldStation = await HoldingStation.findOne({
                where: { id: animal.quarantineId },
            });

            const newStation = await HoldingStation.findOne({
                where: { id: updatedPayload.quarantineId },
            });

            if (!newStation) {
                return res.status(404).json({
                    success: false,
                    message: "New holding station not found",
                });
            }

            if (newStation.currentOccupancy >= newStation.totalCapacity) {
                return res.status(409).json({
                    success: false,
                    message: "New holding station capacity full",
                });
            }

            if (oldStation && oldStation.currentOccupancy > 0) {
                await oldStation.increment("currentOccupancy", { by: -1 });
            }

            await newStation.increment("currentOccupancy", { by: 1 });
        }


        await animal.update(updatedPayload);

        return res.status(200).json({
            success: true,
            message: "Animal updated successfully",
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
            message: "Failed to update animal",
            error: error.message,
        });
    }
};


export const deleteAnimal = async (req: Request, res: Response) => {
    try {
        const animal = await Animal.findOne({
            where: { uid: req.params.uid },
            paranoid: false,
        });

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: "Animal not found",
            });
        }

        const forceDelete = req.query.status === "true";

        if (forceDelete) {
            const files = [
                animal.photoFront,
                animal.photoBack,
                animal.photoSide,
                animal.video,
                animal.calfImage,
                animal.calfVideo,
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

        if (animal.quarantineId) {
            const holdingStation = await HoldingStation.findOne({
                where: { id: animal.quarantineId },
            });

            if (holdingStation && holdingStation.currentOccupancy > 0) {
                await holdingStation.increment("currentOccupancy", { by: -1 });
            }
        }

        await animal.destroy({ force: forceDelete });

        return res.status(200).json({
            success: true,
            message: forceDelete
                ? "Animal permanently deleted"
                : "Animal soft deleted",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete animal",
            error: error.message,
        });
    }
};


export const vendorAssignedAnimal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const unpaidAnimals = await Animal.findAll({
            where: {
                vendorId: id,
                vendorPay: false,
            },
            attributes: ['id', 'uid', 'breed', 'earTagId'],
        });

        if (unpaidAnimals.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All animals assigned to this vendor are already paid",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Unpaid animals for this vendor fetched successfully",
            data: unpaidAnimals,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendor animals",
            error: error.message,
        });
    }
};
