import {db} from "../../../lib/knex/knex.js";
import type {UpdateProductBranchDetailsDto} from "../DTO/update-product.dto.js";

class ProductBranchInfoRepo {

    async updateProductBranchInfo(branchId: number | undefined, productId: number, branchData:Partial<UpdateProductBranchDetailsDto>,conn=db) {
        const [result] =  await conn('product_branch_info')
            .update(branchData)
            .where({id: branchId,product_id: productId}).returning('*')
        return result

    }
}

export const productBranchInfoRepo = new ProductBranchInfoRepo()