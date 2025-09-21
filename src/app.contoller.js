import express  from 'express'
import { rateLimit } from 'express-rate-limit'
import authrouter from './Module/auth/auth.controller.js'
import userrouter from './Module/user/user.controller.js'
import messagerouter from './Module/messages/meesage.controller.js'
import { connectionDB } from './DB/connection.js';
import path from 'node:path';
import { attachRoutingWithLogger } from './Utils/logger/logger.utils.js'
import { corsOptions } from './Utils/cors/cors.js';
import cors from "cors"
import helmet from 'helmet';

const bootstrap = async(app,express)=>{
app.use(express.json());
app.use(cors(corsOptions()));
app.use(helmet());

  const limiter = rateLimit({
    windowMs: 60 * 1000, 
    limit: 3, 
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);


attachRoutingWithLogger(app,'/api/auth',authrouter,"auth.log");
attachRoutingWithLogger(app,'/api/user',userrouter,"user.log");
app.use("/uploads",express.static(path.resolve('./src/uploads')));






app.use('/api/auth',authrouter);
app.use('/api/user',userrouter);
app.use('/api/message',messagerouter);
await connectionDB();


app.all('/*dummy',(req,res)=>{

return res.status(404).json({message:'error path'})

})



app.use((err,req,res,next)=>{

const status = err.cause || 500 ; 
return res.status(status).json({message:"something went wrong",err : err.message , stack : err.stack})

})

}


export default bootstrap ;