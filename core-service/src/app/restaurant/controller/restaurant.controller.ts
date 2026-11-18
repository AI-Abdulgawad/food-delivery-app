import type {Request,Response,NextFunction} from "express";
import {restaurantService} from "../service/restaurant.service.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {AddRestaurantDto} from "../dto/AddRestaurantDto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {RestaurantStatus} from "../entity/restaurant_status_types.js";
import {UpdateRestaurantInfoDto} from "../dto/UpdateRestaurantInfo.js";
import {sendSuccess} from "../../../lib/types/response_entity.js";
import {parseFilterParams, parsePaginationParams} from "../../../lib/pagination/query-parser.js";
import {PaginationParams,FilterParams} from "../../../lib/pagination/cursor-pagination.js";

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
            let paginationParams:PaginationParams = new PaginationParams();

            if(Object.keys(req.query).includes('cursor'))
                paginationParams = await validateBody(PaginationParams, req.query)

            let filterParams: FilterParams[] = []
            if(Object.keys(req.query).includes('filter')) {
                const filterList: Object[] = parseFilterParams(req.query,['id','name','status'])
                console.log(filterList);
                // validating filter params
                filterParams = await Promise.all(filterList.map(async (filter) => await validateBody(FilterParams, filter)))
                console.log(paginationParams)
                console.log(filterParams)
            }
            const restaurant = await restaurantService.getAllRestaurant(paginationParams,filterParams)

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

