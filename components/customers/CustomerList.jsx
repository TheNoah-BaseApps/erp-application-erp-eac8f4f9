'use client';

import { useRouter } from 'next/navigation';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CustomerList({ customers, loading, onRefresh }) {
  const router = useRouter();

  const columns = [
    {
      key: 'customer_code',
      label: 'Code',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'customer_name',
      label: 'Customer Name',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'contact_person',
      label: 'Contact',
      sortable: false
    },
    {
      key: 'telephone_number',
      label: 'Phone',
      sortable: false
    },
    {
      key: 'sales_rep',
      label: 'Sales Rep',
      sortable: true
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      render: (value) => value ? <Badge variant="outline">{value}</Badge> : '-'
    },
    {
      key: 'balance_risk_limit',
      label: 'Risk Limit',
      sortable: true,
      render: (value) => value ? formatCurrency(value) : '-'
    }
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      loading={loading}
      onRowClick={(row) => router.push(`/customers/${row.id}`)}
      searchPlaceholder="Search customers..."
    />
  );
}