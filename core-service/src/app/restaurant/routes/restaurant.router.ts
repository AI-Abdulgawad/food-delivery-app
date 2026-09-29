import express from "express";
import {restaurantController} from "../controller/restaurant.controller.js";
import {authenticate} from "../../../lib/filters/authenticate.js";
import {RBACAction, rbacGuard, RBACResource} from "../../../lib/filters/restuarant_rbac.js";
import {requireRestaurantMember} from "../../../lib/filters/require_restaurant_member.js";


export const restaurantRouter = express.Router();

restaurantRouter.get('/:id',restaurantController.getRestaurant.bind(restaurantController));

restaurantRouter.get('/',restaurantController.getAllRestaurant.bind(restaurantController));

restaurantRouter.post('/',authenticate,rbacGuard.requireAdminAccess,restaurantController.addRestaurant.bind(restaurantController));

restaurantRouter.patch('/:id/:status',authenticate,rbacGuard.requireAdminAccess,restaurantController.updateStatus.bind(restaurantController));

restaurantRouter.patch('/:id',authenticate,requireRestaurantMember('id'),
            rbacGuard.restaurantRbac({resource:RBACResource.restaurant,action:RBACAction.UPDATE}),
            restaurantController.updateRestaurantInfo.bind(restaurantController));