import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE "product_categories"(
    "id" BIGSerial PRIMARY KEY ,
    "restaurant_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL
);
    
    ALTER TABLE "product_categories"
    ADD CONSTRAINT fk_product_categories FOREIGN KEY ("restaurant_id") REFERENCES restaurants("id");
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    DROP TABLE "product_categories
    `)
}

