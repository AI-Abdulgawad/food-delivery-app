import {Router} from "express";
import {productController} from "../controller/product.controller.js";
import {authenticate} from "../../../lib/filters/authenticate.js";
import {requireRestaurantMember} from "../../../lib/filters/require_restaurant_member.js";
import {RBACAction, rbacGuard, RBACResource} from "../../../lib/filters/restuarant_rbac.js";


export const productRouter = Router()

productRouter.get("/categories/:restaurantId",productController.categoriesPerRestaurant.bind(productController))
productRouter.get("/branches/:branchId",productController.productsPerBranch.bind(productController))
productRouter.get("/restaurants/:restaurantId",productController.productsPerRestaurant.bind(productController))
productRouter.get("/:productId",productController.singleProduct.bind(productController))
productRouter.post('/restaurants/:restaurantId/products',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource:RBACResource.product,action: RBACAction.CREATE}),productController.addProduct.bind(productController))
productRouter.patch('/:productId',authenticate,requireRestaurantMember('restaurantId'),rbacGuard.restaurantRbac({resource:RBACResource.product,action: RBACAction.UPDATE}),productController.patchProduct.bind(productController))
