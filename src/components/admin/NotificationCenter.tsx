
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Send, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationCenter = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSendNotification = () => {
    toast({
      title: 'Notifications Sent',
      description: 'Successfully sent notifications to selected users.',
    });
  };

  const notifications = [
    {
      id: '1',
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2AM-4AM',
      recipient: 'All Users',
      status: 'sent',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Payment Issue',
      message: 'Multiple payment failures detected',
      recipient: 'Vendors',
      status: 'pending',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'success',
      title: 'New Feature Launch',
      message: 'Chat system is now live!',
      recipient: 'All Users',
      status: 'sent',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Notification Center</h2>
        <p className="text-gray-600">Manage and send notifications to users</p>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Notifications</TabsTrigger>
          <TabsTrigger value="compose">Compose New</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Selected
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {notification.type === 'info' && <Bell className="h-4 w-4 text-blue-600" />}
                        {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                        {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'}>
                          {notification.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>To: {notification.recipient}</span>
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Group</label>
                <select className="w-full border rounded-md p-2">
                  <option>All Users</option>
                  <option>Vendors</option>
                  <option>Drivers</option>
                  <option>Customers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input 
                  type="text" 
                  className="w-full border rounded-md p-2" 
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  className="w-full border rounded-md p-2" 
                  rows={4}
                  placeholder="Notification message"
                />
              </div>
              <Button onClick={handleSendNotification} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Welcome Message</h4>
                  <p className="text-sm text-gray-600 mb-4">Welcome new users to the platform</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Order Confirmation</h4>
                  <p className="text-sm text-gray-600 mb-4">Confirm order placement</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">System Maintenance</h4>
                  <p className="text-sm text-gray-600 mb-4">Notify about scheduled maintenance</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Feature Update</h4>
                  <p className="text-sm text-gray-600 mb-4">Announce new features</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
