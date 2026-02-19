import { Request, Response } from "express";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import { CommissionAgent, Seller, sequelize } from "../../models";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";
import { cleanupFiles } from "../../middlewares/multerMiddleWare";
import Animal from "../../models/Animal";


export const getAnimals = async (req: Request, res: Response) => {
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


export const getAnimalByUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const animal = await Animal.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "updatedAt", "createdBy", "updatedBy", "deletedAt"],
            },
            include: [
                {
                    model: Seller,
                    as: "sellers",
                    attributes: ["uid", "name", "phone"],
                },
                {
                    model: CommissionAgent,
                    as: "commission_agents",
                    attributes: ["uid", "name", "phone"],
                    required: false,
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
    const transaction = await sequelize.transaction();

    try {
        if (!req.user || !req.user.id) {
            throw new Error("Unauthorized: User not found");
        }

        const userId = req.user.id;

        const { sellerId } = req.body;

        if (!sellerId) {
            cleanupFiles(req);
            return res.status(400).json({
                success: false,
                message: "Seller ID is required",
            });
        }

        if (!req.body.animals) {
            cleanupFiles(req);
            return res.status(400).json({
                success: false,
                message: "Animals data is required",
            });
        }

        const animals = JSON.parse(req.body.animals);

        if (!Array.isArray(animals) || animals.length === 0) {
            cleanupFiles(req);
            return res.status(400).json({
                success: false,
                message: "Animals must be a non-empty array",
            });
        }

        const files = req.files as Express.Multer.File[];

        const getFile = (index: number, field: string) => {
            const file = files?.find(
                (f) => f.fieldname === `animals[${index}][${field}]`
            );
            return file
                ? file.path.replace(/\\/g, "/").replace("public", "")
                : null;
        };

        const createdAnimals = [];

        for (let i = 0; i < animals.length; i++) {
            const animal = animals[i];

            if (
                !animal.earTagId ||
                !animal.animalType ||
                !animal.breed ||
                !animal.pricing ||
                !animal.pregnancyStatus
            ) {
                throw new Error(`Missing required fields for animal at index ${i}`);
            }

            if (
                animal.pregnancyStatus?.toLowerCase() === "milking" &&
                !animal.calfEarTagId
            ) {
                throw new Error(
                    `Calf Ear Tag ID is required when pregnancy status is Milking (index ${i})`
                );
            }

            if (
                animal.earTagId &&
                animal.calfEarTagId &&
                animal.earTagId === animal.calfEarTagId
            ) {
                throw new Error(
                    `Ear tag ID and calf ear tag ID cannot be same (index ${i})`
                );
            }

            const duplicate = await checkDuplicateGeneric({
                model: Animal,
                payload: animal,
                fields: ["earTagId", "calfEarTagId"],
            });

            if (duplicate) {
                throw new Error(
                    `${duplicate.message} (index ${i})`
                );
            }

            let uid: string = "";
            let exists = true;

            while (exists) {
                uid = await generateUID({
                    table: Animal,
                    prefix: "ANML",
                    start: 1000001,
                    end: 9999999,
                });

                const record = await Animal.findOne({ where: { uid }});
                exists = !!record;
            }

            const payload = {
                sellerId: Number(sellerId),
                uid,

                earTagId: animal.earTagId,
                animalType: animal.animalType,
                breed: animal.breed,
                pricing: animal.pricing,
                pregnancyStatus: animal.pregnancyStatus,

                calfEarTagId: animal.calfTagId || null,
                totalPregnancies: animal.totalPregnancies || null,
                ageYears: animal.ageYears || null,
                ageMonths: animal.ageMonths || null,
                weight: animal.weight || null,
                milkPerDay: animal.milkPerDay || null,
                calfAgeYears: animal.calfAgeYears || null,
                calfAgeMonths: animal.calfAgeMonths || null,
                agentId: animal.agentId || null,

                frontPhoto: getFile(i, "frontPhoto"),
                sidePhoto: getFile(i, "sidePhoto"),
                backPhoto: getFile(i, "backPhoto"),
                animalVideo: getFile(i, "animalVideo"),
                calfPhoto: getFile(i, "calfPhoto"),
                calfVideo: getFile(i, "calfVideo"),

                createdBy: userId,
                updatedBy: userId,
            };

            const createdAnimal = await Animal.create(payload, { transaction });
            createdAnimals.push(createdAnimal);
        }

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Animals registered successfully",
            data: createdAnimals,
        });

    } catch (error: any) {
        console.log(error)
        await transaction.rollback();
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to create animal detail",
            error: error.message,
        });
    }
};


