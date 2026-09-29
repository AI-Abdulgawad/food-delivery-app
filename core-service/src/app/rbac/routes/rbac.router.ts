import {Router} from "express";
import {branchMemberController} from "../controller/branch-member.controller.js";
import {authenticate} from "../../../lib/filters/authenticate.js";
import {requireRestaurantMember} from "../../../lib/filters/require_restaurant_member.js";
import {RBACAction, rbacGuard, RBACResource} from "../../../lib/filters/restuarant_rbac.js";


export const rbacRouter = Router();
rbacRouter.post('/restaurants/:restaurantId/members',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource: RBACResource.member,action: RBACAction.CREATE}),branchMemberController.addBranchMember.bind(branchMemberController));
rbacRouter.get('/restaurants/:restaurantId/members',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource: RBACResource.member,action: RBACAction.READ}),branchMemberController.listmembers.bind(branchMemberController));
rbacRouter.patch('/restaurants/:restaurantId/members/:memberId',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource: RBACResource.member,action: RBACAction.UPDATE}),branchMemberController.updateMember.bind(branchMemberController));
rbacRouter.delete('/restaurants/:restaurantId/members/:memberId',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource: RBACResource.member,action: RBACAction.DELETE}),branchMemberController.deleteMember.bind(branchMemberController));
rbacRouter.patch('/restaurants/:restaurantId/members/:memberId/branches',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource: RBACResource.member,action: RBACAction.UPDATE}),branchMemberController.updateMemberBranches.bind(branchMemberController));
rbacRouter.get('/roles/:role/permission',branchMemberController.getRolePermissions.bind(branchMemberController));