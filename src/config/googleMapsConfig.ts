
import { supabase } from '@/integrations/supabase/client';

class GoogleMapsConfig {
  private apiKey: string | null = null;
  private isInitialized = false;

  async getApiKey(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (!this.apiKey) {
      throw new Error('Google Maps API key not configured');
    }
    
    return this.apiKey;
  }

  private async initialize(): Promise<void> {
    try {
      // First try to get from environment variable
      const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (envKey) {
        this.apiKey = envKey;
        this.isInitialized = true;
        return;
      }

      // If not in environment, try to get from Supabase secrets
      const { data, error } = await supabase.rpc('get_google_maps_api_key');
      if (error) {
        console.error('Failed to get Google Maps API key:', error);
        throw new Error('Google Maps API key not available');
      }
      
      this.apiKey = data;
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Google Maps config:', error);
      throw error;
    }
  }

  // Reset the configuration (useful for testing)
  reset(): void {
    this.apiKey = null;
    this.isInitialized = false;
  }
}

export const googleMapsConfig = new GoogleMapsConfig();
