'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import ExportButton from '@/components/ui/ExportButton';
import ReportFilters from './ReportFilters';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export default function CustomerReport() {
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
      const response = await fetch(`/api/reports/customers?${params}`, {
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
    { key: 'customer_code', label: 'Code', sortable: true },
    { key: 'customer_name', label: 'Name', sortable: true },
    { key: 'contact_person', label: 'Contact', sortable: false },
    { key: 'telephone_number', label: 'Phone', sortable: false },
    { key: 'sales_rep', label: 'Sales Rep', sortable: true },
    { key: 'country', label: 'Country', sortable: true },
    { 
      key: 'payment_terms_limit', 
      label: 'Payment Terms', 
      sortable: true,
      render: (value) => value ? `${value} days` : 'N/A'
    },
    { 
      key: 'balance_risk_limit', 
      label: 'Risk Limit', 
      sortable: true,
      render: (value) => value ? formatCurrency(value) : 'N/A'
    },
    {
      key: 'risk_status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const colors = {
          safe: 'bg-green-100 text-green-700',
          monitored: 'bg-yellow-100 text-yellow-700',
          exceeded: 'bg-red-100 text-red-700'
        };
        return <Badge variant="outline" className={colors[value]}>{value}</Badge>;
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Report</CardTitle>
            <CardDescription>Complete customer relationship overview</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchReport} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ExportButton data={data} filename="customer-report" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReportFilters 
          type="customers" 
          onFilterChange={setFilters}
        />
        
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          searchPlaceholder="Search customers..."
        />
      </CardContent>
    </Card>
  );
}