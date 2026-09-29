import {IsNotEmpty, IsOptional} from "class-validator";


export class UpdateRestaurantInfoDto {

     @IsOptional()
     @IsNotEmpty()
     name?: string

     @IsOptional()
     @IsNotEmpty()
     logo_url?: string

     @IsOptional()
     @IsNotEmpty()
     primary_country?:string

}