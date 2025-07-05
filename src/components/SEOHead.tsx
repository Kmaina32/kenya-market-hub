
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Sokko Sasa - Kenya\'s Premier Marketplace',
  description = 'Discover amazing products, services, rides, and real estate in Kenya. Your one-stop marketplace for everything you need.',
  keywords = 'marketplace, Kenya, shopping, services, rides, real estate, products',
  image = '/lovable-uploads/79fe9f77-6c77-4b5c-b7e0-4c0f7d6b4b4b.png',
  url
}) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);

    // Open Graph tags
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:image', image);
    updateProperty('og:url', currentUrl);
    updateProperty('og:type', 'website');

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Sokko Sasa",
      "description": description,
      "url": currentUrl,
      "logo": image
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, image, currentUrl]);

  return null;
};

export default SEOHead;
