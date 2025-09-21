
import mongoose, { Schema } from "mongoose";


const tokenschema = new Schema(
  {
    jti: {
      type: String,
      required: true,
      unique:true
    },
  
    expiresIn : {
        type: Number ,
        required : true 
    },
    userId : {
        type : mongoose.Types.ObjectId,ref:"User" ,
        required:true
    }
  },
  { timestamps: true }
);

export const Tokenmodel =
  mongoose.models.Token || mongoose.model("Token",  tokenschema);
