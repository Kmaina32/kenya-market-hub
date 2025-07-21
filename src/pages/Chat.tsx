
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

function Chat() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Direct Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Messages</h3>
              <p className="text-gray-600">Start a conversation with other users</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

export default Chat;
