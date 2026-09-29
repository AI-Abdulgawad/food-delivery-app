import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE TABLE "permissions"(
        "id" Serial PRIMARY KEY ,
        "resource" Text NOT NULL,
        "action" Text NOT NULL,
         created_at TIMESTAMP NOT NULL,   
            UNIQUE (resource,action)
            
        );
        CREATE TABLE restaurant_roles(
            id smallserial PRIMARY KEY ,
            name Text Not null,
            display_name TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            UNIQUE(name)
        );
       
        CREATE TABLE "role_permissions"(
        "role_id" smallint NOT NULL,
        "permission_id" int NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,    
            PRIMARY KEY (role_id, permission_id)
        );
       
        ALTER TABLE
            "role_permissions" ADD CONSTRAINT "fk_role_permission_permission_id_permissions" FOREIGN KEY("permission_id") REFERENCES "permissions"("id");
        Alter TABLE role_permissions    
         ADD CONSTRAINT "fk_role_permission_role_id_permissions" FOREIGN KEY("role_id") REFERENCES "restaurant_roles"("id");
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    `)

}

