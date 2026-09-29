import {db} from "../../../lib/knex/knex.js";
import {ProductCategory} from "../entity/product_category.entity.js";

class ProductCategoryRepo {
    async findAllCategoriesByRestaurantId(restaurantId: number,conn=db) {
        return await conn('product_categories').select('*').where('restaurant_id', restaurantId)
    }
    async findCategoryByNameAndRestaurantId(categoryName: string, restaurantId: number,conn=db) {
        return await conn('product_categories').select('id')
            .where('restaurant_id', restaurantId)
            .where('name', categoryName).first()



    }
    async addNewCategory(categoryName:string, restaurant_id: number,conn=db) {

        const [result] = await conn('product_categories').insert(new ProductCategory(categoryName,restaurant_id)).returning('id')
        return result
    }
}

export const productCategoryRepo = new ProductCategoryRepo();