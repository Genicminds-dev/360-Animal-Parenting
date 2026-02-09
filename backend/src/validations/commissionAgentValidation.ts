import Joi from "joi";

export const CreateCommissionAgentSchema = Joi.object({
    name: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must not exceed 50 characters",
            "string.pattern.base": "Name must contain only alphabets and single spaces",
            "any.required": "Name is required",
        }),

    phone: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number",
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required",
        }),

    aadhaarNumber: Joi.string()
        .pattern(/^[2-9][0-9]{11}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base":
                "Aadhaar number must be a valid 12-digit Indian Aadhaar number",
        }),

    profileImg: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Profile image must be a string",
        }),

    aadhaarFile: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Aadhaar file must be a string",
        }),
}).options({
    abortEarly: false,
});


export const UpdateCommissionAgentSchema = Joi.object({
    name: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)
        .min(3)
        .max(50)
        .optional()
        .messages({
            "string.base": "Name must be a string",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must not exceed 50 characters",
            "string.pattern.base":
                "Name must contain only alphabets and single spaces",
        }),

    phone: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .optional()
        .messages({
            "string.pattern.base":
                "Phone number must be a valid 10-digit Indian mobile number",
            "string.base": "Phone number must be a string",
        }),

    aadhaarNumber: Joi.string()
        .pattern(/^[2-9][0-9]{11}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base":
                "Aadhaar number must be a valid 12-digit Indian Aadhaar number",
            "string.base": "Aadhaar number must be a string",
        }),

    profileImg: Joi.string()
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Profile image must be a string",
        }),

    aadhaarFile: Joi.string()
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Aadhaar file must be a string",
        }),
}).options({
    abortEarly: false,
});
