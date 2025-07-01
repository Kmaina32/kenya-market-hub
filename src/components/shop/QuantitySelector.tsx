
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'default';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = 'default'
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const sizeClasses = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className={`${sizeClasses} p-0 rounded-full`}
        onClick={handleDecrease}
        disabled={quantity <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className={`min-w-8 text-center font-medium ${textSize}`}>
        {quantity}
      </span>
      <Button
        variant="outline"
        size="sm"
        className={`${sizeClasses} p-0 rounded-full`}
        onClick={handleIncrease}
        disabled={quantity >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};
