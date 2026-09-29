import  {RestaurantStatus} from "../entity/restaurant_status_types.js";
import {IsEnum, IsNotEmpty, IsNumber, MinLength} from "class-validator";

export class AddRestaurantDto {


    @IsNumber()
    @IsNotEmpty()
    owner_id!:number;

    @IsNotEmpty()
    @MinLength(3)
    name!:string;

    @IsNotEmpty()
    primary_country!:string;

    @IsEnum(RestaurantStatus)
    @IsNotEmpty()
    status!:RestaurantStatus


    @IsNotEmpty()
    logo_url!:string;




}