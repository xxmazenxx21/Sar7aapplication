import { Router } from "express";
import  * as authservice from './auth.services.js'
import { Authentication, TokentypeEnum } from "../../Middlewares/authientication.middleware.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { confirmEmailvalidation, forgetPasswordvalidation, loginValidation, logoutvalidation, resetPasswordvalidation, SignupValidation, socialloginValidation } from "./auth.validation.js";

const router = Router();



router.post('/signup',validation(SignupValidation),authservice.signup);


router.post('/login',validation(loginValidation),authservice.login);


router.post('/social-login',validation(socialloginValidation),authservice.LoginWithGmail);


router.get('/refresh-token',Authentication({Tokentype:TokentypeEnum.refresh}),authservice.refreshtoken);


router.patch('/confirmEmail',validation(confirmEmailvalidation),authservice.confirmEmail);


router.patch('/Forget-Password',validation(forgetPasswordvalidation),authservice.forgetpassword);



router.patch('/reset-Password',validation(resetPasswordvalidation),authservice.resetpassword);



router.post('/log-out',validation(logoutvalidation),Authentication({Tokentype:TokentypeEnum.access}),authservice.logout);




export default router 