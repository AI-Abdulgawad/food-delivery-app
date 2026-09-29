import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS POSTGIS;
    --CREATE TYPE currency AS ENUM('EGP','SAR');
    CREATE TABLE restaurant_branch(
    id BIGSERIAL Primary key,
    name TEXT NOT NULL,
    opens_at TIME NOT NULL,
    closes_at TIME NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    location geography GENERATED ALWAYS AS (ST_MakePoint(longitude::float, latitude::float)::geography) STORED,
    restaurant_id BIGINT NOT NULL,
    country_code TEXT NOT NULL,
    address_text TEXT NOT NULL,
    label TEXT NOT NULL,
    is_active BOOLEAN NOT NULL,
    accepting_orders BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    delivery_radius INTEGER NOT NULL,
    currency currency,
    
    constraint fk_restaurant_branch_restaurant_id FOREIGN KEY(restaurant_id) REFERENCES RESTAURANTS(id)
);
    CREATE INDEX idx_restaurant_branch_restaurant_id ON restaurant_branch(restaurant_id); 
    CREATE INDEX idx_restaurant_branch_restaurant_latitude_longitude ON restaurant_branch(latitude,longitude); 
    CREATE INDEX idx_restaurant_branch_restaurant_is_active ON restaurant_branch(is_active); 
    CREATE INDEX idx_restaurant_branch_restaurant_location ON restaurant_branch Using GIST(location); 

    
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    DROP TABLE IF EXISTS  restaurant_branch
    `)
}

