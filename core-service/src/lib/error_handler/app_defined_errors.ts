import {AppError} from "./app_error.js";

export const userAlreadyExistException = new AppError('userAlreadyExist',false,400);
export const IncorrectCredentialsException = new AppError('IncorrectCredentials',false,401);