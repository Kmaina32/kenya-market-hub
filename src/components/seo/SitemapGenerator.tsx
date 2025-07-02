import { useEffect } from 'react';

/**
 * @typedef {object} SitemapUrl
 * @property {string} loc - The URL of the page. Must be an absolute URL.
 * @property {string} [lastmod] - The date of last modification of the file. W3C Datetime format (YYYY-MM-DD).
 * @property {'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'} [changefreq] - How frequently the page is likely to change.
 * @property {number} [priority] - The priority of this URL relative to other URLs on your site.
 * Valid values range from 0.0 to 1.0. Default is 0.5.
 */
interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * `SitemapGenerator` is a React component that dynamically generates an XML sitemap
 * for the application's pages.
 *
 * IMPORTANT: This client-side generation is primarily for **development and debugging purposes**.
 * For production environments, sitemaps should be generated on the server-side (e.g., Node.js, serverless function)
 * or during a static site build process, and served as a static XML file (e.g., `yourdomain.com/sitemap.xml`).
 * Search engine crawlers do not execute client-side JavaScript to discover sitemaps.
 *
 * @returns {null} This component does not render any visible UI elements.
 */
const SitemapGenerator = () => {
  useEffect(() => {
    /**
     * Fetches dynamic data (e.g., products, properties) from your API.
     * In a real application, replace these with actual API calls to your Supabase or other backend.
     * @returns {Promise<SitemapUrl[]>} A promise that resolves to an array of SitemapUrl objects.
     */
    const fetchDynamicUrls = async (): Promise<SitemapUrl[]> => {
      const dynamicUrls: SitemapUrl[] = [];
      const baseUrl = window.location.origin;

      // --- Example: Fetching Products (replace with actual API calls) ---
      // Imagine you have a hook or API function like `useProducts` or `getProducts`
      // const { data: products } = await getProducts(); // Placeholder for actual data fetching
      const mockProducts = [
        { id: 'prod1', slug: 'product-one', updated_at: '2024-06-20T10:00:00Z' },
        { id: 'prod2', slug: 'product-two', updated_at: '2024-06-22T15:30:00Z' },
      ];
      mockProducts.forEach(product => {
        dynamicUrls.push({
          loc: `${baseUrl}/product/${product.slug}`,
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined,
          changefreq: 'weekly',
          priority: 0.8
        });
      });

      // --- Example: Fetching Properties (replace with actual API calls) ---
      // const { data: properties } = await getProperties(); // Placeholder for actual data fetching
      const mockProperties = [
        { id: 'prop1', slug: 'apartment-nairobi', updated_at: '2024-06-25T08:00:00Z' },
        { id: 'prop2', slug: 'house-mombasa', updated_at: '2024-06-21T11:00:00Z' },
      ];
      mockProperties.forEach(property => {
        dynamicUrls.push({
          loc: `${baseUrl}/property/${property.slug}`,
          lastmod: property.updated_at ? new Date(property.updated_at).toISOString().split('T')[0] : undefined,
          changefreq: 'daily',
          priority: 0.8
        });
      });

      // Add more dynamic content types as needed (services, jobs, events, etc.)

      return dynamicUrls;
    };

    /**
     * Generates the XML sitemap string from a list of URLs.
     * @param {SitemapUrl[]} urls - An array of URLs to include in the sitemap.
     * @returns {string} The XML sitemap content.
     */
    const generateSitemap = async () => {
      const baseUrl = window.location.origin;
      const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

      // Define static pages
      const staticPages: SitemapUrl[] = [
        {
          loc: `${baseUrl}/`,
          changefreq: 'daily',
          priority: 1.0,
          lastmod: currentDate // Use current date for static pages if no specific lastmod
        },
        {
          loc: `${baseUrl}/shop`, // Changed from products to shop based on your routing
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/real-estate`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/services`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/rides`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/jobs`,
          changefreq: 'daily',
          priority: 0.9
        },
        {
          loc: `${baseUrl}/medical`, // Added medical page
          changefreq: 'weekly',
          priority: 0.7
        },
        {
          loc: `${baseUrl}/insurance`, // Added insurance page
          changefreq: 'weekly',
          priority: 0.7
        },
        {
          loc: `${baseUrl}/food`, // Added food delivery page
          changefreq: 'daily',
          priority: 0.8
        },
        {
          loc: `${baseUrl}/events`, // Added events page
          changefreq: 'daily',
          priority: 0.8
        },
        {
          loc: `${baseUrl}/chat-forums`, // Added chat forums page
          changefreq: 'daily',
          priority: 0.6
        },
        {
          loc: `${baseUrl}/search`,
          changefreq: 'weekly',
          priority: 0.7
        },
        {
          loc: `${baseUrl}/auth`, // Login/Signup page
          changefreq: 'monthly',
          priority: 0.5
        },
        {
          loc: `${baseUrl}/profile`, // User profile page (if publicly accessible or for logged-in users)
          changefreq: 'weekly',
          priority: 0.6
        },
        {
          loc: `${baseUrl}/wishlist`, // Wishlist page
          changefreq: 'weekly',
          priority: 0.5
        },
        {
          loc: `${baseUrl}/cart`, // Cart page
          changefreq: 'weekly',
          priority: 0.5
        },
        {
          loc: `${baseUrl}/checkout`, // Checkout page
          changefreq: 'weekly',
          priority: 0.5
        },
        // Add other static pages like About Us, Contact, Privacy Policy, Terms of Service etc.
        {
          loc: `${baseUrl}/about`,
          changefreq: 'monthly',
          priority: 0.6
        },
        {
          loc: `${baseUrl}/contact`,
          changefreq: 'monthly',
          priority: 0.6
        },
        {
          loc: `${baseUrl}/privacy-policy`,
          changefreq: 'monthly',
          priority: 0.4
        },
        {
          loc: `${baseUrl}/terms-of-service`,
          changefreq: 'monthly',
          priority: 0.4
        },
        {
          loc: `${baseUrl}/service-provider-registration`,
          changefreq: 'monthly',
          priority: 0.7
        },
        {
          loc: `${baseUrl}/service-hub`,
          changefreq: 'weekly',
          priority: 0.8
        },
        {
          loc: `${baseUrl}/vendor-dashboard`, // If this is a public-facing page
          changefreq: 'weekly',
          priority: 0.7
        },
        // Add any other top-level public pages
      ];

      // Add city-specific landing pages
      const cities = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'kisii', 'malindi'];
      cities.forEach(city => {
        staticPages.push({
          loc: `${baseUrl}/city/${city}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: currentDate
        });
      });

      // Fetch dynamic URLs
      const dynamicUrls = await fetchDynamicUrls();

      const allUrls = [...staticPages, ...dynamicUrls];

      // Construct the XML sitemap string
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

      // For development/debugging: store sitemap in sessionStorage and log it
      sessionStorage.setItem('sitemap', sitemap);
      console.log('Sitemap generated and stored in sessionStorage (for dev):', sitemap);

      // In a production environment, you would typically send this sitemap
      // to a server endpoint that saves it as a static sitemap.xml file
      // accessible at yourdomain.com/sitemap.xml.
      // Example (pseudo-code):
      // try {
      //   await fetch('/api/generate-sitemap', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/xml' },
      //     body: sitemap
      //   });
      //   console.log('Sitemap sent to server for saving.');
      // } catch (error) {
      //   console.error('Failed to send sitemap to server:', error);
      // }
    };

    // Generate sitemap when the component mounts
    generateSitemap();

    // No cleanup needed for client-side sitemap generation in sessionStorage,
    // as it's not affecting the DOM directly.
  }, []); // Empty dependency array means this effect runs once on mount

  return null; // This component renders nothing
};

export default SitemapGenerator;