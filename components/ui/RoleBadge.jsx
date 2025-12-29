'use client';

import { Badge } from '@/components/ui/badge';
import { getRoleLabel, getRoleColor } from '@/lib/permissions';
import { cn } from '@/lib/utils';

export default function RoleBadge({ role }) {
  const color = getRoleColor(role);
  const label = getRoleLabel(role);

  const colorClasses = {
    red: 'bg-red-100 text-red-700 border-red-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <Badge variant="outline" className={cn(colorClasses[color])}>
      {label}
    </Badge>
  );
}