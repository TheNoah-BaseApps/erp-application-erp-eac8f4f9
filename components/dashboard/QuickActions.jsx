'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Users, DollarSign, FileText } from 'lucide-react';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: 'Add Product',
      icon: Package,
      onClick: () => router.push('/products'),
      color: 'blue'
    },
    {
      label: 'Add Customer',
      icon: Users,
      onClick: () => router.push('/customers'),
      color: 'green'
    },
    {
      label: 'Add Cost Entry',
      icon: DollarSign,
      onClick: () => router.push('/product-costs'),
      color: 'yellow'
    },
    {
      label: 'View Reports',
      icon: FileText,
      onClick: () => router.push('/reports'),
      color: 'gray'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}