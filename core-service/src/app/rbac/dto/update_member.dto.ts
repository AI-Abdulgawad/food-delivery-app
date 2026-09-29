import {IsEnum, IsOptional} from "class-validator";
import {MemberStatus, RestaurantRoleType} from "../rbac.enums.js";

export class UpdateMemberDto {

    @IsOptional()
    @IsEnum(RestaurantRoleType)
    role?:RestaurantRoleType;

    @IsOptional()
    @IsEnum(MemberStatus)
    status?:MemberStatus;

}