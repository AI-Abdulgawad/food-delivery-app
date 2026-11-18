import {Router} from "express";
import {UserController} from "../controller/user.controller.js";
import {authenticate} from "../../../lib/filters/authenticate.js";
import {container} from "tsyringe";

export const userRouter:Router =  Router();
const userController = container.resolve(UserController);
userRouter.get('/info',authenticate,userController.getUserInfo.bind(userController));
userRouter.patch('/me',authenticate,userController.updateUserNameOrPhone.bind(userController));