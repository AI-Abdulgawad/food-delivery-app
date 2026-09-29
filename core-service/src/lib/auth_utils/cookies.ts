import {env} from "../config/env.js";
import type {Response} from "express";
import {TimeUtils} from "../../pkg/time/time-utils.js";

export function addAccessTokenCookie(res:Response,token: string)  {
    res.cookie('access_token',token,{
    httpOnly:true,
        secure: env.NODE_ENV === 'production',
        maxAge: TimeUtils.toMS(1,'h'),

});
}

export function addRefreshTokenCookie(res:Response,token: string)  {
    res.cookie('refresh_token',token,{
        httpOnly:true,
        secure: env.NODE_ENV === 'production',
        maxAge: TimeUtils.toMS(7,'d'),
        path:'/api'

    });
}