// src/integrations/googlemaps/googleMapsLoader.ts

import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '@/integrations/supabase/client';

let loader: Loader | null = null;
let googleMapsInstance: typeof google.maps | null = null;
let apiKey: string | null = null;

// Function to get API key from Supabase secrets
const getGoogleMapsApiKey = async (): Promise<string | null> => {
  if (apiKey) return apiKey;
  
  try {
    // In production, this would be fetched from an edge function that has access to secrets
    // For now, we'll use a fallback but this needs to be properly implemented
    console.warn('Google Maps API Key should be fetched from Supabase secrets via an edge function');
    return null;
  } catch (error) {
    console.error('Failed to fetch Google Maps API key:', error);
    return null;
  }
};

// Function to load the Google Maps API
export const loadGoogleMapsScript = async (): Promise<typeof google.maps | null> => {
  if (googleMapsInstance) {
    return googleMapsInstance; // Already loaded
  }

  const key = await getGoogleMapsApiKey();
  if (!key) {
    console.error('Google Maps API Key is not available. Please configure it in Supabase secrets.');
    return null;
  }

  if (!loader) {
    loader = new Loader({
      apiKey: key,
      version: 'weekly',
      libraries: ['places', 'geometry'], 
      language: 'en',
      region: 'KE', 
    });
  }

  try {
    await loader.load();
    googleMapsInstance = window.google.maps;
    console.log('Google Maps API loaded successfully!');
    return googleMapsInstance;
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
    return null;
  }
};

export const getGeocodingService = (): google.maps.Geocoder | null => {
  if (googleMapsInstance) {
    return new google.maps.Geocoder();
  }
  return null;
};

export const getDirectionsService = (): google.maps.DirectionsService | null => {
  if (googleMapsInstance) {
    return new google.maps.DirectionsService();
  }
  return null;
};

export const getPlacesService = (map: google.maps.Map): google.maps.places.PlacesService | null => {
  if (googleMapsInstance) {
    return new google.maps.places.PlacesService(map);
  }
  return null;
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> => {
  const geocoder = getGeocodingService();
  if (!geocoder) {
    console.error('Geocoder service not available.');
    return null;
  }

  return new Promise((resolve) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: results[0].formatted_address,
        });
      } else {
        console.error('Geocoding failed due to:', status);
        resolve(null);
      }
    });
  });
};

export const getRouteDetails = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<{ distanceKm: number; etaMinutes: number; path: google.maps.LatLng[] } | null> => {
  const directionsService = getDirectionsService();
  if (!directionsService) {
    console.error('Directions service not available.');
    return null;
  }

  return new Promise((resolve) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && response && response.routes && response.routes[0]) {
          const route = response.routes[0].legs[0];
          const distance = route.distance ? route.distance.value / 1000 : 0;
          const duration = route.duration ? route.duration.value / 60 : 0;
          const path = response.routes[0].overview_path;
          resolve({ distanceKm: distance, etaMinutes: duration, path: path });
        } else {
          console.error('Directions request failed due to ' + status);
          resolve(null);
        }
      }
    );
  });
};
