// src/integrations/googlemaps/googleMapsLoader.ts

import { Loader } from '@googlemaps/js-api-loader';

// FIX: Use the environment variable here for the API key
const API_KEY = process.env.REACT_APP_Maps_API_KEY || ''; 

let loader: Loader | null = null;
let googleMapsInstance: typeof google.maps | null = null;

// Function to load the Google Maps API
export const loadGoogleMapsScript = async (): Promise<typeof google.maps | null> => {
  if (googleMapsInstance) {
    return googleMapsInstance; // Already loaded
  }

  // FIX: Update the console error message to reflect environment variable
  if (!API_KEY) {
    console.error('Google Maps API Key (REACT_APP_Maps_API_KEY) is not set in environment variables.');
    return null;
  }

  if (!loader) {
    loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly', // Or 'beta' for latest features, '3.x' for specific version
      libraries: ['places', 'geometry'], // 'places' for geocoding/autocomplete, 'geometry' for distance calculations etc.
      language: 'en', // Or 'sw' for Swahili, 'fr' for French, etc.
      region: 'KE', // Set region to Kenya for localized results
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

// Functions to get Google Maps services (will be initialized after script loads)
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

// Utility function to convert place name to coordinates (simple geocoding)
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

// Utility function to get directions (distance and duration)
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
          const distance = route.distance ? route.distance.value / 1000 : 0; // meters to km
          const duration = route.duration ? route.duration.value / 60 : 0; // seconds to minutes
          const path = response.routes[0].overview_path; // Array of LatLng objects for the route line
          resolve({ distanceKm: distance, etaMinutes: duration, path: path });
        } else {
          console.error('Directions request failed due to ' + status);
          resolve(null);
        }
      }
    );
  });
};