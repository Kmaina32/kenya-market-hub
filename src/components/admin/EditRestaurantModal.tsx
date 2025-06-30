
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { InputField, TextareaField, SelectField } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantData?: any;
}

const cuisineTypes = [
  { value: 'italian', label: 'Italian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'indian', label: 'Indian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'american', label: 'American' },
  { value: 'kenyan', label: 'Kenyan' },
  { value: 'ethiopian', label: 'Ethiopian' },
  { value: 'fast-food', label: 'Fast Food' },
  { value: 'seafood', label: 'Seafood' }
];

const validationSchema = {
  name: { required: true, minLength: 2 },
  cuisine_type: { required: true },
  phone: { required: true },
  address: { required: true }
};

const EditRestaurantModal: React.FC<EditRestaurantModalProps> = ({ 
  isOpen, 
  onClose, 
  restaurantId, 
  restaurantData 
}) => {
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();
  
  const initialValues = {
    name: restaurantData?.name || '',
    description: restaurantData?.description || '',
    cuisine_type: restaurantData?.cuisine_type || '',
    address: restaurantData?.address || '',
    phone: restaurantData?.phone || '',
    image_url: restaurantData?.image_url || '',
    delivery_fee: restaurantData?.delivery_fee?.toString() || '0',
    minimum_order: restaurantData?.minimum_order?.toString() || '0',
    delivery_time_minutes: restaurantData?.delivery_time_minutes?.toString() || '30'
  };

  const { values, errors, handleChange, handleBlur, validateForm } = useFormValidation(
    initialValues,
    validationSchema
  );

  const updateRestaurantMutation = useMutation({
    mutationFn: async (restaurantData: any) => {
      const { data, error } = await supabase
        .from('restaurants')
        .update({
          ...restaurantData,
          delivery_fee: parseFloat(restaurantData.delivery_fee),
          minimum_order: parseFloat(restaurantData.minimum_order),
          delivery_time_minutes: parseInt(restaurantData.delivery_time_minutes),
          updated_at: new Date().toISOString()
        })
        .eq('id', restaurantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      handleSuccess('Restaurant updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      onClose();
    },
    onError: (error: any) => {
      handleError(error, { customMessage: 'Failed to update restaurant' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateRestaurantMutation.mutate(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Restaurant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Restaurant Name"
            name="name"
            value={values.name}
            onChange={(value) => handleChange('name', value)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            required
          />

          <SelectField
            label="Cuisine Type"
            name="cuisine_type"
            value={values.cuisine_type}
            onChange={(value) => handleChange('cuisine_type', value)}
            options={cuisineTypes}
            error={errors.cuisine_type}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={(value) => handleChange('phone', value)}
              onBlur={() => handleBlur('phone')}
              error={errors.phone}
              required
            />

            <InputField
              label="Delivery Time (minutes)"
              name="delivery_time_minutes"
              type="number"
              value={values.delivery_time_minutes}
              onChange={(value) => handleChange('delivery_time_minutes', value)}
            />
          </div>

          <InputField
            label="Address"
            name="address"
            value={values.address}
            onChange={(value) => handleChange('address', value)}
            onBlur={() => handleBlur('address')}
            error={errors.address}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Delivery Fee (KSH)"
              name="delivery_fee"
              type="number"
              step="0.01"
              value={values.delivery_fee}
              onChange={(value) => handleChange('delivery_fee', value)}
            />

            <InputField
              label="Minimum Order (KSH)"
              name="minimum_order"
              type="number"
              step="0.01"
              value={values.minimum_order}
              onChange={(value) => handleChange('minimum_order', value)}
            />
          </div>

          <InputField
            label="Image URL"
            name="image_url"
            value={values.image_url}
            onChange={(value) => handleChange('image_url', value)}
            placeholder="https://..."
          />

          <TextareaField
            label="Description"
            name="description"
            value={values.description}
            onChange={(value) => handleChange('description', value)}
            rows={3}
          />

          <div className="flex gap-3 pt-4">
            <LoadingButton
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              loading={updateRestaurantMutation.isPending}
              className="flex-1"
            >
              Update Restaurant
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRestaurantModal;
