import  {Currency} from "../entity/currency.enum.js";
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max
} from "class-validator";

export class UpdateBranchDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    label?:string


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address_text?:string

    @IsOptional()
    @IsNotEmpty()
    @IsLatitude()
    latitude?:number

    @IsOptional()
    @IsNotEmpty()
    @IsLongitude()
    longitude?:number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    opens_at?:string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    closes_at?:string

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Max(5)
    delivery_radius?:number

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Currency)
    currency?:Currency

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    accepting_orders?:boolean


}