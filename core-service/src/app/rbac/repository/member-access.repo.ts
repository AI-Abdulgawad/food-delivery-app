import  {MemberAccess} from "../entity/member_access.entity.js";
import {db} from "../../../lib/knex/knex.js";
import {MemberStatus} from "../rbac.enums.js";

export class  MemberAccessRepo{


    async addMemberBranchAccess(memberAccess:MemberAccess[],conn=db) {
           return await conn('members_access').insert(memberAccess).returning('*');

    }
    async getAccessibleBranchesByUserId(userId:number,conn=db){
        const result = await conn('members_access').
          join('restaurant_members',"members_access.member_id","=",'restaurant_members.id')
        .where('restaurant_members.user_id', userId)
            .where('restaurant_members.status', MemberStatus.ACTIVE)
            .select('members_access.branch_id as branch_id , restaurant_members.restaurant_id as restaurant_id')

            const branchId:number[] = []
            const restaurantId:number[] = []

        result.forEach((row)=> {
            restaurantId.push(Number(row.restaurant_id))
            branchId.push(Number(row.branch_id))
        })
        return {branchId, restaurantId}
    }

    async deleteMemberAccess(memberId:number,conn=db) {
        return await conn('members_access').where('members_access.member_id', memberId).delete()
    }


}
export const memberAccessRepo = new MemberAccessRepo();