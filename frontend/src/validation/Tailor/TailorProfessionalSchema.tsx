import Joi from "joi";

export const professionalSchema = Joi.object({
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),

  speciality: Joi.string().min(3).required().messages({
    "string.empty": "Speciality is required",
    "string.min": "Speciality must be at least 3 characters",
  }),

  // Changed .uri() to a simpler string check if you don't want to force https://
  socialLink: Joi.string().required().messages({
    "string.empty": "Social link is required",
  }),

  // ADDED .coerce() - This is the magic fix! 
  // It tells Joi: "If you get a string '2020', convert it to a number 2020 automatically."
  workingSince: Joi.number()
    .integer()
    .min(1950)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Enter a valid year",
      "number.min": "Year must be 1950 or later",
      "number.max": "Year cannot be in the future",
    }),

  workType: Joi.string().required().messages({
    "string.empty": "Work type is required",
  }),

  shopAddress: Joi.string().min(5).required().messages({ // Reduced to 5 for easier testing
    "string.empty": "Shop address is required",
    "string.min": "Address is too short",
  }),

  shopCity: Joi.string().required().messages({
    "string.empty": "Shop city is required",
  }),

  otherInfo: Joi.string().allow("").optional(),
});