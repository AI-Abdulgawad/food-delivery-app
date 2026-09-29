import type {Request,Response,NextFunction} from "express";
import {productService} from "../service/product.service.js";
import {validateBody} from "../../../lib/validation/validator.js";
import {ProductDto} from "../DTO/product.dto.js";
import {PatchProductDto} from "../DTO/update-product.dto.js";

export class ProductController {


   async categoriesPerRestaurant(req: Request, res: Response, next: NextFunction) {
       try{
           const restaurantId = Number(req.params.restaurantId);
           const result = await productService.getCategoriesByRestaurant(restaurantId)
           res.status(200).send(result)
       }catch(err){
           next(err)
       }


    }
    async productsPerBranch(req: Request, res: Response, next: NextFunction) {
        try{
            const branchId = Number(req.params.branchId);
            const result = await productService.getProductsByBranch(branchId)
            res.status(200).send(result)
        }catch(err){
            next(err)
        }


    }
    async productsPerRestaurant(req: Request, res: Response, next: NextFunction) {
        try{
            const restaurantId = Number(req.params.restaurantId);
            const result = await productService.getProductsByRestaurant(restaurantId)
            res.status(200).send(result)
        }catch(err){
            next(err)
        }


    }
    async singleProduct(req: Request, res: Response, next: NextFunction) {
        try{
            const productId = Number(req.params.productId);
            const result = await productService.getProduct(productId)
            res.status(200).send(result)
        }catch(err){
            next(err)
        }
   }
   async addProduct(req: Request, res: Response, next: NextFunction) {
       try{
           const restaurantId = Number(req.params.restaurantId);
           const productDto = await validateBody(ProductDto, req.body)

           const result = await productService.addNewProduct(productDto,restaurantId)
           return res.status(200).send(result)
       }catch(err){
           next(err)
       }

   }
   async patchProduct(req: Request, res: Response, next: NextFunction) {
       try{
           const productId = Number(req.params.productId);
           const branchId = Number(req.query.branchId);

           const dto = await validateBody(PatchProductDto, req.body)
           const result = await productService.patchProductData(dto, branchId, productId)
           return res.status(200).send(result)
       }catch(err){
           next(err)
       }
   }

}

export const productController = new ProductController()