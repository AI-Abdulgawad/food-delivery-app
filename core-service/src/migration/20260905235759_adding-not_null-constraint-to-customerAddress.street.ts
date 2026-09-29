import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    Alter Table customer_address
    ALTER COLUMN street SET NOT NULL;
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    Alter Table customer_address
    ALTER COLUMN street DROP NOT NULL;
    `)
}

