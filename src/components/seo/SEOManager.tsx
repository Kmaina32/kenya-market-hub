import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: any;
  canonical?: string;
  hreflangs?: { hrefLang: string; href: string }[];
  breadcrumbs?: { name: string; url: string }[];
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title = "Sokko Sasa - Kenya's Premier Marketplace",
  description = "Discover amazing products, services, rides, and real estate in Kenya. Your one-stop marketplace for everything you need.",
  keywords = "marketplace Kenya, online shopping Kenya, property Kenya, services Kenya, rides Kenya, jobs Kenya",
  image = `${window.location.origin}/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png`,
  url,
  type = "website",
  structuredData,
  canonical,
  hreflangs = [],
  breadcrumbs = [],
}) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Remove existing hreflang links
    const removeHreflangs = () => {
      const links = document.querySelectorAll('link[rel="alternate"][hreflang]');
      links.forEach((link) => link.remove());
    };

    // Add hreflang links
    const addHreflangs = () => {
      hreflangs.forEach(({ hrefLang, href }) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = hrefLang;
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Add breadcrumb structured data
    const addBreadcrumbs = () => {
      if (breadcrumbs.length === 0) return null;
      const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };
      let script = document.querySelector('script#breadcrumb-jsonld') as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "breadcrumb-jsonld";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(breadcrumbList);
      return () => {
        script.remove();
      };
    };

    document.title = title;

    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("author", "Sokko Sasa");
    updateMeta("robots", "index,follow");
    updateMeta("viewport", "width=device-width, initial-scale=1.0");

    updateProperty("og:title", title);
    updateProperty("og:description", description);
    updateProperty("og:image", image);
    updateProperty("og:url", currentUrl);
    updateProperty("og:type", type);
    updateProperty("og:site_name", "Sokko Sasa");
    updateProperty("og:locale", "en_KE");

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
    updateMeta("twitter:site", "@SokoSmart");

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Sokko Sasa",
      description,
      url: currentUrl,
      logo: image,
      sameAs: [
        "https://facebook.com/sokosmart",
        "https://twitter.com/sokosmart",
        "https://instagram.com/sokosmart",
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "KE",
        addressLocality: "Nairobi",
      },
      areaServed: "Kenya",
      potentialAction: {
        "@type": "SearchAction",
        target: `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    const finalStructuredData = structuredData || defaultStructuredData;

    let script = document.querySelector('script[type="application/ld+json"]:not(#breadcrumb-jsonld)') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(finalStructuredData);

    removeHreflangs();
    addHreflangs();

    const cleanupBreadcrumbs = addBreadcrumbs();

    return () => {
      document.querySelector(`meta[name="description"]`)?.remove();
      document.querySelector(`meta[name="keywords"]`)?.remove();
      document.querySelector(`meta[name="author"]`)?.remove();
      document.querySelector(`meta[name="robots"]`)?.remove();
      document.querySelector(`meta[name="viewport"]`)?.remove();

      document.querySelector(`meta[property="og:title"]`)?.remove();
      document.querySelector(`meta[property="og:description"]`)?.remove();
      document.querySelector(`meta[property="og:image"]`)?.remove();
      document.querySelector(`meta[property="og:url"]`)?.remove();
      document.querySelector(`meta[property="og:type"]`)?.remove();
      document.querySelector(`meta[property="og:site_name"]`)?.remove();
      document.querySelector(`meta[property="og:locale"]`)?.remove();

      document.querySelector(`meta[name="twitter:card"]`)?.remove();
      document.querySelector(`meta[name="twitter:title"]`)?.remove();
      document.querySelector(`meta[name="twitter:description"]`)?.remove();
      document.querySelector(`meta[name="twitter:image"]`)?.remove();
      document.querySelector(`meta[name="twitter:site"]`)?.remove();

      document.querySelector('link[rel="canonical"]')?.remove();

      document.querySelector('script[type="application/ld+json"]:not(#breadcrumb-jsonld)')?.remove();

      cleanupBreadcrumbs && cleanupBreadcrumbs();
    };
  }, [
    title,
    description,
    keywords,
    image,
    currentUrl,
    type,
    structuredData,
    canonicalUrl,
    hreflangs,
    breadcrumbs,
    location.pathname,
  ]);

  return null;
};

export default SEOManager;
