import { Router } from "express";
import * as Messageservice from "./message.service.js";  
import { cloudfileupload } from "../../Utils/multer/cloud.multer.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { getMessageValidation, sendMessageValidation } from "./message.validation.js";
import { Authentication, TokentypeEnum } from "../../Middlewares/authientication.middleware.js";
const router = Router();

router.post(
  "/:recieverId/send-Message",
  cloudfileupload({ validation: [...fileValidation.images] }).array( "attachment", 3 ),
  validation(sendMessageValidation),
  Messageservice.sendMessage
);



router.post(
  "/:recieverId/sender",
  Authentication({Tokentype:TokentypeEnum.access}),
  cloudfileupload({ validation: [...fileValidation.images] }).array( "attachment", 3 ),
  validation(sendMessageValidation),
  Messageservice.sendMessage
);



router.get(
  "/:userId/get-messages",
  validation(getMessageValidation),
  Messageservice.getMessage
);








export default router;
