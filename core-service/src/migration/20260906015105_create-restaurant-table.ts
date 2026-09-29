import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE "restaurants"(
    "id"  BIGSerial,
     owner_id BIGINT NOT NULL,   
    "name" TEXT NOT NULL,
    "primary_country" TEXT NOT NULL,
    "status" VARCHAR(255) CHECK ("status" IN('active','suspedended','disabled','pending')) NOT NULL,
    "created_at" TIMESTAMP NOT NULL ,
    "logo_url" TEXT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    status_updated_at TIMESTAMP NOT NULL
);
ALTER TABLE
    "restaurants" ADD PRIMARY KEY("id");
ALTER TABLE
    "restaurants" ADD CONSTRAINT fk_restaurants_owner_id FOREIGN KEY(owner_id) REFERENCES users("id");

CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at);
CREATE INDEX idx_restaurants_primary_country ON restaurants(primary_country);
    
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TABLE restaurants
    `)
}

