'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';
import ReportFilters from './ReportFilters';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export default function ProductReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/reports/products?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'product_code', label: 'Code', sortable: true },
    { key: 'product_name', label: 'Product Name', sortable: true },
    { key: 'product_category', label: 'Category', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'unit', label: 'Unit', sortable: false },
    { 
      key: 'critical_stock_level', 
      label: 'Critical Stock', 
      sortable: true,
      render: (value) => parseFloat(value).toFixed(2)
    },
    { 
      key: 'latest_cost', 
      label: 'Latest Cost', 
      sortable: true,
      render: (value) => value ? formatCurrency(value) : 'N/A'
    },
    { 
      key: 'cost_entries_count', 
      label: 'Cost Entries', 
      sortable: true 
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Report</CardTitle>
            <CardDescription>Comprehensive product catalog analysis</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchReport} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ExportButton data={data} filename="product-report" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReportFilters 
          type="products" 
          onFilterChange={setFilters}
        />
        
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search products..."
        />
      </CardContent>
    </Card>
  );
}