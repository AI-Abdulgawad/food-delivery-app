import express from "express";
import {verifyAccessToken} from "../../../lib/auth_utils/jwt_utils.js";
import {customerAddressService} from "../service/CustomerAddressService.js";
import {customerAddressController} from "../controller/CustomerAddressController.js";
import {authenticate} from "../../../lib/filters/authenticate.js";


export const customerAddressRouter = express.Router();
customerAddressRouter.get("/address",authenticate,customerAddressController.getCustomerAddresses.bind(customerAddressService));
customerAddressRouter.post("/address",authenticate,customerAddressController.addCustomerAddress.bind(customerAddressService) );
customerAddressRouter.patch("/address/:id",authenticate,customerAddressController.updateCustomerAddress.bind(customerAddressService) );
customerAddressRouter.delete("/address/:id",authenticate,customerAddressController.deleteCustomerAddress.bind(customerAddressService) );