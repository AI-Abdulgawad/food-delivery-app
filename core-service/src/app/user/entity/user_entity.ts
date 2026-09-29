import {SystemRole} from "../enums/system_role.js";

export class User {
    id:number;
    email:string;
    passwordHash:string;
    name:string;
    phone:string;
    // is_active?:boolean;
    system_role:SystemRole;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date | null;


    constructor(data: Partial<User>) {
        this.id = data.id!;
        this.email = data.email!;
        this.passwordHash = data.passwordHash!;
        this.name = data.name!;
        this.phone = data.phone!;
        // this.is_active = data.is_active!;
        this.system_role = data.system_role!;
        this.createdAt = data.createdAt ?? new Date();
        this.updatedAt = data.updatedAt ?? new Date();
        this.deletedAt = data.deletedAt?? null;
    }

    static fromRow(row:any) {
        return new User(
            {
                id: row.id,
                email: row.email,
                passwordHash: row.password_hash,
                name: row.name,
                phone: row.phone,
                system_role: row.system_role,
                createdAt: row.created_at,
                deletedAt:row.deleted_at,
                updatedAt: row.updated_at
                // is_active: row.is_active,
            }
        )
    }
    static toEntity(user:User) {
        return {
            email:user.email,
            password_hash:user.passwordHash,
            name:user.name,
            phone:user.phone,
            system_role:user.system_role,
            created_at:user.createdAt,
            updated_at:user.updatedAt,
            // is_active:user.is_active,
            deleted_at:user.deletedAt,
        }
    }
}