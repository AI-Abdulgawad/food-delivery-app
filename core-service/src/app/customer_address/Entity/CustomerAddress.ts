import type {AddressType} from "./AddressTypes.js";

export class CustomerAddress {

    id?: number;
    userId!: number;
    latitude!:number;
    longitude! :number;
    is_default! :boolean;
    country! :string;
    building! :string
    city! :string;
    street! :string;
    apartmentNumber! :number;
    type!:AddressType
    label! :string;
    createdAt:Date;
    updatedAt:Date;

    constructor(obj:Partial<CustomerAddress>) {
        this.id = obj.id!;
       this.userId = obj.userId!
       this.latitude = obj.latitude!;
       this.longitude = obj.longitude!;
       this.apartmentNumber = obj.apartmentNumber!;
       this.type = obj.type!;
       this.label = obj.label!;
       this.createdAt = obj.createdAt?? new Date();
       this.updatedAt = obj.updatedAt?? new Date();
       this.is_default = obj.is_default ?? false;
       this.country = obj.country!;
       this.building = obj.building!;
       this.city = obj.city!;
       this.street = obj.street!;
    }
    toRow() {
        return {
            id: this.id,
            user_id: this.userId,
            latitude: this.latitude,
            longitude: this.longitude,
            is_default: this.is_default,
            country: this.country,
            building: this.building,
            city: this.city,
            apartment_number: this.apartmentNumber,
            type: this.type,
            label: this.label,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            street: this.street,
        }
    }

    static fromRow(row:any) {
        return new CustomerAddress({
            id: row.id,
            userId: row.user_id,
            latitude: row.latitude,
            longitude: row.longitude,
            is_default: row.is_default,
            country: row.country,
            building: row.building,
            city: row.city,
            apartmentNumber: row.apartment_number,
            type: row.type,
            label: row.label,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            street: row.street,

        });
    }


}