import {IsNotEmpty, IsPhoneNumber, Max, MaxLength, MinLength} from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    name!:string;

    @MinLength(10)
    @MaxLength(11)
    phone!:string;

}