
import { useEffect } from 'react';

interface LocalBusinessSchemaProps {
  businessType?: string;
  name?: string;
  description?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    country: string;
  };
  phone?: string;
  email?: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  businessType = 'LocalBusiness',
  name = 'Sokko Sasa',
  description = "Kenya's premier marketplace for products, real estate, rides, services and jobs",
  address = {
    street: 'Nairobi CBD',
    city: 'Nairobi',
    region: 'Nairobi County',
    country: 'Kenya'
  },
  phone = '+254700000000',
  email = 'contact@sokosmart.co.ke'
}) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": businessType,
      "name": name,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.street,
        "addressLocality": address.city,
        "addressRegion": address.region,
        "addressCountry": address.country
      },
      "telephone": phone,
      "email": email,
      "url": window.location.origin,
      "areaServed": {
        "@type": "Country",
        "name": "Kenya"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": -1.2921,
          "longitude": 36.8219
        },
        "geoRadius": "50000"
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "$$"
    };

    let script = document.querySelector('script[data-schema="local-business"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'local-business');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const schemaScript = document.querySelector('script[data-schema="local-business"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [businessType, name, description, address, phone, email]);

  return null;
};

export default LocalBusinessSchema;
