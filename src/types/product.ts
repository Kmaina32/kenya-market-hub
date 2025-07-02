
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  brand?: string;
  vendor?: string;
  vendor_id?: string;
  image_url?: string;
  make?: string;
  model?: string;
  year?: number;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  stock_quantity: number;
  tags?: string[];
  condition?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}
