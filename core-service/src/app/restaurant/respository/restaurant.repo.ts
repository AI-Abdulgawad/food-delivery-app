import {db} from "../../../lib/knex/knex.js";
import {Restaurant} from "../entity/restaurant.entity.js";
import type {RestaurantStatus} from "../entity/restaurant_status_types.js";
import type {UpdateRestaurantInfoDto} from "../dto/UpdateRestaurantInfo.js";
import {
    applyCursorPagination,
    applyFilters,
     FilterParams,
     PaginationParams
} from "../../../lib/pagination/cursor-pagination.js";

class RestaurantRepository {

    async findRestaurantById(id: number, trx=db) {
        const row = await trx('restaurants').select('*').where('id', id).first();
        return row != undefined ? Restaurant.toEntity(row) : undefined
    }

    async findRestaurantByName(name: string) {
        const row = await db('restaurants').select('*').where('name', name).first();
        return row != undefined ? Restaurant.toEntity(row) : undefined
    }

    async addRestaurant(restaurant: Restaurant) {
        const [inserted] = await db('restaurants').insert(restaurant.toRow()).returning('*');
        return inserted != undefined ? Restaurant.toEntity(inserted) : undefined;
    }

    async updateRestaurantStatus(id: number, status: RestaurantStatus) {
        const [updatedRestaurant] = await db('restaurants').where('id', id).update({status: status}).returning('*')
        return updatedRestaurant
    }

    async updateRestaurantInfo(restaurantId: number, dto: UpdateRestaurantInfoDto) {
        const [updatedRestaurant] = await db('restaurants').where('id', restaurantId).update({...dto}).returning('*')
        return updatedRestaurant
    }

    async findRestaurantsByOwnerId(id: number) {
        const restaurantsId = await db('restaurants').select('id').where('owner_id', id)
        const Ids: number[] = restaurantsId.map((id) => id as number)
        return Ids

    }

    async findAllRestaurant(filterParams:FilterParams[], paginationParams: PaginationParams) {
       let result =  db('restaurants').select('*')

        if(filterParams) {
            result = applyFilters(result,filterParams)
        }
        result = applyCursorPagination(result,paginationParams)

        const rows = await result

        return rows.map(Restaurant.toEntity)
    }
}

export const restaurantRepository = new RestaurantRepository();