/**
 * @swagger
 * /api/product-costs/{id}:
 *   get:
 *     summary: Get product cost by ID
 *     tags: [Product Costs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product cost retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query, getClient } from '@/lib/database/aurora';
import { validateCostData } from '@/lib/validation';

async function getHandler(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT pc.*, p.product_name, p.product_code, u.name as created_by_name
       FROM product_costs pc
       LEFT JOIN products p ON pc.product_id = p.id
       LEFT JOIN users u ON pc.created_by = u.id
       WHERE pc.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product cost not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/product-costs/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product cost' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate cost data
    const validation = validateCostData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const client = await getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE product_costs 
         SET product_id = $1, month = $2, unit_cost = $3, updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [body.product_id, body.month, body.unit_cost, id]
      );

      await client.query('COMMIT');

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Product cost not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: result.rows[0],
          message: 'Product cost updated successfully'
        },
        { status: 200 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in PUT /api/product-costs/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product cost' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const { id } = params;

    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'DELETE FROM product_costs WHERE id = $1 RETURNING id',
        [id]
      );

      await client.query('COMMIT');

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Product cost not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Product cost deleted successfully'
        },
        { status: 200 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in DELETE /api/product-costs/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product cost' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('costs', 'read')(getHandler);
export const PUT = requirePermission('costs', 'update')(putHandler);
export const DELETE = requirePermission('costs', 'delete')(deleteHandler);