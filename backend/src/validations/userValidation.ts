import Joi from 'joi';

export const passwordSchema = Joi.string()
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,30}$"))
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be 8-30 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  });


export const createUserSchema = Joi.object({

  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "First name must be a string",
      "string.empty": "First name is required",
      "string.min": "First name must be at least 3 characters",
      "string.max": "First name must not exceed 30 characters",
      "string.pattern.base": "First name must contain only alphabets",
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Last name must be a string",
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 3 characters",
      "string.max": "Last name must not exceed 30 characters",
      "string.pattern.base": "Last name must contain only alphabets",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
      "string.max": "Email cannot exceed 100 characters",
    }),

  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    "string.empty": "Mobile number is required",
    "string.pattern.base": "Mobile number must be a valid 10-digit Indian number",
  }),

  password: passwordSchema,

  roleId: Joi.number().integer().valid(2, 3).required().messages({
    "number.base": "Role ID must be a number",
    "number.integer": "Role ID must be an integer",
    "any.required": "Role ID is required",
    "any.only": "Role ID must be one of 2 (SuperAdmin) or 3 (Admin)",
  }),

  status: Joi.string()
    .valid("active", "inactive")
    .default("active")
    .messages({
      "any.only": "Status must be either active or inactive",
    }),

});


export const updateUserSchema = Joi.object({

  firstName: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.base": "First name must be a string",
      "string.min": "First name must be at least 3 characters",
      "string.max": "First name must not exceed 30 characters",
      "string.pattern.base": "First name must contain only alphabets",
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name must be at least 3 characters",
      "string.max": "Last name must not exceed 30 characters",
      "string.pattern.base": "Last name must contain only alphabets",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .optional()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.max": "Email cannot exceed 100 characters",
    }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be a valid 10-digit Indian number",
    }),

  roleId: Joi.number()
    .integer()
    .valid(2, 3)
    .optional()
    .messages({
      "number.base": "Role ID must be a number",
      "number.integer": "Role ID must be an integer",
      "any.only": "Role ID must be one of 2 (SuperAdmin) or 3 (Admin)",
    }),

  status: Joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "any.only": "Status must be either active or inactive",
    }),

});


export const updateUserProfileSchema = Joi.object({

  firstName: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.base": "First name must be a string",
      "string.min": "First name must be at least 3 characters",
      "string.max": "First name must not exceed 30 characters",
      "string.pattern.base": "First name must contain only alphabets",
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name must be at least 3 characters",
      "string.max": "Last name must not exceed 30 characters",
      "string.pattern.base": "Last name must contain only alphabets",
    }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be a valid 10-digit Indian number",
    }),

});


export const changePasswordSchema = Joi.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});

export const editPasswordSchema = Joi.object({
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});