import { useState } from 'react';
import { Bell, Trash2, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { PageHeader, PrimaryButton } from './hb/listing';
import { toast } from 'sonner';
import { mockNotifications, type Notification } from '../data/notifications';

interface NotificationsProps {
  onNavigate?: (route: string) => void;
}

export default function Notifications({ onNavigate }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Format timestamp (DD/MM/YYYY HH:MM)
  const formatTimestamp = (timestamp: string) => {
    const [datePart, timePart] = timestamp.split(' ');
    const date = new Date(datePart);
    const formattedDate = date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    return `${formattedDate} ${timePart}`;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-100 dark:bg-success-900' };
      case 'warning':
        return { icon: AlertCircle, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-100 dark:bg-warning-900' };
      case 'info':
        return { icon: Info, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-100 dark:bg-primary-900' };
      case 'system':
        return { icon: Clock, color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800' };
      default:
        return { icon: Bell, color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800' };
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (notification.unread) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, unread: false } : n
        )
      );
    }

    // Navigate if redirect target exists
    if (notification.redirectTarget && onNavigate) {
      onNavigate(notification.redirectTarget);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const unreadCount = notifications.filter(n => n.unread).length;
    
    if (unreadCount === 0) {
      toast.info('All notifications are already read');
      return;
    }

    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
    toast.success(`${unreadCount} notification${unreadCount > 1 ? 's' : ''} marked as read`);
  };

  // Delete notification
  const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent notification click
    
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Notifications"
          breadcrumbs={[
            { label: 'Home', href: '#' },
            { label: 'Notifications', current: true },
          ]}
        >
          <PrimaryButton
            onClick={handleMarkAllAsRead}
            size="sm"
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </PrimaryButton>
        </PageHeader>

        {/* ========== UNREAD COUNT BANNER ========== */}
        {unreadCount > 0 && (
          <div className="mb-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
            <p className="text-xs text-primary-800 dark:text-primary-200">
              <strong>You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</strong>
            </p>
          </div>
        )}

        {/* ========== NOTIFICATIONS LIST ========== */}
        {notifications.length > 0 ? (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {notifications.map((notification) => {
                const iconConfig = getNotificationIcon(notification.type);
                const Icon = iconConfig.icon;

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 transition-colors cursor-pointer ${
                      notification.unread
                        ? 'bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-950/50'
                        : 'bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className={`text-sm ${notification.unread ? 'font-semibold' : 'font-medium'} text-neutral-900 dark:text-white`}>
                            {notification.title}
                            {notification.unread && (
                              <span className="ml-2 inline-block w-2 h-2 bg-primary-600 rounded-full"></span>
                            )}
                          </h3>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="p-1 text-neutral-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 rounded transition-colors flex-shrink-0"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          {notification.redirectTarget && (
                            <>
                              <span>•</span>
                              <span className="text-primary-600 dark:text-primary-400">Click to view details</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <Bell className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No notifications to display
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}

        {/* ========== INFO SECTION ========== */}
        {notifications.length > 0 && (
          <div className="mt-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3">
            <h4 className="text-xs font-medium text-neutral-900 dark:text-white mb-2">
              Notification Actions
            </h4>
            <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <li>• Click on a notification to mark it as read</li>
              <li>• Some notifications contain links - clicking them will navigate to the related screen</li>
              <li>• Use the trash icon to permanently delete a notification</li>
              <li>• Deleted notifications cannot be recovered</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}