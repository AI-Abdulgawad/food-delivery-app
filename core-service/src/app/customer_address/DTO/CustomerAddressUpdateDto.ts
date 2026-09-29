import  {AddressType} from "../Entity/AddressTypes.js";
import {IsEnum, IsNotEmpty} from "class-validator";

export class CustomerAddressUpdateDto {

    @IsNotEmpty()
    label!: string

    @IsNotEmpty()
    country!: string

    @IsNotEmpty()
    city!: string

    @IsNotEmpty()
    street!: string

    @IsNotEmpty()
    building!: number

    @IsNotEmpty()
    apartmentNumber!: number

    @IsNotEmpty()
    @IsEnum(AddressType)
    type!: AddressType

    @IsNotEmpty()
    latitude!: number

    @IsNotEmpty()
    longitude!: number


}