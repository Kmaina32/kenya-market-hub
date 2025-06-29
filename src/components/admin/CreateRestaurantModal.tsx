
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRestaurantModal: React.FC<CreateRestaurantModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine_type: '',
    address: '',
    phone: '',
    image_url: '',
    delivery_fee: '0',
    minimum_order: '0',
    delivery_time_minutes: '30'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.cuisine_type.trim()) newErrors.cuisine_type = 'Cuisine type is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createRestaurantMutation = useMutation({
    mutationFn: async (restaurantData: typeof formData) => {
      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          ...restaurantData,
          delivery_fee: parseFloat(restaurantData.delivery_fee),
          minimum_order: parseFloat(restaurantData.minimum_order),
          delivery_time_minutes: parseInt(restaurantData.delivery_time_minutes),
          is_active: true,
          rating: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Restaurant added successfully!');
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to add restaurant: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cuisine_type: '',
      address: '',
      phone: '',
      image_url: '',
      delivery_fee: '0',
      minimum_order: '0',
      delivery_time_minutes: '30'
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createRestaurantMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const cuisineTypes = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Japanese',
    'Thai', 'Mediterranean', 'French', 'Korean', 'African', 'Kenyan'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Restaurant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Pizza Palace"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="cuisine_type">Cuisine Type *</Label>
              <Select value={formData.cuisine_type} onValueChange={(value) => handleInputChange('cuisine_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cuisine_type && <p className="text-sm text-red-500 mt-1">{errors.cuisine_type}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the restaurant"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Full restaurant address"
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+254..."
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="delivery_time_minutes">Delivery Time (minutes)</Label>
              <Input
                id="delivery_time_minutes"
                type="number"
                value={formData.delivery_time_minutes}
                onChange={(e) => handleInputChange('delivery_time_minutes', e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delivery_fee">Delivery Fee (KSH)</Label>
              <Input
                id="delivery_fee"
                type="number"
                step="0.01"
                value={formData.delivery_fee}
                onChange={(e) => handleInputChange('delivery_fee', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="minimum_order">Minimum Order (KSH)</Label>
              <Input
                id="minimum_order"
                type="number"
                step="0.01"
                value={formData.minimum_order}
                onChange={(e) => handleInputChange('minimum_order', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              disabled={createRestaurantMutation.isPending}
            >
              {createRestaurantMutation.isPending ? 'Adding...' : 'Add Restaurant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRestaurantModal;
