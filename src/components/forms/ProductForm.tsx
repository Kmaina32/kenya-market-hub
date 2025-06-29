
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateInput, validateEmail } from '@/utils/authUtils';

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    brand: product?.brand || '',
    condition: product?.condition || 'new',
    location: product?.location || '',
    image_url: product?.image_url || '',
    stock_quantity: product?.stock_quantity || 0,
    vendor: product?.vendor || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateInput(formData.name, 100)) {
      newErrors.name = 'Product name is required (max 100 characters)';
    }

    if (!validateInput(formData.description, 1000)) {
      newErrors.description = 'Description is required (max 1000 characters)';
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!validateInput(formData.category, 50)) {
      newErrors.category = 'Category is required (max 50 characters)';
    }

    const stockQuantity = parseInt(formData.stock_quantity.toString());
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Sanitize all text inputs
    const sanitizedData = {
      ...formData,
      name: validateInput(formData.name, 100),
      description: validateInput(formData.description, 1000),
      category: validateInput(formData.category, 50),
      brand: validateInput(formData.brand, 50),
      location: validateInput(formData.location, 100),
      vendor: validateInput(formData.vendor, 100),
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity.toString()),
    };

    onSubmit(sanitizedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={100}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={1000}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (KSH) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                min="0"
                step="0.01"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                min="0"
                className={errors.stock_quantity ? 'border-red-500' : ''}
              />
              {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                maxLength={50}
              />
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => handleInputChange('condition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              maxLength={100}
              placeholder="e.g., Nairobi, Kenya"
            />
          </div>

          <div>
            <Label htmlFor="vendor">Vendor/Store Name</Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
