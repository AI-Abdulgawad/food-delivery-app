import type {NextFunction, Request, RequestHandler, Response} from "express";
import {SystemRole} from "../../app/user/enums/system_role.js";


export  function requireRestaurantMember(paramName:string='restaurantId'):RequestHandler {


    return (req: Request, res: Response, next: NextFunction) => {

        if(!req.user) {
            res.status(401).json({message:"UnAuthorized"});
        }
            const restaurantId = parseInt(req.params[paramName] as string);

            if(req.user?.role === SystemRole.ADMIN) {
                next()
            }
            if(!req.restaurantUser) {
                return res.status(401).json({message:"No restaurant found"});
            }

            if(!req.restaurantUser.restaurantId || req.restaurantUser.restaurantId.length <= 0) {
                return res.status(401).json({message:"No restaurant found"});
            }

            if(!req.restaurantUser.restaurantId.includes(restaurantId)) {
                return res.status(401).json({message:"Permission denied"});
            }
            next()



    }
}



