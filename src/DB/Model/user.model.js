import mongoose, { Schema } from "mongoose";
const genderEnum = {
  male: "male",
  female: "female",
};

export const providers = {
  google: "google",
  system: "system",
};
export const roles = {
  user: "User",
  admin: "Admin",
};

const userschema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providers.system ? true : false;
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "gender must be male or female",
      },
      default: "male",
    },
    phone: String,
    confirmEmailOTP: String,
    ForgetPassword : String ,
     profileImage: String,
     profileImagecloud : {public_id:String,secure_url:String},
      coverImages: [String],
       coverImagescloud : [{public_id:String,secure_url:String}],
    confirmEmail: Date,
    changeCredentialsTime : Date , 
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    provider: {
      type: String,
      enum: {
        values: Object.values(providers),
        message: "provider must be system or google",
      },
      default: providers.system,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roles),
        message: "role must be admin or user",
      },
    },
  },
  { timestamps: true , toJSON:{virtuals:true},  toObject:{virtuals:true}}
);
userschema.virtual('messages',{
  localField:'_id' ,
  foreignField:'recieverId',
  ref : 'Message'
  
})
export const Usermodel =
  mongoose.models.User || mongoose.model("User", userschema);
