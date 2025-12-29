'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePicker from '@/components/ui/DatePicker';
import { toast } from 'sonner';

export default function CostForm({ cost = null, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: cost?.product_id || '',
    month: cost?.month || '',
    unit_cost: cost?.unit_cost || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.product_id) {
      newErrors.product_id = 'Product is required';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.unit_cost || parseFloat(formData.unit_cost) <= 0) {
      newErrors.unit_cost = 'Valid unit cost is required';
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
      const url = cost ? `/api/product-costs/${cost.id}` : '/api/product-costs';
      const method = cost ? 'PUT' : 'POST';

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
        toast.success(data.message || 'Cost entry saved successfully');
        onSuccess();
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.error || 'Failed to save cost entry');
      }
    } catch (err) {
      console.error('Error saving cost:', err);
      toast.error('Failed to save cost entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product_id">Product *</Label>
        <Select 
          value={formData.product_id} 
          onValueChange={(value) => setFormData({ ...formData, product_id: value })}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.product_name} ({product.product_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.product_id && (
          <p className="text-sm text-red-600">{errors.product_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="month">Month *</Label>
        <DatePicker
          value={formData.month}
          onChange={(value) => setFormData({ ...formData, month: value })}
          placeholder="Select month"
        />
        {errors.month && (
          <p className="text-sm text-red-600">{errors.month}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit_cost">Unit Cost *</Label>
        <Input
          id="unit_cost"
          type="number"
          step="0.01"
          value={formData.unit_cost}
          onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
          disabled={loading}
        />
        {errors.unit_cost && (
          <p className="text-sm text-red-600">{errors.unit_cost}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : cost ? 'Update Cost' : 'Create Cost Entry'}
        </Button>
      </div>
    </form>
  );
}