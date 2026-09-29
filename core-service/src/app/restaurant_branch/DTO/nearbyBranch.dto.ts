import type {RestaurantBranch} from "../entity/restaurant_branch.entity.js";

export class NearbyBranchDto {
    id:number
    branch_name:string
    restaurant_id:number
    address_text:string
    label:string
    currency:string
    is_active:boolean
    latitude:number
    longitude:number
    opens_at:string
    closes_at:string
    restaurant_name:string
    logo_url:string

    constructor(data:Partial<NearbyBranchDto>) {
        this.id = data.id!
        this.branch_name = data.branch_name!
        this.restaurant_name = data.restaurant_name!
        this.restaurant_id = data.restaurant_id!
        this.address_text = data.address_text!
        this.label = data.label!
        this.currency = data.currency!
        this.is_active=  data.is_active!
        this.latitude = data.latitude!
        this.longitude = data.longitude!
        this.opens_at = data.opens_at!
        this.closes_at = data.closes_at!
        this.logo_url = data.logo_url!

    }


    static toEntity(row:any) {
        return new NearbyBranchDto({
        id : row.id,
        branch_name : row.branch_name,
        restaurant_name : row.restaurant_name,
        restaurant_id : row.restaurant_id,
        address_text : row.address_text,
        label : row.label,
        currency : row.currency,
        is_active:  row.is_active,
        latitude : row.latitude,
        longitude : row.longitude,
        opens_at : row.opens_at,
        closes_at : row.closes_at,
        logo_url : row.logo_url

        })
    }

    toRow() {
        return  {
            id : this.id,
            branch_name : this.branch_name,
            restaurant_name : this.restaurant_name,
            restaurant_id : this.restaurant_id,
            address_text : this.address_text,
            label : this.label,
            currency : this.currency,
            is_active:  this.is_active,
            latitude : this.latitude,
            longitude : this.longitude,
            opens_at : this.opens_at,
            closes_at : this.closes_at,
            logo_url : this.logo_url
        }
    }

}