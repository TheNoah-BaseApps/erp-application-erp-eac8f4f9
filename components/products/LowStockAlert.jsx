'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function LowStockAlert({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-yellow-900">Low Stock Alert</CardTitle>
        </div>
        <CardDescription className="text-yellow-700">
          Products below critical stock level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between py-2 border-b border-yellow-200 last:border-0">
              <div>
                <p className="font-medium text-yellow-900">{product.product_name}</p>
                <p className="text-sm text-yellow-700">{product.product_code}</p>
              </div>
              <Badge variant="outline" className="bg-white border-yellow-300 text-yellow-700">
                Critical: {parseFloat(product.critical_stock_level).toFixed(2)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}