
// src/integrations/googlemaps/googleMapsLoader.ts

import { Loader } from '@googlemaps/js-api-loader';

// Use the provided Google Maps API key
const API_KEY = 'AIzaSyAFIC4z-WvYA6DYbJPMwrXxQTdIG4K-F_8';

let loader: Loader | null = null;
let googleMapsInstance: typeof google.maps | null = null;

// Function to load the Google Maps API
export const loadGoogleMapsScript = async (): Promise<typeof google.maps | null> => {
  if (googleMapsInstance) {
    return googleMapsInstance; // Already loaded
  }

  if (!API_KEY) {
    console.error('Google Maps API Key is not set.');
    return null;
  }

  if (!loader) {
    loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry', 'marker'], // Add marker library for AdvancedMarkerElement
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

  // Add better address formatting for Kenya
  const formattedAddress = address.trim();
  if (!formattedAddress) {
    console.error('Address cannot be empty');
    return null;
  }

  // Only add Kenya context if the address doesn't already contain location context
  const hasLocationContext = formattedAddress.toLowerCase().includes('kenya') || 
                            formattedAddress.toLowerCase().includes('nairobi') ||
                            formattedAddress.toLowerCase().includes('mombasa') ||
                            formattedAddress.toLowerCase().includes('kisumu');

  const searchAddress = hasLocationContext ? formattedAddress : `${formattedAddress}, Nairobi, Kenya`;

  return new Promise((resolve) => {
    geocoder.geocode({ 
      address: searchAddress,
      region: 'KE', // Bias results to Kenya
      componentRestrictions: { country: 'KE' } // Restrict to Kenya
    }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: results[0].formatted_address,
        });
      } else {
        console.warn(`Geocoding failed for "${address}": ${status}`);
        
        // Try with just the original address as fallback
        if (searchAddress !== formattedAddress) {
          geocoder.geocode({ address: formattedAddress }, (fallbackResults, fallbackStatus) => {
            if (fallbackStatus === 'OK' && fallbackResults && fallbackResults[0]) {
              const location = fallbackResults[0].geometry.location;
              resolve({
                lat: location.lat(),
                lng: location.lng(),
                formattedAddress: fallbackResults[0].formatted_address,
              });
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
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

// Helper function to create AdvancedMarkerElement
export const createAdvancedMarker = (
  position: google.maps.LatLngLiteral,
  map: google.maps.Map,
  title?: string,
  pinElement?: google.maps.marker.PinElement
): google.maps.marker.AdvancedMarkerElement | null => {
  if (!googleMapsInstance?.marker?.AdvancedMarkerElement) {
    console.error('AdvancedMarkerElement not available');
    return null;
  }

  const markerOptions: any = {
    position,
    map,
    title
  };

  // Fix: Use pinElement.element instead of pinElement directly
  if (pinElement) {
    markerOptions.content = pinElement.element;
  }

  return new google.maps.marker.AdvancedMarkerElement(markerOptions);
};

// Helper function to create marker pin element
export const createMarkerPin = (
  color: string = '#FF0000',
  scale: number = 1
): google.maps.marker.PinElement | null => {
  if (!googleMapsInstance?.marker?.PinElement) {
    console.error('PinElement not available');
    return null;
  }

  return new google.maps.marker.PinElement({
    background: color,
    scale,
    borderColor: '#FFFFFF',
    glyphColor: '#FFFFFF'
  });
};
