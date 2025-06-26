
import React from 'react';
import { Bell, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const NotificationDropdown = () => {
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeletingNotification
  } = useNotifications();

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    toast.success('Notification deleted');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-white border border-gray-200 shadow-lg" align="end">
        <DropdownMenuLabel className="flex items-center justify-between py-2">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-6 p-2"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-3 text-center text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-xs">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 8).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 ${
                  !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                  if (notification.action_url) {
                    window.open(notification.action_url, '_blank');
                  }
                }}
              >
                <div className="flex items-start space-x-2 w-full">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-xs text-gray-900 truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    disabled={isDeletingNotification}
                    className="flex-shrink-0 p-1 h-auto hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notifications.length > 8 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer py-2">
              <span className="text-xs">View all notifications</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
