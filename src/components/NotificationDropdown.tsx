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
import { useNotifications } from '@/hooks/useNotifications'; // Custom hook for notification logic
import { formatDistanceToNow } from 'date-fns'; // Utility for formatting dates
import { toast } from 'sonner'; // Toast notification library

/**
 * Defines the structure of a single notification object.
 * Adjust this type to match the actual shape of your notification data from `useNotifications`.
 */
interface NotificationType {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string; // ISO 8601 string or Date-like
  type: 'success' | 'warning' | 'error' | 'info'; // Or other relevant types
  action_url?: string;
}

/**
 * NotificationDropdown component displays a bell icon with unread count,
 * and a dropdown menu with a list of recent notifications.
 * It provides actions to mark notifications as read/unread and delete them.
 */
const NotificationDropdown = () => {
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMarkingAsRead, // State indicating if a single notification is being marked as read
    isMarkingAllAsRead, // State indicating if all notifications are being marked as read
    isDeletingNotification // State indicating if a notification is being deleted
  } = useNotifications();

  /**
   * Handles marking a specific notification as read.
   * @param notificationId The ID of the notification to mark as read.
   */
  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    // Optional: Add a subtle toast or visual feedback here if needed,
    // but the `is_read` state change should update the UI.
  };

  /**
   * Handles marking all notifications as read.
   * Displays a success toast notification upon completion.
   */
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  /**
   * Handles deleting a specific notification.
   * Displays a success toast notification upon completion.
   * @param notificationId The ID of the notification to delete.
   */
  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    toast.success('Notification deleted');
  };

  /**
   * Returns the appropriate icon component based on the notification type.
   * @param type The type of the notification (e.g., 'success', 'warning', 'error', 'info').
   * @returns A React icon component.
   */
  const getNotificationIcon = (type: NotificationType['type'] | string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'info': // Added 'info' type for completeness
      default:
        return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      {/* Dropdown Menu Trigger (the bell icon button) */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 h-10 w-10 rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {/* Display unread count badge if there are unread notifications */}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-white rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount} {/* Shows '9+' for counts over 9 */}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Menu Content (the notification list) */}
      <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-xl rounded-lg" align="end">
        {/* Header section of the dropdown */}
        <DropdownMenuLabel className="flex items-center justify-between py-3 px-4">
          <span className="font-semibold text-base">Notifications</span>
          {/* "Mark all read" button, visible only if there are unread notifications */}
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead} // Disable button while operation is in progress
              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-7 px-3"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Conditional rendering based on loading state and notification count */}
        {isLoading ? (
          // Loading state
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          // Empty state: No notifications
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives!</p>
          </div>
        ) : (
          // Display list of notifications (up to 10 items)
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 10).map((notification: NotificationType) => (
              <DropdownMenuItem
                key={notification.id}
                className={
                  `p-4 cursor-pointer hover:bg-gray-50 border-none focus:bg-gray-50 ` +
                  // Apply distinct styling for unread notifications
                  `${!notification.is_read ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}`
                }
                onClick={() => {
                  // Mark as read if not already read
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                  // Open action URL if available
                  if (notification.action_url) {
                    window.open(notification.action_url, '_blank');
                  }
                }}
              >
                <div className="flex items-start space-x-3 w-full">
                  {/* Notification icon based on type */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  {/* Notification content (title, message, timestamp) */}
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {/* Delete notification button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent DropdownMenuItem's onClick from firing
                      handleDeleteNotification(notification.id);
                    }}
                    disabled={isDeletingNotification} // Disable button while operation is in progress
                    className="flex-shrink-0 p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600 rounded-full"
                    aria-label="Delete notification" // For accessibility
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {/* "View all notifications" link, visible if there are more than 10 notifications */}
        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer py-3">
              <span className="text-sm font-medium">View all notifications</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
