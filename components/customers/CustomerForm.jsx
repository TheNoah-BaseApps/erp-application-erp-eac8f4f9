'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CustomerForm({ customer = null, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: customer?.customer_name || '',
    customer_code: customer?.customer_code || '',
    address: customer?.address || '',
    city_or_district: customer?.city_or_district || '',
    sales_rep: customer?.sales_rep || '',
    country: customer?.country || '',
    region_or_state: customer?.region_or_state || '',
    telephone_number: customer?.telephone_number || '',
    email: customer?.email || '',
    contact_person: customer?.contact_person || '',
    payment_terms_limit: customer?.payment_terms_limit || '',
    balance_risk_limit: customer?.balance_risk_limit || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }

    if (!formData.customer_code.trim()) {
      newErrors.customer_code = 'Customer code is required';
    }

    if (!formData.telephone_number.trim()) {
      newErrors.telephone_number = 'Telephone number is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.payment_terms_limit && parseInt(formData.payment_terms_limit) <= 0) {
      newErrors.payment_terms_limit = 'Payment terms must be a positive number';
    }

    if (formData.balance_risk_limit && parseFloat(formData.balance_risk_limit) <= 0) {
      newErrors.balance_risk_limit = 'Balance risk limit must be a positive number';
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
      const url = customer ? `/api/customers/${customer.id}` : '/api/customers';
      const method = customer ? 'PUT' : 'POST';

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
        toast.success(data.message || 'Customer saved successfully');
        onSuccess();
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.error || 'Failed to save customer');
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      toast.error('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_name">Customer Name *</Label>
          <Input
            id="customer_name"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            disabled={loading}
          />
          {errors.customer_name && (
            <p className="text-sm text-red-600">{errors.customer_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_code">Customer Code *</Label>
          <Input
            id="customer_code"
            value={formData.customer_code}
            onChange={(e) => setFormData({ ...formData, customer_code: e.target.value })}
            disabled={loading}
          />
          {errors.customer_code && (
            <p className="text-sm text-red-600">{errors.customer_code}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone_number">Telephone *</Label>
          <Input
            id="telephone_number"
            value={formData.telephone_number}
            onChange={(e) => setFormData({ ...formData, telephone_number: e.target.value })}
            disabled={loading}
          />
          {errors.telephone_number && (
            <p className="text-sm text-red-600">{errors.telephone_number}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sales_rep">Sales Representative</Label>
          <Input
            id="sales_rep"
            value={formData.sales_rep}
            onChange={(e) => setFormData({ ...formData, sales_rep: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city_or_district">City/District</Label>
          <Input
            id="city_or_district"
            value={formData.city_or_district}
            onChange={(e) => setFormData({ ...formData, city_or_district: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region_or_state">Region/State</Label>
          <Input
            id="region_or_state"
            value={formData.region_or_state}
            onChange={(e) => setFormData({ ...formData, region_or_state: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_terms_limit">Payment Terms (days)</Label>
          <Input
            id="payment_terms_limit"
            type="number"
            value={formData.payment_terms_limit}
            onChange={(e) => setFormData({ ...formData, payment_terms_limit: e.target.value })}
            disabled={loading}
          />
          {errors.payment_terms_limit && (
            <p className="text-sm text-red-600">{errors.payment_terms_limit}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="balance_risk_limit">Balance Risk Limit</Label>
          <Input
            id="balance_risk_limit"
            type="number"
            step="0.01"
            value={formData.balance_risk_limit}
            onChange={(e) => setFormData({ ...formData, balance_risk_limit: e.target.value })}
            disabled={loading}
          />
          {errors.balance_risk_limit && (
            <p className="text-sm text-red-600">{errors.balance_risk_limit}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}