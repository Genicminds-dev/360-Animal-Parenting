import Joi from "joi";

export const CreateBeneficiarySchema = Joi.object({
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

    gender: Joi.string()
        .lowercase()
        .valid("male", "female", "other")
        .required()
        .empty("")
        .messages({
            "any.required": "Gender is required",
            "any.only": "Gender must be Male, Female, or Other",
        }),

    mobile: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Mobile number must be a valid 10-digit Indian mobile number",
            "string.empty": "Mobile number is required",
            "any.required": "Mobile number is required",
        }),

    dob: Joi.date()
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
        .required()
        .messages({
            "date.base": "Date of birth must be a valid date",
            "date.max": "Beneficiary must be at least 18 years old",
            "any.required": "Date of birth is required",
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

    city: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "any.required": "City is required",
            "string.empty": "City is required",
        }),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
        }),
}).options({
    abortEarly: false,
});


export const UpdateBeneficiarySchema = Joi.object({
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

    gender: Joi.string()
        .lowercase()
        .valid("male", "female", "other")
        .optional()
        .messages({
            "any.only": "Gender must be Male, Female, or Other",
        }),

    mobile: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .optional()
        .messages({
            "string.pattern.base":
                "Mobile number must be a valid 10-digit Indian mobile number",
            "string.base": "Mobile number must be a string",
        }),

    dob: Joi.date()
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
        .optional()
        .messages({
            "date.base": "Date of birth must be a valid date",
            "date.max": "Beneficiary must be at least 18 years old",
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

    city: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            "string.base": "City must be a string",
        }),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
        }),
}).options({
    abortEarly: false,
});
