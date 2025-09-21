import mongoose, { Schema } from "mongoose";

const Messageschema = new Schema(
  {
    content: {
      type: String,
      minlength:2 ,
      maxlength : 2000,
      required: function(){
        return this.attachment?.length ? false : true
      },
    },

    attachment: [{public_id:String,secure_url:String}],
     
    
    recieverId: {
      type: Schema.Types.ObjectId ,
      ref : "User",
      required : true
    },
      senderId: {
     type: Schema.Types.ObjectId ,
      ref : "User",
      
    },
    
  },
  { timestamps: true }
);

export const Messagemodel =
  mongoose.models.Message || mongoose.model("Message", Messageschema);
