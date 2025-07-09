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
  X
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
  timestamp: Date;
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
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate some dynamic notifications for demonstration
        const mockNotifications: Notification[] = [
          {
            id: 'notif-101',
            type: 'like',
            user: { id: 'user-001', name: 'Alex M', username: 'alex_m_ke', avatar: 'https://i.pravatar.cc/150?img=1' },
            content: 'liked your post "Exploring the Nairobi Tech Scene"',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            isRead: false,
            postId: 'post-xyz'
          },
          {
            id: 'notif-102',
            type: 'comment',
            user: { id: 'user-002', name: 'Grace W', username: 'grace_dev', avatar: 'https://i.pravatar.cc/150?img=2' },
            content: 'commented on your article: "This is a must-read for any dev!"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
            isRead: false,
            postId: 'post-abc'
          },
          {
            id: 'notif-103',
            type: 'follow',
            user: { id: 'user-003', name: 'Kenyan Coder', username: 'kencodes' },
            content: 'started following you',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            isRead: true, // Mark this one as read initially
          },
          {
            id: 'notif-104',
            type: 'mention',
            user: { id: 'user-004', name: 'Data Wizard', username: 'dataninja' },
            content: 'mentioned you in their latest project update: "Check out @yourusername\'s insights here!"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isRead: false,
          },
          {
            id: 'notif-105',
            type: 'like',
            user: { id: 'user-005', name: 'Software Sam', username: 'samsoft' },
            content: 'liked your comment on the "AI in Africa" thread',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            isRead: true,
          },
          {
            id: 'notif-106',
            type: 'trending',
            user: { id: 'system', name: 'Sokko Sasa', username: 'sokkosasa' }, // Example for a system/trending notification
            content: 'Your post "Tips for Startup Funding in Kenya" is trending!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
            isRead: false,
            postId: 'post-xyz' // Assuming trending notifications could also link to posts
          },
          {
            id: 'notif-107',
            type: 'comment',
            user: { id: 'user-006', name: 'Tech Enthusiast', username: 'techenthusiast' },
            content: 'replied to your comment: "Agreed, the community aspect is key!"',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            isRead: false,
            postId: 'comment-abc'
          },
        ];
        setNotifications(mockNotifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications. Please try again later.");
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
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
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
              disabled={unreadCount === 0 || loading} // Disable if loading
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
              {/* Optional: Add a "Trending" tab if you want to filter by it */}
              {/* <TabsTrigger value="trending">Trending</TabsTrigger> */}
            </TabsList>

            <div className="mt-6">
              {loading ? (
                <div className="text-center py-12">
                  <span className="animate-spin text-orange-500 block mb-4">
                    <svg className="mx-auto h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12c0 2.21.896 4.21 2.344 5.656M20 20v-5h-.581m0 0a8.001 8.001 0 01-15.357-2m15.357 2H4" />
                    </svg>
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