import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.raw(`CREATE TABLE customer_address(
                        id BIGINT NOT NULL,
                        user_id BIGINT NOT NULL,
                        latitude DECIMAL(10, 7) NOT NULL,
                        longitude DECIMAL(10, 7) NOT NULL,
                        is_default BOOLEAN NOT NULL,
                        country TEXT NOT NULL,
                        building TEXT NOT NULL,
                        city TEXT NOT NULL,
                        apartment_number BIGINT NOT NULL,
                        type TEXT NOT NULL CHECK ( type IN('office','home','public')),
                        label TEXT NOT NULL,
                        created_at TIMESTAMP  NOT NULL,
                        updated_at TIMESTAMP NOT NULL
                    );
            ALTER TABLE
                customer_address ADD PRIMARY KEY("id");
            ALTER TABLE
                customer_address ADD CONSTRAINT customer_address_user_id_foreign FOREIGN KEY("user_id") REFERENCES "users"("id");`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXIST customer_address`);
}

