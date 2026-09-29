import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE "product_branch_info"(
    "id" BIGSerial PRIMARY KEY ,
    "branch_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL
);
    
    CREATE INDEX "idx_product_branch_info_branch_id" ON
        "product_branch_info"("branch_id");

    CREATE INDEX "idx_product_branch_info_product_id" ON
        "product_branch_info"("product_id");

    ALTER TABLE "product_branch_info"
    ADD CONSTRAINT fk_product_branch_info_branch_id_restaurant_branch FOREIGN KEY (branch_id)
    REFERENCES restaurant_branch("id");
    ;
    ALTER TABLE "product_branch_info"
    ADD CONSTRAINT fk_product_branch_info_product_id_product FOREIGN KEY (product_id)
    REFERENCES products("id");
    
    
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
    
    
    `)
}

