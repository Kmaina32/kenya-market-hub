
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedButton } from '@/components/ui/UnifiedButton';

const HelpSection: React.FC = () => {
  const helpOptions = [
    {
      icon: '📚',
      title: 'Read Guidelines',
      description: 'Learn about requirements',
      action: () => console.log('Guidelines clicked')
    },
    {
      icon: '💬',
      title: 'Contact Support',
      description: 'Get help from our team',
      action: () => console.log('Support clicked')
    },
    {
      icon: '📈',
      title: 'Success Stories',
      description: 'See how others succeed',
      action: () => console.log('Success stories clicked')
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-center text-blue-900">
          Need Help Getting Started?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpOptions.map((option, index) => (
            <UnifiedButton 
              key={index}
              variant="outline" 
              className="flex flex-col items-center p-6 h-auto space-y-2"
              onClick={option.action}
            >
              <div className="text-2xl">{option.icon}</div>
              <span className="font-medium">{option.title}</span>
              <span className="text-xs text-gray-600">{option.description}</span>
            </UnifiedButton>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpSection;
