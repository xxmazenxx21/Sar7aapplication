import { roles, Usermodel } from "../../DB/Model/user.model.js";
import * as dbservice from "../../DB/dbservice.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
import { decrypt, encrypt } from "../../Utils/encryption.utils.js";
import { hash,compare } from "../../Utils/hash.utils.js";
import { logoutEnum } from "../../Utils/token.utils.js";
import {Tokenmodel} from '../../DB/Model/Token.model.js'
import { cloudconfig } from "../../Utils/multer/cloudinary.js";

export const getprofile = async (req, res, next) => {
const user = await dbservice.findById({model:Usermodel ,id:req.user._id , populate:[{path:"messages"}]} )


  req.user.phone = decrypt(req.user.phone);
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "user fetched successfuly",
    data: { user },
  });
};

export const shareprofile = async (req, res, next) => {
  const { userid } = req.params;
  const user = await dbservice.findOne({
    model: Usermodel,
    filter: { _id: userid, confirmEmail: { $exists: true } },
  });

  return user
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "user fetched succussfuly",
        data: { user },
      })
    : next(new Error("user not found!!!!!", { cause: 404 }));
};

export const updateprofile = async (req, res, next) => {
  if (req.user.phone) {
    req.user.phone = await encrypt(req.user.phone);
  }

  const updateduser = await dbservice.findOneAndUpdate({
    model: Usermodel,
    filter: { __id: req.user.__id },
    data: req.body,
  });

  return updateduser
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "user updated  succussfuly",
        data: { updateduser },
      })
    : next(new Error("invalid account", { cause: 404 }));
};

export const freezAccount = async (req, res, next) => {
  const { userid } = req.params;
  if (userid && req.user.role != roles.admin)
    return next(
      new Error("you are not authorized to freez this account", { cause: 403 })
    );

  const updateduser = await dbservice.findOneAndUpdate({
    model: Usermodel,
    filter: { _id : userid || req.user._id, deletedAt: { $exists: false } },
    data: {
      deletedAt: Date.now(),
      deletedBy: req.user._id,
      $unset: {
        restoredAt: true,
        restoredBy: true,
      },
    },
  });

  return updateduser
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "user freezed  succussfuly",
        data: { updateduser },
      })
    : next(new Error("invalid account", { cause: 404 }));


};



export const restoredaccount = async (req, res, next) => {
  const { userid } = req.params;

const user = await dbservice.findOne({model:Usermodel,filter:{_id:userid}}); 


   if (!user || !user.deletedAt) {
  return next(
    new Error(
      !user ? "invalid account" : "account is not deleted",
      { cause: !user ? 404 : 400 }
    )
  );
}


const selfrestored = user.deletedBy == userid && req.user._id == userid ;

const adminrestored = req.user.role == roles.admin && user.deletedBy != userid



if(!selfrestored && !adminrestored)
    return next(new Error("you are not authorized to restore this account", { cause: 403 }))


console.log({ userid, deletedBy: user.deletedBy, reqUser: req.user._id });

  const restoreduser = await dbservice.findOneAndUpdate({
    model: Usermodel,
    filter: { _id : userid , deletedAt:{$exists:true}   },
    data: {
     restoredAt: Date.now(),
      restoredBy: req.user._id,
      $unset: {
        deletedAt: true,
        deletedBy: true,
      },
    },
  });

  return restoreduser
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "user restored success  succussfuly",
        data: { restoreduser },
      })
    : next(new Error("invalid account", { cause: 404 }));

};


export const deleteAccount = async (req, res, next) => {
  const { userid } = req.params;
  
  const user = await dbservice.deleteone({
    model: Usermodel,
    filter: { _id : userid,deletedAt: { $exists: true } },
  });

  return user.deletedCount
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "user deleted  succussfuly",
      
      })
    : next(new Error("invalid account", { cause: 404 }));


};


export const updatePassword = async (req, res, next) => {
  const { oldpassword ,password,flag} = req.body;
if(!(await compare({plainText:oldpassword,hash:req.user.password})))
  return next(new Error("old password is in correct",{cause:400}))
  let updateddata= {};
  switch (flag) {

    case logoutEnum.logoutFromalldevices:
      updateddata. changeCredentialsTime  = Date.now()
      break;

       case logoutEnum.logout:
       await dbservice.create({
             model: Tokenmodel,
             data: [
               {
                 jti: req.decoded.jti,
                 expiresIn: Date.now() - req.decoded.iat,
                 userId: req.user._id,
               },
             ],
           });
      break;
  
    default:
      break;
  }

const user = await dbservice.findOneAndUpdate({model:Usermodel,filter:{_id:req.user._id},data:{
  password: await hash({plainText:password}),...updateddata
}})

  return user
    ? SuccessResponse({
        res,
        statusCode: 200,
        message: "password updated success",
        data : {user}
      
      })
    : next(new Error("invalid account", { cause: 404 }));


};



export const uploadfile= async (req, res, next) => {

const {secure_url,public_id} = await cloudconfig().uploader.upload(req.file.path,{
  folder:`sar7app/User/${req.user._id}`
})


 const user = await dbservice.findOneAndUpdate({model:Usermodel , filter:{_id:req.user._id},data:{
  profileImagecloud : {secure_url,public_id}
 }})

    return SuccessResponse({
        res,
        statusCode: 200,
        message: "file uploaded",
        data : {user}
      
      })
   

};



export const coverImages= async (req, res, next) => {
const attachments = [] 
for (const file of req.files) {
const {secure_url,public_id} = await cloudconfig().uploader.upload(file.path,{
  folder:`sar7app/User/${req.user._id}`
})
attachments.push({secure_url,public_id})
}
 const user = await dbservice.findOneAndUpdate({model:Usermodel , filter:{_id:req.user._id},data:{
 coverImagescloud : attachments 
 }})

    return SuccessResponse({
        res,
        statusCode: 200,
        message: "file uploaded",
        data : {user}
      
      })
   

};
