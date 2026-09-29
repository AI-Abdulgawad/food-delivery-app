import {IsEmail, IsEnum, IsNotEmpty,} from "class-validator";
import {SystemRole} from "../../user/enums/system_role.js";

export class LoginDTO {


    @IsEmail()
    email!: string;

    @IsNotEmpty()
    password!: string;

    @IsEnum(SystemRole)
    @IsNotEmpty()
    role!:SystemRole

    constructor(){}



}