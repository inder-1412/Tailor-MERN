import Joi from "joi";

export const personalSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter valid email",
    }),

  name: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Minimum 3 characters required",
    }),

  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Contact number is required",
      "string.pattern.base": "Enter valid 10 digit number",
    }),

  dob: Joi.date()
    .required()
    .messages({
      "date.base": "Enter valid date",
      "any.required": "Date of birth is required",
    }),

  gender: Joi.string()
    .valid("male", "female", "other")
    .required()
    .messages({
      "any.only": "Select valid gender",
      "string.empty": "Gender is required",
    }),

  aadharNumber: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      "string.empty": "Aadhaar is required",
      "string.pattern.base": "Aadhaar must be 12 digits",
    }),
});