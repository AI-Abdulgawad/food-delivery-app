import {IsInt, IsNotEmpty, IsOptional} from "class-validator";

export class ProductDto {

    @IsNotEmpty()
    name!:string

    @IsNotEmpty()
    description!:string

    @IsNotEmpty()
    image_url!:string

    // @IsNotEmpty()
    // @IsInt()
    // restaurant_id!:number

    @IsOptional()
    @IsNotEmpty()
    category_name?:string
}