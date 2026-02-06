import Joi from "joi";

export const CreateVendorSchema = Joi.object({
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

    email: Joi.string()
        .email()
        .allow(null, "")
        .messages({
            "string.email": "Invalid email format",
        }),

    phone: Joi.string()
        .pattern(/^[6-9][0-9]{9}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be a valid Indian mobile number",
            "any.required": "Phone number is required",
        }),

    gender: Joi.string()
        .valid("male", "female", "other")
        .allow(null, "")
        .messages({
            "any.only": "Gender must be male, female, or other",
        }),

    status: Joi.string()
        .valid("active", "inactive", "blacklisted")
        .default("active")
        .messages({
            "any.only": "Status must be active, inactive, or blacklisted",
        }),

    firmName: Joi.string()
        .min(3)
        .max(150)
        .required()
        .messages({
            "any.required": "Firm name is required",
        }),

    firmType: Joi.string()
        .required()
        .messages({
            "any.required": "Firm type is required",
        }),

    supplierType: Joi.string()
        .valid("animal_supplier", "feed_supplier", "other")
        .required()
        .messages({
            "any.only": "Supplier type must be Animal Supplier, Feed Supplier, or Other",
            "any.required": "Supplier type is required",
        }),

    pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .required()
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
            "any.required": "Pincode is required",
        }),

    state: Joi.string().allow(null, ""),
    city: Joi.string().allow(null, ""),
    district: Joi.string().allow(null, ""),
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

    aadhaar: Joi.string()
        .pattern(/^[2-9][0-9]{11}$/)
        .required()
        .messages({
            "string.pattern.base": "Aadhaar number must be a valid 12-digit Indian Aadhaar number",
            "any.required": "Aadhaar number is required",
        }),

    pan: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
        .required()
        .messages({
            "string.pattern.base": "PAN number must be in format ABCDE1234F",
            "any.required": "PAN number is required",
        }),

    gst: Joi.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
        .required()
        .messages({
            "string.pattern.base": "GST number must be a valid Indian GSTIN",
            "any.required": "GST number is required",
        }),

    msmeCertificateNo: Joi.string()
        .pattern(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base": "MSME number must be in format UDYAM-XX-00-0000000",
        }),

    bankName: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.min": "Bank name must be at least 3 characters",
            "any.required": "Bank name is required",
        }),

    accountNumber: Joi.string()
        .pattern(/^[0-9]{9,18}$/)
        .required()
        .messages({
            "string.pattern.base": "Account number must be between 9 and 18 digits",
            "any.required": "Account number is required",
        }),

    confirmAccountNumber: Joi.string()
        .valid(Joi.ref("accountNumber"))
        .required()
        .messages({
            "any.only": "Account number and confirm account number must match",
            "any.required": "Confirm account number is required",
        }),

    ifsc: Joi.string()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .uppercase()
        .required()
        .messages({
            "string.pattern.base": "IFSC code must be a valid Indian IFSC",
            "any.required": "IFSC code is required",
        }),

    branch: Joi.string()
        .min(2)
        .max(100)
        .allow(null, "")
        .messages({
            "string.min": "Branch name must be at least 2 characters",
        }),

    upiId: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base": "Invalid UPI ID format (example: name@bank)",
        }),
})
    .options({
        abortEarly: false,
    });


export const UpdateVendorSchema = Joi.object({
    name: Joi.string().pattern(/^[A-Za-z\s]+$/).min(3).max(50),
    email: Joi.string().email().allow(null, ""),
    phone: Joi.string().pattern(/^[6-9][0-9]{9}$/),

    gender: Joi.string().valid("male", "female", "other").allow(null, ""),
    status: Joi.string().valid("active", "inactive", "blacklisted"),

    firmName: Joi.string().min(3).max(150),
    firmType: Joi.string(),
    supplierType: Joi.string().valid("animal_supplier", "feed_supplier", "other"),

    pincode: Joi.string().pattern(/^[1-9][0-9]{5}$/),

    state: Joi.string().allow(null, ""),
    city: Joi.string().allow(null, ""),
    district: Joi.string().allow(null, ""),
    block: Joi.string().allow(null, ""),
    tehsil: Joi.string().allow(null, ""),
    postOffice: Joi.string().allow(null, ""),

    addressLine: Joi.string().min(10).max(500),
    landmark: Joi.string().max(200).allow(null, ""),

    aadhaar: Joi.string().pattern(/^[2-9][0-9]{11}$/),
    pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
    gst: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/),

    msmeCertificateNo: Joi.string()
        .pattern(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/)
        .allow(null, ""),

    bankName: Joi.string().min(3).max(100),
    accountNumber: Joi.string().pattern(/^[0-9]{9,18}$/),
    confirmAccountNumber: Joi.string().valid(Joi.ref("accountNumber")),
    ifsc: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).uppercase(),
    branch: Joi.string().min(2).max(100).allow(null, ""),
    upiId: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base": "Invalid UPI ID format (example: name@bank)",
        }),


    profileImg: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "Profile image must be a string",
        }),

    aadhaarFile: Joi.string()
        .optional()
        .disallow("", null)
        .messages({
            "any.invalid": "Aadhaar file cannot be empty",
        }),

    panFile: Joi.string()
        .optional()
        .disallow("", null)
        .messages({
            "any.invalid": "PAN file cannot be empty",
        }),

    gstFile: Joi.string()
        .optional()
        .disallow("", null)
        .messages({
            "any.invalid": "GST file cannot be empty",
        }),

    msmeFile: Joi.string()
        .optional()
        .allow("", null)
        .messages({
            "string.base": "MSME file must be a string",
        }),
})
    .options({
        abortEarly: false,
    })
