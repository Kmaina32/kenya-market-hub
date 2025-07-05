
import React from 'react';
import { useParams } from 'react-router-dom';
import SEOLayout from '@/components/layouts/SEOLayout';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import { cityPages } from '@/config/seoConfig';

const CityLandingPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const city = cityName?.toLowerCase() || 'nairobi';
  
  const cityConfig = cityPages[city as keyof typeof cityPages] || cityPages.nairobi;
  
  const cityFAQs = [
    {
      question: `What services are available in ${cityName}?`,
      answer: `Sokko Sasa offers products, real estate, rides, services, and job opportunities in ${cityName}. Find everything you need from local vendors and service providers.`
    },
    {
      question: `How do I buy products in ${cityName}?`,
      answer: `Browse our marketplace, select products from ${cityName} vendors, add to cart, and complete your purchase with secure payment options.`
    },
    {
      question: `Are there property rentals available in ${cityName}?`,
      answer: `Yes, we have a wide selection of houses, apartments, and commercial properties for rent in ${cityName}. Browse listings with photos and contact owners directly.`
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cities', href: '/cities' },
    { label: cityName || 'Nairobi', href: `/city/${city}` }
  ];

  return (
    <SEOLayout
      title={cityConfig.title}
      description={cityConfig.description}
      keywords={cityConfig.keywords}
      breadcrumbItems={breadcrumbItems}
    >
      <LocalBusinessSchema
        businessType="LocalBusiness"
        name={`Sokko Sasa ${cityName}`}
        description={cityConfig.description}
        address={{
          street: `${cityName} CBD`,
          city: cityName || 'Nairobi',
          region: `${cityName} County`,
          country: 'Kenya'
        }}
      />
      <FAQSchema faqs={cityFAQs} pageType={city} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {cityName} Marketplace - Sokko Sasa
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {cityConfig.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Products</h3>
            <p className="text-gray-600">Shop from local {cityName} vendors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Real Estate</h3>
            <p className="text-gray-600">Find properties in {cityName}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Rides</h3>
            <p className="text-gray-600">Book rides around {cityName}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Services</h3>
            <p className="text-gray-600">Hire professionals in {cityName}</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions - {cityName}
          </h2>
          <div className="space-y-4">
            {cityFAQs.map((faq, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SEOLayout>
  );
};

export default CityLandingPage;
