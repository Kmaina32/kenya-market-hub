
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    listing_type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    location_address: '',
    city: '',
    county: '',
    contact_phone: '',
    contact_email: '',
    amenities: [] as string[],
    features: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.property_type) newErrors.property_type = 'Property type is required';
    if (!formData.listing_type) newErrors.listing_type = 'Listing type is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.location_address.trim()) newErrors.location_address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPropertyMutation = useMutation({
    mutationFn: async (propertyData: typeof formData) => {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          owner_id: user?.id,
          price: parseFloat(propertyData.price),
          bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : null,
          bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms) : null,
          area_sqm: propertyData.area_sqm ? parseFloat(propertyData.area_sqm) : null,
          status: 'available',
          views_count: 0,
          is_featured: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Property listed successfully!');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to list property: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      property_type: '',
      listing_type: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area_sqm: '',
      location_address: '',
      city: '',
      county: '',
      contact_phone: '',
      contact_email: '',
      amenities: [],
      features: []
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createPropertyMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const propertyTypes = ['apartment', 'house', 'condo', 'townhouse', 'land'];
  const listingTypes = ['sale', 'rent'];
  const availableAmenities = ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony'];
  const availableFeatures = ['Furnished', 'Pet Friendly', 'Air Conditioning', 'Fireplace', 'Walk-in Closet'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List New Property</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Modern 3BR Apartment in Westlands"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="property_type">Property Type *</Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type && <p className="text-sm text-red-500 mt-1">{errors.property_type}</p>}
            </div>

            <div>
              <Label htmlFor="listing_type">Listing Type *</Label>
              <Select value={formData.listing_type} onValueChange={(value) => handleInputChange('listing_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      For {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.listing_type && <p className="text-sm text-red-500 mt-1">{errors.listing_type}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price (KSH) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="500000"
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="3"
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="2"
              />
            </div>

            <div>
              <Label htmlFor="area_sqm">Area (sqm)</Label>
              <Input
                id="area_sqm"
                type="number"
                value={formData.area_sqm}
                onChange={(e) => handleInputChange('area_sqm', e.target.value)}
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location_address">Address *</Label>
            <Input
              id="location_address"
              value={formData.location_address}
              onChange={(e) => handleInputChange('location_address', e.target.value)}
              placeholder="Full property address"
            />
            {errors.location_address && <p className="text-sm text-red-500 mt-1">{errors.location_address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Nairobi"
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                value={formData.county}
                onChange={(e) => handleInputChange('county', e.target.value)}
                placeholder="Nairobi County"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+254..."
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed property description..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              disabled={createPropertyMutation.isPending}
            >
              {createPropertyMutation.isPending ? 'Listing...' : 'List Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyModal;
