import nodemailer from "nodemailer";

export const sendemail = async({to='',
    subject=emailsubject.welcome,
    text='',
    html='' ,
    cc='' ,
    bcc='', 
    attachments = []


})=>{
const transporter = nodemailer.createTransport({
 
    service : "gmail" , 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


  const info = await transporter.sendMail({
    from: `sara7a appppp <${ process.env.EMAIL}>`,
    to ,
    subject,
    text, 
    html, 
    cc,
    bcc ,
    attachments
  });

  console.log("Message sent:", info.messageId);

}


export const emailsubject={
confirmEmail : "confirm your email"
, resetPAswword : "reseet your password",
welcome : "welcome to sara7a apapp" 

}