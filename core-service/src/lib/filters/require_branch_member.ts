import type {Request,Response,NextFunction} from "express";
import {SystemRole} from "../../app/user/enums/system_role.js";


export  function requireBranchMember(paramName:string='branchId') {

    return (req: Request, res: Response, next: NextFunction) => {

        if(!req.user) {
            res.status(401).json({message:"UnAuthorized"});
        }
        const branchId = parseInt(req.params[paramName] as string);

        if(req.user?.role === SystemRole.ADMIN) {
            next()
        }
        if(!req.restaurantUser) {
            return res.status(401).json({message:"No restaurant found"});
        }

        if(!req.restaurantUser.branchId || req.restaurantUser.branchId.length <= 0) {
            return res.status(401).json({message:"No restaurant found"});
        }

        if(!req.restaurantUser.branchId.includes(branchId)) {
            return res.status(401).json({message:"Permission denied"});
        }
        next()



    }
}