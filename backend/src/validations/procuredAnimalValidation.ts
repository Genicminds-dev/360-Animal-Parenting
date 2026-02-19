import Joi from "joi";

export const CreateProcuredAnimalSchema = Joi.object({
    procurementOfficer: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Procurement officer is required",
            "number.base": "Procurement officer must be a number",
            "number.integer": "Procurement officer must be a valid integer ID",
            "number.positive": "Procurement officer must be a valid ID",
        }),

    sourceType: Joi.string()
        .lowercase()
        .valid("bazaar", "farm")
        .required()
        .empty("")
        .messages({
            "any.required": "Source type is required",
            "any.only": "Source type must be Bazaar or Farm",
        }),

    sourceLocation: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            "any.required": "Source location is required",
            "string.empty": "Source location is required",
            "string.min": "Source location must be at least 10 characters",
            "string.max": "Source location must not exceed 500 characters",
        }),

    visitDate: Joi.date()
        .required()
        .messages({
            "any.required": "Visit date is required",
            "date.base": "Visit date must be a valid date",
        }),

    visitTime: Joi.string()
        .required()
        .messages({
            "any.required": "Visit time is required",
        }),

    breederName: Joi.string()
        .pattern(/^[A-Za-z\s.()-]+$/)
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.base": "Breeder name must be a string",
            "string.empty": "Breeder name is required",
            "string.min": "Breeder name must be at least 3 characters",
            "string.max": "Breeder name must not exceed 100 characters",
            "string.pattern.base": "Breeder name must contain only alphabets, spaces, dots, parentheses and hyphens",
        }),

    breederContact: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Breeder contact must be a valid Indian mobile number",
            "any.required": "Breeder contact is required",
        }),

    tagId: Joi.string()
        .trim()
        .max(20)
        .required()
        .messages({
            "any.required": "Tag ID is required",
            "string.empty": "Tag ID is required",
            "string.max": "Tag ID must not exceed 20 characters",
        }),


    breed: Joi.string()
        .trim()
        .allow(null, "")
        .optional(),

    ageYears: Joi.number()
        .integer()
        .min(0)
        .max(20)
        .allow("", null)
        .optional()
        .messages({
            "number.base": "Age (years) must be a number",
            "number.integer": "Age (years) must be an integer",
            "number.min": "Age (years) cannot be negative",
            "number.max": "Age (years) cannot be more than 20",
        }),

    ageMonths: Joi.number()
        .integer()
        .min(0)
        .max(11)
        .allow("", null)
        .optional()
        .messages({
            "number.base": "Age (months) must be a number",
            "number.integer": "Age (months) must be an integer",
            "number.min": "Age (months) cannot be negative",
            "number.max": "Age (months) must be between 0 and 11",
        }),

    milkingCapacity: Joi.number()
        .min(0)
        .max(100)
        .precision(2)
        .allow("", null)
        .optional()
        .messages({
            "number.base": "Milking capacity must be a number",
            "number.min": "Milking capacity cannot be negative",
            "number.max": "Milking capacity seems too high",
        }),

    isCalfIncluded: Joi.string()
        .lowercase()
        .valid("yes", "no")
        .allow("", null)
        .optional()
        .messages({
            "any.only": "Calf included must be either 'yes' or 'no'",
        }),

    physicalCheck: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .allow("", null)
        .optional()
        .messages({
            "string.min": "Physical check must be at least 10 characters",
            "string.max": "Physical check must not exceed 1000 characters",
        }),

    fmdDisease: Joi.boolean()
        .allow("", null)
        .optional()
        .messages({
            "boolean.base": "FMD disease must be true or false",
        }),

    lsdDisease: Joi.boolean()
        .allow("", null)
        .optional()
        .messages({
            "boolean.base": "LSD disease must be true or false",
        }),

    animalPhotoFront: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Animal photo (front view) must be a string",
        }),

    animalPhotoSide: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Animal photo (side view) must be a string",
        }),

    animalPhotoRear: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Animal photo (rear view) must be a string",
        }),

    healthRecord: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Health record must be a string",
        }),

    vehicleNo: Joi.string()
        .trim()
        .uppercase()
        .replace(/\s+/g, '')
        .pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Invalid vehicle number format (e.g., MH12AB1234)",
        }),

    driverName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z\s.()-]+$/)
        .min(3)
        .max(100)
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Driver name must be a string",
            "string.min": "Driver name must be at least 3 characters",
            "string.max": "Driver name must not exceed 100 characters",
            "string.pattern.base": "Driver name must contain only alphabets, spaces, dots, parentheses and hyphens",
        }),

    driverDesignation: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Driver designation must be a string",
            "string.min": "Driver designation must be at least 3 characters",
            "string.max": "Driver designation must not exceed 50 characters",
        }),

    driverMobile: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Driver mobile must be a valid 10-digit Indian mobile number",
        }),

    driverAadhar: Joi.string()
        .pattern(/^[2-9][0-9]{11}$/)
        .allow("", null)
        .messages({
            "string.pattern.base":
                "Driver aadhaar number must be a valid 12-digit Indian Aadhaar number",
        }),

    drivingLicense: Joi.string()
        .trim()
        .pattern(/^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Driving license must be a valid Indian driving license number",
        }),

    licenseCertificate: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "License certificate must be a string",
        }),

    quarantineCenter: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.min": "Quarantine center must be at least 10 characters",
            "string.max": "Quarantine center must not exceed 500 characters",
        }),

    quarantineCenterPhoto: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Quarantine center photo must be a string",
        }),

    quarantineHealthRecord: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Quarantine health record must be a string",
        }),

    finalHealthClearance: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Final health clearance record must be a string",
        }),

    handoverOfficer: Joi.number()
        .integer()
        .positive()
        .empty("")
        .allow(null)
        .optional()
        .messages({
            "number.base": "Handover officer must be a number",
            "number.integer": "Handover officer must be a valid integer ID",
            "number.positive": "Handover officer must be a valid ID",
        }),

    beneficiaryId: Joi.string()
        .trim()
        .max(20)
        .allow("", null)
        .optional()
        .messages({
            "string.max": "Beneficiary ID must not exceed 500 characters",
        }),

    beneficiaryLocation: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.min": "Beneficiary location must be at least 10 characters",
            "string.max": "Beneficiary location must not exceed 500 characters",
        }),

    handoverPhoto: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Handover photo must be a string",
        }),

    handoverDate: Joi.date()
        .allow("", null)
        .optional()
        .messages({
            "date.base": "Handover date must be a valid date",
        }),

    handoverTime: Joi.string()
        .trim()
        .allow("", null)
        .optional(),

    handoverDocument: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Handover document must be a string",
        }),
}).options({
    abortEarly: false,
});


