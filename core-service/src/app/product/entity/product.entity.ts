export class Product {
    id?:number
    name:string
    description:string
    image_url:string
    restaurant_id:number
    created_at:Date
    updated_at:Date
    category_id?:number
    deleted_at?:Date

    constructor(data:Partial<Product>) {
        this.id = data.id!
        this.name = data.name!
        this.description = data.description!
        this.image_url = data.image_url!
        this.restaurant_id = data.restaurant_id!
        this.created_at = data.created_at! ?? new Date()
        this.updated_at = data.updated_at! ?? new Date()
        this.category_id = data.category_id!
        this.deleted_at = data.deleted_at!
    }
    static toEntity(row:any) {
        return new Product(
            {
                id: row.id,
                name: row.name,
                description: row.description,
                image_url: row.image_url,
                restaurant_id: row.restaurant_id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                category_id: row.category_id,
                deleted_at: row.deleted_at,
            }
        )
    }

    toRow() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            image_url: this.image_url,
            restaurant_id: this.restaurant_id,
            created_at: this.created_at,
            updated_at: this.updated_at,
            category_id: this.category_id,
            deleted_at: this.deleted_at,
        }
    }

}
