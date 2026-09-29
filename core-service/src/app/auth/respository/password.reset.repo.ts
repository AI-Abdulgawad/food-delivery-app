import  {PasswordReset} from "../entity/password_reset_entity.js";
import {db} from "../../../lib/knex/knex.js";
import {validateOTPHash} from "../../../lib/auth_utils/otp.js";

class PasswordResetRepo {

    async addPasswordReset(passwordReset: PasswordReset, trx=db){
        const  id:number = await trx('password_resets')
            .insert(passwordReset.toEntity()).returning('id')
        return id
    }

    async retrievePasswordReset(userId:number){
        const entry = await db('password_resets').select('*')
            .where('user_id',userId).orderBy('expiry_date',"DESC").first()
        return PasswordReset.fromEntity(entry)
    }


    async consumeOTP(passwordReset: PasswordReset) {
        const [resultRow] = await db('password_resets')
            .update('consumed_at', new Date())
            .where('id',passwordReset.id)
            .returning('*')
        return resultRow
    }
}

export const passwordResetRepo = new PasswordResetRepo()