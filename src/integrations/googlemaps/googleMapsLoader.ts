
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
