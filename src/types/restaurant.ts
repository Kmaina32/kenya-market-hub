
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  cuisine_type: string;
  image_url?: string;
  rating: number;
  delivery_time_minutes: number;
  delivery_fee: number;
  minimum_order: number;
  is_active: boolean;
  phone?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}
