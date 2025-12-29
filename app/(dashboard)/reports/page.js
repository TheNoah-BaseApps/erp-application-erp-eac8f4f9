'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductReport from '@/components/reports/ProductReport';
import CostAnalysisReport from '@/components/reports/CostAnalysisReport';
import CustomerReport from '@/components/reports/CustomerReport';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ReportsPage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Reports', href: '/reports' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mt-2">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and export comprehensive reports</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductReport />
        </TabsContent>

        <TabsContent value="costs">
          <CostAnalysisReport />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}