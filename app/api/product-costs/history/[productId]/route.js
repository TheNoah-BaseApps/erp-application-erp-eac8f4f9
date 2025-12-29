/**
 * @swagger
 * /api/product-costs/history/{productId}:
 *   get:
 *     summary: Get cost history for a specific product
 *     tags: [Product Costs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost history retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request, { params }) {
  try {
    const { productId } = params;

    const result = await query(
      `SELECT pc.*, p.product_name, p.product_code
       FROM product_costs pc
       LEFT JOIN products p ON pc.product_id = p.id
       WHERE pc.product_id = $1
       ORDER BY pc.month DESC`,
      [productId]
    );

    // Calculate trends
    const costHistory = result.rows.map((cost, index) => {
      if (index < result.rows.length - 1) {
        const previousCost = result.rows[index + 1].unit_cost;
        const change = cost.unit_cost - previousCost;
        const percentageChange = ((change / previousCost) * 100).toFixed(2);
        
        return {
          ...cost,
          previous_cost: previousCost,
          cost_change: change,
          percentage_change: parseFloat(percentageChange),
          trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable'
        };
      }
      
      return {
        ...cost,
        previous_cost: null,
        cost_change: null,
        percentage_change: null,
        trend: null
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: costHistory
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/product-costs/history/[productId]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cost history' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('costs', 'read')(handler);