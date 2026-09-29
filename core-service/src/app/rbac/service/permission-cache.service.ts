import type {MemberAccessRepo} from "../repository/member-access.repo.js";
import type {Permission} from "../entity/permission.entity.js";
import {TimeUtils} from "../../../pkg/time/time-utils.js";
import {rolePermissionRepo} from "../repository/role-permission.repo.js";

export class PermissionCacheService {
    private cache: Map<string,{permissions:string[],cachedAt:number}> = new Map();
    readonly  TTL= TimeUtils.toMS(1,'h')

     async getPermissionsByRoleName(roleName:string):Promise<string[]> {
        const cached = this.cache.get(roleName)
        if(cached && Date.now() - cached.cachedAt < this.TTL) {
            return cached.permissions
        }
        const permissions = await rolePermissionRepo.getPermissionsByRoleName(roleName);
        this.cache.set(roleName,{permissions,cachedAt:Date.now()})
         return permissions;

    }
    hasPermission(permissions:string[],resource:string,action:string) {
        return permissions.includes(`${resource}:${action}`);
    }

}

export const permissionCacheService = new PermissionCacheService();