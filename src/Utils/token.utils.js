import jwt from "jsonwebtoken";
import { roles } from "../DB/Model/user.model.js";
import { nanoid } from "nanoid";

export const signatureenum = {
  admin: "Admin",
  user: "User",
};

export const logoutEnum = {
  logoutFromalldevices: "logoutFromalldevices",
  logout: "logout",
  stayloggedIn : "stayloggedIn"
};


export const signToken = ({
  payload = [],
  signature,
  options = {
    expiresIn: "1d",
  },
}) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = ({ token = "", signature }) => {
  return jwt.verify(token, signature);
};

export const getsignature = async ({ signaturelevel }) => {
  let Signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (signaturelevel) {
    case signatureenum.admin:
      Signature.accessSignature = process.env.ACCESS_ADMIN_SIGNATURE_TOKEN;
      Signature.refreshSignature = process.env.REFRESH_ADMIN_SIGNATURE_TOKEN;
      break;
    case signatureenum.user:
      Signature.accessSignature = process.env.ACCESS_USER_SIGNATURE_TOKEN;
      Signature.refreshSignature = process.env.REFRESH_USER_SIGNATURE_TOKEN;

      break;
    default:
      console.log("invalid signature level ");
      break;
  }
  return Signature ;
};



export const getLoginCraidentials = async (user) => {
let signature = await getsignature({
  signaturelevel:
  user.role !=roles.user ? signatureenum.admin :signatureenum.user
})


const jwtid =  nanoid()

  const accesstoken = signToken({
    payload: { _id: user._id },
    signature  : signature.accessSignature
    ,
    options: {
      issuer: "sar7aapp",
      subject: "Authentication",
      expiresIn: "1d",
      jwtid
    },
  });
  
  const refreshtoken = signToken({
    payload: { _id: user._id },
    signature  : signature.refreshSignature
    ,
    options: {
      issuer: "sar7aapp",
      subject: "Authentication",
      expiresIn: "7d",
    jwtid
    },
  });

  return {accesstoken,refreshtoken}
};



