import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, ShoppingCart, ShieldAlert } from 'lucide-react';
import type { Medication } from '@/hooks/useMedications';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface MedicationCardProps {
  medication: Medication;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
  const { addToCart } = useCartContext();

  const handleAddToCart = () => {
    addToCart(medication.id);
    toast({
      title: "Added to cart",
      description: `${medication.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="relative h-40 bg-gray-100 flex items-center justify-center rounded-t-lg mb-4">
          {medication.image_url ? (
            <img src={medication.image_url} alt={medication.name} className="h-full w-full object-contain p-2" />
          ) : (
            <Pill className="h-16 w-16 text-gray-400" />
          )}
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-1">{medication.name}</CardTitle>
        <CardDescription>{medication.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2 h-10">{medication.description || 'No description available.'}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {medication.requires_prescription && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Prescription Required
            </Badge>
          )}
          {medication.stock_quantity !== null && (
            <Badge variant={medication.stock_quantity > 0 ? "secondary" : "outline"}>
              {medication.stock_quantity > 0 ? `In Stock: ${medication.stock_quantity}` : 'Out of Stock'}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4">
        <p className="text-xl font-bold text-gray-800">Ksh {medication.price.toFixed(2)}</p>
        <Button size="sm" disabled={!medication.stock_quantity || medication.stock_quantity <= 0} onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicationCard;
