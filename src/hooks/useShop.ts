
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ShopCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  display_order: number;
}

export interface FeaturedProduct {
  id: string;
  product_id: string;
  category: string;
  is_active: boolean;
  featured_until?: string;
  product?: {
    name: string;
    price: number;
    image_url?: string;
    rating?: number;
  };
}

export const useShop = () => {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching shop categories:', err);
      setError('Failed to load shop categories');
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_products')
        .select(`
          *,
          product:products (
            name,
            price,
            image_url,
            rating
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError('Failed to load featured products');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchFeaturedProducts()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    categories,
    featuredProducts,
    loading,
    error,
    refetch: () => {
      fetchCategories();
      fetchFeaturedProducts();
    }
  };
};
