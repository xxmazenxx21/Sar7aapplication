import joi from "joi";
import { Types } from "mongoose";

export const generalFields = {
  firstname: joi.string().alphanum().min(3).max(30).messages({
    "string.min": "first name must be atleast 3 charachters",
    "string.max": "first name at max is 30 characters",
    "any.required": "first name must be mandatory",
  }),

  lastname: joi.string().alphanum().min(3).max(30).messages({
    "string.min": "last name must be atleast 3 charachters",
    "string.max": "last name at max is 30 characters",
    "any.required": "last name must be mandatory",
  }),
  phone: joi.string(),
  password: joi.string(),
  confirmpassword: joi.ref("password"),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  role: joi.string().valid("Admin", "User").default("User"),
  gender: joi.string().valid("male", "female").default("male"),
  id: joi.string().custom((value, helper) => {
    return (
      Types.ObjectId.isValid(value) ||
      helper.message("invalid object id format")
    );
  }),
  OTP: joi.string(),


  file : {
    fieldname : joi.string(),
    originalname:joi.string(),
    encoding :joi.string() ,
    mimetype :joi.string() ,
    size :joi.number().positive(),
    destination :joi.string()	,
    filename :joi.string(), 
    path :joi.string(),
    finalPath :joi.string() 
  }
};


























export const validation = (schema) => {
  return (req, res, next) => {
    const validationErros = [];
    for (const key of Object.keys(schema)) {
      const validationresult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationresult.error)
        validationErros.push({ key, details: validationresult.error.details });
    }

    if (validationErros.length)
      return res
        .status(400)
        .json({ error: "validation error", details: validationErros });

    return next();
  };
};
