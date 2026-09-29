import {db} from "../../../lib/knex/knex.js";
import {Restaurant} from "../entity/restaurant.entity.js";
import type {RestaurantStatus} from "../entity/restaurant_status_types.js";
import type {UpdateRestaurantInfoDto} from "../dto/UpdateRestaurantInfo.js";

class RestaurantRepository {

    async findRestaurantById(id:number){
        const row = await db('restaurants').select('*').where('id', id).first();
        return row != undefined ? Restaurant.toEntity(row) : undefined
    }

    async findRestaurantByName(name: string) {
        const row = await db('restaurants').select('*').where('name', name).first();
        return row != undefined ? Restaurant.toEntity(row) : undefined
    }

   async addRestaurant(restaurant: Restaurant) {
       const [inserted] =  await db('restaurants').insert(restaurant.toRow()).returning('*');
        return inserted != undefined ? Restaurant.toEntity(inserted) : undefined;
    }

    async updateRestaurantStatus(id: number, status: RestaurantStatus) {
       const [updatedRestaurant] =  await db('restaurants').where('id', id).update({status: status}).returning('*')
        return updatedRestaurant
    }

    async updateRestaurantInfo(restaurantId: number, dto: UpdateRestaurantInfoDto) {
        const [updatedRestaurant] = await db('restaurants').where('id', restaurantId).update({...dto}).returning('*')
        return updatedRestaurant
    }

    async findRestaurantsByOwnerId(id: number) {
        const restaurantsId = await db('restaurants').select('id').where('owner_id', id)
        const Ids:number[] = restaurantsId.map((id) => id as number)
        return Ids

    }

    async findAllRestaurant() {
      const result = await db('restaurants').select('*')
       return result.map(Restaurant.toEntity)
    }
}

export const restaurantRepository = new RestaurantRepository();