import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE "restaurant_members"(
    "id" BIGSerial primary key ,
    "user_id" BIGINT NOT NULL,
    "restaurant_id" BIGINT NOT NULL,
    "role_id" smallint, 
    status Text NOT NULL Check(status IN ('active','inactive','suspended')),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,    
    UNIQUE (user_id) 
    );

CREATE TABLE "members_access"(
    "member_id" BIGINT NOT NULL,
    "branch_id" BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY(member_id,branch_id)                         
);


ALTER TABLE
    "restaurant_members" ADD CONSTRAINT "fk_restaurant_members_user_id" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "restaurant_members" ADD CONSTRAINT "fk_restaurant_members_role_id" FOREIGN KEY("role_id") REFERENCES "restaurant_roles"("id");
ALTER TABLE
    "members_access" ADD CONSTRAINT "fk_members_access_member_id" FOREIGN KEY("member_id") REFERENCES "restaurant_members"("id");
ALTER TABLE
    "members_access" ADD CONSTRAINT "fk_members_access_branch_id" FOREIGN KEY("branch_id") REFERENCES "restaurant_branch"("id");
ALTER TABLE
    "restaurant_members" ADD CONSTRAINT "fk_restaurant_members_restaurant_id" FOREIGN KEY("restaurant_id") REFERENCES "restaurants"("id");
    
 CREATE INDEX idx_restaurant_members_user_id ON restaurant_members(user_id);

`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    `)
}

