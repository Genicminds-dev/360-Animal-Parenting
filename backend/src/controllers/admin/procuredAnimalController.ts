import { Request, Response } from "express";
import { generateUID } from "../../utils/generateUID";
import fs from "fs";
import path from "path";
import { col, fn, Op, where } from "sequelize";
import { checkDuplicateGeneric } from "../../utils/checkDuplicateHelper";
import { cleanupFiles } from "../../middlewares/multerMiddleWare";
import { User, SourceVisit, ProcuredAnimal, Logistic, QuarantineCenter, Handover, sequelize } from "../../models";


export const getProcurementOfficers = async (req: Request, res: Response) => {
    try {
        const user = await User.findAll({
            where: {
                roleId: 3,
                status: "active"
            },
            attributes: [
                "id",
                "firstName",
                "lastName",
                "mobile"
            ]
        });
        res.status(200).json({
            success: true,
            message: "Procurement officers data fetched successfully",
            data: user
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get procurement officers",
            error: error.message,
        });
    }
}


export const getProcuredAnimals = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { search, sourceType, breed, fromDate, toDate } = req.query;

        const whereClause: any = {};

        if (search) {
            whereClause[Op.or] = [
                { uid: { [Op.like]: `%${search}%` } },
                { breederName: { [Op.like]: `%${search}%` } },
                { breederContact: { [Op.like]: `%${search}%` } },
                { "$procured_animal.tagId$": { [Op.like]: `%${search}%` } },
            ];
        }

        if (sourceType) {
            whereClause.sourceType = where(
                fn("LOWER", col("sourceType")),
                sourceType.toString().toLowerCase()
            );
        }

        let procuredAnimal: any = {
            association: "procured_animal",
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            required: false
        };

        if (breed) {
            procuredAnimal.where = where(
                fn("LOWER", col("procured_animal.breed")),
                breed.toString().toLowerCase()
            );
            procuredAnimal.required = true;
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

        const { rows, count: filteredCount } = await SourceVisit.findAndCountAll({
            limit,
            offset,
            subQuery: false,
            where: whereClause,
            attributes: {
                exclude: ["id", "createdBy", "updatedBy", "updatedAt", "deletedAt"],
            },
            include: [
                procuredAnimal,
                {
                    association: "logistic",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    association: "quarantine_center",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    association: "handover",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    include: [
                        {
                            association: "users",
                            attributes: ["id", "firstName", "lastName", "mobile"]
                        }
                    ]
                },
                {
                    association: "users",
                    attributes: ["id", "firstName", "lastName", "mobile"]
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Procured animals fetched successfully",
            data: rows,
            pagination: {
                totalRecords: filteredCount,
                totalPages: Math.ceil(filteredCount / limit),
                currentPage: page,
                limit: limit,
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get procured animals",
            error: error.message,
        });
    }
};


export const getProcuredAnimalbyUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const sourceVisit = await SourceVisit.findOne({
            where: { uid },
            attributes: {
                exclude: ["id", "updatedAt", "createdBy", "updatedBy", "deletedAt"],
            },
            include: [
                {
                    association: "procured_animal",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    association: "logistic",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    association: "quarantine_center",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    association: "handover",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    include: [
                        {
                            association: "users",
                            attributes: ["id", "firstName", "lastName", "mobile"]
                        }
                    ]
                },
                {
                    association: "users",
                    attributes: ["id", "firstName", "lastName", "mobile"]
                }
            ]
        })

        if (!sourceVisit) {
            return res.status(404).json({
                success: false,
                message: "Procured animal data not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Procured animal data fetched by uid successfully",
            data: sourceVisit,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get procured animal by uid",
            error: error.message,
        })
    }
}


export const createProcurement = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        if (!req.user || !req.user.id) {
            throw new Error("Unauthorized: User not found");
        }

        const userId = req.user.id;
        const body = req.body;
        const files = req.files as Record<string, Express.Multer.File[]>;

        const normalizePath = (file?: Express.Multer.File) =>
            file ? file.path.replace(/\\/g, "/").replace("public", "") : null;

        const duplicate = await checkDuplicateGeneric({
            model: ProcuredAnimal,
            payload: req.body,
            fields: [
                "tagId",
            ],
        });

        if (duplicate) {
            if (files) cleanupFiles(req);
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        let uid: string = "";
        let exists = true;

        while (exists) {
            uid = await generateUID({ table: SourceVisit, prefix: "ANML", start: 1000001, end: 9999999 });
            const record = await SourceVisit.findOne({ where: { uid } });
            exists = !!record;
        }

        const sourceVisit = await SourceVisit.create(
            {
                uid,
                procurementOfficer: body.procurementOfficer,
                sourceType: body.sourceType,
                sourceLocation: body.sourceLocation,
                visitDate: body.visitDate,
                visitTime: body.visitTime,
                breederName: body.breederName,
                breederContact: body.breederContact,
                createdBy: userId,
                updatedBy: userId,
            },
            { transaction }
        );

        const procurementId = sourceVisit.id;

        const procuredAnimal = await ProcuredAnimal.create(
            {
                procurementId,
                tagId: body.tagId,
                breed: body.breed,
                ageYears: body.ageYears,
                ageMonths: body.ageMonths,
                milkingCapacity: body.milkingCapacity,
                isCalfIncluded: body.isCalfIncluded,
                physicalCheck: body.physicalCheck,
                fmdDisease: body.fmdDisease,
                lsdDisease: body.lsdDisease,

                animalPhotoFront: normalizePath(files.animalPhotoFront?.[0]),
                animalPhotoSide: normalizePath(files.animalPhotoSide?.[0]),
                animalPhotoRear: normalizePath(files.animalPhotoRear?.[0]),
                healthRecord: normalizePath(files.healthRecord?.[0]),
            },
            { transaction }
        );

        const logistic = await Logistic.create(
            {
                procurementId,
                vehicleNo: body.vehicleNo,
                driverName: body.driverName,
                driverDesignation: body.driverDesignation,
                driverMobile: body.driverMobile,
                driverAadhar: body.driverAadhar,
                drivingLicense: body.drivingLicense,
                licenseCertificate: normalizePath(files.licenseCertificate?.[0]),
            },
            { transaction }
        );

        const quarantine = await QuarantineCenter.create(
            {
                procurementId,
                quarantineCenter: body.quarantineCenter,
                quarantineCenterPhoto: normalizePath(files.quarantineCenterPhoto?.[0]),
                quarantineHealthRecord: normalizePath(files.quarantineHealthRecord?.[0]),
                finalHealthClearance: normalizePath(files.finalHealthClearance?.[0]),
            },
            { transaction }
        );

        const handover = await Handover.create(
            {
                procurementId,
                handoverOfficer: body.handoverOfficer ? Number(body.handoverOfficer) : null,
                beneficiaryId: body.beneficiaryId,
                beneficiaryLocation: body.beneficiaryLocation,
                handoverPhoto: normalizePath(files.handoverPhoto?.[0]),
                handoverDate: body.handoverDate,
                handoverTime: body.handoverTime,
                handoverDocument: normalizePath(files.handoverDocument?.[0]),
            },
            { transaction }
        );

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "Procurement created successfully",
            data: {
                sourceVisit,
                procuredAnimal,
                logistic,
                quarantine,
                handover,
            },
        });
    } catch (error: any) {
        await transaction.rollback();
        cleanupFiles(req);

        return res.status(500).json({
            success: false,
            message: "Failed to create procurement",
            error: error.message,
        });
    }
};


