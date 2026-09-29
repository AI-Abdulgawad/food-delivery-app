import type {Permission} from "../entity/permission.entity.js";
import {db} from "../../../lib/knex/knex.js";

class RolePermissionRepo {


    async getPermissionsByRoleName(roleName:string,conn=db):Promise<string[]> {
       const result =  await conn('role_permissions').
        join('permissions','permissions.id','=','role_permissions.permission_id')
       .join('restaurant_roles','restaurant_roles.id','=','role_permissions.role_id')
        .select('permissions.resource AS resource','permissions.action AS action')
            .where('restaurant_roles.name',roleName)
        return result.map((row) => `${row.resource}:${row.action}`)
    }
    async findRoleNameByUserId(userId:number,conn=db):Promise<string> {
        const result  = await conn('restaurant_roles').
        join('restaurant_members','restaurant_members.role_id','=','restaurant_roles.id')
            .select('restaurant_roles.name as roleName')
            .where('restaurant_members.user_id',userId)
        return result[0].roleName
    }
    async findRoleIdByRoleName(roleName:string,conn=db):Promise<number> {
        const result  = await conn('restaurant_roles').select('id').where('name',roleName).first()
        return Number(result.id)
    }



}
export const rolePermissionRepo = new RolePermissionRepo();