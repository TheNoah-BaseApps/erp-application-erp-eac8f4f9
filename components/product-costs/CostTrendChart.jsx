'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CostTrendChart({ data }) {
  // Simple placeholder for cost trend visualization
  // In a real application, you would use a charting library like recharts or chart.js
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Trend</CardTitle>
        <CardDescription>Visual representation of cost changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chart visualization would appear here</p>
        </div>
      </CardContent>
    </Card>
  );
}