import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  TrendingUp,
  MoreHorizontal,
  Check,
  X,
  Loader2 // Import for spinner
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Interface remains the same
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'trending';
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date; // Keep as Date for direct usage with date-fns
  isRead: boolean;
  postId?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to manage potential errors
  const [activeTab, setActiveTab] = useState('all');

  // Simulate fetching notifications from an API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- REPLACE THIS WITH YOUR ACTUAL API CALL ---
        // Example: const response = await fetch('/api/notifications');
        // Example: const result = await response.json();
        // Example: setNotifications(result.notifications.map(n => ({ ...n, timestamp: new Date(n.timestamp) })));

        // FOR DEMONSTRATION: Simulating an API call that returns empty data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

        // --- Option 1: Simulate successful fetch with NO initial data (truly empty) ---
        setNotifications([]);

        // --- Option 2: Simulate a fetch error (uncomment to test error state) ---
        // throw new Error("Network error: Could not retrieve notifications.");

      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);
        setError(err.message || "Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array means this runs once on mount

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    // In a real app, you'd send an API request here to mark as read on the backend
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    // In a real app, you'd send an API request here to mark all as read on the backend
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'mention':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-orange-600" />
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="like">Likes</TabsTrigger>
              <TabsTrigger value="comment">Comments</TabsTrigger>
              <TabsTrigger value="follow">Follows</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger> {/* Added Trending tab for consistency */}
            </TabsList>

            <div className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <span className="animate-spin text-orange-500 block mb-4">
                    <Loader2 className="mx-auto h-8 w-8" /> {/* Using Loader2 from lucide-react */}
                  </span>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">
                  <X className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error loading notifications</h3>
                  <p>{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">
                    {activeTab === 'unread'
                      ? "You're all caught up!"
                      : `No ${activeTab === 'all' ? '' : activeTab} notifications yet.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notification.isRead
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                              {notification.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{notification.user.name}</span>{' '}
                                <span className="text-gray-600">{notification.content}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Action buttons for follow notifications */}
                          {notification.type === 'follow' && !notification.isRead && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                                Follow Back
                              </Button>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;