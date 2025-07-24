
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

      // Try to get from a direct query since the RPC function doesn't exist
      // This is a fallback - ideally you'd store this in Supabase secrets
      // and create a proper RPC function
      console.warn('Google Maps API key should be configured in environment variables or Supabase secrets');
      
      // For now, use a placeholder that will cause the API to fail gracefully
      this.apiKey = 'CONFIGURE_GOOGLE_MAPS_API_KEY';
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
