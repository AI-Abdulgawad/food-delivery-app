import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.raw(
        `CREATE TABLE IF NOT EXISTS  users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL ,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                system_role TEXT NOT NULL CHECK ( system_role IN('customer','restaurant_user','admin') ),
                created_at TIMESTAMP NOT NULL ,
                updated_at TIMESTAMP NOT NULL ,
                is_active NOT NULL DEFAULT 'active' Check(is_active IN ('active' ,'disabled')),
                deleted_at TIMESTAMP NOT NULL );

            CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_system_role ON users(system_role);
            
    
    `
    )
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw("DROP TABLE IF EXISTS users;");
}

