export class ProductBranchDetail {
    id?:number;
    branch_id:number;
    product_id:number;
    price:number;
    stock:number;
    is_available:boolean;

    constructor(data:Partial<ProductBranchDetail>) {
        this.id = data.id!
        this.branch_id = data.branch_id!
        this.product_id = data.product_id!
        this.price = data.price!
        this.stock = data.stock!
        this.is_available = data.is_available!

    }
    static toEntity(row:any) {
        return new ProductBranchDetail(row)
    }
    toRow() {
        return {
            id: this.id,
            branch_id: this.branch_id,
            product_id: this.product_id,
            price: this.price,
            stock: this.stock,
            is_available: this.is_available,

        }
    }
}