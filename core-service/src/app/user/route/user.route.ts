import {Router} from "express";
import {userController} from "../controller/user.controller.js";
import {authenticate} from "../../../lib/filters/authenticate.js";

export const userRouter:Router =  Router();

userRouter.get('/info',authenticate,userController.getUserInfo.bind(userController));
userRouter.patch('/me',authenticate,userController.updateUserNameOrPhone.bind(userController));