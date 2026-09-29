
export class RestaurantRole {
    id?:number;
    name: string;
    display_name: string;
    description: string;
    created_at: Date;
    updated_at: Date;

    constructor(data:Partial<RestaurantRole>) {
        this.id = data.id!
        this.name = data.name!
        this.display_name = data.display_name!
        this.description = data.description!
        this.created_at = data.created_at ?? new Date();
        this.updated_at = data.updated_at ?? new Date();
    }

    toRow() {
        return {
            id: this.id,
            name: this.name,
            display_name: this.display_name,
            description: this.description,
            created_at: this.created_at,
            updated_at: this.updated_at,
        }
    }
    static toEntity(row:any) {
        return new RestaurantRole(row);
    }

}