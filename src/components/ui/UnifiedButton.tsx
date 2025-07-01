
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export const UnifiedButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(({
  variant = 'primary',
  size = 'default',
  loading = false,
  icon,
  fullWidth = false,
  asChild = false,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md';
      case 'secondary':
        return 'bg-orange-100 text-orange-900 hover:bg-orange-200 border border-orange-200';
      case 'outline':
        return 'border-2 border-orange-200 text-orange-600 hover:bg-orange-50 bg-white';
      case 'ghost':
        return 'hover:bg-orange-50 hover:text-orange-600 text-gray-700';
      case 'destructive':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md';
    }
  };

  return (
    <Button
      ref={ref}
      asChild={asChild}
      className={cn(
        'transition-all duration-200 font-medium',
        getVariantStyles(),
        fullWidth && 'w-full',
        className
      )}
      size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {children}
        </>
      ) : icon ? (
        <>
          <span className="mr-2">{icon}</span>
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
});

UnifiedButton.displayName = 'UnifiedButton';
