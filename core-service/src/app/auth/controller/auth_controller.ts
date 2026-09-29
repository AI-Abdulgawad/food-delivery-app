import  {type Request,type Response,type NextFunction} from "express";
import {authService, type Tokens} from "../service/AuthService.js";

import {validateBody} from "../../../lib/validation/validator.js";
import {RegisterDTO} from "../DTO/registerDTO.js";
import {LoginDTO} from "../DTO/login_dto.js";
import {ForgetPasswordDTO} from "../DTO/forgetPassword.js";
import {ResetPasswordDTO} from "../DTO/ResetPasswordDTO.js";
import {addAccessTokenCookie, addRefreshTokenCookie} from "../../../lib/auth_utils/cookies.js";

export class AuthController {


    async register(req:Request,res:Response,next:NextFunction) {
        try {
                const data:RegisterDTO = await validateBody(RegisterDTO,req.body);
                const result = await authService.registerUser(data)
                return res.status(201).json(result)

        }catch(err){
                next(err);
        }
    }

    async login(req:Request,res:Response,next:NextFunction) {
        try {
            // validate user input
            const userCredentials:LoginDTO = await validateBody(LoginDTO,req.body)

            const result =  await authService.loginUser(userCredentials) as Tokens
            addAccessTokenCookie(res,result.access_token)
            addRefreshTokenCookie(res,result.refresh_token)
            return res.status(200).json(result)


        }catch (err) {
            next(err)
        }


    }
    async forgetPassword(req:Request,res:Response,next:NextFunction) {

        try {
        const forgetPasswordDTO:ForgetPasswordDTO = await validateBody(ForgetPasswordDTO,req.body)
        await authService.forgetPassword(forgetPasswordDTO)
            return res.status(200).json({"message":`OTP has been sent to ${forgetPasswordDTO.email}`})
        }catch (err) {
            console.log(err)
            next(err)
        }

    }

     async resetPassword(req:Request,res:Response,next:NextFunction) {
         try{
             console.log(req.body)
             const resetPasswordDto: ResetPasswordDTO = await validateBody(ResetPasswordDTO, req.body)
             console.log(resetPasswordDto)
             const user = await authService.checkOTP(resetPasswordDto)

             return res.status(200).json({'message': 'Password has been updated '})
         }catch (err) {
             next(err)
         }
    }
    refresh(req:Request,res:Response,next:NextFunction) {
        const refreshToken:string = req.cookies.refresh_token;
        console.log('req_token',refreshToken)
        if (!refreshToken) {
            res.status(400).json({"message":"Refresh token not found"})
        }
        const result = authService.refreshToken(refreshToken) as Tokens
        console.log('result',result)
            addAccessTokenCookie(res,result.access_token)
            addRefreshTokenCookie(res,result.refresh_token)

        return res.status(200).json({'message':'tokens updated'})

        }

    async acceptInvite(req:Request,res:Response,next:NextFunction) {
        try{

            const resetPasswordDto: ResetPasswordDTO = await validateBody(ResetPasswordDTO, req.body)

            const result = await authService.acceptInvite(resetPasswordDto)

            return res.status(200).json({message: 'your user is activated login again',result})
        }catch (err) {
            next(err)
        }
    }

}

export const authController = new AuthController()