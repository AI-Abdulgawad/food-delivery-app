import {customerAddressService} from "../service/CustomerAddressService.js";

import type {Request,Response,NextFunction} from "express";
import {AppError} from "../../../lib/error_handler/app_error.js";
import  {CustomerAddressDto} from "../DTO/CustomerAddressDto.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {CustomerAddress} from "../Entity/CustomerAddress.js";
import  {CustomerAddressUpdateDto} from "../DTO/CustomerAddressUpdateDto.js";

export class CustomerAddressController {

    async getCustomerAddresses(req: Request, res: Response,next: NextFunction) {
        try {

        const addresses = await customerAddressService.getCustomerAddresses(req.user?.user_id)
        if(addresses != undefined) {
            return res.status(200).json({'addresses': addresses})
        }else {
            return res.status(200).json({'addresses': []})

        }
        }catch (err) {
            next(new AppError("invalid user id"));
        }
    }

    async addCustomerAddress(req: Request, res: Response,next: NextFunction) {
        try {

            const dto:CustomerAddressDto = await validateBody(CustomerAddressDto,req.body)
            console.log("is_default",dto.is_default)
            const customerAddress = await customerAddressService.addCustomerAddress(dto,req.user?.user_id)
            res.status(200).json({'address': customerAddress.id})
        }catch (err) {
            next(err);
        }
    }
    async updateCustomerAddress(req: Request, res: Response,next: NextFunction) {
        try {
         const updateDto:CustomerAddressUpdateDto = await validateBody(CustomerAddressUpdateDto,req.body)
        const addressId = parseInt(req.params.id as string);
        const updatedAddress:CustomerAddress = await customerAddressService.updateCustomerAddress(updateDto, addressId)
        return res.status(200).json({'message':'address updated successfully','address': updatedAddress})

        }catch (err) {
            next(err);
        }
    }

    async deleteCustomerAddress(req: Request, res: Response,next: NextFunction) {

        try {
        const addressId = parseInt(req.params.id as string);
        const deletedAddress = await customerAddressService.deleteCustomerAddress(addressId)
         res.status(200).json({'message': 'deleted','address': addressId})
        }catch (err) {
            next(err);
        }

    }
}

export const customerAddressController = new CustomerAddressController();