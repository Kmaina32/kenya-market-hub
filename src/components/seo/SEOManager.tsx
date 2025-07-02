import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * @typedef {object} SEOManagerProps
 * @property {string} [title] - The title of the page. Appears in the browser tab and search results.
 * Defaults to 'Soko Smart - Kenya\'s Premier Marketplace'.
 * @property {string} [description] - A brief summary of the page content. Used by search engines.
 * Defaults to 'Discover amazing products, services, rides, and real estate in Kenya. Your one-stop marketplace for everything you need.'.
 * @property {string} [keywords] - Comma-separated keywords relevant to the page. (Less impactful for modern SEO, but can be included).
 * Defaults to 'marketplace Kenya, online shopping Kenya, property Kenya, services Kenya, rides Kenya, jobs Kenya'.
 * @property {string} [image] - URL of an image to be used when the page is shared on social media.
 * Should be an absolute URL. Defaults to a placeholder image.
 * @property {string} [url] - The canonical URL of the current page. If not provided, it's derived from `window.location`.
 * @property {'website' | 'article' | 'product' | 'business.business'} [type] - The Open Graph type of the content.
 * Defaults to 'website'.
 * @property {object} [structuredData] - JSON-LD structured data object to be added to the page.
 * If not provided, a default Organization schema is used.
 * @property {string} [canonical] - Explicit canonical URL for the page, overriding the auto-generated one.
 */
interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
  structuredData?: any; // Consider defining a more specific type for structured data if known
  canonical?: string;
}

/**
 * `SEOManager` is a React component that dynamically updates the document's
 * meta tags and adds JSON-LD structured data for Search Engine Optimization (SEO).
 * It should be placed within the component tree of the page whose SEO properties it manages.
 *
 * @param {SEOManagerProps} props - The properties for configuring the SEO metadata.
 * @returns {null} This component does not render any visible UI elements.
 */
const SEOManager: React.FC<SEOManagerProps> = ({
  title = 'Soko Smart - Kenya\'s Premier Marketplace',
  description = 'Discover amazing products, services, rides, and real estate in Kenya. Your one-stop marketplace for everything you need.',
  keywords = 'marketplace Kenya, online shopping Kenya, property Kenya, services Kenya, rides Kenya, jobs Kenya',
  // Ensure image is an absolute URL for Open Graph and Twitter cards
  image = `${window.location.origin}/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png`,
  url,
  type = 'website',
  structuredData,
  canonical
}) => {
  const location = useLocation();
  // Construct the current URL, prioritizing the `url` prop if provided.
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  // Construct the canonical URL, prioritizing the `canonical` prop.
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    /**
     * Helper function to update or create a standard HTML meta tag.
     * @param name The value of the 'name' attribute (e.g., 'description').
     * @param content The value of the 'content' attribute.
     */
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    /**
     * Helper function to update or create an Open Graph (OG) meta tag.
     * These use the 'property' attribute instead of 'name'.
     * @param property The value of the 'property' attribute (e.g., 'og:title').
     * @param content The value of the 'content' attribute.
     */
    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // --- Update Document Title ---
    document.title = title;

    // --- Basic Meta Tags ---
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'Soko Smart');
    updateMeta('robots', 'index,follow'); // Instructs search engine robots to index the page and follow links
    updateMeta('viewport', 'width=device-width, initial-scale=1.0'); // Ensures proper responsive behavior

    // --- Open Graph (OG) Tags for Social Media Sharing ---
    // These tags control how your page appears when shared on platforms like Facebook, LinkedIn.
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:image', image);
    updateProperty('og:url', currentUrl);
    updateProperty('og:type', type);
    updateProperty('og:site_name', 'Soko Smart');
    updateProperty('og:locale', 'en_KE'); // Specifies the language and locale (English, Kenya)

    // --- Twitter Card Tags ---
    // These tags control how your page appears when shared on Twitter.
    updateMeta('twitter:card', 'summary_large_image'); // Type of Twitter card (summary_large_image is common for images)
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@SokoSmart'); // Your Twitter handle

    // --- Canonical URL ---
    // Helps prevent duplicate content issues by specifying the preferred version of a page.
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // --- Structured Data (JSON-LD) ---
    // Provides search engines with explicit information about the page's content,
    // which can lead to rich snippets in search results.
    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "Organization", // Defaulting to Organization schema
      "name": "Soko Smart",
      "description": description,
      "url": currentUrl,
      "logo": image, // Use the provided image as the organization's logo
      "sameAs": [ // Links to social media profiles
        "https://facebook.com/sokosmart",
        "https://twitter.com/sokosmart",
        "https://instagram.com/sokosmart"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KE",
        "addressLocality": "Nairobi"
      },
      "areaServed": "Kenya",
      "potentialAction": { // Defines a search action for the site
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    // Use provided structuredData or the default one
    const finalStructuredData = structuredData || defaultStructuredData;

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(finalStructuredData);

    // Cleanup function: Remove dynamically added meta and script tags when the component unmounts
    // or when dependencies change to prevent duplicates.
    return () => {
      // Remove basic meta tags
      document.querySelector(`meta[name="description"]`)?.remove();
      document.querySelector(`meta[name="keywords"]`)?.remove();
      document.querySelector(`meta[name="author"]`)?.remove();
      document.querySelector(`meta[name="robots"]`)?.remove();
      document.querySelector(`meta[name="viewport"]`)?.remove(); // Be cautious with viewport, usually static

      // Remove Open Graph tags
      document.querySelector(`meta[property="og:title"]`)?.remove();
      document.querySelector(`meta[property="og:description"]`)?.remove();
      document.querySelector(`meta[property="og:image"]`)?.remove();
      document.querySelector(`meta[property="og:url"]`)?.remove();
      document.querySelector(`meta[property="og:type"]`)?.remove();
      document.querySelector(`meta[property="og:site_name"]`)?.remove();
      document.querySelector(`meta[property="og:locale"]`)?.remove();

      // Remove Twitter Card tags
      document.querySelector(`meta[name="twitter:card"]`)?.remove();
      document.querySelector(`meta[name="twitter:title"]`)?.remove();
      document.querySelector(`meta[name="twitter:description"]`)?.remove();
      document.querySelector(`meta[name="twitter:image"]`)?.remove();
      document.querySelector(`meta[name="twitter:site"]`)?.remove();

      // Remove Canonical URL link
      document.querySelector('link[rel="canonical"]')?.remove();

      // Remove Structured Data script
      document.querySelector('script[type="application/ld+json"]')?.remove();
    };

  }, [title, description, keywords, image, currentUrl, type, structuredData, canonicalUrl, location.pathname]);
  // Added location.pathname to dependencies to ensure currentUrl updates on route changes

  return null; // This component does not render any visible UI
};

export default SEOManager;
