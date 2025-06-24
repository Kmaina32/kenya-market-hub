
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mock seed data for properties
const seedProperties = [
  {
    id: '1',
    title: 'Modern 3BR Apartment in Westlands',
    description: 'Spacious apartment with modern amenities, parking, and 24/7 security.',
    price: 4500000,
    property_type: 'apartment',
    listing_type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    location_address: 'Westlands, Nairobi',
    status: 'available',
    is_featured: true,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    contact_phone: '+254 712 345 678',
    contact_email: 'agent@realestate.com'
  },
  {
    id: '2',
    title: 'Executive Villa in Karen',
    description: 'Luxury 4-bedroom villa with garden, swimming pool, and servant quarters.',
    price: 85000,
    property_type: 'house',
    listing_type: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 250,
    location_address: 'Karen, Nairobi',
    status: 'available',
    is_featured: true,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    contact_phone: '+254 722 456 789',
    contact_email: 'karen@properties.com'
  },
  {
    id: '3',
    title: 'Commercial Office Space CBD',
    description: 'Prime office space in the heart of Nairobi CBD with excellent connectivity.',
    price: 2800000,
    property_type: 'commercial',
    listing_type: 'sale',
    bedrooms: 0,
    bathrooms: 2,
    area_sqm: 85,
    location_address: 'CBD, Nairobi',
    status: 'available',
    is_featured: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'],
    contact_phone: '+254 733 567 890',
    contact_email: 'cbd@offices.com'
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
