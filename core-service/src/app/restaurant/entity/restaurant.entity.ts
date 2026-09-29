import type {RestaurantStatus} from "./restaurant_status_types.js";

export class Restaurant {
    id?:number;
    owner_id!:number;
    name!:string;

    primary_country!:string;
    status!:RestaurantStatus
    created_at!:Date;

    logo_url!:string;
    updated_at!:Date;
    status_updated_at!:Date;

    constructor(obj:Partial<Restaurant>) {
        this.id = obj.id!;
        this.created_at = obj.created_at ?? new Date();
        this.owner_id = obj.owner_id!;
        this.name = obj.name!;
        this.primary_country = obj.primary_country!;
        this.status = obj.status!;
        this.logo_url = obj.logo_url!;
        this.updated_at = obj.updated_at! ?? new Date();
        this.status_updated_at = obj.status_updated_at! ?? new Date();

    }

    toRow() {
        return {
            id: this.id,
            owner_id: this.owner_id,
            name: this.name,
            primary_country: this.primary_country,
            status: this.status,
            logo_url: this.logo_url,
            created_at: this.created_at,
            updated_at: this.updated_at,
            status_updated_at: this.status_updated_at,

        }
    }
    static toEntity(row:any) {
        return new Restaurant(
            {
                id: row.id,
                owner_id: row.owner_id,
                name: row.name!,
                primary_country: row.primary_country,
                status: row.status,
                logo_url: row.logo_url,
                created_at: row.created_at,
                updated_at: row.updated_at,
                status_updated_at: row.status_updated_at,
            }

        )
    }
}