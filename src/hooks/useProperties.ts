
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PropertyFilters {
  property_type?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  location?: string;
}

// Mock seed data for properties
const seedProperties = [
  {
    id: '1',
    owner_id: 'seed-owner-1',
    agent_id: null,
    title: 'Modern 3BR Apartment in Westlands',
    description: 'Spacious apartment with modern amenities, parking, and 24/7 security.',
    price: 4500000,
    property_type: 'apartment',
    listing_type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    location_address: 'Westlands, Nairobi',
    location_coordinates: { lat: -1.2647, lng: 36.8062 },
    county: 'Nairobi',
    city: 'Nairobi',
    amenities: ['Parking', '24/7 Security', 'Swimming Pool', 'Gym', 'Balcony'],
    features: ['Modern Kitchen', 'Master En-suite', 'Spacious Living Room'],
    status: 'available',
    is_featured: true,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    virtual_tour_url: 'https://example.com/virtual-tour-1',
    contact_phone: '+254 712 345 678',
    contact_email: 'agent@realestate.com',
    views_count: 245,
    available_from: '2024-02-01',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    owner_id: 'seed-owner-2',
    agent_id: null,
    title: 'Executive Villa in Karen',
    description: 'Luxury 4-bedroom villa with garden, swimming pool, and servant quarters.',
    price: 85000,
    property_type: 'house',
    listing_type: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 250,
    location_address: 'Karen, Nairobi',
    location_coordinates: { lat: -1.3197, lng: 36.6859 },
    county: 'Nairobi',
    city: 'Karen',
    amenities: ['Swimming Pool', 'Garden', 'Servant Quarters', 'Garage', 'Security'],
    features: ['Spacious Rooms', 'Modern Kitchen', 'Study Room', 'Family Room'],
    status: 'available',
    is_featured: true,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    virtual_tour_url: 'https://example.com/virtual-tour-2',
    contact_phone: '+254 722 456 789',
    contact_email: 'karen@properties.com',
    views_count: 189,
    available_from: '2024-01-20',
    created_at: '2024-01-10T14:20:00Z',
    updated_at: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    owner_id: 'seed-owner-3',
    agent_id: null,
    title: 'Commercial Office Space CBD',
    description: 'Prime office space in the heart of Nairobi CBD with excellent connectivity.',
    price: 2800000,
    property_type: 'commercial',
    listing_type: 'sale',
    bedrooms: 0,
    bathrooms: 2,
    area_sqm: 85,
    location_address: 'CBD, Nairobi',
    location_coordinates: { lat: -1.2864, lng: 36.8172 },
    county: 'Nairobi',
    city: 'Nairobi',
    amenities: ['Elevator', 'Parking', 'Security', 'Air Conditioning', 'High Speed Internet'],
    features: ['Prime Location', 'Modern Facilities', 'Conference Room', 'Reception Area'],
    status: 'available',
    is_featured: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'],
    virtual_tour_url: null,
    contact_phone: '+254 733 567 890',
    contact_email: 'cbd@offices.com',
    views_count: 156,
    available_from: '2024-01-15',
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z'
  }
];

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Database error, using seed data:', error);
          return seedProperties;
        }

        // If no data from database, return seed data
        if (!data || data.length === 0) {
          console.log('No data in database, using seed data');
          return seedProperties;
        }

        return data;
      } catch (error) {
        console.log('Error fetching properties, using seed data:', error);
        return seedProperties;
      }
    }
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.log('Database error, checking seed data:', error);
          const seedProperty = seedProperties.find(p => p.id === id);
          if (seedProperty) return seedProperty;
          throw error;
        }

        return data;
      } catch (error) {
        console.log('Error fetching property, checking seed data:', error);
        const seedProperty = seedProperties.find(p => p.id === id);
        if (seedProperty) return seedProperty;
        throw error;
      }
    },
    enabled: !!id
  });
};

export const useCreatePropertyInquiry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryData: {
      property_id: string;
      inquirer_name: string;
      inquirer_email: string;
      inquirer_phone: string;
      message: string;
    }) => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert([inquiryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Inquiry Sent',
        description: 'Your property inquiry has been sent successfully. The property owner will contact you soon.',
      });
      queryClient.invalidateQueries({ queryKey: ['property-inquiries'] });
    },
    onError: (error) => {
      console.error('Error creating property inquiry:', error);
      toast({
        title: 'Error',
        description: 'Failed to send inquiry. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
