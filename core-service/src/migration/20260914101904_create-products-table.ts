import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE "products"(
    "id" BIGSerial PRIMARY KEY ,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "restaurant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP  NOT NULL,
    "updated_at" TIMESTAMP  NOT NULL,
    "category_id" BIGINT NULL
);

ALTER TABLE
    "products" ADD constraint fk_products_restaurant_id_restaurants Foreign KEY("restaurant_id") REFERENCES restaurants("id");
CREATE INDEX "idx_products_restaurant_id" ON
    "products"("restaurant_id");
    
    
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    DROP TABLE "products";
    `)
}

