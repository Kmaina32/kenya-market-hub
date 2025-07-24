
import { googleMapsConfig } from '@/config/googleMapsConfig';

export class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async loadGoogleMaps(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.loadScript();
    
    try {
      await this.loadPromise;
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load Google Maps:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadScript(): Promise<void> {
    try {
      const apiKey = await googleMapsConfig.getApiKey();
      
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        
        document.head.appendChild(script);
      });
    } catch (error) {
      throw new Error(`Google Maps API key error: ${error}`);
    }
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && typeof google !== 'undefined' && google.maps;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
