import {Logger} from '../logger/logger.js'
import type {Request,Response,NextFunction} from 'express'
import {AppError} from "./app_error.js";
class ExceptionHandler  {
    static manage(error:Error,req:Request,res:Response,next:NextFunction) {
        // console.log(error.message)
        // console.log(error.stack)

        let logger = new Logger()
        logger.info(error.message, {
            stack: error.stack,
            // isOperational : error.getIsOperational() ?? false,
            body : req.body,
            correlationId: req.correlationId,
            timestamp: Date.now(),
        })

       res.status(500).json({message: error.message})

    }

}

export const errorHandler =  ExceptionHandler.manage