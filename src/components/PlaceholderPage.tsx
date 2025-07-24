
import React from 'react';
import MainLayout from './MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Construction className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-500">
              This page is under construction. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PlaceholderPage;
