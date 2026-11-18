import type {AddBranchMemberDto} from "../dto/add-branch-member.dto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {restaurantMemberRepo} from "../repository/restuarant-member.repo.js";
import {RestaurantMember} from "../entity/resturant_member.entity.js";
import {MemberStatus, RestaurantRoleType} from "../rbac.enums.js";
import {MemberAccess} from "../entity/member_access.entity.js";
import {memberAccessRepo} from "../repository/member-access.repo.js";
import {userRepository} from "../../user/repository/UserRepository.js";
import {User} from "../../user/entity/user_entity.js";
import {db} from "../../../lib/knex/knex.js";


import {userAlreadyExistException} from "../../../lib/error_handler/app_defined_errors.js";
import {restaurantBranchRepository} from "../../restaurant_branch/repository/restaurantBranch.repository.js";
import {rolePermissionRepo} from "../repository/role-permission.repo.js";
import type {UpdateMemberDto} from "../dto/update_member.dto.js";
import {SystemRole} from "../../user/enums/system_role.js";
import {restaurantBranchService} from "../../restaurant_branch/service/restaurantBranch.service.js";
import type {UpdateMemberBranchesDto} from "../dto/update_member_branches.dto.js";
import {permissionCacheService} from "./permission-cache.service.js";
import {delay, inject, injectable} from "tsyringe";
import {MailJetProvider} from "../../../pkg/email/MailJetProvider.js";
import container from "../../../lib/di/container.js";
import path from "node:path";
import {readFile} from "node:fs/promises";
import {restaurantService} from "../../restaurant/service/restaurant.service.js";
import {TOKENS} from "../../../lib/di/tokens.js";
import {userService, UserService} from "../../user/service/user.service.js";
import {AuthService} from "../../auth/service/AuthService.js";
import {ForgetPasswordDTO} from "../../auth/DTO/forgetPassword.js";
import {EMAIL_TYPE} from "../../auth/enums/auth.enum.js";



@injectable()
export class BranchMemberService {
    private readonly authService:AuthService;
    private readonly userService:UserService
    private readonly mailJetProvider:MailJetProvider = container.resolve(TOKENS.MailJetProvider);
    constructor
    (@inject(delay( () => AuthService))authService:AuthService,
     @inject(UserService) userService:UserService,
    ) {
        this.authService = authService;
        this.userService = userService;

    }
    async addRestaurantBranchMember(restaurantId: number, dto: AddBranchMemberDto) {


        return await db.transaction(async (trx) => {  // 1. Create new user with no password
        // creating user

        const exists = await userService.findUserByEmailOrPhone(dto.email,dto.phone,trx)
            if(exists) {
                throw userAlreadyExistException
            }
           // contruct user object
        const user = new User({
            email: dto.email,
            passwordHash: '',
            name: dto.name,
            phone: dto.phone,
            system_role: dto.role,

        })
        // inserting user into the database
        const addedUser:User = await userService.addUser(user,trx)

        /////////////    constructing forget password object for email verification      /////////////////////

        // sending invitation mail for password reset
        const forgetPasswordDto:ForgetPasswordDTO = new ForgetPasswordDTO()
        forgetPasswordDto.email = addedUser.email;



        // constructing template members
        const restaurant = await restaurantService.getRestaurant(restaurantId,trx);
        if(!restaurant?.name) throw new AppError('Restaurant not found');

        const templatePath = path.resolve(
            import.meta.dirname,
            '../template/member-invitation.html'
        );
        let template = await readFile(templatePath,'utf8')

        template = template.replaceAll('{{memberName}}',addedUser.name)
            .replaceAll('{{restaurantName}}',`${restaurant?.name}`)



            // 2. add Restaurant Member
            console.log(`role${dto.restaurantRole}`)
                const roleId:number = await rolePermissionRepo.findRoleIdByRoleName(dto.restaurantRole,trx)
                console.log('role_id',roleId)
                if(!roleId || isNaN(roleId)){
                    throw new AppError("role does not exist")
                }
                const newMember = new RestaurantMember({
                    user_id: addedUser.id,
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
                    for (const branch of dto.branchId)
                    {
                        if(availableBranches.includes(Number(branch)))
                        {
                            access.push(new MemberAccess(
                                {
                                    member_id: restaurantMemberId, branch_id: Number(branch)
                                }))
                        }else {
                            throw new AppError('Invalid Branch ID')
                        }
                    }
                    await memberAccessRepo.addMemberBranchAccess(access,trx)
                    await this.authService.forgetPassword(forgetPasswordDto,template,trx)

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


// export const branchMemberService = new BranchMemberService();