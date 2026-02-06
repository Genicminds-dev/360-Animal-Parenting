import Joi from "joi";

const earTagRegex = /^[A-Z0-9\-]{5,20}$/i;

export const CreateAnimalSchema = Joi.object({

  age: Joi.number()
    .positive()
    .max(30)
    .required()
    .messages({
      "number.base": "Age must be a number",
      "number.positive": "Age must be greater than 0",
      "number.max": "Age cannot exceed 30 years",
      "any.required": "Age is required",
    }),

  weight: Joi.number()
    .positive()
    .max(1500)
    .required()
    .messages({
      "number.base": "Weight must be a number",
      "number.positive": "Weight must be greater than 0",
      "any.required": "Weight is required",
    }),

  breed: Joi.string()
    .max(100)
    .allow(null, "")
    .messages({
      "string.max": "Breed must not exceed 100 characters",
    }),

  animalType: Joi.string()
    .max(50)
    .allow(null, "")
    .messages({
      "string.max": "Animal type must not exceed 50 characters",
    }),

  numberOfPregnancy: Joi.number()
    .integer()
    .min(0)
    .max(6)
    .required()
    .messages({
      "number.base": "Number of pregnancy must be a number",
      "number.integer": "Number of pregnancy must be an integer",
      "number.min": "Number of pregnancy cannot be negative",
      "any.required": "Number of pregnancy is required",
    }),

  pregnancyStatus: Joi.string()
    .valid("pregnant", "not_pregnant")
    .required()
    .messages({
      "any.only": "Pregnancy status must be Pregnant or Not Pregnant",
      "any.required": "Pregnancy status is required",
    }),

  milkData: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      "number.base": "Milk data must be a number",
      "any.required": "Milk data is required",
    }),

  dob: Joi.date()
    .required()
    .messages({
      "date.base": "DOB must be a valid date",
      "any.required": "DOB is required",
    }),

  pricing: Joi.number()
    .positive()
    .allow(null)
    .messages({
      "number.base": "Pricing must be a number",
    }),

  earTagId: Joi.string()
    .pattern(earTagRegex)
    .required()
    .messages({
      "string.pattern.base": "Invalid ear tag ID format",
      "any.required": "Ear tag ID is required",
    }),

  snb_id: Joi.string()
    .max(50)
    .allow(null, "")
    .messages({
      "string.max": "SNB ID must not exceed 50 characters",
    }),

  calfEarTagId: Joi.string()
    .pattern(earTagRegex)
    .required()
    .messages({
      "string.pattern.base": "Invalid calf ear tag ID format",
      "any.required": "Calf ear tag ID is required",
    }),

  calfDob: Joi.date()
    .allow(null)
    .messages({
      "date.base": "Calf DOB must be a valid date",
    }),

  calfGender: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.only": "Calf gender must be Male or Female",
      "any.required": "Calf gender is required",
    }),

  vendorId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Vendor ID must be a number",
      "any.required": "Vendor ID is required",
    }),

  quarantineId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Quarantine ID must be a number",
      "any.required": "Quarantine ID is required",
    }),

}).options({
  abortEarly: false,
});

export const UpdateAnimalSchema = Joi.object({
  age: Joi.number().positive().max(30),
  weight: Joi.number().positive().max(1500),

  breed: Joi.string().max(100).allow(null, ""),
  animalType: Joi.string().max(50).allow(null, ""),

  numberOfPregnancy: Joi.number().integer().min(0).max(15),

  pregnancyStatus: Joi.string().valid("pregnant", "not_pregnant"),

  milkData: Joi.number().min(0).max(100),

  dob: Joi.date(),

  pricing: Joi.number().positive().allow(null),

  earTagId: Joi.string().pattern(earTagRegex),

  snb_id: Joi.string().max(50).allow(null, ""),

  calfEarTagId: Joi.string().pattern(earTagRegex),

  calfDob: Joi.date().allow(null),

  calfGender: Joi.string().valid("male", "female"),

  vendorId: Joi.number().integer().positive(),
  quarantineId: Joi.number().integer().positive(),

}).options({
  abortEarly: false,
});