export const updateAnimal = async (req: Request, res: Response) => {
    try {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const { uid } = req.params;


        const animal = await Animal.findOne({
            where: { uid },
        });

        if (!animal) {
            if (files) cleanupFiles(req);
            return res.status(404).json({
                success: false,
                message: "Animal not found",
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

        const duplicate = await checkDuplicateGeneric({
            model: Animal,
            payload: req.body,
            fields: [
                "calfEarTagId",
                "earTagId"
            ],
            ignoreValue: animal.uid,
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

        if (files?.frontPhoto?.[0] && animal.frontPhoto) {
            deleteOldFile(animal.frontPhoto);
        }

        if (req.body.frontPhoto === "" && animal.frontPhoto) {
            deleteOldFile(animal.frontPhoto);
        }

        if (files?.sidePhoto?.[0] && animal.sidePhoto) {
            deleteOldFile(animal.sidePhoto);
        }

        if (req.body.sidePhoto === "" && animal.sidePhoto) {
            deleteOldFile(animal.sidePhoto);
        }

        if (files?.backPhoto?.[0] && animal.backPhoto) {
            deleteOldFile(animal.backPhoto);
        }

        if (req.body.backPhoto === "" && animal.backPhoto) {
            deleteOldFile(animal.backPhoto);
        }

        if (files?.animalVideo?.[0] && animal.animalVideo) {
            deleteOldFile(animal.animalVideo);
        }

        if (req.body.animalVideo === "" && animal.animalVideo) {
            deleteOldFile(animal.animalVideo);
        }

        if (files?.calfPhoto?.[0] && animal.calfPhoto) {
            deleteOldFile(animal.calfPhoto);
        }

        if (req.body.calfPhoto === "" && animal.calfPhoto) {
            deleteOldFile(animal.calfPhoto);
        }

        if (files?.calfVideo?.[0] && animal.calfVideo) {
            deleteOldFile(animal.calfVideo);
        }

        if (req.body.calfVideo === "" && animal.calfVideo) {
            deleteOldFile(animal.calfVideo);
        }

        const payload = {
            ...req.body,

            frontPhoto: files?.frontPhoto?.[0]
                ? normalizePath(files.frontPhoto[0])
                : req.body.frontPhoto === ""
                    ? null
                    : animal.frontPhoto,

            sidePhoto: files?.sidePhoto?.[0]
                ? normalizePath(files.sidePhoto[0])
                : req.body.sidePhoto === ""
                    ? null
                    : animal.sidePhoto,

            backPhoto: files?.backPhoto?.[0]
                ? normalizePath(files.backPhoto[0])
                : req.body.backPhoto === ""
                    ? null
                    : animal.backPhoto,

            animalVideo: files?.animalVideo?.[0]
                ? normalizePath(files.animalVideo[0])
                : req.body.animalVideo === ""
                    ? null
                    : animal.animalVideo,

            calfPhoto: files?.calfPhoto?.[0]
                ? normalizePath(files.calfPhoto[0])
                : req.body.calfPhoto === ""
                    ? null
                    : animal.calfPhoto,

            calfVideo: files?.calfVideo?.[0]
                ? normalizePath(files.calfVideo[0])
                : req.body.calfVideo === ""
                    ? null
                    : animal.calfVideo,
        };

        await animal.update(payload);

        return res.status(200).json({
            success: true,
            message: "Animal updated successfully",
            data: animal,
        });

    } catch (error: any) {
        cleanupFiles(req);
        return res.status(500).json({
            success: false,
            message: "Failed to update animal",
            error: error.message,
        });
    }
};


export const deleteAnimal = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const forceDelete = req.query.status === "true";

        const animal = await Animal.findOne({
            where: { uid },
            paranoid: false,
        });

        if (!animal) {
            return res.status(400).json({
                success: false,
                message: "Animal not found",
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

            deleteFile(animal.frontPhoto);
            deleteFile(animal.sidePhoto);
            deleteFile(animal.backPhoto);
            deleteFile(animal.animalVideo);
            deleteFile(animal.calfPhoto);
            deleteFile(animal.calfVideo);
        }

        await animal.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Animal permanently deleted"
                : "Animal soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete animal",
            error: error.message,
        });
    }
};
