import type {AddMemberDto} from "../dto/add-member.dto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {restaurantMemberRepo} from "../repository/restuarant-member.repo.js";
import {RestaurantMember} from "../entity/resturant_member.entity.js";
import {MemberStatus, RestaurantRoleType} from "../rbac.enums.js";
import {MemberAccess} from "../entity/member_access.entity.js";
import {memberAccessRepo} from "../repository/member-access.repo.js";
import {userRepository} from "../../user/repository/UserRepository.js";
import {User} from "../../user/entity/user_entity.js";
import {db} from "../../../lib/knex/knex.js";

import {passwordResetRepo} from "../../auth/respository/password.reset.repo.js";
import {PasswordReset} from "../../auth/entity/password_reset_entity.js";
import {generateOTP, generateOTPHash} from "../../../lib/auth_utils/otp.js";
import {userAlreadyExistException} from "../../../lib/error_handler/app_defined_errors.js";
import {restaurantBranchRepository} from "../../restaurant_branch/repository/restaurantBranch.repository.js";
import {rolePermissionRepo} from "../repository/role-permission.repo.js";
import type {UpdateMemberDto} from "../dto/update_member.dto.js";
import {SystemRole} from "../../user/enums/system_role.js";
import {restaurantBranchService} from "../../restaurant_branch/service/restaurantBranch.service.js";
import type {UpdateMemberBranchesDto} from "../dto/update_member_branches.dto.js";
import {permissionCacheService} from "./permission-cache.service.js";

export class BranchMemberService {

    async addRestaurantBranchMember(restaurantId: number, dto: AddMemberDto) {

        return await  db.transaction(async (trx)=> {  // 1. Create new user with no password



            // 1. create restaurant user
            const exists = await userRepository.findUserByEmailOrPhone(dto.email,dto.phone)
            if(exists){
                throw userAlreadyExistException

            }
            const userId = (await userRepository.createUser(new User({
                email: dto.email,
                passwordHash: '',
                name: dto.name,
                phone: dto.phone,
                system_role: dto.role,

            }),trx)).id
            // 2 password reset entry
            const otp = generateOTP()
            console.log("otp",otp)
            const otpHash = generateOTPHash(otp)
            const passwordReset = new PasswordReset({
                userId,
                otpHash: otpHash,
                createdAt: new Date(),

            })
            await passwordResetRepo.addPasswordReset(passwordReset,trx)
            // 2. add Restaurant Member
            console.log(`rrole${dto.restaurantRole}`)
                const roleId:number = await rolePermissionRepo.findRoleIdByRoleName(dto.restaurantRole)
                console.log('role_id',roleId)
                if(!roleId || isNaN(roleId)){
                    throw new AppError("role does not exist")
                }
                const newMember = new RestaurantMember({
                    user_id: userId,
                    restaurant_id: restaurantId,
                    role_id: roleId,
                    status: MemberStatus.INACTIVE,
                })
                const restaurantMemberId = await restaurantMemberRepo.addRestaurantMember(newMember,trx)

            // 3. assign member to Restaurant Branch
                const availableBranches = (await restaurantBranchRepository.findAllByRestaurantId(restaurantId)).map((b)=> Number(b.id))

                if (dto.branchId && dto.branchId.length > 0)
                {
                    const access: MemberAccess[] = []
                    for (let idx in dto.branchId)
                    {
                        if(availableBranches.includes(dto.branchId[Number(idx)]!))
                        {
                            access.push(new MemberAccess(
                                {
                                    member_id: restaurantMemberId, branch_id: dto.branchId[Number(idx)]!
                                }))
                        }else {
                            throw new AppError('Invalid Branch ID')
                        }
                    }
                    await memberAccessRepo.addMemberBranchAccess(access,trx)
                }else {
                    throw new AppError('branches must be provided')
                }
                return newMember

        })
    }
    async getAccessibleBranchesByUserId(userId:number) {
        return await memberAccessRepo.getAccessibleBranchesByUserId(userId)
    }
    async activateRestaurantMember(user_id: number) {
        return await restaurantMemberRepo.activate(user_id)
    }

