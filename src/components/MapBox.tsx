// src/components/MapBox.tsx

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/integrations/googlemaps/googleMapsLoader'; // Import our loader

interface MapBoxProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    title?: string;
    color?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (coordinates: google.maps.LatLngLiteral) => void;
  showRoute?: {
    start: google.maps.LatLngLiteral;
    end: google.maps.LatLngLiteral;
    path?: google.maps.LatLng[];
  };
  className?: string;
}

const MapBox: React.FC<MapBoxProps> = ({
  center = { lat: -1.2921, lng: 36.8219 },
  zoom = 12,
  markers = [],
  onMapClick,
  showRoute,
  className = "w-full h-96" // This className will be overridden by inline style for testing
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      const googleMaps = await loadGoogleMapsScript();
      if (!googleMaps || !mapContainerRef.current) {
        console.error('Failed to load Google Maps or map container not found.');
        return;
      }

      const mapOptions: google.maps.MapOptions = {
        center: center,
        zoom: zoom,
        mapId: 'YOUR_MAP_ID_HERE', // Check this again, or comment out if not using custom style
        disableDefaultUI: false,
      };

      mapRef.current = new googleMaps.Map(mapContainerRef.current, mapOptions);

      mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (onMapClick && e.latLng) {
          onMapClick(e.latLng.toJSON());
        }
      });

      setMapLoaded(true);
    };

    if (!mapRef.current) {
      initMap();
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Update markers (unchanged)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapRef.current,
        title: markerData.title,
      });
      if (markerData.onClick) {
        marker.addListener('click', markerData.onClick);
      }
      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  // Show route (unchanged)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (showRoute) {
      if (showRoute.path && showRoute.path.length > 0) {
        polylineRef.current = new google.maps.Polyline({
          path: showRoute.path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.7,
          strokeWeight: 5,
        });
        polylineRef.current.setMap(mapRef.current);
        const bounds = new google.maps.LatLngBounds();
        showRoute.path.forEach(point => bounds.extend(point));
        mapRef.current.fitBounds(bounds, { padding: 50 });
      } else {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: showRoute.start,
            destination: showRoute.end,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === 'OK' && response && response.routes && response.routes[0]) {
              if (polylineRef.current) {
                polylineRef.current.setMap(null);
              }
              const path = response.routes[0].overview_path;
              polylineRef.current = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.7,
                strokeWeight: 5,
              });
              polylineRef.current.setMap(mapRef.current);
              const bounds = new google.maps.LatLngBounds();
              path.forEach(point => bounds.extend(point));
              mapRef.current.fitBounds(bounds, { padding: 50 });
            } else {
              console.error('Directions request failed due to ' + status);
            }
          }
        );
      }
    }
  }, [showRoute, mapLoaded]);

  return <div ref={mapContainerRef} className={className} style={{ width: '100%', height: '400px', border: '2px solid red' }} />;
};

export default MapBox;