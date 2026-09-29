import {productRepository} from "../repository/product.repo.js";
import type {ProductDto} from "../DTO/product.dto.js";
import {productRouter} from "../routes/product.routes.js";
import {Product} from "../entity/product.entity.js";
import {db} from "../../../lib/knex/knex.js";
import {productCategoryRepo} from "../repository/product-category.repo.js";
import {
    type PatchProductDto,
    UpdateProductBranchDetailsDto,
    UpdateProductDetailsDto
} from "../DTO/update-product.dto.js";
import {pickDefined} from "../../../lib/validation/validator.js";
import {productBranchInfoRepo} from "../repository/product-branch-info.repo.js";

export class ProductService {

    async getCategoriesByRestaurant(restaurantId: number) {
        return await productCategoryRepo.findAllCategoriesByRestaurantId(restaurantId)
    }

    async getProductsByBranch(branchId: number) {
        return await productRepository.findAllProductsByBranchId(branchId)
    }

    async getProductsByRestaurant(restaurantId: number) {
        return await productRepository.findAllProductsByRestaurantId(restaurantId)
    }

    async getProduct(productId: number) {
       return await productRepository.findProductById(productId)
    }

    async addNewProduct(productDto: ProductDto,restaurantId: number) {
        return await db.transaction(async (transaction) => {
            let isExist = false
            let category_id = null
            if (productDto.category_name !== undefined && productDto.category_name !== null) {

                isExist = await this.isCategoryExist(<string>productDto.category_name, restaurantId,transaction)

            }
            if (!isExist && productDto.category_name !== undefined && productDto.category_name !== null) {
                category_id = await productCategoryRepo.addNewCategory(productDto.category_name, restaurantId, transaction)
            }
            if(isExist) {
                category_id = await productCategoryRepo.findCategoryByNameAndRestaurantId(productDto.category_name!, restaurantId, transaction)
            }
            const newProduct = new Product(productDto)
            newProduct.category_id = category_id?.id
            newProduct.restaurant_id = restaurantId

            return await productRepository.addNewProduct(newProduct, transaction)
        })

    }

    private async isCategoryExist(categoryName:string,restaurantId: number,trx=db) {
        const result =  await productCategoryRepo.findCategoryByNameAndRestaurantId(categoryName, restaurantId,trx)
        return result !== undefined && result !== null;
    }

   async patchProductData(dto: PatchProductDto, branchId: number | undefined, productId: number) {
       return await db.transaction(async (transaction) =>
       {
           // products
           const {name,description,image_url,category_name,stock,price,isAvailable} = dto;
           const productDetails = Object.assign(new UpdateProductDetailsDto(), {name,description,image_url,category_name})
           const productData = pickDefined(productDetails)
           let product = null
           if(Object.keys(productData).length > 0){
               product = await productRepository.updateProduct(productData, productId,transaction)
           }else {
               return {}
           }


           // branch
           const branchDetails = Object.assign(new UpdateProductBranchDetailsDto(),{stock,price,isAvailable})
           const branchData = pickDefined(branchDetails)
           let branch = null
           if(Object.keys(branchData).length > 0) {
                branch = await productBranchInfoRepo.updateProductBranchInfo(branchId, productId, branchData)
           }
           return {
               product: product,
               branch: branch,
           }
       })
    }
}
export const productService = new ProductService()