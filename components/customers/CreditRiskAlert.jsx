'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CreditRiskAlert({ customers }) {
  if (!customers || customers.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-900">Credit Risk Alert</CardTitle>
        </div>
        <CardDescription className="text-red-700">
          Customers approaching or exceeding credit limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customers.slice(0, 5).map((customer) => (
            <div key={customer.id} className="flex items-center justify-between py-2 border-b border-red-200 last:border-0">
              <div>
                <p className="font-medium text-red-900">{customer.customer_name}</p>
                <p className="text-sm text-red-700">{customer.customer_code}</p>
              </div>
              <Badge variant="outline" className="bg-white border-red-300 text-red-700">
                Limit: {formatCurrency(customer.balance_risk_limit)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}