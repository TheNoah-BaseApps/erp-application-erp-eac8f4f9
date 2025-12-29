/**
 * @swagger
 * /api/reports/costs:
 *   get:
 *     summary: Generate cost analysis report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_month
 *         schema:
 *           type: string
 *       - in: query
 *         name: end_month
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost report generated successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start_month = searchParams.get('start_month');
    const end_month = searchParams.get('end_month');

    let sql = `
      SELECT 
        pc.*,
        p.product_name,
        p.product_code,
        p.product_category,
        p.brand,
        LAG(pc.unit_cost) OVER (PARTITION BY pc.product_id ORDER BY pc.month) as previous_cost
      FROM product_costs pc
      LEFT JOIN products p ON pc.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (start_month) {
      sql += ` AND pc.month >= $${paramCount}`;
      params.push(start_month);
      paramCount++;
    }

    if (end_month) {
      sql += ` AND pc.month <= $${paramCount}`;
      params.push(end_month);
      paramCount++;
    }

    sql += ' ORDER BY pc.month DESC, p.product_name';

    const result = await query(sql, params);

    // Calculate trends
    const dataWithTrends = result.rows.map(row => {
      if (row.previous_cost) {
        const change = row.unit_cost - row.previous_cost;
        const percentageChange = ((change / row.previous_cost) * 100).toFixed(2);
        
        return {
          ...row,
          cost_change: change,
          percentage_change: parseFloat(percentageChange),
          trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable'
        };
      }
      
      return {
        ...row,
        cost_change: null,
        percentage_change: null,
        trend: null
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: dataWithTrends,
        metadata: {
          total_entries: dataWithTrends.length,
          generated_at: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/reports/costs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate cost report' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('reports', 'view')(handler);