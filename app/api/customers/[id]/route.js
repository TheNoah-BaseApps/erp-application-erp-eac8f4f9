/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
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
 *         description: Customer retrieved successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { updateCustomer, deleteCustomer } from '@/lib/db';
import { validateCustomerData } from '@/lib/validation';

async function getHandler(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT c.*, u.name as created_by_name
       FROM customers c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
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
    console.error('Error in GET /api/customers/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate customer data
    const validation = validateCustomerData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check for duplicate customer code (excluding current customer)
    const existingCustomer = await query(
      'SELECT id FROM customers WHERE customer_code = $1 AND id != $2',
      [body.customer_code, id]
    );

    if (existingCustomer.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Customer code already exists' },
        { status: 400 }
      );
    }

    const customer = await updateCustomer(id, body);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: customer,
        message: 'Customer updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/customers/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const { id } = params;

    await deleteCustomer(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Customer deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/customers/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('customers', 'read')(getHandler);
export const PUT = requirePermission('customers', 'update')(putHandler);
export const DELETE = requirePermission('customers', 'delete')(deleteHandler);