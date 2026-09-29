import type {RestaurantBranchDto} from "../DTO/restaurant_branch_dto.js";
import {restaurantBranchRepository} from "../repository/restaurantBranch.repository.js";
import {RestaurantBranch} from "../entity/restaurant_branch.entity.js";
import type {UpdateBranchDto} from "../DTO/updateBranch.dto.js";
import type {UpdateBranchStatusDto} from "../DTO/UpdateStatus.dto.js";

export class RestaurantBranchService {


    async addBranch(dto: RestaurantBranchDto, restaurantId: number) {
        const branch:RestaurantBranch = new RestaurantBranch(dto);
        branch.restaurant_id = restaurantId;
        // TODO: check whether restaurant_id exists and is_active
         return await restaurantBranchRepository.addBranch(branch);
    }

    async findNearByBranches(lng:number,lat:number) {
       return  await restaurantBranchRepository.findNearByBranches(lng,lat);

    }

    async updateBranchInfo(dto: UpdateBranchDto|UpdateBranchStatusDto, branchId: number) {

        let branch = await restaurantBranchRepository.getBranchById(branchId)
        Object.assign(branch, dto)
        branch.updated_at = new Date()
        return await restaurantBranchRepository.updateBranch(branch)


    }


    async findAllBranchesByRestaurantId(restaurantId: number) {
         return await restaurantBranchRepository.findAllByRestaurantId(restaurantId)
    }
    async findAllBranchesByOwnerId(ownerId: number) {
        return await restaurantBranchRepository.findAllBranchesByOwnerId(ownerId)
    }
}

export const restaurantBranchService: RestaurantBranchService = new RestaurantBranchService();