import type {NextFunction, Request, RequestHandler, Response} from "express";
import {verifyAccessToken} from "../auth_utils/jwt_utils.js";
import {SystemRole} from "../../app/user/enums/system_role.js";
import {permissionCacheService} from "../../app/rbac/service/permission-cache.service.js";

export enum RBACResource {
    product='core:product',
    restaurant='core:restaurant',
    branch='core:branch',
    member='core:member'

}
export enum RBACAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    READ = 'read'
}


export interface RBACOptions {
    resource:RBACResource;
    action:RBACAction
}
class RBAC {
    restaurantRbac(options: RBACOptions): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.user?.role === SystemRole.ADMIN) {
                next()
            }
            if (req.restaurantUser && req.user?.role === SystemRole.RESTAURANT_USER) {
                const permissions = await permissionCacheService.getPermissionsByRoleName(req.restaurantUser.roleName!)
                const hasAccess = permissionCacheService.hasPermission(permissions, options.resource, options.action)
                if (hasAccess) {
                    next()
                } else {
                    return res.status(403).send("permission denied")
                }

            }

            return res.status(401).send("Not authorized")

        }


    }

    requireAdminAccess(req: Request, res: Response, next: NextFunction){
        if (req.user?.role === SystemRole.ADMIN) {
            next()
        }
        return res.status(403).send("permission denied")
}


}
export const rbacGuard: RBAC = new RBAC();

