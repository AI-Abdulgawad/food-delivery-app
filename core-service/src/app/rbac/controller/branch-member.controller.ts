import type {Request,Response,NextFunction} from "express";
import {BranchMemberService} from "../service/branch-memebr.service.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {AddBranchMemberDto} from "../dto/add-branch-member.dto.js";
import {UpdateMemberDto} from "../dto/update_member.dto.js";
import type {SystemRole} from "../../user/enums/system_role.js";
import {restaurantBranchService} from "../../restaurant_branch/service/restaurantBranch.service.js";
import {UpdateMemberBranchesDto} from "../dto/update_member_branches.dto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";
import {inject, injectable} from "tsyringe";
import  type {MailJetProvider} from "../../../pkg/email/MailJetProvider.js";
import container from "../../../lib/di/container.js";
import {TOKENS} from "../../../lib/di/tokens.js";
import path from "node:path";
import {readFile} from "node:fs/promises";
@injectable()
export class BranchMemberController {
    branchMemberService: BranchMemberService;
    mailProvider:MailJetProvider = container.resolve(TOKENS.MailJetProvider) as MailJetProvider

    constructor(@inject(BranchMemberService) branchMemberService: BranchMemberService) {
        this.branchMemberService = branchMemberService;
    }
    async addBranchMember(req:Request, res:Response,next:NextFunction){

        try{
            const restaurantId = Number(req.params.restaurantId);
            const dto = await validateBody(AddBranchMemberDto, req.body)
            const result = await this.branchMemberService.addRestaurantBranchMember(restaurantId, dto);
            return res.status(200).json({
                message:'member successfully added',
                member:Object.fromEntries(Object.entries(result))
                })
        }catch (err) {
            next(err)
        }


    }

    async listmembers(req:Request, res:Response,next:NextFunction){
        try {
            const restaurantId = Number(req.params.restaurantId);
            const result = await this.branchMemberService.listRestaurantMembers(restaurantId)
            return res.status(200).json({
                members: result.map((member)=>member.toRow())
            })
        }catch (err){
            next(err)
        }

    }
    async updateMember(req:Request, res:Response,next:NextFunction){
        try {
            const restaurantId = Number(req.params.restaurantId);
            const memberId = Number(req.params.memberId);
            const dto = await validateBody(UpdateMemberDto, req.body)
            const count = await this.branchMemberService.updateMember(restaurantId,memberId,dto)
            return res.status(200).json({message: `${count} field(s) updated successfully`})
        }catch (err) {
            next(err)
        }
    }
    async deleteMember(req:Request, res:Response,next:NextFunction){
        try {
            const restaurantId = Number(req.params.restaurantId);
            const memberId = Number(req.params.memberId);
            const system_role = req.user?.role as SystemRole;
            const id = await this.branchMemberService.deleteMember(restaurantId,memberId,system_role)
            res.status(200).json({'message': `member: ${id} successfully deleted`})
        }catch (err) {
            next(err)
        }
    }
    async updateMemberBranches(req:Request, res:Response,next:NextFunction){
        try {
            const restaurantId = Number(req.params.restaurantId);
            const memberId = Number(req.params.memberId);
            const dto = await validateBody(UpdateMemberBranchesDto, req.body)
            const result = await this.branchMemberService.updateMemberBranches(restaurantId,memberId,dto)

            if(!result){
                  return res.status(500).json({'message': 'Failed to update member..try again later'})
            }
                return res.status(500).json({newBranches: result})

        }catch (err) {
            next(err)
        }
    }
    async getRolePermissions(req:Request, res:Response,next:NextFunction){
        try {
            const role = String(req.params.role);
            const result = await this.branchMemberService.getRolePermission(role)
            return res.status(200).json({
                permissions: result
            })
        }catch (err) {
            next(err)
        }
    }

}
// export const branchMemberController = new BranchMemberController();