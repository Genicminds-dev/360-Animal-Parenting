import Joi from "joi";

export const CreateSellerSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must not exceed 50 characters",
            "string.pattern.base": "Name must contain only alphabets",
        }),

    phone: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be a valid Indian mobile number",
            "any.required": "Phone number is required",
        }),

    gender: Joi.string()
        .lowercase()
        .valid("male", "female", "other")
        .required()
        .empty("")
        .messages({
            "any.required": "Gender is required",
            "any.only": "Gender must be Male, Female, or Other",
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

    address: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            "any.required": "Address is required",
            "string.empty": "Address is required",
            "string.min": "Address must be at least 10 characters",
            "string.max": "Address must not exceed 500 characters",
        }),

    state: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "any.required": "State is required",
            "string.empty": "State is required",
        }),

    district: Joi.string()
        .allow(null, "")
        .optional(),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
        }),

    town: Joi.string()
        .allow(null, "")
        .optional(),

    bankName: Joi.string()
        .min(3)
        .max(100)
        .allow(null, "")
        .optional()
        .messages({
            "string.min": "Bank name must be at least 3 characters",
            "string.max": "Bank name must not exceed 100 characters",
        }),

    accountNumber: Joi.string()
        .pattern(/^[0-9]{9,18}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Account number must be between 9 and 18 digits",
        }),

    ifscCode: Joi.string()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .uppercase()
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "IFSC code must be a valid Indian IFSC",
        }),

    upiId: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Invalid UPI ID format (example: name@bank)",
        }),
}).options({
    abortEarly: false,
});


export const UpdateSellerSchema = Joi.object({
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
            "string.pattern.base": "Name must contain only alphabets and single spaces",
        }),

    phone: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .optional()
        .messages({
            "string.pattern.base":
                "Phone number must be a valid 10-digit Indian mobile number",
            "string.base": "Phone number must be a string",
        }),

    gender: Joi.string()
        .lowercase()
        .valid("male", "female", "other")
        .optional()
        .messages({
            "any.only": "Gender must be Male, Female, or Other",
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

    address: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            "string.min": "Address must be at least 10 characters",
            "string.max": "Address must not exceed 500 characters",
        }),

    state: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            "string.base": "State must be a string",
        }),

    district: Joi.string()
        .allow(null, "")
        .optional(),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
        }),

    town: Joi.string()
        .allow(null, "")
        .optional(),

    bankName: Joi.string()
        .min(3)
        .max(100)
        .allow(null, "")
        .optional()
        .messages({
            "string.min": "Bank name must be at least 3 characters",
            "string.max": "Bank name must not exceed 100 characters",
        }),

    accountNumber: Joi.string()
        .pattern(/^[0-9]{9,18}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base":
                "Account number must be between 9 and 18 digits",
        }),

    ifscCode: Joi.string()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .uppercase()
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "IFSC code must be a valid Indian IFSC",
        }),

    upiId: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base":
                "Invalid UPI ID format (example: name@bank)",
        }),
}).options({
    abortEarly: false,
});
