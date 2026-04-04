import Joi from "joi";

export const profileSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email",
    }),

  name: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  address: Joi.string()
    .required()
    .messages({
      "string.empty": "Address is required",
    }),

  city: Joi.string()
    .required()
    .messages({
      "string.empty": "City is required",
    }),

  state: Joi.string()
    .required()
    .messages({
      "string.empty": "State is required",
    }),

  gender: Joi.string()
    .required()
    .messages({
      "string.empty": "Please select gender",
    }),
    
    profilepic: Joi.any().optional(),

});
