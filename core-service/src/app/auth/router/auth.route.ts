import {Router} from "express";
import {container} from "tsyringe";
import {AuthController} from "../controller/auth_controller.js";
import {idempotency} from "../../../lib/idempotency/idempotency.js";

export const authRouter = Router()
const authController = container.resolve(AuthController);
authRouter.post('/register',authController.register.bind(authController))
authRouter.post('/login',idempotency({strict:true,userScoped:true}),authController.login.bind(authController))
authRouter.post('/forget-password',idempotency({strict:true,userScoped:true}),authController.forgetPassword.bind(authController))
authRouter.post('/reset-password',authController.resetPassword.bind(authController))
authRouter.post('/refresh',authController.refresh.bind(authController))
authRouter.post('/accept-invite',authController.acceptInvite.bind(authController))
