
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig } from '@/config/seoConfig';

interface UseSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: any;
  canonical?: string;
}

export const useSEO = (props: UseSEOProps = {}) => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let config;

    // Get page-specific config
    if (pathname === '/') {
      config = seoConfig.home;
    } else if (pathname.startsWith('/shop') || pathname.startsWith('/products')) {
      config = seoConfig.shop;
    } else if (pathname.startsWith('/real-estate')) {
      config = seoConfig.realEstate;
    } else if (pathname.startsWith('/rides')) {
      config = seoConfig.rides;
    } else if (pathname.startsWith('/services')) {
      config = seoConfig.services;
    } else if (pathname.startsWith('/jobs')) {
      config = seoConfig.jobs;
    }

    const finalConfig = {
      title: props.title || config?.title || 'Sokko Sasa - Kenya\'s Premier Marketplace',
      description: props.description || config?.description || 'Discover amazing products, services, rides, and real estate in Kenya.',
      keywords: props.keywords || config?.keywords || 'marketplace Kenya, online shopping Kenya',
      image: props.image || '/lovable-uploads/563ee6fb-f94f-43f3-a61873a1b491.png',
      type: props.type || 'website',
      structuredData: props.structuredData || config?.structuredData,
      canonical: props.canonical
    };

    // Update meta tags
    document.title = finalConfig.title;

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

    updateMeta('description', finalConfig.description);
    updateMeta('keywords', finalConfig.keywords);
    updateProperty('og:title', finalConfig.title);
    updateProperty('og:description', finalConfig.description);
    updateProperty('og:image', finalConfig.image);
    updateProperty('og:type', finalConfig.type);

    if (finalConfig.canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = finalConfig.canonical;
    }

    if (finalConfig.structuredData) {
      let script = document.querySelector('script[data-seo="page"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', 'page');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(finalConfig.structuredData);
    }

  }, [location.pathname, props]);

  return {
    updateSEO: (newProps: UseSEOProps) => {
      // This function can be used to dynamically update SEO
      Object.assign(props, newProps);
    }
  };
};
