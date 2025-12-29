/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: Products retrieved successfully
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Product created successfully
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { createProduct } from '@/lib/db';
import { validateProductData } from '@/lib/validation';

async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    let sql = `
      SELECT p.*, u.name as created_by_name
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
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

    if (search) {
      sql += ` AND (p.product_name ILIKE $${paramCount} OR p.product_code ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    sql += ' ORDER BY p.created_at DESC';

    const result = await query(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();

    // Validate product data
    const validation = validateProductData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check for duplicate product code
    const existingProduct = await query(
      'SELECT id FROM products WHERE product_code = $1',
      [body.product_code]
    );

    if (existingProduct.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Product code already exists' },
        { status: 400 }
      );
    }

    const product = await createProduct(body, request.user.id);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('products', 'read')(getHandler);
export const POST = requirePermission('products', 'create')(postHandler);