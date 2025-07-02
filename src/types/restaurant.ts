
export interface Restaurant {
  id: string;
  business_name: string;
  business_description?: string;
  business_address: string;
  business_phone?: string;
  business_email?: string;
  category: string;
  cuisine_type?: string;
  delivery_fee: number;
  delivery_time_min: number;
  delivery_time_max: number;
  min_order_value: number;
  average_rating?: number;
  total_reviews?: number;
  is_active?: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
