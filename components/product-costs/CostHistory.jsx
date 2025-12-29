'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatMonth } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function CostHistory({ productId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/product-costs/history/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setHistory(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch cost history');
      }
    } catch (err) {
      console.error('Error fetching cost history:', err);
      toast.error('Failed to load cost history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost History</CardTitle>
        <CardDescription>Historical cost trends for this product</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No cost history available</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{formatMonth(entry.month)}</p>
                  {entry.trend && (
                    <div className="flex items-center text-sm text-gray-500">
                      {entry.trend === 'increasing' && <TrendingUp className="h-3 w-3 mr-1 text-red-500" />}
                      {entry.trend === 'decreasing' && <TrendingDown className="h-3 w-3 mr-1 text-green-500" />}
                      {entry.trend === 'stable' && <Minus className="h-3 w-3 mr-1" />}
                      {entry.percentage_change !== null && `${entry.percentage_change}%`}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(entry.unit_cost)}</p>
                  {entry.previous_cost && (
                    <p className="text-sm text-gray-500">
                      from {formatCurrency(entry.previous_cost)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}