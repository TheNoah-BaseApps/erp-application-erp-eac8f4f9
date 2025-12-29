/**
 * @swagger
 * /api/reports/products:
 *   get:
 *     summary: Generate product report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product report generated successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');

    let sql = `
      SELECT 
        p.*,
        u.name as created_by_name,
        COUNT(pc.id) as cost_entries_count,
        MAX(pc.month) as latest_cost_month,
        (SELECT unit_cost FROM product_costs WHERE product_id = p.id ORDER BY month DESC LIMIT 1) as latest_cost
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN product_costs pc ON p.id = pc.product_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      sql += ` AND p.product_category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (brand) {
      sql += ` AND p.brand = $${paramCount}`;
      params.push(brand);
      paramCount++;
    }

    sql += ' GROUP BY p.id, u.name ORDER BY p.product_name';

    const result = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows,
        metadata: {
          total_products: result.rows.length,
          generated_at: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/reports/products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate product report' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('reports', 'view')(handler);