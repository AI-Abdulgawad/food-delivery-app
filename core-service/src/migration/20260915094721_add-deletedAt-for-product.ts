import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(
        `
        ALTER TABLE products
        ADD COLUMN deleted_at TIMESTAMP NULL;
        
        `
    )
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(
        `
        ALTER TABLE products
        DROP COLUMN deleted_at;
        
        `
    )

}

