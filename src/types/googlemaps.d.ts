
/// <reference types="google.maps" />

declare namespace google.maps {
  namespace marker {
    class AdvancedMarkerElement {
      constructor(options: {
        position: google.maps.LatLngLiteral;
        map: google.maps.Map;
        title?: string;
        content?: HTMLElement;
      });
      map: google.maps.Map | null;
      position: google.maps.LatLngLiteral;
      title?: string;
      content?: HTMLElement;
      addListener(eventName: string, handler: () => void): void;
    }

    class PinElement {
      constructor(options?: {
        background?: string;
        scale?: number;
        borderColor?: string;
        glyphColor?: string;
      });
      element: HTMLElement;
    }
  }
}
