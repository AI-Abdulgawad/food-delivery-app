import type {RegisterDTO} from "../DTO/registerDTO.js";
import {User} from "../../user/entity/user_entity.js";
import {
    IncorrectCredentialsException,
    userAlreadyExistException
} from "../../../lib/error_handler/app_defined_errors.js";
import {hashPassword, validatePassword} from "../../../lib/auth_utils/Bcrpyt.js";
import {userService} from "../../user/service/user.service.js";
import type {LoginDTO} from "../DTO/login_dto.js";
import {
    generateAccessToken,
    generateRefreshToken,
    type JwtPayload,
    verifyRefreshToken
} from "../../../lib/auth_utils/jwt_utils.js";
import type {ForgetPasswordDTO} from "../DTO/forgetPassword.js";
import {generateOTP, generateOTPHash, validateOTPHash} from "../../../lib/auth_utils/otp.js";
import {passwordResetRepo} from "../respository/password.reset.repo.js";
import {PasswordReset} from "../entity/password_reset_entity.js";
import type {ResetPasswordDTO} from "../DTO/ResetPasswordDTO.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import type {UpdateUserDto} from "../../user/UpdateUserDto.js";
import {userRepository} from "../../user/repository/UserRepository.js";
import {SystemRole} from "../../user/enums/system_role.js";
import {restaurantService} from "../../restaurant/service/restaurant.service.js";
import {branchMemberService} from "../../rbac/service/branch-memebr.service.js";
import {rolePermissionRepo} from "../../rbac/repository/role-permission.repo.js";
import {restaurantBranchService} from "../../restaurant_branch/service/restaurantBranch.service.js";
import {RestaurantRoleType} from "../../rbac/rbac.enums.js";


export interface Tokens {
    access_token: string;
    refresh_token: string;
}


export class AuthService {

    constructor() {

    }
    async registerUser(registerDTO:RegisterDTO) {

        // 1. CHECK if user exists
        const isExist = await userService.findUserByEmailOrPhone(registerDTO.email,registerDTO.phone)
        if(isExist){
            throw userAlreadyExistException
        }
        // 2. hash user password
        const hashedPassword = await hashPassword(registerDTO.password);

        const user:User = new User({
            email: registerDTO.email,
            phone: registerDTO.phone,
            passwordHash: hashedPassword,
            name: registerDTO.name,
            system_role: registerDTO.role,
            // is_active: registerDTO.is_active ?? true
        })

        const savedUser:User = await userService.addUser(user)

        return {
                userId: savedUser.id,
                username:savedUser.name,
                userEmail: savedUser.email
            }



    }
    async loginUser(data:LoginDTO):Promise<Object> {

        // get user data from db
        const user:User = await userService.findUserByEmail(data.email)
        if(user.passwordHash.trim().length === 0) {
            throw new AppError("This user is disabled")
        }

        const isValid  = await validatePassword(data.password,user.passwordHash)
        if(!isValid){
            throw IncorrectCredentialsException
        }
            let restaurantsId:number[] = []
            let branchesId:number[] = []
            let roleName;
            if(data.role === SystemRole.RESTAURANT_USER)
            {
                restaurantsId =  await restaurantService.findRestaurantsIdOfOwner(user.id)
                if(restaurantsId.length > 0) {
                    branchesId= await restaurantBranchService.findAllBranchesByOwnerId(user.id)
                    roleName = RestaurantRoleType.OWNER
                }else  {
                 const memberBranches = await branchMemberService.getAccessibleBranchesByUserId(user.id)
                    restaurantsId=memberBranches.restaurantId
                    branchesId= memberBranches.branchId
                roleName = await rolePermissionRepo.findRoleNameByUserId(user.id)

                }


            }


            const payload:JwtPayload = {
                email: user.email, userId: user.id.toString(), role: user.system_role,
                phone:user.phone, name: user.name,
                restaurantId: restaurantsId,
                branchId:branchesId,
                restaurantRoleName: roleName!,

            }
            const accessToken = generateAccessToken(payload)
            const refreshToken = generateRefreshToken(payload)
        return {access_token: accessToken, refresh_token: refreshToken}
        }


    async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO) {
        const user = await userService.findUserByEmail(forgetPasswordDTO.email)
        if(user){
            const otp = generateOTP()
            console.log("otp",otp)
            const otpHash = generateOTPHash(otp)
            const passwordReset = new PasswordReset({
                userId: user.id,
                otpHash: otpHash,
                createdAt: new Date(),
                expiryDate: new Date(Date.now() + (2*60*1000)),

            })
            const id = await passwordResetRepo.addPasswordReset(passwordReset)
        }
        return
    }

    async checkOTP(dto: ResetPasswordDTO) {
       const passwordReset = await passwordResetRepo.retrievePasswordReset(dto.userId)
        if(!passwordReset) {
            throw new AppError('user_id dos not exist')
        }
        const isIdentical = validateOTPHash(parseInt(dto.otp,10),passwordReset.otpHash)
        if(isIdentical){
            if(!passwordReset.isExpired() && passwordReset.consumedAt === null) {
                   const result = await passwordResetRepo.consumeOTP(passwordReset)
                    if(!result){
                        throw new AppError('Error updating OTP consumed_at')
                    }
                    return userService.updateUserPassword(dto.userId,dto.newPassword)
            }else {
                throw new AppError('OTP EXPIRED')
            }
        }else {
            throw new AppError('Wrong password')
        }

    }

    refreshToken(refreshToken: string) {
        const payload = verifyRefreshToken(refreshToken)
        if(!payload){
            throw new AppError('Refresh token is invalid')
        }
        const newPayload:JwtPayload = {
            userId:payload.userId,
            email:payload.email,
            name: payload.name,
            phone:payload.email,
            role:payload.role,
        }
        const accessToken = generateAccessToken(newPayload)
        const newRefreshToken = generateRefreshToken(newPayload)
        return {access_token: accessToken, refresh_token: newRefreshToken}

    }

    async updateUser(dto: UpdateUserDto, userId: number) {
        return await userRepository.updateNameAndPhone(userId,dto.name,dto.phone)
    }

    async acceptInvite(resetPasswordDto: ResetPasswordDTO) {

        const user = await this.checkOTP(resetPasswordDto)
        const restaurantMemberId = await branchMemberService.activateRestaurantMember(user.id)
        return {
            user:User.toEntity(user),
            memberId: restaurantMemberId,
        }

    }
}
export const authService = new AuthService();