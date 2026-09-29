import {Router} from "express";
import {authController} from "../controller/auth_controller.js";

export const authRouter = Router()

authRouter.post('/register',authController.register.bind(authController))
authRouter.post('/login',authController.login.bind(authController))
authRouter.post('/forget-password',authController.forgetPassword.bind(authController))
authRouter.post('/reset-password',authController.resetPassword.bind(authController))
authRouter.post('/refresh',authController.refresh.bind(authController))
authRouter.post('/accept-invite',authController.acceptInvite.bind(authController))
