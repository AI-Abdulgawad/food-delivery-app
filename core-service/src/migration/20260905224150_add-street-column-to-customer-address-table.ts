import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    ALTER TABLE customer_address
    ADD COLUMN street TEXT 
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        ALTER TABLE customer_address DROP COLUMN street
    `)


}

