import {env} from "../config/env.js";
import jwt, {type SignOptions} from "jsonwebtoken";
import type {StringValue} from 'ms';

export interface JwtPayload {
        email: string;
        userId: string;
        role: string;
        phone: string;
        name: string;
        restaurantId?:number[]
        branchId?:number[]
        restaurantRoleName?:string
}




export const generateAccessToken =  (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: env.jwt.accessExpiresIn as StringValue ,
    }

    return jwt.sign(payload,env.jwt.accessSecret, options)

}
export const verifyAccessToken =  (token:string): JwtPayload => {


    return jwt.verify(token,env.jwt.accessSecret) as JwtPayload;

}

export function decodeJwtToken(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload;


}


export const generateRefreshToken =  (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: env.jwt.refreshExpiresIn as StringValue ,
    }

    return jwt.sign(payload,env.jwt.refreshSecret, options)
}
export const verifyRefreshToken =  (token:string): JwtPayload => {
    return jwt.verify(token,env.jwt.refreshSecret) as JwtPayload;
}

