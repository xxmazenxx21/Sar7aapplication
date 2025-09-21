import * as dbservice from "../../DB/dbservice.js"
import { Usermodel } from "../../DB/Model/user.model.js";
import {Messagemodel } from "../../DB/Model/message.model.js";
import { cloudconfig } from "../../Utils/multer/cloudinary.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
export const sendMessage = async (req, res, next) => {
const {recieverId} = req.params ; 
const{content} = req.body ; 

if(!await dbservice.findOne({model:Usermodel,filter:{_id:recieverId,deletedAt:{$exists:false},confirmEmail:{$exists:true}}
}))
 return next(new Error("invalid recipent account"),{cause:404})

const attachment = []

if(req.files){
for (const file of req.files) {
   const {secure_url,public_id} = await cloudconfig().uploader.upload(file.path,{
     folder:`sar7app/message/${recieverId}`
   })
   attachment.push({secure_url,public_id})
}

}
const Message = await dbservice.create({model:Messagemodel,
    data:[{
    content,
      attachment , 
    recieverId,
     senderId : req.user?._id  }]
    })


    return SuccessResponse({
        res,
        statusCode: 200,
        message: "message send successes",
        data : {Message}
      
      })
};


export const getMessage = async (req, res, next) => {
const {userId} = req.params ; 

const messages = await dbservice.find({model:Messagemodel,filter:{
   recieverId : userId
},populate:[{path:"recieverId",select:"firstname lastname email -_id"}]})

    return SuccessResponse({
        res,
        statusCode: 200,
        message: "message send successes",
        data : {messages }
      
      })
};
