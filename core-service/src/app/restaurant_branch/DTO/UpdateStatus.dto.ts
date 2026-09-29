import {IsBoolean, IsNotEmpty, IsOptional, Max} from "class-validator";

export class UpdateBranchStatusDto {


    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    is_active?:boolean;

    @IsOptional()
    @IsNotEmpty()
    @Max(20)
    commission?:number



}