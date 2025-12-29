/**
 * @swagger
 * /api/reports/customers:
 *   get:
 *     summary: Generate customer report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sales_rep
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer report generated successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sales_rep = searchParams.get('sales_rep');
    const country = searchParams.get('country');

    let sql = `
      SELECT 
        c.*,
        u.name as created_by_name
      FROM customers c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (sales_rep) {
      sql += ` AND c.sales_rep = $${paramCount}`;
      params.push(sales_rep);
      paramCount++;
    }

    if (country) {
      sql += ` AND c.country = $${paramCount}`;
      params.push(country);
      paramCount++;
    }

    sql += ' ORDER BY c.customer_name';

    const result = await query(sql, params);

    // Add risk status to each customer
    const dataWithRisk = result.rows.map(customer => {
      let risk_status = 'safe';
      
      if (customer.balance_risk_limit) {
        // Note: This assumes balance tracking is implemented
        // For now, just flag customers with defined limits
        risk_status = 'monitored';
      }
      
      return {
        ...customer,
        risk_status
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: dataWithRisk,
        metadata: {
          total_customers: dataWithRisk.length,
          generated_at: new Date().toISOString()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/reports/customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate customer report' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('reports', 'view')(handler);