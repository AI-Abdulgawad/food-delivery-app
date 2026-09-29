import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE OR REPLACE FUNCTION update_product_branch_products()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO product_branch_info(branch_id,product_id,price,stock,is_available)
        SELECT rb.id, New.id,0,0,false
        FROM restaurant_branch rb
        WHERE New.restaurant_id = rb.restaurant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


    CREATE TRIGGER trg_product_after_insert
    AFTER INSERT ON products 
    FOR EACH ROW
    EXECUTE FUNCTION update_product_branch_products();
    
    
    `)
}


export async function down(knex: Knex): Promise<void> {

    await knex.raw(`
    DROP TRIGGER trg_product_after_insert ON products;
    DROP FUNCTION update_product_branch_products;
    `)
}

