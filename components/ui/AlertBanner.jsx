'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-900'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-900'
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-900'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900'
  }
};

export default function AlertBanner({ 
  variant = 'info', 
  title, 
  message,
  className 
}) {
  const { icon: Icon, className: variantClassName } = variants[variant];

  return (
    <Alert className={cn(variantClassName, className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}