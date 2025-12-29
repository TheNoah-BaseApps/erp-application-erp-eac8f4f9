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

export default function ReportFilters({ type, onFilterChange }) {
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (type === 'products') {
      fetchProductFilters();
    } else if (type === 'customers') {
      fetchCustomerFilters();
    }
  }, [type]);

  const fetchProductFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const uniqueCategories = [...new Set(data.data.map(p => p.product_category).filter(Boolean))];
        const uniqueBrands = [...new Set(data.data.map(p => p.brand).filter(Boolean))];
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const fetchCustomerFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const uniqueSalesReps = [...new Set(data.data.map(c => c.sales_rep).filter(Boolean))];
        const uniqueCountries = [...new Set(data.data.map(c => c.country).filter(Boolean))];
        setSalesReps(uniqueSalesReps);
        setCountries(uniqueCountries);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) {
      delete newFilters[key];
    }
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {type === 'products' && (
          <>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={filters.category || ''} 
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Brand</Label>
              <Select 
                value={filters.brand || ''} 
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {type === 'costs' && (
          <>
            <div className="space-y-2">
              <Label>Start Month</Label>
              <DatePicker
                value={filters.start_month || ''}
                onChange={(value) => handleFilterChange('start_month', value)}
                placeholder="Select start month"
              />
            </div>

            <div className="space-y-2">
              <Label>End Month</Label>
              <DatePicker
                value={filters.end_month || ''}
                onChange={(value) => handleFilterChange('end_month', value)}
                placeholder="Select end month"
              />
            </div>
          </>
        )}

        {type === 'customers' && (
          <>
            <div className="space-y-2">
              <Label>Sales Representative</Label>
              <Select 
                value={filters.sales_rep || ''} 
                onValueChange={(value) => handleFilterChange('sales_rep', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sales reps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sales reps</SelectItem>
                  {salesReps.map((rep) => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Select 
                value={filters.country || ''} 
                onValueChange={(value) => handleFilterChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className="flex space-x-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={clearFilters}>Clear</Button>
      </div>
    </div>
  );
}