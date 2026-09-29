import {IsBoolean, IsDefined, IsNotEmpty, IsOptional, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import type {ProductDto} from "./product.dto.js";

export class PatchProductDto {

    // product
    @IsOptional()
    @IsNotEmpty()
    name?:string

    @IsOptional()
    @IsNotEmpty()
    description?:string;

    @IsOptional()
    @IsNotEmpty()
    image_url?:string;

    @IsOptional()
    @IsNotEmpty()
    category_name?:string


    // branch
    @IsOptional()
    @IsNotEmpty()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsNotEmpty()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    isAvailable?:boolean;


}
export class UpdateProductBranchDetailsDto {

    @IsOptional()
    @IsNotEmpty()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsNotEmpty()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    isAvailable?:boolean;

    // constructor(stock?:number,price?:number,isAvailable?:boolean) {
    //     this.stock = stock!
    //     this.price = price!
    //     this.isAvailable = isAvailable!
    // }
}


export class UpdateProductDetailsDto {
    // product
    @IsOptional()
    @IsNotEmpty()
    name?:string

    @IsOptional()
    @IsNotEmpty()
    description?:string;

    @IsOptional()
    @IsNotEmpty()
    image_url?:string;

    @IsOptional()
    @IsNotEmpty()
    category_name?:string

    // constructor(name?:string,description?:string,image_url?:string,category_name?:string) {
    //     this.name = name!;
    //     this.description = description!;
    //     this.image_url = image_url!;
    //     this.category_name = category_name!;
    //
    // }
}