export const updateProcurement = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        if (!req.user || !req.user.id) {
            throw new Error("Unauthorized: User not found");
        }

        const userId = req.user.id;

        const { uid } = req.params;
        const files = req.files as Record<string, Express.Multer.File[]>;

        const normalizePath = (file?: Express.Multer.File) =>
            file ? file.path.replace(/\\/g, "/").replace("public", "") : null;

        const deleteOldFile = (filePath?: string | null) => {
            if (!filePath) return;
            const fullPath = path.join("public", filePath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        };

        const sourceVisit = await SourceVisit.findOne({ where: { uid } });

        if (!sourceVisit) {
            if (files) cleanupFiles(req);
            return res.status(404).json({
                success: false,
                message: "Procurement not found",
            });
        }

        const procurementId = sourceVisit.id;

        const procuredAnimal = await ProcuredAnimal.findOne({ where: { procurementId } });
        const logistic = await Logistic.findOne({ where: { procurementId } });
        const quarantine = await QuarantineCenter.findOne({ where: { procurementId } });
        const handover = await Handover.findOne({ where: { procurementId } });

        const body = req.body;

        const duplicate = await checkDuplicateGeneric({
            model: ProcuredAnimal,
            payload: req.body,
            fields: ["tagId"],
            ignoreValue: procuredAnimal?.id?.toString(),
        });

        if (duplicate) {
            if (files) cleanupFiles(req);
            return res.status(409).json({
                success: false,
                message: duplicate.message,
            });
        }

        await sourceVisit.update(
            {
                procurementOfficer: body.procurementOfficer,
                sourceType: body.sourceType,
                sourceLocation: body.sourceLocation,
                visitDate: body.visitDate,
                visitTime: body.visitTime,
                breederName: body.breederName,
                breederContact: body.breederContact,
                updatedBy: userId,
            },
            { transaction }
        );

        if (procuredAnimal) {

            if (files?.animalPhotoFront?.[0] && procuredAnimal.animalPhotoFront) {
                deleteOldFile(procuredAnimal.animalPhotoFront);
            }

            if (req.body.animalPhotoFront === "" && procuredAnimal.animalPhotoFront) {
                deleteOldFile(procuredAnimal.animalPhotoFront);
            }

            if (files?.animalPhotoSide?.[0] && procuredAnimal.animalPhotoSide) {
                deleteOldFile(procuredAnimal.animalPhotoSide);
            }

            if (req.body.animalPhotoSide === "" && procuredAnimal.animalPhotoSide) {
                deleteOldFile(procuredAnimal.animalPhotoSide);
            }

            if (files?.animalPhotoRear?.[0] && procuredAnimal.animalPhotoRear) {
                deleteOldFile(procuredAnimal.animalPhotoRear);
            }

            if (req.body.animalPhotoRear === "" && procuredAnimal.animalPhotoRear) {
                deleteOldFile(procuredAnimal.animalPhotoRear);
            }

            if (files?.healthRecord?.[0] && procuredAnimal.healthRecord) {
                deleteOldFile(procuredAnimal.healthRecord);
            }

            if (req.body.healthRecord === "" && procuredAnimal.healthRecord) {
                deleteOldFile(procuredAnimal.healthRecord);
            }

            await procuredAnimal.update(
                {
                    tagId: body.tagId,
                    breed: body.breed,
                    ageYears: body.ageYears,
                    ageMonths: body.ageMonths,
                    milkingCapacity: body.milkingCapacity,
                    isCalfIncluded: body.isCalfIncluded,
                    physicalCheck: body.physicalCheck,
                    fmdDisease: body.fmdDisease,
                    lsdDisease: body.lsdDisease,

                    animalPhotoFront: files?.animalPhotoFront?.[0]
                        ? normalizePath(files.animalPhotoFront[0])
                        : body.animalPhotoFront === ""
                            ? null
                            : procuredAnimal.animalPhotoFront,

                    animalPhotoSide: files?.animalPhotoSide?.[0]
                        ? normalizePath(files.animalPhotoSide[0])
                        : body.animalPhotoSide === ""
                            ? null
                            : procuredAnimal.animalPhotoSide,

                    animalPhotoRear: files?.animalPhotoRear?.[0]
                        ? normalizePath(files.animalPhotoRear[0])
                        : body.animalPhotoRear === ""
                            ? null
                            : procuredAnimal.animalPhotoRear,

                    healthRecord: files?.healthRecord?.[0]
                        ? normalizePath(files.healthRecord[0])
                        : body.healthRecord === ""
                            ? null
                            : procuredAnimal.healthRecord,
                },
                { transaction }
            );
        }

        if (logistic) {

            if (files?.licenseCertificate?.[0] && logistic.licenseCertificate) {
                deleteOldFile(logistic.licenseCertificate);
            }

            if (req.body.licenseCertificate === "" && logistic.licenseCertificate) {
                deleteOldFile(logistic.licenseCertificate);
            }

            await logistic.update(
                {
                    vehicleNo: body.vehicleNo,
                    driverName: body.driverName,
                    driverDesignation: body.driverDesignation,
                    driverMobile: body.driverMobile,
                    driverAadhar: body.driverAadhar,
                    drivingLicense: body.drivingLicense,

                    licenseCertificate: files?.licenseCertificate?.[0]
                        ? normalizePath(files.licenseCertificate[0])
                        : body.licenseCertificate === ""
                            ? null
                            : logistic.licenseCertificate,
                },
                { transaction }
            );
        }

        if (quarantine) {

            if (files?.quarantineCenterPhoto?.[0] && quarantine.quarantineCenterPhoto) {
                deleteOldFile(quarantine.quarantineCenterPhoto);
            }

            if (req.body.quarantineCenterPhoto === "" && quarantine.quarantineCenterPhoto) {
                deleteOldFile(quarantine.quarantineCenterPhoto);
            }

            if (files?.quarantineHealthRecord?.[0] && quarantine.quarantineHealthRecord) {
                deleteOldFile(quarantine.quarantineHealthRecord);
            }

            if (req.body.quarantineHealthRecord === "" && quarantine.quarantineHealthRecord) {
                deleteOldFile(quarantine.quarantineHealthRecord);
            }

            if (files?.finalHealthClearance?.[0] && quarantine.finalHealthClearance) {
                deleteOldFile(quarantine.finalHealthClearance);
            }

            if (req.body.finalHealthClearance === "" && quarantine.finalHealthClearance) {
                deleteOldFile(quarantine.finalHealthClearance);
            }

            await quarantine.update(
                {
                    quarantineCenter: body.quarantineCenter,

                    quarantineCenterPhoto: files?.quarantineCenterPhoto?.[0]
                        ? normalizePath(files.quarantineCenterPhoto[0])
                        : body.quarantineCenterPhoto === ""
                            ? null
                            : quarantine.quarantineCenterPhoto,

                    quarantineHealthRecord: files?.quarantineHealthRecord?.[0]
                        ? normalizePath(files.quarantineHealthRecord[0])
                        : body.quarantineHealthRecord === ""
                            ? null
                            : quarantine.quarantineHealthRecord,

                    finalHealthClearance: files?.finalHealthClearance?.[0]
                        ? normalizePath(files.finalHealthClearance[0])
                        : body.finalHealthClearance === ""
                            ? null
                            : quarantine.finalHealthClearance,
                },
                { transaction }
            );
        }

        if (handover) {

            if (files?.handoverPhoto?.[0] && handover.handoverPhoto) {
                deleteOldFile(handover.handoverPhoto);
            }

            if (req.body.handoverPhoto === "" && handover.handoverPhoto) {
                deleteOldFile(handover.handoverPhoto);
            }

            if (files?.handoverDocument?.[0] && handover.handoverDocument) {
                deleteOldFile(handover.handoverDocument);
            }

            if (req.body.handoverDocument === "" && handover.handoverDocument) {
                deleteOldFile(handover.handoverDocument);
            }

            await handover.update(
                {
                    handoverOfficer: body.handoverOfficer
                        ? Number(body.handoverOfficer)
                        : null,
                    beneficiaryId: body.beneficiaryId,
                    beneficiaryLocation: body.beneficiaryLocation,
                    handoverDate: body.handoverDate,
                    handoverTime: body.handoverTime,

                    handoverPhoto: files?.handoverPhoto?.[0]
                        ? normalizePath(files.handoverPhoto[0])
                        : body.handoverPhoto === ""
                            ? null
                            : handover.handoverPhoto,

                    handoverDocument: files?.handoverDocument?.[0]
                        ? normalizePath(files.handoverDocument[0])
                        : body.handoverDocument === ""
                            ? null
                            : handover.handoverDocument,
                },
                { transaction }
            );
        }

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Procurement updated successfully",
        });

    } catch (error: any) {
        await transaction.rollback();
        cleanupFiles(req);
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Failed to update procurement",
            error: error.message,
        });
    }
};


