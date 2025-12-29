'use client';

import StatsCard from '@/components/ui/StatsCard';
import { Package, Users, DollarSign, Archive } from 'lucide-react';

export default function MetricsGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Products"
        value={metrics?.total_products || 0}
        icon={Package}
        color="blue"
        description="In catalog"
      />
      
      <StatsCard
        title="Total Customers"
        value={metrics?.total_customers || 0}
        icon={Users}
        color="green"
        description="Active customers"
      />
      
      <StatsCard
        title="Cost Entries"
        value={metrics?.total_cost_entries || 0}
        icon={DollarSign}
        color="yellow"
        description="Historical records"
      />
      
      <StatsCard
        title="Categories"
        value={metrics?.total_categories || 0}
        icon={Archive}
        color="gray"
        description="Product categories"
      />
    </div>
  );
}