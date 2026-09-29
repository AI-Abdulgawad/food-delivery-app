import type {Request,Response,NextFunction} from "express";
import {branchMemberService} from "../service/branch-memebr.service.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {AddMemberDto} from "../dto/add-member.dto.js";
import {UpdateMemberDto} from "../dto/update_member.dto.js";
import type {SystemRole} from "../../user/enums/system_role.js";
import {restaurantBranchService} from "../../restaurant_branch/service/restaurantBranch.service.js";
import {UpdateMemberBranchesDto} from "../dto/update_member_branches.dto.js";
import {AppError} from "../../../lib/error_handler/app_error.js";

export class BranchMemberController {
    async addBranchMember(req:Request, res:Response,next:NextFunction){
        try{
            const restaurantId = Number(req.params.restaurantId);
            const dto = await validateBody(AddMemberDto, req.body)
            const result = await branchMemberService.addRestaurantBranchMember(restaurantId, dto);
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
            const result = await branchMemberService.listRestaurantMembers(restaurantId)
            res.status(200).json({
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
            const count = await branchMemberService.updateMember(restaurantId,memberId,dto)
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
            const id = await branchMemberService.deleteMember(restaurantId,memberId,system_role)
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
            const result = await branchMemberService.updateMemberBranches(restaurantId,memberId,dto)

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
            const result = await branchMemberService.getRolePermission(role)
            return res.status(200).json({
                permissions: result
            })
        }catch (err) {
            next(err)
        }
    }

}
export const branchMemberController = new BranchMemberController();