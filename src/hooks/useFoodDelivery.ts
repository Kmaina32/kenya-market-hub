
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine_type: string;
  image_url?: string;
  rating: number;
  delivery_time_minutes: number;
  delivery_fee: number;
  minimum_order: number;
  is_active: boolean;
  phone?: string;
  address?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
}

export const useFoodDelivery = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants');
    }
  };

  const fetchMenuItems = async (restaurantId?: string) => {
    try {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query.order('category');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRestaurants();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    restaurants,
    menuItems,
    loading,
    error,
    fetchMenuItems,
    refetch: fetchRestaurants
  };
};
