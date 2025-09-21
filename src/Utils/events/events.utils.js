import { EventEmitter } from "node:events";
import { emailsubject, sendemail } from "../sendEmail.utils.js";
import { template } from "../generateHTML.js";

export const emailevents = new EventEmitter(); 

emailevents.on('confirmemail',async(data)=>{
await sendemail({
  to : data.to ,
  text :"hello from sara7a app",
  html : template(data.otp,data.firstname),
  subject : emailsubject.confirmEmail
})
})



emailevents.on('forgetpassword',async(data)=>{
await sendemail({
  to : data.to ,
  text :"hello from sara7a app",
  html : template(data.otp,data.firstnam, emailsubject.resetPAswword),
  subject : emailsubject.resetPAswword
})
})