import type {Request,Response,NextFunction} from "express";
import {restaurantService} from "../service/restaurant.service.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {AddRestaurantDto} from "../dto/AddRestaurantDto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {RestaurantStatus} from "../entity/restaurant_status_types.js";
import {UpdateRestaurantInfoDto} from "../dto/UpdateRestaurantInfo.js";
import {sendSuccess} from "../../../lib/types/response_entity.js";

export class RestaurantController {


    async getRestaurant(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = parseInt(req.params.id as string);
            const restaurant = await restaurantService.getRestaurant(id)

            if (restaurant != undefined) {

                return res.status(200).json({'restaurant': restaurant});
            } else {
                return res.status(404).json({'message': 'No restaurant found'});
            }

        } catch (error) {
            next(error);
        }
    }

    async getAllRestaurant(req: Request, res: Response, next: NextFunction) {
        try {

            const restaurant = await restaurantService.getAllRestaurant()

            if (restaurant != undefined) {

                return sendSuccess(res, restaurant);
                // return res.status(200).json({'restaurant': restaurant});
            } else {
                return res.status(404).json({'message': 'No restaurant found'});
            }

        } catch (error) {
            next(error);
        }
    }

    async addRestaurant(req: Request, res: Response, next: NextFunction)
    {

        try {
            const addRestaurantDto: AddRestaurantDto = await validateBody(AddRestaurantDto, req.body)


            const restaurant = await restaurantService.addRestaurant(addRestaurantDto)
            if (restaurant != undefined) {
                return res.status(200).json({'restaurant': restaurant});
            } else {
                throw new AppError('error adding restaurant');
            }
        }catch(error) {
                next(error);
        }
    }

    async updateStatus (req:Request,res:Response,next:NextFunction) {

        try {
            // TODO: make sure that the admin is only one who can update status

        const restaurantId = parseInt(req.params.id as string);
        const  status:RestaurantStatus = req.params.status as RestaurantStatus;



            const restaurant=  await restaurantService.updateStatus(restaurantId,status)

            if (restaurant != undefined) {
                return res.status(200).json({'restaurant': restaurant});
            } else {
                throw new AppError('error updating status restaurant');
            }

        }catch (error) {
            next(error);
        }
    }

    async updateRestaurantInfo (req:Request,res:Response,next:NextFunction) {
            try {
            const restaurantId = parseInt(req.params.id as string);

                const dto:UpdateRestaurantInfoDto = await validateBody(UpdateRestaurantInfoDto,req.body)
                const restaurant = await restaurantService.updateRestaurantInfo(restaurantId,dto)
                 res.status(200).json({'restaurant':restaurant})


            }catch (error) {
                next(error);
            }

    }


}
export const restaurantController = new RestaurantController();

