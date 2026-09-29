import {validate} from 'class-validator'
import {AppError} from "../error_handler/app_error.js";
import {AddMemberDto} from "../../app/rbac/dto/add-member.dto.js";
import {SystemRole} from "../../app/user/enums/system_role.js";

export async function validateBody<T extends Object>  (cls: new() => T,body:unknown):Promise<T>  {
    const instance:T = Object.assign(new cls(),body);
    if(instance instanceof AddMemberDto){
        instance.role = SystemRole.RESTAURANT_USER
    }
    const errors = await validate(instance,{whitelist:true});
    if(errors.length > 0 ){
        const messages = errors.flatMap(e => Object.values(e.constraints ?? {}));
        const errorMessage = messages.join(', \n')
        throw new AppError(errorMessage,true,400)
    }
    return instance
}

export function pickDefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
    ) as Partial<T>;
}