
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProperty } from '@/hooks/useProperties';

interface CreatePropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location_address: '',
    city: '',
    county: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    property_type: 'house' as const,
    listing_type: 'sale',
    image_url: ''
  });

  const createProperty = useCreateProperty();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProperty.mutate({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      location_address: formData.location_address,
      city: formData.city,
      county: formData.county,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      area_sqm: parseInt(formData.area_sqm) || 0,
      property_type: formData.property_type,
      listing_type: formData.listing_type,
      image_url: formData.image_url,
      is_featured: false,
      amenities: []
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          title: '',
          description: '',
          price: '',
          location_address: '',
          city: '',
          county: '',
          bedrooms: '',
          bathrooms: '',
          area_sqm: '',
          property_type: 'house',
          listing_type: 'sale',
          image_url: ''
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price (KSh) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location_address">Location Address *</Label>
              <Input
                id="location_address"
                value={formData.location_address}
                onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="county">County *</Label>
              <Input
                id="county"
                value={formData.county}
                onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, property_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="area_sqm">Area (m²)</Label>
              <Input
                id="area_sqm"
                type="number"
                value={formData.area_sqm}
                onChange={(e) => setFormData(prev => ({ ...prev, area_sqm: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="listing_type">Listing Type</Label>
              <Select value={formData.listing_type} onValueChange={(value) => setFormData(prev => ({ ...prev, listing_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProperty.isPending}>
              {createProperty.isPending ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyModal;
