
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white p-2">
                <img
                  alt="Sokko Sasa Logo"
                  src="/LOGO/Sokko.svg"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  <span className="text-gray-900">Sokko</span>{' '}
                  <span className="text-orange-600">Sasa</span>
                </CardTitle>
                <CardDescription>Kenya's Smart Marketplace</CardDescription>
              </div>
            </div>
            <h1 className="text-3xl font-bold mt-4">Terms and Conditions</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Sokko Sasa, Kenya's premier smart marketplace platform. These Terms and Conditions ("Terms") govern your use of our website, mobile applications, and services (collectively, the "Platform"). By accessing or using Sokko Sasa, you agree to be bound by these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. About Sokko Sasa</h2>
              <p className="text-gray-700 leading-relaxed">
                Sokko Sasa is a comprehensive marketplace platform that connects buyers and sellers across Kenya. Our platform offers various services including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Product marketplace for buying and selling goods</li>
                <li>Real estate listings and property management</li>
                <li>Transportation and ride-sharing services</li>
                <li>Food delivery and restaurant services</li>
                <li>Professional services and job listings</li>
                <li>Event management and ticketing</li>
                <li>Insurance and financial services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                To access certain features of our Platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed">
                Users are prohibited from engaging in the following activities:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Posting false, misleading, or fraudulent content</li>
                <li>Violating intellectual property rights</li>
                <li>Harassing or threatening other users</li>
                <li>Engaging in illegal activities</li>
                <li>Attempting to compromise platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Payment and Transactions</h2>
              <p className="text-gray-700 leading-relaxed">
                All transactions on our Platform are subject to our payment terms. We support various payment methods including M-Pesa and other mobile money services. Users are responsible for ensuring they have sufficient funds for their transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                We are committed to protecting your privacy and personal data in accordance with Kenyan data protection laws. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content on the Sokko Sasa Platform, including but not limited to text, graphics, logos, images, and software, is the property of Sokko Sasa or its licensors and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Sokko Sasa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Platform. Our liability is limited to the maximum extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising from these Terms or your use of our Platform shall be resolved through binding arbitration in accordance with Kenyan law, with proceedings conducted in Nairobi, Kenya.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our Platform. Your continued use of the Platform constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="text-gray-700">
                  <strong>Sokko Sasa</strong><br />
                  Email: info@sokkosasa.com<br />
                  Phone: +254 707 590 734<br />
                  Address: Nairobi, Kenya
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-500">
                By using Sokko Sasa, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TermsAndConditions;
