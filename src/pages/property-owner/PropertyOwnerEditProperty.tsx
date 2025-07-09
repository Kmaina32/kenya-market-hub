import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateProperty, useDeleteProperty, PropertyFormData } from '@/hooks/usePropertyManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PropertyImageManager from '@/components/property-owner/PropertyImageManager';
import { useToast } from '@/hooks/use-toast';

const PropertyOwnerEditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    property_type: 'apartment' as const,
    listing_type: 'sale' as const,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area_sqm: 0,
    location_address: '',
    county: '',
    city: '',
    amenities: [],
    features: [],
    contact_phone: '',
    contact_email: '',
    available_from: '',
    is_featured: false
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        property_type: property.property_type || 'apartment',
        listing_type: property.listing_type || 'sale',
        price: property.price || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area_sqm: property.area_sqm || 0,
        location_address: property.location_address || '',
        county: property.county || '',
        city: property.city || '',
        amenities: (property.amenities as string[]) || [],
        features: (property.features as string[]) || [],
        contact_phone: property.contact_phone || '',
        contact_email: property.contact_email || '',
        available_from: property.available_from || '',
        is_featured: property.is_featured || false
      });
      setExistingImages((property.images as string[]) || []);
    }
  }, [property]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...(prev.amenities || []), amenity]
        : (prev.amenities || []).filter(a => a !== amenity)
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setExistingImages(images);
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      await updateProperty.mutateAsync({
        id,
        data: formData
      });
      
      navigate('/property-owner/properties');
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deleteProperty.mutateAsync(id);
        navigate('/property-owner/properties');
      } catch (error) {
        console.error('Failed to delete property:', error);
      }
    }
  };

  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony',
    'Air Conditioning', 'Elevator', 'Backup Generator', 'CCTV'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Property not found</p>
        <Button 
          onClick={() => navigate('/property-owner/properties')}
          className="mt-4"
        >
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg flex-1 mr-4">
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-blue-100 mt-2">Update your property listing</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/property-owner/properties')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteProperty.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Property
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the basic details of your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Title *</label>
                  <Input 
                    placeholder="e.g., Modern 3BR Apartment in Westlands" 
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea 
                    placeholder="Describe your property..." 
                    rows={4}
                    className="resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type *</label>
                    <Select 
                      value={formData.property_type}
                      onValueChange={(value) => handleInputChange('property_type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Listing Type *</label>
                    <Select 
                      value={formData.listing_type}
                      onValueChange={(value) => handleInputChange('listing_type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Update the property location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Address *</label>
                  <Input 
                    placeholder="e.g., 123 Westlands Road, Nairobi" 
                    value={formData.location_address}
                    onChange={(e) => handleInputChange('location_address', e.target.value)}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input 
                      placeholder="e.g., Nairobi" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">County</label>
                    <Input 
                      placeholder="e.g., Nairobi County" 
                      value={formData.county}
                      onChange={(e) => handleInputChange('county', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Update property features and amenities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={formData.bedrooms || ''}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={formData.bathrooms || ''}
                      onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (m²)</label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={formData.area_sqm || ''}
                      onChange={(e) => handleInputChange('area_sqm', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={amenity}
                          checked={formData.amenities?.includes(amenity) || false}
                          onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                        />
                        <label htmlFor={amenity} className="text-sm">{amenity}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>Manage your property images</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyImageManager
                  images={existingImages}
                  onImagesChange={handleImagesChange}
                  onNewImagesUpload={() => {}}
                  maxImages={10}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Update your property price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (KSh) *</label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    required 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', !!checked)}
                  />
                  <label htmlFor="featured" className="text-sm">Mark as Featured (+10% visibility)</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input 
                    placeholder="+254 XXX XXX XXX" 
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available From</label>
                  <Input 
                    type="date" 
                    value={formData.available_from}
                    onChange={(e) => handleInputChange('available_from', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              disabled={updateProperty.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProperty.isPending ? 'Updating...' : 'Update Property'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyOwnerEditProperty;
