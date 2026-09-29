import type {Request,Response,NextFunction} from "express";
import {restaurantBranchService} from "../service/restaurantBranch.service.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {RestaurantBranchDto} from "../DTO/restaurant_branch_dto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {UpdateBranchDto} from "../DTO/updateBranch.dto.js";
import {UpdateBranchStatusDto} from "../DTO/UpdateStatus.dto.js";

export class RestaurantBranchController {

    async getAllRestaurantBranches(req: Request, res: Response, next: NextFunction) {
        try {
                const restaurantId = Number(req.params.restaurantId);
                const result =   await restaurantBranchService.findAllBranchesByRestaurantId(restaurantId)
                 res.status(200).send(result)

        }catch (err) {
            next(err)
        }

    }


   async createBranch(req: Request, res: Response,next:NextFunction) {
            try {
                const restaurantId = Number(req.params.restaurantId);
               const data = await validateBody(RestaurantBranchDto,req.body);
               let result = await restaurantBranchService.addBranch(data,restaurantId)
                result = result == undefined ? -1 : result
                return res.status(200).json(result)
            }catch (err) {
               next(err)
            }
   }
   async nearbyBranches(req:Request,res:Response,next:NextFunction){
       try {
           const lngRaw = req.query.lng;
            const latRaw = req.query.lat;

           if (typeof lngRaw !== 'string' || typeof latRaw !== 'string') {
               throw new AppError('lng/lat must be a single string query parameter');
           }

           const lng = Number(lngRaw);
           const lat = Number(latRaw);
           if (Number.isNaN(lng || Number.isNaN(lat))) {
               throw new AppError('lng must be a valid number');
           }
           const result = await restaurantBranchService.findNearByBranches(lng,lat)
           res.status(200).json(result)
       }catch (err) {
           next(err)
       }
   }
   async updateBranch(req: Request, res: Response,next:NextFunction){

       try {
             const branchId=  Number(req.params.id)
             const dto = await validateBody(UpdateBranchDto,req.body)
             const result = await restaurantBranchService.updateBranchInfo(dto,branchId)
           res.status(200).json(result)


       }catch (err) {
           next(err)
       }

   }

   async updateBranchStatus(req: Request, res: Response,next:NextFunction){
       try {
           const branchId=  Number(req.params.id)
           const dto = await validateBody(UpdateBranchStatusDto,req.body)
           const result =  await restaurantBranchService.updateBranchInfo(dto,branchId)
           res.status(200).json(result)

       }catch (err) {
            next(err)
       }


   }



}

export const restaurantBranchController = new RestaurantBranchController()