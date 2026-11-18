import type {User} from "../entity/user_entity.js";
import {userRepository} from "../repository/UserRepository.js";
import {type JwtPayload, verifyAccessToken} from "../../../lib/auth_utils/jwt_utils.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {hashPassword} from "../../../lib/auth_utils/Bcrpyt.js";
import {injectable} from "tsyringe";
import {db} from "../../../lib/knex/knex.js";

@injectable()
export class UserService {

    async addUser(user:User,trx=db):Promise<User> {
        return await userRepository.createUser(user,trx);
    }

    async findUserByEmailOrPhone(email:string,phone:string,trx=db):Promise<Boolean> {
        return await userRepository.findUserByEmailOrPhone(email,phone,trx)
    }

    async findUserByEmail(email: string, trx=db) {
        return userRepository.findUserByEmail(email,trx)
    }

   getUserInfo(token:string): JwtPayload {
        try {
            const payload = verifyAccessToken(token??'')
            console.log("payload",payload)
          return payload

        }catch (error){
            console.log("error",error)
            throw new AppError('access Token is invalid');
        }
  }

    async updateUserPassword(userId:number,newPassword:string) {
        const newHash = await hashPassword(newPassword)
        return userRepository.addUpdatedUser(userId,newHash)





    }

}

export const userService = new UserService();