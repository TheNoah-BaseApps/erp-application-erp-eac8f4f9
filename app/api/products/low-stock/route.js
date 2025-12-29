/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Get products below critical stock level
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock products retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request) {
  try {
    // Note: This query assumes there's a current_stock field or calculation
    // For now, we'll return products sorted by critical_stock_level
    const result = await query(
      `SELECT p.*, u.name as created_by_name
       FROM products p
       LEFT JOIN users u ON p.created_by = u.id
       ORDER BY p.critical_stock_level DESC
       LIMIT 50`
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/products/low-stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('products', 'read')(handler);