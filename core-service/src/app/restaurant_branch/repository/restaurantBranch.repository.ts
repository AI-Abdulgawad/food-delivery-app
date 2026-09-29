import  {RestaurantBranchDto} from "../DTO/restaurant_branch_dto.js";
import  {RestaurantBranch} from "../entity/restaurant_branch.entity.js";
import {db} from "../../../lib/knex/knex.js";
import knex from "knex";
import {NearbyBranchDto} from "../DTO/nearbyBranch.dto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";

class RestaurantBranchRepository {


    async addBranch(data:RestaurantBranch,conn=db)  {
        const [affected] = await  conn('restaurant_branch').insert(data).returning('id');

        return affected as number;
    }
    async findNearByBranches(lng:number,lat:number,conn=db) {
        const result = await conn.raw(`
        SELECT
        b.id,
        b.name,
        b.restaurant_id,
        b.address_text,
        b.label,
        b.currency,
        b.is_active,
        b.latitude,
        b.longitude,
        b.opens_at,
        b.closes_at,
        r.name,
        r.logo_url
            
        FROM restaurant_branch b join restaurants r ON b.restaurant_id = r.id
        WHERE 
            b.is_active = true
            AND 
            b.accepting_orders=true 
            AND 
            r.status = 'active'
            AND      
         ST_DWithin(location,ST_MakePoint(?,?)::geography,b.delivery_radius*1000) ;   
        `,[lng,lat])
     return result.rows
    }

    async getBranchById(branchId: number,conn=db) {
      const [result] =   await conn('restaurant_branch').select('*').where('id', branchId)
      if (result != undefined) {
          return RestaurantBranch.toEntity(result)
      }
      throw new AppError('No restaurant branches found with that id')

    }

    async updateBranch(branch: RestaurantBranch,conn=db) {
      return await  conn('restaurant_branch').
           update(branch).
           where('id', branch.id).returning('id');

    }

    async findAllByRestaurantId(restaurantId: number,conn=db) {
       const result = await conn('restaurant_branch').
       join('restaurants', 'restaurant_branch.restaurant_id', '=', 'restaurants.id')
           .where('restaurant_branch.restaurant_id', restaurantId)
           .select('restaurant_branch.*')
       return  result.map(RestaurantBranch.toEntity);
    }
    async findAllBranchesByOwnerId(ownerId:number,conn=db) {
        const result = await conn('restaurant_branch')
            .join('restaurants','restaurant_branch.restaurant_id', '=', 'restaurants.id')
            .where('owner_id', ownerId)
        .select('restaurant_branch.id as branchId')
        return result.map((r) => Number(r.branchId))
    }
}

export const restaurantBranchRepository = new RestaurantBranchRepository();