
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: any;
  schemaData?: any; // Add support for schemaData
  canonical?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title = 'Sokko Sasa - Kenya\'s Smart Marketplace',
  description = 'Discover Kenya\'s premier marketplace for shopping, rides, real estate, and services.',
  keywords = 'Kenya marketplace, online shopping, taxi booking, real estate, services',
  image = '/lovable-uploads/79fe9f77-6c77-4b5c-b7e0-4c0f7d6b4b4b.png',
  url = window.location.href,
  type = 'website',
  structuredData,
  schemaData, // Accept schemaData prop
  canonical
}) => {
  // Use schemaData if provided, otherwise use structuredData
  const jsonLdData = schemaData || structuredData;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Structured Data */}
      {jsonLdData && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOManager;
