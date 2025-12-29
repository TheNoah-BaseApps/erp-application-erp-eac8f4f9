'use client';

import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatMonth } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function CostList({ costs, loading, onRefresh }) {
  const columns = [
    {
      key: 'product_code',
      label: 'Product Code',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'product_name',
      label: 'Product Name',
      sortable: true
    },
    {
      key: 'month',
      label: 'Month',
      sortable: true,
      render: (value) => formatMonth(value)
    },
    {
      key: 'unit_cost',
      label: 'Unit Cost',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'font-semibold'
    },
    {
      key: 'created_by_name',
      label: 'Created By',
      sortable: false
    }
  ];

  return (
    <DataTable
      data={costs}
      columns={columns}
      loading={loading}
      searchPlaceholder="Search costs..."
    />
  );
}