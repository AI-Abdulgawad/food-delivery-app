import {Router} from "express";
import {restaurantBranchController} from "../controller/restaurant_branch.controller.js";
import {authenticate} from "../../../lib/filters/authenticate.js";
import {requireBranchMember} from "../../../lib/filters/require_branch_member.js";
import {requireRestaurantMember} from "../../../lib/filters/require_restaurant_member.js";
import {RBACAction, rbacGuard, RBACResource} from "../../../lib/filters/restuarant_rbac.js";


export const restaurantBranchRouter =  Router();

// create new branch
restaurantBranchRouter.post('/:restaurantId',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource:RBACResource.branch,action:RBACAction.CREATE}),restaurantBranchController.createBranch.bind(restaurantBranchController));

// get nearBy branches
restaurantBranchRouter.get('/nearby',restaurantBranchController.nearbyBranches.bind(restaurantBranchController));

// get all branches related to one restaurant
restaurantBranchRouter.get('/restaurant/:restaurantId',restaurantBranchController.getAllRestaurantBranches.bind(restaurantBranchController));

// update branch info
restaurantBranchRouter.patch('/:id',authenticate,requireBranchMember('branchId'),rbacGuard.restaurantRbac({resource:RBACResource.branch,action:RBACAction.UPDATE}),restaurantBranchController.updateBranch.bind(restaurantBranchController))

// update branch status
restaurantBranchRouter.patch('/:id/status',authenticate,rbacGuard.requireAdminAccess,restaurantBranchController.updateBranchStatus.bind(restaurantBranchController))
