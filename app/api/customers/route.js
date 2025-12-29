/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
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
 *         description: Customers retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { createCustomer } from '@/lib/db';
import { validateCustomerData } from '@/lib/validation';

async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sales_rep = searchParams.get('sales_rep');
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const search = searchParams.get('search');

    let sql = `
      SELECT c.*, u.name as created_by_name
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

    if (region) {
      sql += ` AND c.region_or_state = $${paramCount}`;
      params.push(region);
      paramCount++;
    }

    if (search) {
      sql += ` AND (c.customer_name ILIKE $${paramCount} OR c.customer_code ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    sql += ' ORDER BY c.created_at DESC';

    const result = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();

    // Validate customer data
    const validation = validateCustomerData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check for duplicate customer code
    const existingCustomer = await query(
      'SELECT id FROM customers WHERE customer_code = $1',
      [body.customer_code]
    );

    if (existingCustomer.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Customer code already exists' },
        { status: 400 }
      );
    }

    const customer = await createCustomer(body, request.user.id);

    return NextResponse.json(
      {
        success: true,
        data: customer,
        message: 'Customer created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('customers', 'read')(getHandler);
export const POST = requirePermission('customers', 'create')(postHandler);