import { query, getClient } from '@/lib/database/aurora';

export async function createUser(userData) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO users (id, email, name, password, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, name, role, created_at, updated_at`,
      [userData.email, userData.name, userData.password, userData.role]
    );
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating user:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email) {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function createProduct(productData, userId) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO products 
       (id, product_name, product_code, product_category, unit, critical_stock_level, brand, created_by, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        productData.product_name,
        productData.product_code,
        productData.product_category,
        productData.unit,
        productData.critical_stock_level,
        productData.brand,
        userId
      ]
    );
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateProduct(id, productData) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `UPDATE products 
       SET product_name = $1, product_code = $2, product_category = $3, 
           unit = $4, critical_stock_level = $5, brand = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        productData.product_name,
        productData.product_code,
        productData.product_category,
        productData.unit,
        productData.critical_stock_level,
        productData.brand,
        id
      ]
    );
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteProduct(id) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    // Check for associated cost records
    const costCheck = await client.query(
      'SELECT COUNT(*) as count FROM product_costs WHERE product_id = $1',
      [id]
    );
    
    if (parseInt(costCheck.rows[0].count) > 0) {
      throw new Error('Cannot delete product with associated cost records');
    }
    
    await client.query('DELETE FROM products WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting product:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createCustomer(customerData, userId) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO customers 
       (id, customer_name, customer_code, address, city_or_district, sales_rep, country, 
        region_or_state, telephone_number, email, contact_person, payment_terms_limit, 
        balance_risk_limit, created_by, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
       RETURNING *`,
      [
        customerData.customer_name,
        customerData.customer_code,
        customerData.address,
        customerData.city_or_district,
        customerData.sales_rep,
        customerData.country,
        customerData.region_or_state,
        customerData.telephone_number,
        customerData.email,
        customerData.contact_person,
        customerData.payment_terms_limit,
        customerData.balance_risk_limit,
        userId
      ]
    );
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating customer:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCustomer(id, customerData) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `UPDATE customers 
       SET customer_name = $1, customer_code = $2, address = $3, city_or_district = $4,
           sales_rep = $5, country = $6, region_or_state = $7, telephone_number = $8,
           email = $9, contact_person = $10, payment_terms_limit = $11, 
           balance_risk_limit = $12, updated_at = NOW()
       WHERE id = $13
       RETURNING *`,
      [
        customerData.customer_name,
        customerData.customer_code,
        customerData.address,
        customerData.city_or_district,
        customerData.sales_rep,
        customerData.country,
        customerData.region_or_state,
        customerData.telephone_number,
        customerData.email,
        customerData.contact_person,
        customerData.payment_terms_limit,
        customerData.balance_risk_limit,
        id
      ]
    );
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating customer:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCustomer(id) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    await client.query('DELETE FROM customers WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting customer:', error);
    throw error;
  } finally {
    client.release();
  }
}