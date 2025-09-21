import { hash, compare } from "../../Utils/hash.utils.js";
import * as dbservice from "../../DB/dbservice.js";
import { Usermodel } from "../../DB/Model/user.model.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
import { encrypt } from "../../Utils/encryption.utils.js";
import {
  getLoginCraidentials,
  getsignature,
  logoutEnum,
  signatureenum,
  signToken,
} from "../../Utils/token.utils.js";
import { OAuth2Client } from "google-auth-library";
import { providers, roles } from "../../DB/Model/user.model.js";

import { emailevents } from "../../Utils/events/events.utils.js";
import { customAlphabet, nanoid } from "nanoid";
import { Tokenmodel } from "../../DB/Model/Token.model.js";

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password, gender, phone, role } =
    req.body;

  if (await dbservice.findOne({ model: Usermodel, filter: { email } }))
    return next(new Error("user already exist", { cause: 409 }));
  //hash
  const hashedPassword = await hash({ plainText: password });
  // encrypt
  const encryptedphone = encrypt(phone);
  // create otp
  const code = customAlphabet("123456abcd", 6)();
  const hashedotp = await hash({ plainText: code });
  // send email
  emailevents.emit("confirmemail", { to: email, otp: code, firstname });

  const user = await dbservice.create({
    model: Usermodel,
    data: [
      {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        gender,
        phone: encryptedphone,
        confirmEmailOTP: hashedotp,
        role,
      },
    ],
  });
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "user created successfuly",
    data: user,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await dbservice.findOne({ model: Usermodel, filter: { email } });
  if (!user) return next(new Error("user not found ", { cause: 404 }));
  if (!(await compare({ plainText: password, hash: user.password })))
    return next(new Error("invalid password", { cause: 401 }));
  if (!user.confirmEmail)
    return next(
      new Error("user not found or email already confirmed", { cause: 404 })
    );

  const newcreidntials = await getLoginCraidentials(user);

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "user loged in successfuly",
    data: { newcreidntials },
  });
};

async function VerifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const LoginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const { email, email_verified, given_name, family_name, picture } =
    await VerifyGoogleAccount({ idToken });
  // login

  if (!email_verified)
    return next(new Error("email not veified", { cause: 401 }));
  const user = await dbservice.findOne({ model: Usermodel, filter: { email } });

  if (user) {
    // login
    if (user.provider === providers.google) {
      const newcreidntials = await getLoginCraidentials(user);

      return SuccessResponse({
        res,
        statusCode: 201,
        message: "user loged in successfuly",
        data: { newcreidntials },
      });
    }
  }
  //-----------------------------
  // singn up create
  const newuser = await dbservice.create({
    model: Usermodel,
    data: [
      {
        email,
        firstname: given_name,
        lastname: family_name,
        photo: picture,
        provider: providers.google,
        confirmEmail: Date.now(),
      },
    ],
  });

  const newcreidntials = await getLoginCraidentials(newuser);

  return SuccessResponse({
    res,
    statusCode: 201,
    message: "user created in successfuly",
    data: { newcreidntials },
  });
};


export const refreshtoken = async (req, res, next) => {
  const user = req.user;
  const newcreidntials = await getLoginCraidentials(user);

  return SuccessResponse({
    res,
    statusCode: 201,
    message: " new Craidntial genrated successfuly",
    data: { newcreidntials },
  });
};

export const confirmEmail = async (req, res, next) => {
  const { email,OTP } = req.body;
  const user = await dbservice.findOne({
    model: Usermodel,
    filter: {
      email,
      confirmEmailOTP: { $exists: true },
      confirmEmail: { $exists: false },
    },
  });
  if (!user)
    return next(
      new Error("user not found or email already confirmed", { cause: 404 })
    );

  if (!(await compare({ plainText: OTP, hash: user.confirmEmailOTP})))
    return next(new Error("invalid otp", { cause: 401 }));

  await dbservice.updateone({
    model: Usermodel,
    filters: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOTP: "" },
      $inc: { __v: 1 },
    },
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "email confirmed  successfuly",
  });
};

export const forgetpassword = async (req, res, next) => {
  const { email } = req.body;

  const otp = await customAlphabet("123456789", 6)();
  const hashedotp = await hash({ plainText: otp });

  const user = await dbservice.findOneAndUpdate({
    model: Usermodel,
    filter: {
      email,
      deletedAt: { $exists: false },

      provider: providers.system,

      confirmEmail: { $exists: true },
    },
    data: {
      ForgetPassword: hashedotp,
    },
  });

  if (!user)
    return next(
      new Error("user not found or email not confirmed", { cause: 404 })
    );

  emailevents.emit("forgetpassword", {
    to: email,
    firstname: user.firstname,
    otp,
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "check your inpox",
  });
};

export const resetpassword = async (req, res, next) => {
  const { email, otp, password } = req.body;

  const user = await dbservice.findOne({
    model: Usermodel,
    filter: {
      email,
      deletedAt: { $exists: false },
      provider: providers.system,
      confirmEmail: { $exists: true },
      ForgetPassword: { $exists: true },
    },
  });

  if (!user) return next(new Error("user not found ", { cause: 404 }));

  if (!(await compare({ plainText: otp, hash: user.ForgetPassword })))
    return next(new Error("invalid otp", { cause: 400 }));

  const hashedPassword = await hash({ plainText: password });

  await dbservice.updateone({
    model: Usermodel,
    filter: { email },
    data: {
      password: hashedPassword,
      $unset: { ForgetPassword: true },
      $inc: { __v: 1 },
    },
  });

  return SuccessResponse({
    res,
    statusCode: 200,
    message: "password reseted successfult",
  });
};

export const logout = async (req, res, next) => {
  let status = 200;
  const { flag } = req.body;

  switch (flag) {
    case logoutEnum.logoutFromalldevices:
      await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: { _id: req.user._id },
        data: { changeCredentialsTime: Date.now() },
      });
      break;

    default:
      await dbservice.create({
        model: Tokenmodel,
        data: [
          {
            jti: req.decoded.jti,
            expiresIn: Date.now() - req.decoded.exp,
            userId: req.user._id,
          },
        ],
      });
      status = 201;

      break;
  }

  return SuccessResponse({
    res,
    statusCode: status,
    message: "user loged out succefuly",
  });
};
