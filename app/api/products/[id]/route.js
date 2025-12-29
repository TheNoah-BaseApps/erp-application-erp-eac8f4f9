/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
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
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */

import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { updateProduct, deleteProduct } from '@/lib/db';
import { validateProductData } from '@/lib/validation';

async function getHandler(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT p.*, u.name as created_by_name
       FROM products p
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
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
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

async function putHandler(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate product data
    const validation = validateProductData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check for duplicate product code (excluding current product)
    const existingProduct = await query(
      'SELECT id FROM products WHERE product_code = $1 AND id != $2',
      [body.product_code, id]
    );

    if (existingProduct.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Product code already exists' },
        { status: 400 }
      );
    }

    const product = await updateProduct(id, body);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product updated successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/products/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

async function deleteHandler(request, { params }) {
  try {
    const { id } = params;

    await deleteProduct(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    
    if (error.message.includes('associated cost records')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export const GET = requirePermission('products', 'read')(getHandler);
export const PUT = requirePermission('products', 'update')(putHandler);
export const DELETE = requirePermission('products', 'delete')(deleteHandler);