'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';
import ReportFilters from './ReportFilters';
import { formatCurrency, formatMonth } from '@/lib/utils';
import { toast } from 'sonner';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function CostAnalysisReport() {
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
      const response = await fetch(`/api/reports/costs?${params}`, {
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
    { key: 'product_name', label: 'Product', sortable: true },
    { 
      key: 'month', 
      label: 'Month', 
      sortable: true,
      render: (value) => formatMonth(value)
    },
    { 
      key: 'unit_cost', 
      label: 'Cost', 
      sortable: true,
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'previous_cost', 
      label: 'Previous', 
      sortable: false,
      render: (value) => value ? formatCurrency(value) : 'N/A'
    },
    { 
      key: 'percentage_change', 
      label: 'Change', 
      sortable: true,
      render: (value, row) => {
        if (value === null) return 'N/A';
        
        const Icon = row.trend === 'increasing' ? TrendingUp : 
                     row.trend === 'decreasing' ? TrendingDown : Minus;
        const color = row.trend === 'increasing' ? 'text-red-600' : 
                      row.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600';
        
        return (
          <div className={`flex items-center ${color}`}>
            <Icon className="h-4 w-4 mr-1" />
            {value}%
          </div>
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cost Analysis Report</CardTitle>
            <CardDescription>Historical cost trends and analysis</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchReport} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ExportButton data={data} filename="cost-analysis-report" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReportFilters 
          type="costs" 
          onFilterChange={setFilters}
        />
        
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search costs..."
        />
      </CardContent>
    </Card>
  );
}