import type {Request,Response,NextFunction} from "express";
import {UpdateUserDto} from "../UpdateUserDto.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {authService} from "../../auth/service/AuthService.js";
import {addAccessTokenCookie, addRefreshTokenCookie} from "../../../lib/auth_utils/cookies.js";
import {
    decodeJwtToken, generateAccessToken, generateRefreshToken,
    type JwtPayload,
    verifyAccessToken,
    verifyRefreshToken
} from "../../../lib/auth_utils/jwt_utils.js";

export class UserController {


    async getUserInfo(req:Request,res:Response,next:NextFunction){


        return res.status(200).json({data:req.user});

    }
    async updateUserNameOrPhone(req:Request,res:Response,next:NextFunction){
        let dto:UpdateUserDto = await validateBody(UpdateUserDto,req.body);
        if(dto != undefined){
            const user = await authService.updateUser(dto,req.user?.user_id!)
            // updating jwt payloads

           const newPayload:JwtPayload = {
               userId:user.id.toString() ,
               email:user.email,
               phone:user.phone,
               name:user.name,
               role:user.system_role,
           }
            // regenrating updated token with new data
            const accessToken = generateAccessToken(newPayload)
            const refreshToken = generateRefreshToken(newPayload)
            addAccessTokenCookie(res,accessToken)
            addRefreshTokenCookie(res,refreshToken)
            res.status(200).json({
                'message' : 'profile updated successfully.',
                'user': newPayload,
            });
        }
    }


}

export const userController = new UserController();