export const deleteProcuredAnimal = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const forceDelete = req.query.status === "true";

        const sourceVisit = await SourceVisit.findOne({
            where: { uid },
            include: [
                { model: ProcuredAnimal, as: "procured_animal" },
                { model: Logistic, as: "logistic" },
                { model: QuarantineCenter, as: "quarantine_center" },
                { model: Handover, as: "handover" },
            ],
            paranoid: false,
        });


        if (!sourceVisit) {
            return res.status(400).json({
                success: false,
                message: "Procured animal not found",
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

            sourceVisit.procured_animal?.forEach((animal: any) => {
                deleteFile(animal.animalPhotoFront);
                deleteFile(animal.animalPhotoSide);
                deleteFile(animal.animalPhotoRear);
                deleteFile(animal.healthRecord);
            });

            sourceVisit.logistic?.forEach((log) => {
                deleteFile(log.licenseCertificate);
            });

            sourceVisit.quarantine_center?.forEach((qc) => {
                deleteFile(qc.quarantineCenterPhoto);
                deleteFile(qc.quarantineHealthRecord);
                deleteFile(qc.finalHealthClearance);
            });

            sourceVisit.handover?.forEach((ho) => {
                deleteFile(ho.handoverPhoto);
                deleteFile(ho.handoverDocument);
            });
        }

        await sourceVisit.destroy({ force: forceDelete });

        res.status(200).json({
            success: true,
            message: forceDelete
                ? "Procured animal permanently deleted"
                : "Procured animal soft deleted",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete procured animal",
            error: error.message,
        });
    }
};
