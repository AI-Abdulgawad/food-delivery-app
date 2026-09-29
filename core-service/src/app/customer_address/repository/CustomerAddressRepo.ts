import {db} from "../../../lib/knex/knex.js";
import {CustomerAddress} from "../Entity/CustomerAddress.js";
import {CustomerAddressUpdateDto} from "../DTO/CustomerAddressUpdateDto.js";

class CustomerAddressRepository  {


    async getCustomerAddresses(user_id: number ) {
       const addressList =  await db('customer_address').select("*").where("user_id", user_id).returning("*");
        const addresses:CustomerAddress[] = addressList.map(CustomerAddress.fromRow);
        return addresses;
    }
    async insertCustomerAddress(customerAddress: CustomerAddress) {
        const [InsertedRow] = await db('customer_address').insert(customerAddress.toRow()).returning('*');
        return CustomerAddress.fromRow(InsertedRow)
    }

    async findAddressById(addressId: number) {
        const address =  await db('customer_address').select("*").where("id", addressId).returning("*").first();
        if (address == undefined) {
            return undefined
        }
        return CustomerAddress.fromRow(address);
    }

    async updateAddress(updatedAddress:CustomerAddress) {
        updatedAddress.updatedAt = new Date();
        const [result] =  await db('customer_address').update(updatedAddress.toRow())
            .where("id", updatedAddress.id)
            .returning('*')
        return CustomerAddress.fromRow(result)
    }

   async deleteCustomerAddressById(addressId: number) {
       const [deleted] = await  db('customer_address').delete().where("id", addressId).returning('*')
        return deleted == undefined ? undefined: CustomerAddress.fromRow(deleted)
    }
}
export const customerAddressRepository = new CustomerAddressRepository();