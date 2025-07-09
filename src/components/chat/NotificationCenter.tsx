import React, { useState } from 'react';
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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      user: { id: '1', name: 'John Doe', username: 'johndoe' },
      content: 'liked your post about React development',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
    {
      id: '2',
      type: 'comment',
      user: { id: '2', name: 'Jane Smith', username: 'janesmith' },
      content: 'commented on your post: "Great tutorial! Thanks for sharing."',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
    },
    {
      id: '3',
      type: 'follow',
      user: { id: '3', name: 'Tech Guru', username: 'techguru' },
      content: 'started following you',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      isRead: true,
    },
    {
      id: '4',
      type: 'mention',
      user: { id: '4', name: 'Sarah Wilson', username: 'sarahw' },
      content: 'mentioned you in a comment',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');

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
              disabled={unreadCount === 0}
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
            </TabsList>

            <div className="mt-6">
              {filteredNotifications.length === 0 ? (
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