    async listRestaurantMembers(restaurantId: number) {
        return await restaurantMemberRepo.findMembersByRestaurantId(restaurantId)
    }

    async updateMember(restaurantId: number,memberId:number, dto: UpdateMemberDto)
    {
        const {member,roleName} = await restaurantMemberRepo.findMemberWithRoleName(memberId)
        console.log(member);

        let count = 0
        if(roleName === RestaurantRoleType.OWNER ) {
            throw new AppError('Owner role can not be updated')
        }

        if(dto.role === RestaurantRoleType.OWNER ) {
            throw new AppError('Owner role can not be updated')
        }


        if(member && member.restaurant_id == restaurantId)
        {
            console.log('valid update member')
            if(dto.role && dto.status)
            {
                 await db.transaction(async (trx)=>{
                    const roleId = await rolePermissionRepo.findRoleIdByRoleName(dto.role!)
                    count+= await restaurantMemberRepo.updateMemberRole(memberId,roleId,trx)
                    count+= await restaurantMemberRepo.updateMemberStatus(memberId,dto.status!,trx)
                })
            }else if(dto.role)
            {
                const roleId = await rolePermissionRepo.findRoleIdByRoleName(dto.role!)

                if(isNaN(roleId))
                {
                    throw new AppError('role does not exist')
                }
                count+= await restaurantMemberRepo.updateMemberRole(memberId,roleId)
            }else if(dto.status)
            {
                count+= await restaurantMemberRepo.updateMemberStatus(memberId,dto.status!)

            }else {
                throw new AppError('Error updating restaurant member')
            }
        }
        return count
    }
    async deleteMember(restaurantId: number,memberId:number,systemRole:SystemRole)
    {
        const {member,roleName} = await restaurantMemberRepo.findMemberWithRoleName(memberId)


        // if((systemRole === SystemRole.ADMIN) && member &&  member.restaurant_id == restaurantId) {
        //     await restaurantMemberRepo.deleteMember(memberId)
        // }
        if(roleName === RestaurantRoleType.OWNER ) {
            throw new AppError('Admin  only can delete Owner')
        }

        if(member && member.restaurant_id == restaurantId)
        {
            return await restaurantMemberRepo.deleteMember(memberId)

        }else {
                throw new AppError('Error deleting restaurant member')
            }
        }
    async updateMemberBranches(restaurantId: number,memberId:number, dto: UpdateMemberBranchesDto)
        {
            const {member,roleName} = await restaurantMemberRepo.findMemberWithRoleName(memberId)
            if(roleName === RestaurantRoleType.OWNER ) {
                throw new AppError('Error Updating branches')
            }
            if(dto.branchId.length <= 0) {
                throw new AppError('Empty Branches')
            }
            if(member && member.restaurant_id == restaurantId) {
                const availableBranches = (await restaurantBranchService.findAllBranchesByRestaurantId(restaurantId)).map((b) => Number(b.id))
                const memberAccess:MemberAccess[] = []
                dto.branchId.forEach(branchId=>{
                    console.log(availableBranches,branchId)
                    if(availableBranches.includes(branchId)){
                        const access=  new MemberAccess({member_id: memberId,branch_id:branchId})
                        memberAccess.push(access)
                    }else {
                        throw new AppError('Wrong Branch ID provided')
                    }
                })
                return await db.transaction(async (trx)=>{
                    await memberAccessRepo.deleteMemberAccess(memberId,trx)
                    return await memberAccessRepo.addMemberBranchAccess(memberAccess,trx)
                })

            }

        }

    async getRolePermission(role: string) {
        return await permissionCacheService.getPermissionsByRoleName(role)
    }
}


export const branchMemberService = new BranchMemberService();