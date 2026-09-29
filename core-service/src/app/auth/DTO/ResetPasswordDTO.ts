import {IsNotEmpty, isNotEmpty, isNumber, IsString, IsStrongPassword} from "class-validator";

export class ResetPasswordDTO {
    @IsNotEmpty()
    userId!:number;
    @IsString()
    otp!:string;

    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase:1,
            minNumbers:1,
            minUppercase:1,
            minSymbols:0
        }
    )
    newPassword!:string;


    constructor() {
    }
}