import  {RestaurantMember} from "../entity/resturant_member.entity.js";
import {db} from "../../../lib/knex/knex.js";
import {memberAccessRepo} from "./member-access.repo.js";
import type {MemberStatus} from "../rbac.enums.js";

export class RestaurantMemberRepo {

    async addRestaurantMember(member:RestaurantMember,conn=db)
    {
       const [result] = await  conn('restaurant_members').insert(member).returning('id');

        return result.id as number;
    }


    async activate(user_id: number,conn=db)
    {
        const [result] = await  conn('restaurant_members').update('status','active')
            .where('user_id',user_id)
            .returning('id');
        return result.id as number;
    }

    async findMembersByRestaurantId(restaurantId:number,conn=db)
    {
         const members =  await conn('restaurant_members').where('restaurant_id',restaurantId).select('*');
         return members.map(RestaurantMember.toEntity)
    }

    async findMemberWithRoleName(memberId:number,conn=db)
    {
        const [result] = await conn('restaurant_members')
            .join('restaurant_roles','restaurant_roles.id','=','restaurant_members.role_id')
            .where('restaurant_members.id',memberId)
            .select('restaurant_members.*','restaurant_roles.name');
        const member = new RestaurantMember({
            id: result.id,
            user_id: result.user_id,
            restaurant_id: result.restaurant_id,
            role_id: result.role_id,
            status: result.status,
            created_at: result.created_at,
            updated_at: result.updated_at,

        })
        const roleName = result.role_name;
        return {member, roleName};
    }

    async deleteMember(memberId:number,conn=db) {
        return await db.transaction(async (trx)=> {

             await memberAccessRepo.deleteMemberAccess(memberId,trx);
            const [result] = await trx('restaurant_members').where('id',memberId).delete().returning('id');
            return result.id as number;
        })
    }

    async updateMemberRole(memberId:number,roleId:number,conn=db,updatedAt= new Date()) {
        const [result] = await  conn('restaurant_members').update('role_id',roleId)
            .where('id',memberId)
            .update('updated_at',updatedAt)
            .returning('id');
        return result.id as number;
    }

    async updateMemberStatus(memberId:number,status:MemberStatus,conn=db,updatedAt=new Date()) {
        const [result] = await  conn('restaurant_members').update('status',status)
            .update('updated_at',updatedAt)
            .where('id',memberId)
            .returning('id');
        return result.id as number;
    }
}
export const restaurantMemberRepo = new RestaurantMemberRepo();