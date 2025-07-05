
import { useEffect } from 'react';
import { Product } from '@/types/product';

interface ProductSchemaProps {
  product: Product;
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ product }) => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} available at Sokko Sasa Kenya`,
      "image": product.image_url || '/placeholder.svg',
      "brand": {
        "@type": "Brand",
        "name": product.brand || product.vendor || 'Sokko Sasa'
      },
      "offers": {
        "@type": "Offer",
        "price": product.price.toString(),
        "priceCurrency": "KES",
        "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": product.vendor || 'Sokko Sasa'
        }
      },
      "aggregateRating": product.rating > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviews_count.toString(),
        "bestRating": "5",
        "worstRating": "1"
      } : undefined,
      "category": product.category,
      "condition": product.condition || "new",
      "sku": product.id
    };

    let script = document.querySelector(`script[data-schema="product-${product.id}"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', `product-${product.id}`);
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const schemaScript = document.querySelector(`script[data-schema="product-${product.id}"]`);
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [product]);

  return null;
};

export default ProductSchema;
