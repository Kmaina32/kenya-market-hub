import { Loader } from '@googlemaps/js-api-loader';

// Use environment variable for API key - should be set in Supabase secrets
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
}

export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry'],
  region: 'KE', // Kenya region
  language: 'en'
});

export const loadGoogleMaps = async () => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }
  
  try {
    await googleMapsLoader.load();
    return window.google;
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
    throw error;
  }
};

// Keep the old function name for backward compatibility
export const loadGoogleMapsScript = loadGoogleMaps;

export const geocodeAddress = async (address: string) => {
  try {
    const google = await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise<{
      lat: number;
      lng: number;
      formattedAddress: string;
    } | null>((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formattedAddress: results[0].formatted_address
          });
        } else {
          console.error('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in geocodeAddress:', error);
    return null;
  }
};

export const getRouteDetails = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {
  try {
    const google = await loadGoogleMaps();
    const directionsService = new google.maps.DirectionsService();
    
    return new Promise<{
      distanceKm: number;
      etaMinutes: number;
      path: google.maps.LatLng[];
    } | null>((resolve) => {
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK' && response && response.routes && response.routes[0]) {
            const route = response.routes[0];
            const leg = route.legs[0];
            
            resolve({
              distanceKm: leg.distance?.value ? leg.distance.value / 1000 : 0,
              etaMinutes: leg.duration?.value ? Math.ceil(leg.duration.value / 60) : 0,
              path: route.overview_path
            });
          } else {
            console.error('Directions request failed:', status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in getRouteDetails:', error);
    return null;
  }
};
