
export class ProductCategory {
    id?: number
    name: string
    restaurant_id: number

    constructor(name: string,restaurant_id: number,id?: number) {
        this.id = id!
        this.restaurant_id = restaurant_id
        this.name = name
    }

    static toEntity(row:any) {
        return new ProductCategory(row.name,row.restaurant_id,row.id)
    }

    toRow() : any {
        return {
            id: this.id,
            name: this.name,
            restaurant_id: this.restaurant_id,
        }
    }
}