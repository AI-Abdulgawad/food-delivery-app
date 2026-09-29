import {restaurantRepository} from "../respository/restaurant.repo.js";
import type {AddRestaurantDto} from "../dto/AddRestaurantDto.js";
import {Restaurant} from "../entity/restaurant.entity.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import type {RestaurantStatus} from "../entity/restaurant_status_types.js";
import type {UpdateRestaurantInfoDto} from "../dto/UpdateRestaurantInfo.js";
import {pickDefined} from "../../../lib/validation/validator.js";

export class RestaurantService {


    async getRestaurant(id:number){
        return await restaurantRepository.findRestaurantById(id)
    }


    async addRestaurant(addRestaurantDto: AddRestaurantDto) {
        const restaurantWithSameName = await restaurantRepository.findRestaurantByName(addRestaurantDto.name)
        if(restaurantWithSameName == undefined){
            const restaurant = new Restaurant(addRestaurantDto);
            return restaurantRepository.addRestaurant(restaurant);
        }else {
            throw new AppError('Restaurant with the same name already exists');
        }
    }

    async updateStatus(id:number, status: RestaurantStatus) {
        return await restaurantRepository.updateRestaurantStatus(id, status)

    }

    async updateRestaurantInfo(restaurantId: number, dto: UpdateRestaurantInfoDto) {
        const updateData = pickDefined(dto)
        if(Object.keys(updateData).length) {
            throw new AppError('NO INFO TO UPDATE restaurant info');
        }
        return await restaurantRepository.updateRestaurantInfo(restaurantId, updateData);

    }

    async findRestaurantsIdOfOwner(owner_id:number){
        return restaurantRepository.findRestaurantsByOwnerId(owner_id)
    }
     hasAccessToRestaurant(role:string | undefined,restaurantId:number,restaurantIdList:number[]|undefined){
        if(role == undefined){
            return false
         }
        if(role == 'admin') {
            return true
        }
        if(role == 'restaurant_user') {
            return restaurantIdList?.includes(restaurantId)
        }
        return false
    }

    async getAllRestaurant() {
        return await restaurantRepository.findAllRestaurant()
    }
}
export const restaurantService = new RestaurantService();