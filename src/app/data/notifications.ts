export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: 'success' | 'warning' | 'info' | 'system';
  redirectTarget?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New User Registration',
    message: 'A new user Sarah Johnson has registered on the platform',
    timestamp: '2024-01-16 14:32',
    unread: true,
    type: 'info',
    redirectTarget: 'users',
  },
  {
    id: 2,
    title: 'Payment Received',
    message: 'Payment of $19.99 received from Michael Chen for 500 Coins Pack',
    timestamp: '2024-01-16 13:45',
    unread: true,
    type: 'success',
    redirectTarget: 'payment-history',
  },
  {
    id: 3,
    title: 'Content Flagged',
    message: 'A post has been flagged by multiple users for inappropriate content',
    timestamp: '2024-01-16 12:18',
    unread: false,
    type: 'warning',
    redirectTarget: 'flagged-posts',
  },
  {
    id: 4,
    title: 'System Update',
    message: 'Platform maintenance scheduled for January 20, 2024 at 2:00 AM UTC',
    timestamp: '2024-01-15 18:30',
    unread: false,
    type: 'system',
  },
  {
    id: 5,
    title: 'New Reward Plan Created',
    message: 'A new reward plan "2500 Coins Pack" has been activated',
    timestamp: '2024-01-15 15:22',
    unread: false,
    type: 'info',
    redirectTarget: 'reward-plans',
  },
  {
    id: 6,
    title: 'Failed Transaction Alert',
    message: 'Transaction TXN001234569 failed for user Emily Davis',
    timestamp: '2024-01-15 12:05',
    unread: false,
    type: 'warning',
    redirectTarget: 'payment-history',
  },
  {
    id: 7,
    title: 'Role Updated',
    message: 'Role permissions for "Content Manager" have been updated',
    timestamp: '2024-01-14 16:40',
    unread: false,
    type: 'info',
    redirectTarget: 'roles',
  },
];
