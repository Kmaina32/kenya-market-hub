
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { InputField, TextareaField, SelectField } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyData?: any;
}

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' }
];

const listingTypes = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' }
];

const validationSchema = {
  title: { required: true, minLength: 3 },
  price: { required: true },
  property_type: { required: true },
  listing_type: { required: true },
  location_address: { required: true, minLength: 5 },
  bedrooms: { required: true },
  bathrooms: { required: true }
};

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ 
  isOpen, 
  onClose, 
  propertyId, 
  propertyData 
}) => {
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();
  
  const initialValues = {
    title: propertyData?.title || '',
    description: propertyData?.description || '',
    price: propertyData?.price?.toString() || '',
    property_type: propertyData?.property_type || '',
    listing_type: propertyData?.listing_type || '',
    location_address: propertyData?.location_address || '',
    city: propertyData?.city || '',
    county: propertyData?.county || '',
    bedrooms: propertyData?.bedrooms?.toString() || '',
    bathrooms: propertyData?.bathrooms?.toString() || '',
    area_sqm: propertyData?.area_sqm?.toString() || '',
    contact_phone: propertyData?.contact_phone || '',
    contact_email: propertyData?.contact_email || ''
  };

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    initialValues,
    validationSchema
  );

  const updatePropertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      const { data, error } = await supabase
        .from('properties')
        .update({
          ...propertyData,
          price: parseFloat(propertyData.price),
          bedrooms: parseInt(propertyData.bedrooms),
          bathrooms: parseInt(propertyData.bathrooms),
          area_sqm: propertyData.area_sqm ? parseFloat(propertyData.area_sqm) : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      handleSuccess('Property updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      onClose();
    },
    onError: (error: any) => {
      handleError(error, { customMessage: 'Failed to update property' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updatePropertyMutation.mutate(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Property Title"
            name="title"
            value={values.title}
            onChange={(value) => handleChange('title', value)}
            onBlur={() => handleBlur('title')}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Property Type"
              name="property_type"
              value={values.property_type}
              onChange={(value) => handleChange('property_type', value)}
              options={propertyTypes}
              error={errors.property_type}
              required
            />

            <SelectField
              label="Listing Type"
              name="listing_type"
              value={values.listing_type}
              onChange={(value) => handleChange('listing_type', value)}
              options={listingTypes}
              error={errors.listing_type}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Price (KSH)"
              name="price"
              type="number"
              value={values.price}
              onChange={(value) => handleChange('price', value)}
              onBlur={() => handleBlur('price')}
              error={errors.price}
              required
            />

            <InputField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={values.bedrooms}
              onChange={(value) => handleChange('bedrooms', value)}
              onBlur={() => handleBlur('bedrooms')}
              error={errors.bedrooms}
              required
            />

            <InputField
              label="Bathrooms"
              name="bathrooms"
              type="number"
              value={values.bathrooms}
              onChange={(value) => handleChange('bathrooms', value)}
              onBlur={() => handleBlur('bathrooms')}
              error={errors.bathrooms}
              required
            />
          </div>

          <InputField
            label="Location Address"
            name="location_address"
            value={values.location_address}
            onChange={(value) => handleChange('location_address', value)}
            onBlur={() => handleBlur('location_address')}
            error={errors.location_address}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              value={values.city}
              onChange={(value) => handleChange('city', value)}
            />

            <InputField
              label="County"
              name="county"
              value={values.county}
              onChange={(value) => handleChange('county', value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Area (sqm)"
              name="area_sqm"
              type="number"
              value={values.area_sqm}
              onChange={(value) => handleChange('area_sqm', value)}
            />

            <InputField
              label="Contact Phone"
              name="contact_phone"
              type="tel"
              value={values.contact_phone}
              onChange={(value) => handleChange('contact_phone', value)}
            />
          </div>

          <InputField
            label="Contact Email"
            name="contact_email"
            type="email"
            value={values.contact_email}
            onChange={(value) => handleChange('contact_email', value)}
          />

          <TextareaField
            label="Description"
            name="description"
            value={values.description}
            onChange={(value) => handleChange('description', value)}
            rows={4}
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
              loading={updatePropertyMutation.isPending}
              className="flex-1"
            >
              Update Property
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyModal;
