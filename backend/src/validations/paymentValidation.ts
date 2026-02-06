import Joi from "joi";

const stringToNumberArray = (value: any) => {
    if (typeof value === "string") {
        return value.split(",").map((v) => Number(v.trim()));
    }
    return value;
};

export const CreatePaymentSchema = Joi.object({
    paymentFor: Joi.string()
        .valid("vendor", "transport")
        .required()
        .messages({
            "any.required": "Payment for is required",
            "any.only": "Payment for must be either vendor or transport",
        }),

    vendorId: Joi.number()
        .integer()
        .positive()
        .when("paymentFor", {
            is: "vendor",
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        })
        .messages({
            "any.required": "Vendor ID is required for vendor payment",
            "number.base": "Vendor ID must be a number",
        }),

    transportId: Joi.number()
        .integer()
        .positive()
        .when("paymentFor", {
            is: "transport",
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        })
        .messages({
            "any.required": "Transport ID is required for transport payment",
            "number.base": "Transport ID must be a number",
        }),

    animalId: Joi.any()
        .custom((value, helpers) => {
            if (value === null || value === undefined || value === "") {
                return helpers.error("any.required");
            }
            const arr = stringToNumberArray(value);
            if (!Array.isArray(arr) || arr.some(isNaN)) {
                return helpers.error("any.invalid");
            }
            if (arr.length === 0) {
                return helpers.error("array.min");
            }
            return arr;
        })
        .when("paymentFor", {
            is: "vendor",
            then: Joi.required(),
            otherwise: Joi.allow(null),
        })
        .messages({
            "any.invalid": "Animal ID must be an array of numbers",
            "array.min": "At least one animal ID is required",
            "any.required": "Animal ID is required for vendor payment",
        }),


    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            "any.required": "Amount is required",
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than zero",
        }),

    paymentMode: Joi.string()
        .valid("cash", "debit card", "credit card", "upi", "net banking", "cheque")
        .required()
        .messages({
            "any.required": "Payment mode is required",
            "any.only": "Invalid payment mode",
        }),

    transactionId: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "any.required": "Transaction ID is required",
            "string.min": "Transaction ID must be at least 3 characters",
        }),

    status: Joi.string()
        .valid("pending", "completed", "failed", "refunded", "cancelled")
        .default("pending")
        .messages({
            "any.only": "Invalid payment status",
        }),

    invoiceNumber: Joi.string()
        .required()
        .messages({
            "any.required": "Invoice number is required",
        }),

    date: Joi.date()
        .allow(null)
        .messages({
            "date.base": "Date must be a valid date",
        }),

    remark: Joi.string()
        .max(500)
        .allow(null, "")
        .messages({
            "string.max": "Remark must not exceed 500 characters",
        }),

}).options({
    abortEarly: false,
});


export const UpdatePaymentSchema = Joi.object({
    paymentFor: Joi.string()
        .valid("vendor", "transport")
        .messages({
            "any.only": "Payment for must be either vendor or transport",
        }),

    vendorId: Joi.number().integer().positive(),

    transportId: Joi.number().integer().positive(),

    animalId: Joi.any()
        .custom((value, helpers) => {
            if (!value) return value;
            const arr = stringToNumberArray(value);
            if (!Array.isArray(arr) || arr.some(isNaN)) {
                return helpers.error("any.invalid");
            }
            if (arr.length === 0) {
                return helpers.error("array.min");
            }
            return arr;
        })
        .when("paymentFor", {
            is: "vendor",
            then: Joi.optional(),
            otherwise: Joi.forbidden(),
        })
        .messages({
            "any.invalid": "Animal ID must be an array of numbers",
            "array.min": "At least one animal ID is required",
        }),

    amount: Joi.number()
        .positive()
        .precision(2)
        .messages({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than zero",
        }),

    paymentMode: Joi.string()
        .valid("cash", "debit card", "credit card", "upi", "net banking", "cheque")
        .messages({
            "any.only": "Invalid payment mode",
        }),

    transactionId: Joi.string().min(3).max(100),

    status: Joi.string()
        .valid("pending", "completed", "failed", "refunded", "cancelled")
        .messages({
            "any.only": "Invalid payment status",
        }),

    invoiceNumber: Joi.string(),

    date: Joi.date().allow(null),

    remark: Joi.string().max(500).allow(null, ""),
}).options({
    abortEarly: false,
});
