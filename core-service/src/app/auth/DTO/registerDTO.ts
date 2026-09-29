import {IsBoolean, IsEmail, IsEnum, IsOptional, IsStrongPassword, MaxLength, MinLength} from "class-validator";
import  {SystemRole} from "../../user/enums/system_role.js";


export class RegisterDTO {

    @IsEmail()
    email!: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols:0
    }, {
        message: "Password must be at least 8 characters and contain uppercase, lowercase and a number"
    })
    password!: string;

    @MinLength(5,{message: 'Name must be at least 5 characters long'})
    name!: string;

    @MinLength(10)
    @MaxLength(11)
    phone!: string;

    @IsEnum(SystemRole)
    role!: SystemRole

    @IsOptional()
    @IsBoolean()
    is_active?:boolean
    constructor() {}
}