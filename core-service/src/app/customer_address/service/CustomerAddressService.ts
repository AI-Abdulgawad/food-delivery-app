import {customerAddressRepository} from "../repository/CustomerAddressRepo.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {CustomerAddress} from "../Entity/CustomerAddress.js";
import type {CustomerAddressDto} from "../DTO/CustomerAddressDto.js";
import type {CustomerAddressUpdateDto} from "../DTO/CustomerAddressUpdateDto.js";

export class CustomerAddressService {


    async getCustomerAddresses(user_id: number | undefined) {
        if (user_id !== undefined) {

        return await customerAddressRepository.getCustomerAddresses(user_id)
        }
        throw new AppError("customer id is invalid");
    }
    async addCustomerAddress(dto: CustomerAddressDto, user_id: number | undefined) {

        const customerAddress:CustomerAddress = new CustomerAddress(dto);
        customerAddress.userId = user_id!

        return await customerAddressRepository.insertCustomerAddress(customerAddress)

    }

        async updateCustomerAddress(dto: CustomerAddressUpdateDto, addressId: number) {
        // 1. check the existnace of the address
        const customerAddress =  await customerAddressRepository.findAddressById(addressId)
        if (!customerAddress) {
            throw new AppError("customer address does not exist")
        }
        // update customer address
        const updatedAddress:CustomerAddress = Object.assign(customerAddress, dto)
         return await customerAddressRepository.updateAddress(updatedAddress)
    }

    async deleteCustomerAddress(addressId: number) {
        return await customerAddressRepository.deleteCustomerAddressById(addressId)
    }
}

export const customerAddressService = new CustomerAddressService();