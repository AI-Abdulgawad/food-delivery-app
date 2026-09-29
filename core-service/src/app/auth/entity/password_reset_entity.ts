import {TimeUtils} from "../../../pkg/time/time-utils.js";

export class PasswordReset {

    // fields
    id?:number;
    userId:number;
    otpHash:string;
    expiryDate:Date;
    consumedAt:Date | null;
    createdAt:Date;



    constructor(obj:Partial<PasswordReset>) {
        this.id = obj.id!;
        this.userId = obj.userId!;
        this.otpHash = obj.otpHash!;
        this.expiryDate = obj.expiryDate! ??  new Date(Date.now() + TimeUtils.toMS(10,'m'))
        this.consumedAt = obj.consumedAt ?? null;
        this.createdAt = obj.createdAt!;

    }

    // me
    isExpired():boolean {
        return this.expiryDate < new Date();
    }
     toEntity() {
        return {
            id: this.id,
            user_id: this.userId,
            otp_hash: this.otpHash,
            expiry_date: this.expiryDate,
            created_at: this.createdAt,
            consumed_at: this.consumedAt,
        }
    }
    static fromEntity(row:any):PasswordReset{
        return new PasswordReset(
            {
                id: row.id,
                userId: row.user_id,
                otpHash: row.otp_hash,
                consumedAt: row.consumed_at,
                createdAt: row.created_at,
                expiryDate: row.expiry_date
            }




        )
    }

    // get id(): number {
    //     return this._id;
    // }
    //
    // set id(value: number) {
    //     this._id = value;
    // }
    //
    // get userId(): number {
    //     return this._userId;
    // }
    //
    // set userId(value: number) {
    //     this._userId = value;
    // }
    //
    // get otpHash(): string {
    //     return this._otpHash;
    // }
    //
    // set otpHash(value: string) {
    //     this._otpHash = value;
    // }
    //
    // get expiryDate(): Date {
    //     return this._expiryDate;
    // }
    //
    // set expiryDate(value: Date) {
    //     this._expiryDate = value;
    // }
    //
    // get consumedAt(): Date {
    //     return this._consumedAt;
    // }
    //
    // set consumedAt(value: Date) {
    //     this._consumedAt = value;
    // }
    //
    // get createdAt(): Date {
    //     return this._createdAt;
    // }
    //
    // set createdAt(value: Date) {
    //     this._createdAt = value;
    // }
}