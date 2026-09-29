import {Router} from "express";
import {healthRouter} from "./app/health/health.routes.js";
import {authRouter} from "./app/auth/router/auth.route.js";
import {userRouter} from "./app/user/route/user.route.js";
import {customerAddressRouter} from "./app/customer_address/routes/CustomerAddressRouter.js";
import {restaurantRouter} from "./app/restaurant/routes/restaurant.router.js";
import {restaurantBranchRouter} from "./app/restaurant_branch/routes/restaurant_branch.router.js";
import {productRouter} from "./app/product/routes/product.routes.js";
import {rbacRouter} from "./app/rbac/routes/rbac.router.js";

export const appRouter = Router()

appRouter.use('/', healthRouter)
appRouter.use('/auth', authRouter)
appRouter.use('/user', userRouter)
appRouter.use('/customer', customerAddressRouter)
appRouter.use('/restaurant', restaurantRouter)
appRouter.use('/branch', restaurantBranchRouter)
appRouter.use('/product', productRouter)
appRouter.use('/rbac',rbacRouter)