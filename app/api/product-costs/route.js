/**
 * @swagger
 * /api/product-costs:
 *   get:
 *     summary: Get all product costs
 *     tags: [Product Costs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product costs retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query, getClient } from '@/lib/database/aurora';
import { validateCostData } from '@/lib/validation';

async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');
    const month = searchParams.get('month');

    let sql = `
      SELECT pc.*, p.product_name, p.product_code, u.name as created_by_name
      FROM product_costs pc
      LEFT JOIN products p ON pc.product_id = p.id
      LEFT JOIN users u ON pc.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (product_id) {
      sql += ` AND pc.product_id = $${paramCount}`;
      params.push(product_id);
      paramCount++;
    }

    if (month) {
      sql += ` AND pc.month = $${paramCount}`;
      params.push(month);
      paramCount++;
    }

    sql += ' ORDER BY pc.month DESC, p.product_name ASC';

    const result = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/product-costs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product costs' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();

    // Validate cost data
    const validation = validateCostData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Verify product exists
    const productCheck = await query(
      'SELECT id FROM products WHERE id = $1',
      [body.product_id]
    );

    if (productCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const client = await getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO product_costs 
         (id, product_id, month, unit_cost, created_by, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [body.product_id, body.month, body.unit_cost, request.user.id]
      );

      await client.query('COMMIT');

      return NextResponse.json(
        {
          success: true,
          data: result.rows[0],
          message: 'Product cost created successfully'
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in POST /api/product-costs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product cost' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('costs', 'read')(getHandler);
export const POST = requirePermission('costs', 'create')(postHandler);