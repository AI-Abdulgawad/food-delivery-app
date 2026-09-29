import {type MemberStatus, RestaurantRoleType} from "../rbac.enums.js";

export class RestaurantMember {
    id?: number;
    user_id: number;
    restaurant_id: number;
    role_id: number;
    status:MemberStatus;
    created_at?: Date;
    updated_at?: Date;

    constructor(data:Partial<RestaurantMember>) {
        this.id = data.id!;
        this.user_id = data.user_id!
        this.restaurant_id = data.restaurant_id!
        this.role_id = data.role_id!
        this.status = data.status!
        this.created_at = data.created_at?? new Date();
        this.updated_at = data.updated_at?? new Date();

    }

    toRow() {
        return {
            id: this.id,
            user_id: this.user_id,
            restaurant_id: this.restaurant_id,
            role_id: this.role_id,
            status: this.status,
            created_at: this.created_at,
            updated_at: this.updated_at,
        }
    }

    static toEntity(row:any) {
        return new RestaurantMember(row)
    }

}