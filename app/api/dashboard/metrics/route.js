/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Get dashboard KPIs and statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

async function handler(request) {
  try {
    // Get total products
    const productsCount = await query('SELECT COUNT(*) as count FROM products');
    
    // Get total customers
    const customersCount = await query('SELECT COUNT(*) as count FROM customers');
    
    // Get recent cost updates (last 30 days)
    const recentCosts = await query(
      `SELECT pc.*, p.product_name
       FROM product_costs pc
       LEFT JOIN products p ON pc.product_id = p.id
       WHERE pc.created_at >= NOW() - INTERVAL '30 days'
       ORDER BY pc.created_at DESC
       LIMIT 10`
    );
    
    // Get product categories count
    const categoriesCount = await query(
      'SELECT COUNT(DISTINCT product_category) as count FROM products'
    );
    
    // Get cost entries count
    const costsCount = await query('SELECT COUNT(*) as count FROM product_costs');

    return NextResponse.json(
      {
        success: true,
        data: {
          total_products: parseInt(productsCount.rows[0].count),
          total_customers: parseInt(customersCount.rows[0].count),
          total_categories: parseInt(categoriesCount.rows[0].count),
          total_cost_entries: parseInt(costsCount.rows[0].count),
          recent_cost_updates: recentCosts.rows,
          products_low_stock: 0, // Placeholder - would need current stock tracking
          customers_at_risk: 0 // Placeholder - would need balance tracking
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/dashboard/metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('dashboard', 'view')(handler);