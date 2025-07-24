
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { InputField, TextareaField, SelectField } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useCreateMenuItem } from '@/hooks/useMenuItems';

interface CreateMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
}

const menuCategories = [
  { value: 'appetizers', label: 'Appetizers' },
  { value: 'mains', label: 'Main Courses' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'sides', label: 'Side Dishes' },
  { value: 'specials', label: 'Specials' }
];

const validationSchema = {
  name: { required: true, minLength: 2 },
  price: { required: true, min: 0 },
  category: { required: true }
};

const CreateMenuItemModal: React.FC<CreateMenuItemModalProps> = ({ 
  isOpen, 
  onClose, 
  restaurantId 
}) => {
  const createMenuItemMutation = useCreateMenuItem();
  
  const initialValues = {
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true
  };

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createMenuItemMutation.mutate({
        restaurant_id: restaurantId,
        name: values.name,
        description: values.description || undefined,
        price: parseFloat(values.price),
        category: values.category,
        image_url: values.image_url || undefined,
        is_available: values.is_available
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (createMenuItemMutation.isSuccess) {
      handleClose();
    }
  }, [createMenuItemMutation.isSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Item Name"
            name="name"
            value={values.name}
            onChange={(value) => handleChange('name', value)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Price (KSH)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={values.price}
              onChange={(value) => handleChange('price', value)}
              onBlur={() => handleBlur('price')}
              error={errors.price}
              required
            />

            <SelectField
              label="Category"
              name="category"
              value={values.category}
              onChange={(value) => handleChange('category', value)}
              options={menuCategories}
              error={errors.category}
              required
            />
          </div>

          <TextareaField
            label="Description"
            name="description"
            value={values.description}
            onChange={(value) => handleChange('description', value)}
            rows={3}
          />

          <InputField
            label="Image URL"
            name="image_url"
            value={values.image_url}
            onChange={(value) => handleChange('image_url', value)}
            placeholder="https://..."
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_available"
              checked={values.is_available}
              onChange={(e) => handleChange('is_available', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="is_available" className="text-sm text-gray-700">
              Available for ordering
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <LoadingButton
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              loading={createMenuItemMutation.isPending}
              className="flex-1"
            >
              Add Menu Item
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenuItemModal;
