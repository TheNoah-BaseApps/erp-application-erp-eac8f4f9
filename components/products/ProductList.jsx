'use client';

import { useRouter } from 'next/navigation';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function ProductList({ products, loading, onRefresh }) {
  const router = useRouter();

  const columns = [
    {
      key: 'product_code',
      label: 'Code',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'product_name',
      label: 'Product Name',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'product_category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'brand',
      label: 'Brand',
      sortable: true
    },
    {
      key: 'unit',
      label: 'Unit',
      sortable: false
    },
    {
      key: 'critical_stock_level',
      label: 'Critical Stock',
      sortable: true,
      render: (value) => parseFloat(value).toFixed(2)
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => formatDate(value)
    }
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      loading={loading}
      onRowClick={(row) => router.push(`/products/${row.id}`)}
      searchPlaceholder="Search products..."
    />
  );
}