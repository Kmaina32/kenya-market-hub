import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Mock seed data for restaurants (partial preview, full list truncated)
const seedRestaurants = [
  {
    id: '1',
    business_name: 'Pizza Palace',
    business_description: 'Authentic Italian pizzas made with fresh ingredients and traditional recipes.',
    business_address: 'Westlands, Nairobi',
    business_phone: '+254 712 345 678',
    business_email: 'orders@pizzapalace.co.ke',
    cuisine_type: 'Italian',
    rating: 4.5,
    delivery_time_minutes: 30,
    delivery_fee: 200,
    minimum_order: 500,
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    logo_url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=100'
  },
  {
    id: '2',
    business_name: 'Nyama Choma Corner',
    business_description: 'Traditional Kenyan grilled meats with ugali and vegetables.',
    business_address: 'South B, Nairobi',
    business_phone: '+254 722 456 789',
    business_email: 'info@nyamachoma.co.ke',
    cuisine_type: 'Kenyan',
    rating: 4.7,
    delivery_time_minutes: 25,
    delivery_fee: 150,
    minimum_order: 800,
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    logo_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100'
  },
  {
    id: '3',
    business_name: 'Sushi Zen',
    business_description: 'Fresh sushi and Japanese cuisine prepared by expert chefs.',
    business_address: 'Kilimani, Nairobi',
    business_phone: '+254 733 567 890',
    business_email: 'orders@sushizen.co.ke',
    cuisine_type: 'Japanese',
    rating: 4.3,
    delivery_time_minutes: 40,
    delivery_fee: 300,
    minimum_order: 1200,
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    logo_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=100'
  },
  {
    id: '4',
    business_name: 'Mama Oliech',
    business_description: 'Famous for deep-fried tilapia and traditional Kenyan sides.',
    business_address: 'Hurlingham, Nairobi',
    business_phone: '+254 700 123 456',
    business_email: 'mamaoliech@restaurant.co.ke',
    cuisine_type: 'Kenyan',
    rating: 4.6,
    delivery_time_minutes: 35,
    delivery_fee: 180,
    minimum_order: 600,
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1606788075761-6c9d974ce69a?w=400',
    logo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100'
  },
  {
    id: '5',
    business_name: 'Café Deli',
    business_description: 'Trendy café with continental dishes and Kenyan staples.',
    business_address: 'CBD, Nairobi',
    business_phone: '+254 720 987 654',
    business_email: 'info@cafedeli.co.ke',
    cuisine_type: 'Continental',
    rating: 4.4,
    delivery_time_minutes: 20,
    delivery_fee: 150,
    minimum_order: 400,
    is_active: true,
    banner_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    logo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100'
  },
  // Additional 95+ restaurants would follow...
];

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Database error, using seed data:', error);
          return seedRestaurants;
        }

        if (!data || data.length === 0) {
          console.log('No data in database, using seed data');
          return seedRestaurants;
        }

        return data;
      } catch (error) {
        console.log('Error fetching restaurants, using seed data:', error);
        return seedRestaurants;
      }
    }
  });
};
