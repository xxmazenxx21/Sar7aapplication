import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { logoutEnum } from "../../Utils/token.utils.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";

export const shareprofileValidation = {
  params: joi
    .object({
      userid : generalFields.id.required()
})}

export const updateprofileValidation = {
  body: joi
    .object({
    firstname: generalFields.firstname,
     lastname: generalFields.lastname,
      gender: generalFields.gender,
       phone: generalFields.phone,
})}



export const freezeAccountValidation = {
  params: joi
    .object({
    userid :  generalFields.id
})}



export const restoredAccountValidation = {
  params: joi
    .object({
    userid :  generalFields.id.required()
})}




export const deleteAccountValidation = {
  params: joi
    .object({
    userid :  generalFields.id.required()
})}












export const updatepasswordValidation = {
  body: joi
    .object({
    oldpassword : generalFields.password.required() ,
       flag : joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayloggedIn),
      password : generalFields.password.not(joi.ref('oldpassword')).required(),
       confirmpassword : generalFields.confirmpassword
})}




export const profileImageValidation = {
  file: joi
    .object({
   fieldname :generalFields.file.fieldname.valid("profileimage").required() ,
 originalname: generalFields.file.originalname.required(),
      encoding: generalFields.file.encoding.required(),
      mimetype: generalFields.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalFields.file.size.required(),
      path: generalFields.file.path.required(),
      filename: generalFields.file.filename.required(),
      finalPath: generalFields.file.finalPath.required(),
      destination: generalFields.file.destination.required(),


}).required()};




export const coverImageValidation = {
files:joi.array().items(joi
    .object({
   fieldname :generalFields.file.fieldname.valid("images").required() ,
 originalname: generalFields.file.originalname.required(),
      encoding: generalFields.file.encoding.required(),
      mimetype: generalFields.file.mimetype
        .valid(...fileValidation.images)
        .required(),
      size: generalFields.file.size.required(),
      path: generalFields.file.path.required(),
      filename: generalFields.file.filename.required(),
      finalPath: generalFields.file.finalPath.required(),
      destination: generalFields.file.destination.required(),


}).required()).required()
  


};



