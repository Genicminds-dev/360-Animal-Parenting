import Joi from "joi";

export const CreateHoldingStationSchema = Joi.object({
    status: Joi.string()
        .valid("active", "inactive", "maintenance")
        .default("active")
        .messages({
            "any.only": "Status must be either active, inactive or maintenance",
        }),

    totalCapacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Total capacity must be a number",
        "number.min": "Total capacity must be at least 1",
        "any.required": "Total capacity is required"
    }),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .required()
        .messages({
            "string.empty": "Pincode is required",
            "any.required": "Pincode is required",
            "string.pattern.base": "Pincode must be a valid 6-digit number",
        }),

    state: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "State is required",
            "string.base": "State must be a string",
            "string.empty": "State is not allowed to be empty",
            "string.min": "State must be at least 2 characters",
            "string.max": "State must not exceed 50 characters"
        }),

    district: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "District is required",
            "string.base": "District must be a string",
            "string.empty": "District is not allowed to be empty",
            "string.min": "District must be at least 2 characters",
            "string.max": "District must not exceed 50 characters"
        }),

    city: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "City is required",
            "string.base": "City must be a string",
            "string.empty": "City is not allowed to be empty",
            "string.min": "City must be at least 2 characters",
            "string.max": "City must not exceed 50 characters"
        }),

    block: Joi.string().allow(null, ""),
    tehsil: Joi.string().allow(null, ""),
    postOffice: Joi.string().allow(null, ""),

    addressLine: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            "any.required": "Address line is required",
            "string.min": "Address must be at least 10 characters",
            "string.max": "Address must not exceed 500 characters",
        }),

    landmark: Joi.string()
        .max(200)
        .allow(null, "")
        .messages({
            "string.max": "Landmark must not exceed 200 characters",
        }),

    centerIncharge: Joi.string().required().messages({
        "string.base": "Center incharge must be a valid JSON string",
        "any.required": "At least one center incharge is required",
    }),

    caretakerDetails: Joi.string().optional().allow("").messages({
        "string.base": "Caretaker details must be a valid JSON string",
    }),
})
    .options({
        abortEarly: false,
        allowUnknown: true
    })


export const UpdateHoldingStationSchema = Joi.object({
    status: Joi.string()
        .valid("active", "inactive", "maintenance")
        .messages({
            "any.only": "Status must be one of active, inactive, or maintenance",
            "string.base": "Status must be a string",
        }),

    totalCapacity: Joi.number()
        .integer()
        .min(1)
        .messages({
            "number.base": "Total capacity must be a number",
            "number.integer": "Total capacity must be an integer",
            "number.min": "Total capacity must be at least 1",
        }),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
            "string.base": "Pincode must be a string",
        }),

    state: Joi.string()
        .min(2)
        .max(50)
        .messages({
            "string.min": "State must be at least 2 characters long",
            "string.max": "State must not exceed 50 characters",
            "string.base": "State must be a string",
        }),

    city: Joi.string()
        .min(2)
        .max(50)
        .messages({
            "string.min": "City must be at least 2 characters long",
            "string.max": "City must not exceed 50 characters",
            "string.base": "City must be a string",
        }),

    district: Joi.string()
        .min(2)
        .max(50)
        .messages({
            "string.min": "District must be at least 2 characters long",
            "string.max": "District must not exceed 50 characters",
            "string.base": "District must be a string",
        }),

    block: Joi.string()
        .allow(null, "")
        .messages({
            "string.base": "Block must be a string",
        }),

    tehsil: Joi.string()
        .allow(null, "")
        .messages({
            "string.base": "Tehsil must be a string",
        }),

    postOffice: Joi.string()
        .allow(null, "")
        .messages({
            "string.base": "Post office must be a string",
        }),

    addressLine: Joi.string()
        .min(10)
        .max(500)
        .messages({
            "string.min": "Address must be at least 10 characters long",
            "string.max": "Address must not exceed 500 characters",
            "string.base": "Address must be a string",
        }),

    landmark: Joi.string()
        .max(200)
        .allow(null, "")
        .messages({
            "string.max": "Landmark must not exceed 200 characters",
            "string.base": "Landmark must be a string",
        }),

    centerImg: Joi.string()
        .optional()
        .min(1)
        .messages({
            "string.min": "Center image cannot be empty",
        }),


    centerVideo: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Center video must be a string",
        }),

    centerIncharge: Joi.string().optional().messages({
        "string.base": "Center incharge must be a valid JSON string",
    }),

    caretakerDetails: Joi.string().optional().allow("").messages({
        "string.base": "Caretaker details must be a valid JSON string",
    }),

})
    .options({
        abortEarly: false,
        allowUnknown: true
    });
