import type {NextFunction, Request, Response} from "express";
import {verifyAccessToken} from "../auth_utils/jwt_utils.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try{
        const token = req.cookies.access_token;

        // No TOKEN PROVIDED
        if (token === undefined || token === null) {
            return res.status(401).json({message: "No token provided"});
        }
        const payload = verifyAccessToken(token)
            req.user = {
                user_id: parseInt(payload.userId),
                name: payload.name,
                email: payload.email,
                role: payload.role,
                phone: payload.phone,

            }
            req.restaurantUser = {
                restaurantId: payload.restaurantId ?? [],
                branchId: payload.branchId ?? [],
                roleName: payload.restaurantRoleName!


        }



            next()


    }catch (err) {
        return res.status(401).json({message:"UnAuthorized"});

    }




}
