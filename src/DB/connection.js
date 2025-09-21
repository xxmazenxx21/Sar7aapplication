import mongoose from "mongoose";


export const connectionDB = async()=>{

try {
    await mongoose.connect(process.env.MONGO_URL,{
        serverSelectionTimeoutMS:5000
    })
    console.log("db connected succsess");
} catch (error) {

     console.log("db failed",error);
    
}

}


