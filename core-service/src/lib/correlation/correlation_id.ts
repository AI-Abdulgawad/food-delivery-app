import {v4 as uuid} from 'uuid';
import type {Request,Response,NextFunction} from "express";

export const correlationId = (req:Request,res:Response,next:NextFunction) => {
    req.correlationId = uuid()
    res.setHeader('X-Correlation',req.correlationId)
    next()
}
