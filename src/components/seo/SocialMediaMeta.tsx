
import { useEffect } from 'react';

interface SocialMediaMetaProps {
  title: string;
  description: string;
  image: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterHandle?: string;
}

const SocialMediaMeta: React.FC<SocialMediaMetaProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'Sokko Sasa',
  twitterHandle = '@SokoSmart'
}) => {
  useEffect(() => {
    const currentUrl = url || window.location.href;

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: 'en_KE' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title }
    ];

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:site', content: twitterHandle },
      { name: 'twitter:creator', content: twitterHandle }
    ];

    // WhatsApp specific tags
    const whatsappTags = [
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '400' },
      { property: 'og:image:height', content: '400' }
    ];

    const updateMetaTags = (tags: Array<{property?: string, name?: string, content: string}>) => {
      tags.forEach(tag => {
        const selector = tag.property ? `meta[property="${tag.property}"]` : `meta[name="${tag.name}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;
        
        if (!meta) {
          meta = document.createElement('meta');
          if (tag.property) {
            meta.setAttribute('property', tag.property);
          } else if (tag.name) {
            meta.setAttribute('name', tag.name);
          }
          document.head.appendChild(meta);
        }
        meta.content = tag.content;
      });
    };

    updateMetaTags([...ogTags, ...twitterTags, ...whatsappTags]);
  }, [title, description, image, url, type, siteName, twitterHandle]);

  return null;
};

export default SocialMediaMeta;
