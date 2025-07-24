
import { googleMapsConfig } from '@/config/googleMapsConfig';

export class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<typeof google.maps> | null = null;

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async loadGoogleMaps(): Promise<typeof google.maps> {
    if (this.isLoaded && typeof google !== 'undefined' && google.maps) {
      return google.maps;
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.loadScript();
    
    try {
      const maps = await this.loadPromise;
      this.isLoaded = true;
      return maps;
    } catch (error) {
      console.error('Failed to load Google Maps:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadScript(): Promise<typeof google.maps> {
    try {
      const apiKey = await googleMapsConfig.getApiKey();
      
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          if (typeof google !== 'undefined' && google.maps) {
            resolve(google.maps);
            return;
          }
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          if (typeof google !== 'undefined' && google.maps) {
            resolve(google.maps);
          } else {
            reject(new Error('Google Maps API failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        
        document.head.appendChild(script);
      });
    } catch (error) {
      throw new Error(`Google Maps API key error: ${error}`);
    }
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && typeof google !== 'undefined' && !!google.maps;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Export convenience functions
export const loadGoogleMapsScript = async (): Promise<typeof google.maps> => {
  return await googleMapsLoader.loadGoogleMaps();
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> => {
  try {
    const maps = await loadGoogleMapsScript();
    const geocoder = new maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formattedAddress: results[0].formatted_address
          });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getRouteDetails = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<{ distanceKm: number; etaMinutes: number; path: google.maps.LatLng[] } | null> => {
  try {
    const maps = await loadGoogleMapsScript();
    const directionsService = new maps.DirectionsService();
    
    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK' && response && response.routes && response.routes[0]) {
            const route = response.routes[0];
            const leg = route.legs[0];
            
            resolve({
              distanceKm: leg.distance ? leg.distance.value / 1000 : 0,
              etaMinutes: leg.duration ? Math.round(leg.duration.value / 60) : 0,
              path: route.overview_path
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    return null;
  }
};
