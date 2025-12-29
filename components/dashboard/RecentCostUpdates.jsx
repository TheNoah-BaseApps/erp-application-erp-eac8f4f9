'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export default function RecentCostUpdates({ updates }) {
  if (!updates || updates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Cost Updates</CardTitle>
          <CardDescription>Latest product cost changes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">No recent updates</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Updates</CardTitle>
        <CardDescription>Latest product cost changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.slice(0, 5).map((update) => (
            <div key={update.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex-1">
                <p className="font-medium">{update.product_name}</p>
                <p className="text-sm text-gray-500">{formatDate(update.month, 'month')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(update.unit_cost)}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Updated
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}