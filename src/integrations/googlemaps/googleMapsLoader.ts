// src/integrations/googlemaps/googleMapsLoader.ts

import { Loader } from '@googlemaps/js-api-loader';

// FIX: Use import.meta.env and ensure your environment variable is prefixed with VITE_
const API_KEY = import.meta.env.VITE_Maps_API_KEY || ''; 

let loader: Loader | null = null;
let googleMapsInstance: typeof google.maps | null = null;

// Function to load the Google Maps API
export const loadGoogleMapsScript = async (): Promise<typeof google.maps | null> => {
  if (googleMapsInstance) {
    return googleMapsInstance; // Already loaded
  }

  // FIX: Update the console error message to reflect the correct environment variable name
  if (!API_KEY) {
    console.error('Google Maps API Key (VITE_Maps_API_KEY) is not set in environment variables.');
    return null;
  }

  if (!loader) {
    loader = new Loader({
      apiKey: API_KEY,
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