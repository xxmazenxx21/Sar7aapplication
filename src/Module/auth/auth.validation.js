import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { logoutEnum } from "../../Utils/token.utils.js";

export const SignupValidation = {
  body: joi.object({
    firstname: generalFields.firstname.required(),
    lastname: generalFields.lastname.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmpassword: generalFields.confirmpassword,
    gender: generalFields.gender.required(),
    phone: generalFields.phone
      .required()
      .pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
    role: generalFields.role.required(),
  }),
};



export const loginValidation = {
  body: joi
    .object({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      password: joi.string().required(),
    })
    .required(),
};



export const socialloginValidation = {
  body: joi
    .object({
      idToken: joi.string().required(),
    })
    .required(),
};



export const confirmEmailvalidation = {
  body: joi
    .object({
      email: generalFields.email.required(),
      OTP: generalFields.OTP.required(),
    })
    .required(),
};





export const forgetPasswordvalidation = {
  body: joi.object({
    email: generalFields.email.required(),
  }),
};



export const resetPasswordvalidation = {
  body: joi.object({
    email: generalFields.email.required(),
     password: generalFields.password.required(),
     otp: generalFields.OTP.required(),
       confirmpassword: generalFields.confirmpassword
  }),
};





export const logoutvalidation = {
  body: joi.object({
  flag : joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayloggedIn)
       
  }).required(),
};
