import {db} from "../../../lib/knex/knex.js";
import {User} from "../entity/user_entity.js";

class UserRepository {


    async findUserByEmailOrPhone(email:string,phone:string):Promise<Boolean> {
        const result  = await db.raw(
            `SELECT EXISTS  (SELECT 1 FROM users WHERE email=? OR phone=?) AS "exist"`
        ,[email, phone])
        return result.rows[0].exist
    }

    async createUser(user:User,conn=db):Promise<User> {
        const [result] = await conn('users').insert(User.toEntity(user)).returning('*')
       return User.fromRow(result)
    }

    async findUserByEmail(email: string) {
        const userRow =  await db('users').select('*').where('email', email).returning('*').first()
        const user =  User.fromRow(userRow)
        console.log(user)
        return user
    }
    async findUserById(id: number) {
        const userRow =  await db('users').select('*').where('id', id).returning('*').first()
        const user =  User.fromRow(userRow)
        console.log(user)
        return user
    }

    async addUpdatedUser(userId: number, newHash: string) {
        const [userRow] = await db('users')
            .update({password_hash:newHash,updated_at:new Date()})
            .where('id',userId).returning('*')
        return User.fromRow(userRow)
    }

    async updateNameAndPhone(userId: number, name: string, phone: string) {
        const [userRow] = await db('users')
            .update('name',name)
            .update('phone', phone)
            .update('updated_at', new Date())
            .where('id',userId).returning('*')
        return User.fromRow(userRow)
    }
}

export const userRepository = new UserRepository()