export const UpdateProcuredAnimalSchema = Joi.object({
    procurementOfficer: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "Procurement officer must be a valid numeric ID",
            "number.integer": "Procurement officer must be a whole number",
            "number.positive": "Procurement officer must be greater than 0",
        }),

    sourceType: Joi.string()
        .lowercase()
        .valid("bazaar", "farm")
        .optional()
        .messages({
            "string.base": "Source type must be a string",
            "any.only": "Source type must be either 'bazaar' or 'farm'",
            "string.empty": "Source type cannot be empty",
        }),

    sourceLocation: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            "string.base": "Source location must be a string",
            "string.min": "Source location must be at least 10 characters",
            "string.max": "Source location must not exceed 500 characters",
            "string.empty": "Source location cannot be empty",
        }),

    visitDate: Joi.date()
        .optional()
        .messages({
            "date.base": "Visit date must be a valid date",
        }),

    visitTime: Joi.string()
        .optional()
        .messages({
            "string.base": "Visit time must be a string",
            "string.empty": "Visit time cannot be empty",
        }),

    breederName: Joi.string()
        .pattern(/^[A-Za-z\s.()-]+$/)
        .min(3)
        .max(100)
        .optional()
        .messages({
            "string.base": "Breeder name must be a string",
            "string.empty": "Breeder name cannot be empty",
            "string.min": "Breeder name must be at least 3 characters long",
            "string.max": "Breeder name must not exceed 100 characters",
            "string.pattern.base":
                "Breeder name may contain only letters, spaces, dots, parentheses and hyphens",
        }),

    breederContact: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .optional()
        .messages({
            "string.base": "Breeder contact must be a string",
            "string.empty": "Breeder contact cannot be empty",
            "string.pattern.base":
                "Breeder contact must be a valid 10-digit Indian mobile number",
        }),

    tagId: Joi.string()
        .trim()
        .max(20)
        .optional()
        .messages({
            "string.base": "Tag ID must be a string",
            "string.empty": "Tag ID cannot be empty",
            "string.max": "Tag ID must not exceed 20 characters",
        }),

    breed: Joi.string()
        .trim()
        .allow(null, "")
        .optional(),

    ageYears: Joi.number()
        .integer()
        .min(0)
        .max(20)
        .allow("", null)
        .optional()
        .messages({
            "number.base": "Age (years) must be a number",
            "number.integer": "Age (years) must be an integer",
            "number.min": "Age (years) cannot be negative",
            "number.max": "Age (years) cannot be more than 20",
        }),

    ageMonths: Joi.number()
        .integer()
        .min(0)
        .max(11)
        .allow("", null)
        .optional()
        .messages({
            "number.base": "Age (months) must be a number",
            "number.integer": "Age (months) must be an integer",
            "number.min": "Age (months) cannot be negative",
            "number.max": "Age (months) must be between 0 and 11",
        }),

    milkingCapacity: Joi.number()
        .min(0)
        .max(100)
        .precision(2)
        .allow("", null)
        .optional()
        .messages({
            "number.base": "Milking capacity must be a number",
            "number.min": "Milking capacity cannot be negative",
            "number.max": "Milking capacity seems too high",
        }),

    isCalfIncluded: Joi.string()
        .lowercase()
        .valid("yes", "no")
        .allow("", null)
        .optional()
        .messages({
            "any.only": "Calf included must be either 'yes' or 'no'",
        }),

    physicalCheck: Joi.string()
        .trim()
        .min(10)
        .max(1000)
        .allow("", null)
        .optional()
        .messages({
            "string.min": "Physical check must be at least 10 characters",
            "string.max": "Physical check must not exceed 1000 characters",
        }),

    fmdDisease: Joi.boolean()
        .allow("", null)
        .optional()
        .messages({
            "boolean.base": "FMD disease must be true or false",
        }),

    lsdDisease: Joi.boolean()
        .allow("", null)
        .optional()
        .messages({
            "boolean.base": "LSD disease must be true or false",
        }),

    animalPhotoFront: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Animal photo (front view) must be a string",
        }),

    animalPhotoSide: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Animal photo (side view) must be a string",
        }),

    animalPhotoRear: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Animal photo (rear view) must be a string",
        }),

    healthRecord: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Health record must be a string",
        }),

    vehicleNo: Joi.string()
        .trim()
        .uppercase()
        .replace(/\s+/g, '')
        .pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Invalid vehicle number format (e.g., MH12AB1234)",
        }),

    driverName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z\s.()-]+$/)
        .min(3)
        .max(100)
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Driver name must be a string",
            "string.min": "Driver name must be at least 3 characters",
            "string.max": "Driver name must not exceed 100 characters",
            "string.pattern.base": "Driver name must contain only alphabets, spaces, dots, parentheses and hyphens",
        }),

    driverDesignation: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Driver designation must be a string",
            "string.min": "Driver designation must be at least 3 characters",
            "string.max": "Driver designation must not exceed 50 characters",
        }),

    driverMobile: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Driver mobile must be a valid 10-digit Indian mobile number",
        }),

    driverAadhar: Joi.string()
        .pattern(/^[2-9][0-9]{11}$/)
        .allow("", null)
        .messages({
            "string.pattern.base":
                "Driver aadhaar number must be a valid 12-digit Indian Aadhaar number",
        }),

    drivingLicense: Joi.string()
        .trim()
        .pattern(/^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/)
        .allow("", null)
        .optional()
        .messages({
            "string.pattern.base": "Driving license must be a valid Indian driving license number",
        }),

    licenseCertificate: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "License certificate must be a string",
        }),

    quarantineCenter: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.min": "Quarantine center must be at least 10 characters",
            "string.max": "Quarantine center must not exceed 500 characters",
        }),

    quarantineCenterPhoto: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Quarantine center photo must be a string",
        }),

    quarantineHealthRecord: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Quarantine health record must be a string",
        }),

    finalHealthClearance: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Final health clearance record must be a string",
        }),

    handoverOfficer: Joi.number()
        .integer()
        .positive()
        .empty("")
        .allow(null)
        .optional()
        .messages({
            "number.base": "Handover officer must be a number",
            "number.integer": "Handover officer must be a valid integer ID",
            "number.positive": "Handover officer must be a valid ID",
        }),

    beneficiaryId: Joi.string()
        .trim()
        .max(20)
        .allow("", null)
        .optional()
        .messages({
            "string.max": "Beneficiary ID must not exceed 500 characters",
        }),

    beneficiaryLocation: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.min": "Beneficiary location must be at least 10 characters",
            "string.max": "Beneficiary location must not exceed 500 characters",
        }),

    handoverPhoto: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Handover photo must be a string",
        }),

    handoverDate: Joi.date()
        .allow("", null)
        .optional()
        .messages({
            "date.base": "Handover date must be a valid date",
        }),

    handoverTime: Joi.string()
        .trim()
        .allow("", null)
        .optional(),

    handoverDocument: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Handover document must be a string",
        }),
}).options({
    abortEarly: false,
});
