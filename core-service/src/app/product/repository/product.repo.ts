import {db} from "../../../lib/knex/knex.js";
import type {Product} from "../entity/product.entity.js";
import {ProductCategory} from "../entity/product_category.entity.js";
import type {UpdateProductDetailsDto} from "../DTO/update-product.dto.js";



class ProductRepository {

    async findAllProductsByBranchId(branchId:number,conn=db) {
       return await conn('product_branch_info')
            .join('products','product_branch_info.product_id','=','products.id')
        .select('products.*').where('product_branch_info.branch_id', branchId)
    }

    async findAllProductsByRestaurantId(restaurantId: number,conn=db) {
        return await conn('products').select('*').where('restaurant_id', restaurantId)

    }

    async findProductById(productId: number,conn=db) {
        return await conn('products').select('*').where('id', productId)

    }





    async addNewProduct(newProduct: Product,conn=db) {
        const [result] =  await conn('products').insert(newProduct).returning('*')
        return result
    }

    async updateProduct(productData: Partial<UpdateProductDetailsDto>,productId:number,conn=db) {
        const [result] =  await conn('products').update(productData)
            .where('id', productId)
            .returning('*')
        return result
    }
}
export const productRepository = new ProductRepository()