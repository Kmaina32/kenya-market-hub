
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViewProductModalProps {
  open: boolean;
  product: any;
  onOpenChange: (open: boolean) => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ 
  open, 
  product, 
  onOpenChange 
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Product Details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {product.image_url && (
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Brand</p>
              <p className="text-sm">{product.brand || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Price</p>
              <p className="text-lg font-bold text-green-600">
                KSH {Number(product.price).toLocaleString()}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Stock</p>
              <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <p className="text-sm">{product.rating}/5 ({product.reviews_count} reviews)</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm">{new Date(product.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {product.description && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
