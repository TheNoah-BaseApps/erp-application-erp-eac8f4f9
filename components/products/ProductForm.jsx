'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProductForm({ product = null, onSuccess }) {
  const [formData, setFormData] = useState({
    product_name: product?.product_name || '',
    product_code: product?.product_code || '',
    product_category: product?.product_category || '',
    unit: product?.unit || '',
    critical_stock_level: product?.critical_stock_level || '',
    brand: product?.brand || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData.product_code.trim()) {
      newErrors.product_code = 'Product code is required';
    }

    if (!formData.product_category.trim()) {
      newErrors.product_category = 'Category is required';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData.critical_stock_level || parseFloat(formData.critical_stock_level) <= 0) {
      newErrors.critical_stock_level = 'Valid critical stock level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Product saved successfully');
        onSuccess();
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product_name">Product Name *</Label>
          <Input
            id="product_name"
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            disabled={loading}
          />
          {errors.product_name && (
            <p className="text-sm text-red-600">{errors.product_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_code">Product Code *</Label>
          <Input
            id="product_code"
            value={formData.product_code}
            onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
            disabled={loading}
          />
          {errors.product_code && (
            <p className="text-sm text-red-600">{errors.product_code}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_category">Category *</Label>
          <Input
            id="product_category"
            value={formData.product_category}
            onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
            disabled={loading}
          />
          {errors.product_category && (
            <p className="text-sm text-red-600">{errors.product_category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            placeholder="e.g., kg, pcs, liters"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            disabled={loading}
          />
          {errors.unit && (
            <p className="text-sm text-red-600">{errors.unit}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="critical_stock_level">Critical Stock Level *</Label>
          <Input
            id="critical_stock_level"
            type="number"
            step="0.01"
            value={formData.critical_stock_level}
            onChange={(e) => setFormData({ ...formData, critical_stock_level: e.target.value })}
            disabled={loading}
          />
          {errors.critical_stock_level && (
            <p className="text-sm text-red-600">{errors.critical_stock_level}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}