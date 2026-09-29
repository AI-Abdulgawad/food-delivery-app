import {container} from "tsyringe";
import {TOKENS} from "./tokens.js";
import {AuthController} from "../../app/auth/controller/auth_controller.js";
import {UserController} from "../../app/user/controller/user.controller.js";
import {ProductController} from "../../app/product/controller/product.controller.js";
import {RestaurantController} from "../../app/restaurant/controller/restaurant.controller.js";
import {RestaurantBranchController} from "../../app/restaurant_branch/controller/restaurant_branch.controller.js";
import {CustomerAddressController} from "../../app/customer_address/controller/CustomerAddressController.js";
import {BranchMemberController} from "../../app/rbac/controller/branch-member.controller.js";
import {AuthService} from "../../app/auth/service/AuthService.js";
import {UserService} from "../../app/user/service/user.service.js";
import {ProductService} from "../../app/product/service/product.service.js";
import {RestaurantService} from "../../app/restaurant/service/restaurant.service.js";
import {RestaurantBranchService} from "../../app/restaurant_branch/service/restaurantBranch.service.js";
import {CustomerAddressService} from "../../app/customer_address/service/CustomerAddressService.js";
import {BranchMemberService} from "../../app/rbac/service/branch-memebr.service.js";

// controllers
container.registerSingleton(TOKENS.AuthController,AuthController)
container.registerSingleton(TOKENS.UserController,UserController)
container.registerSingleton(TOKENS.ProductController,ProductController)
container.registerSingleton(TOKENS.RestaurantController,RestaurantController)
container.registerSingleton(TOKENS.RestaurantBranchController,RestaurantBranchController)
container.registerSingleton(TOKENS.CustomerAddressController,CustomerAddressController)
container.registerSingleton(TOKENS.BranchMemberController,BranchMemberController)





// services
container.registerSingleton(TOKENS.AuthService,AuthService)
container.registerSingleton(TOKENS.UserService,UserService)
container.registerSingleton(TOKENS.ProductService,ProductService)
container.registerSingleton(TOKENS.RestaurantService,RestaurantService)
container.registerSingleton(TOKENS.RestaurantBranchService,RestaurantBranchService)
container.registerSingleton(TOKENS.CustomerAddressService,CustomerAddressService)
container.registerSingleton(TOKENS.BranchMemberService,BranchMemberService)

