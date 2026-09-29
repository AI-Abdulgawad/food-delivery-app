import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(
        `
        ALTER TABLE product_categories
        ADD CONSTRAINT unique_restaurant_category UNIQUE(restaurant_id,name);
        
        `
    )
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(
        `
        ALTER TABLE product_categories
        DROP CONSTRAINT unique_restaurant_categor;
        
        `
    )
}

