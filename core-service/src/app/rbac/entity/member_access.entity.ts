import type {RestaurantMember} from "./resturant_member.entity.js";

export class MemberAccess {

    member_id: number;
    branch_id: number;
    created_at: Date;
    updated_at: Date;

    constructor(data:Partial<MemberAccess>) {
        this.member_id = data.member_id!
        this.branch_id = data.branch_id!
        this.created_at= data.created_at?? new Date();
        this.updated_at = data.updated_at?? new Date()


    }

}