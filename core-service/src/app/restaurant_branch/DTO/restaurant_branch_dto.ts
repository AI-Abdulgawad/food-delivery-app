import type {Currency} from "../entity/currency.enum.js";
import {IsNotEmpty, Max, MaxLength, MinLength} from "class-validator";

export class RestaurantBranchDto {

    @MinLength(3)
    @MaxLength(20)
    name!: string;
    @IsNotEmpty()
    opens_at!: string;

    @IsNotEmpty()
    closes_at!: string;

    @IsNotEmpty()
    latitude!:number;

    @IsNotEmpty()
    longitude!:number;

    // @IsNotEmpty()
    // restaurant_id!:number;

    @IsNotEmpty()
    country_code!:string;

    @IsNotEmpty()
    address_text!:string;
    @IsNotEmpty()
    label!:string;




    is_active!:boolean;
    accepting_orders!:boolean;

    @IsNotEmpty()
    @Max(5)
    delivery_radius!:number;

    @IsNotEmpty()
    currency!:Currency

    @IsNotEmpty()
    commission!:number;
}