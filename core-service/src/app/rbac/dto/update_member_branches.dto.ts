import {IsArray, IsDefined, IsNotEmpty} from "class-validator";

export class UpdateMemberBranchesDto {

    @IsArray()
    @IsDefined()
    @IsNotEmpty()
    branchId!:number[]
}