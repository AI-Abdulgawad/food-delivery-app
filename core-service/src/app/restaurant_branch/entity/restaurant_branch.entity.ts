import type {Currency} from "./currency.enum.js";

export class RestaurantBranch {
    id: number;
    // name: string;
    opens_at: string;
    closes_at: string;
    latitude:number;
    longitude:number;
    restaurant_id:number;
    country_code:string;
    address_text:string;
    label:string;
    is_active:boolean;
    accepting_orders:boolean;
    created_at:Date;
    updated_at:Date;
    delivery_radius:number;
    currency:Currency
    commission:number;
    constructor(data:Partial<RestaurantBranch>) {
        this.id = data.id!
        // this.name= data.name!;
        this.opens_at= data.opens_at!;
        this.closes_at=data.closes_at!
        this.latitude = data.latitude!;
        this.longitude=data.longitude!;
        this.restaurant_id=data.restaurant_id!;
        this.country_code=data.country_code!;
        this.address_text=data.address_text!;
        this.label=data.label!;
        this.is_active=data.is_active! ?? true
        this.accepting_orders=data.accepting_orders! ?? false;
        this.created_at=data.created_at ?? new Date();
        this.updated_at=data.updated_at ?? new Date();
        this.delivery_radius=data.delivery_radius!;
        this.currency=data.currency!;
        this.commission=data.commission!;
    }

    toRow() {
      return {
          id: this.id,
          // name: this.name,
          opens_at: this.opens_at,
          closes_at: this.closes_at,
          latitude: this.latitude,
          longitude: this.longitude,
          restaurant_id: this.restaurant_id,
          country_code: this.country_code,
          address_text: this.address_text,
          label: this.label,
          is_active: this.is_active,
          accepting_orders: this.accepting_orders,
          created_at: this.created_at,
          updated_at: this.updated_at,
          delivery_radius: this.delivery_radius,
          currency: this.currency,
          commission: this.commission

      }

    }
    static toEntity(row:any) {
        return new RestaurantBranch(row)
    }


}