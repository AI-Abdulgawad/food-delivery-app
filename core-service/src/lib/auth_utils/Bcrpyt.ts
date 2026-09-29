import bcrypt from "bcrypt";
import {AppError} from "../error_handler/app_error.js";

export const hashPassword = async (password:string)=> {
   return  await bcrypt.hash(password, 10);
}

export const validatePassword = async (password:string,hashedPassword:string):Promise<boolean> => {
    try {

    return await bcrypt.compare(password, hashedPassword);
    }catch (err) {
        throw new AppError('Wrong Password',false,401);
    }
}