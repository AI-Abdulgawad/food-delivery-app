import  {AddressType} from "../Entity/AddressTypes.js";
import {IsEnum, IsNotEmpty} from "class-validator";

export class CustomerAddressDto {

    @IsNotEmpty()
    latitude!:number;
    @IsNotEmpty()
    longitude! :number;

    @IsNotEmpty()
    is_default! :boolean;

    @IsNotEmpty()
    country! :string;

    @IsNotEmpty()
    building! :string

    @IsNotEmpty()
    city! :string;

    @IsNotEmpty()
    apartmentNumber! :number;

    @IsEnum(AddressType)
    @IsNotEmpty()
    type!:AddressType

    @IsNotEmpty()
    label! :string;



}