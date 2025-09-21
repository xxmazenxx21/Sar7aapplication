import { Router } from "express";
import * as userservice from "./user.service.js";
import {
  Authentication,
  Authorization,
  TokentypeEnum,
} from "../../Middlewares/authientication.middleware.js";
import { endpoints } from "./user.aithorization.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import {
  coverImageValidation,
  deleteAccountValidation,
  freezeAccountValidation,
  profileImageValidation,
  restoredAccountValidation,
  shareprofileValidation,
  updatepasswordValidation,
  updateprofileValidation,
} from "./user.validation.js";
import { fileValidation, localfileupload } from "../../Utils/multer/local.multer.js";
import { cloudfileupload } from "../../Utils/multer/cloud.multer.js";
const router = Router();

router.get(
  "/getprofile",
  Authentication({ Tokentype: TokentypeEnum.access }),
  Authorization({ accessRole: endpoints.getProfile }),
  userservice.getprofile
);

router.get(
  "/share-profile/:userid",
  validation(shareprofileValidation),
  userservice.shareprofile
);


router.patch(
  "/update-profile",
  validation(updateprofileValidation),
  Authentication({ Tokentype: TokentypeEnum.access }),
  Authorization({ accessRole: endpoints.updateProfile }),
  userservice.updateprofile
);

router.delete(
  "{/:userid}/freeze-account",
  validation(freezeAccountValidation),
  Authentication({ Tokentype: TokentypeEnum.access }),
  Authorization({ accessRole: endpoints.freezAccount }),
  userservice.freezAccount
);


router.patch(
  "/restored-account/:userid",
  validation(restoredAccountValidation),
  Authentication({ Tokentype: TokentypeEnum.access }),
  Authorization({ accessRole: endpoints.restoredaccount }),
  userservice.restoredaccount
);


router.delete(
  "/hard-delete/:userid",
  validation(deleteAccountValidation),
  Authentication({ Tokentype: TokentypeEnum.access }),
  Authorization({ accessRole: endpoints.deleteaccount }),
  userservice.deleteAccount
);




router.patch(
  "/update-password",
  validation(updatepasswordValidation),
  Authentication({ Tokentype: TokentypeEnum.access }),
  Authorization({ accessRole: endpoints.updatepassword }),
  userservice.updatePassword
);




router.patch(
  "/upload-file-image",
  Authentication({ Tokentype: TokentypeEnum.access }),
  // localfileupload({customPath:"User",validation:[...fileValidation.images]}).single("profileimage"),
  // validation(profileImageValidation),
  cloudfileupload({validation:[...fileValidation.images]}).single('image'),
  
  userservice.uploadfile
);


router.patch(
  "/upload-cover",
  Authentication({ Tokentype: TokentypeEnum.access }),
  // localfileupload({customPath:"User",validation:[...fileValidation.images]}).array("images",5),
  //  validation(coverImageValidation),
    cloudfileupload({validation:[...fileValidation.images]}).array('images',5),
  userservice.coverImages
);




export default router;
