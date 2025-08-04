
import React from 'react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 mx-auto text-orange-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Matters</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                At Sokko Sasa, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our ride-hailing service.
              </p>

              <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Personal information (name, email, phone number)</li>
                <li>Location data for ride booking and navigation</li>
                <li>Trip history and preferences</li>
                <li>Payment information (securely processed)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and improve our ride-hailing services</li>
                <li>Connect you with nearby drivers</li>
                <li>Process payments and maintain transaction records</li>
                <li>Send important service updates and notifications</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Data Security</h3>
              <p className="mb-4">
                We implement industry-standard security measures to protect your personal information. 
                Your data is encrypted in transit and at rest, and we regularly audit our security practices.
              </p>

              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@sokkosasa.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default PrivacyPolicy;
