/**
 * @swagger
 * /api/customers/credit-risk:
 *   get:
 *     summary: Get customers near or exceeding balance risk limit
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credit risk customers retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request) {
  try {
    // Note: This assumes balance tracking is implemented
    // For now, return customers with defined risk limits
    const result = await query(
      `SELECT c.*, u.name as created_by_name
       FROM customers c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.balance_risk_limit IS NOT NULL
       ORDER BY c.balance_risk_limit ASC`
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/customers/credit-risk:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch credit risk customers' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('customers', 'read')(handler);