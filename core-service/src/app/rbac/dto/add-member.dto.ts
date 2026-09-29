import {IsArray, IsDefined, IsEmail, IsEnum, IsStrongPassword, MaxLength, MinLength} from "class-validator";
import {RegisterDTO} from "../../auth/DTO/registerDTO.js";
import { RestaurantRoleType} from "../rbac.enums.js";

export class AddMemberDto extends RegisterDTO{

    @IsDefined()
    @IsArray()
    branchId?:number[]

    @IsEnum(RestaurantRoleType)
    restaurantRole!:RestaurantRoleType

}