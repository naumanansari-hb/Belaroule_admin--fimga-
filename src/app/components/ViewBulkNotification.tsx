import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Users, User, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormCard,
} from './hb/common/Form';
import { toast } from 'sonner';

interface ViewBulkNotificationProps {
  onNavigate: (pageId: string) => void;
  notificationId?: string;
}

// Bulk Notification interface (should match the one in BulkNotifications.tsx)
interface BulkNotification {
  id: string;
  content: string;
  sentTo: 'all' | 'specific';
  recipientCount?: number;
  addedBy: string;
  dateAdded: string;
  dateSent: string | null;
  status: 'in-progress' | 'sent' | 'failed';
  adminEmail: string;
  selectedUsers?: string[];
}

// Mock Bulk Notifications (this should ideally come from a shared data source or context)
const mockBulkNotifications: BulkNotification[] = [
  {
    id: 'BN001',
    content: 'Welcome to BellaRoules! Discover the latest fashion trends and style your perfect outfit today.',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-15T10:30:00',
    dateSent: '2024-01-15T11:00:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
  },
  {
    id: 'BN002',
    content: 'System maintenance scheduled for January 20th from 2 AM to 6 AM. Please plan accordingly.',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-14T09:00:00',
    dateSent: '2024-01-14T09:30:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
  },
  {
    id: 'BN003',
    content: 'Exclusive offer! Premium members get 30% off on all items. Check your wardrobe now!',
    sentTo: 'specific',
    recipientCount: 85,
    addedBy: 'John Doe',
    dateAdded: '2024-01-13T14:20:00',
    dateSent: '2024-01-13T15:00:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
    selectedUsers: ['user1@email.com', 'user2@email.com'],
  },
  {
    id: 'BN004',
    content: 'New fashion collection available! Explore the latest styles and trends curated just for you.',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-12T11:00:00',
    dateSent: null,
    status: 'in-progress',
    adminEmail: 'admin@bellaroules.com',
  },
  {
    id: 'BN005',
    content: 'Action required: Please update your account security settings to continue using our services.',
    sentTo: 'specific',
    recipientCount: 320,
    addedBy: 'John Doe',
    dateAdded: '2024-01-11T16:45:00',
    dateSent: null,
    status: 'failed',
    adminEmail: 'admin@bellaroules.com',
    selectedUsers: ['user3@email.com', 'user4@email.com'],
  },
  {
    id: 'BN006',
    content: 'Your reward points are expiring soon! Redeem them before the end of this month.',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-10T13:15:00',
    dateSent: '2024-01-10T14:00:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
  },
];

// Mock users database (represents all registered users in the system)
const mockAllUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@email.com', status: 'active' },
  { id: '3', name: 'Carol Williams', email: 'carol@email.com', status: 'active' },
  { id: '4', name: 'David Brown', email: 'david@email.com', status: 'active' },
  { id: '5', name: 'Emma Davis', email: 'emma@email.com', status: 'active' },
  { id: '6', name: 'Frank Miller', email: 'frank@email.com', status: 'active' },
  { id: '7', name: 'Grace Lee', email: 'grace@email.com', status: 'active' },
  { id: '8', name: 'Henry Wilson', email: 'henry@email.com', status: 'active' },
  { id: '9', name: 'Iris Chen', email: 'iris@email.com', status: 'active' },
  { id: '10', name: 'Jack Taylor', email: 'jack@email.com', status: 'active' },
  { id: '11', name: 'Karen Martinez', email: 'karen@email.com', status: 'active' },
  { id: '12', name: 'Liam Anderson', email: 'liam@email.com', status: 'active' },
  { id: '13', name: 'Mia Thompson', email: 'mia@email.com', status: 'active' },
  { id: '14', name: 'Noah Garcia', email: 'noah@email.com', status: 'active' },
  { id: '15', name: 'Olivia Rodriguez', email: 'olivia@email.com', status: 'active' },
];

export default function ViewBulkNotification({ onNavigate, notificationId }: ViewBulkNotificationProps) {
  const [notification, setNotification] = useState<BulkNotification | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    // Find the notification by ID
    if (notificationId) {
      const foundNotification = mockBulkNotifications.find(n => n.id === notificationId);
      if (foundNotification) {
        setNotification(foundNotification);
      } else {
        toast.error('Notification not found');
        onNavigate('bulk-notifications');
      }
    } else {
      toast.error('No notification ID provided');
      onNavigate('bulk-notifications');
    }
  }, [notificationId, onNavigate]);

  // Format date and time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'sent': 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
      'in-progress': 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
      'failed': 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300',
    };

    const statusLabel = {
      'sent': 'Sent',
      'in-progress': 'In Progress',
      'failed': 'Failed',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusLabel[status as keyof typeof statusLabel]}
      </span>
    );
  };

  if (!notification) {
    return (
      <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
        <div className="text-center py-12">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading notification details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Notification Details"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Bulk Notifications', onClick: () => onNavigate('bulk-notifications') },
            { label: notification.id, current: true },
          ]}
        >
          <SecondaryButton
            onClick={() => onNavigate('bulk-notifications')}
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </SecondaryButton>
        </PageHeader>

        {/* DETAILS CARD */}
        <FormCard
          title="Notification Details and Delivery Information"
          description={`Viewing details for notification ${notification.id}`}
          icon={Bell}
        >
          <FormSection>
            {/* Administrator Email */}
            <FormField>
              <FormLabel>Administrator Email</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {notification.adminEmail}
              </div>
            </FormField>

            {/* Sent To */}
            <FormField>
              <FormLabel>Sent To</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                  {notification.sentTo === 'all' ? (
                    <>
                      <Users className="w-4 h-4" />
                      <span>All Users</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>Specific Users</span>
                    </>
                  )}
                </div>
                {notification.recipientCount && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {notification.recipientCount} recipients
                  </div>
                )}
              </div>
            </FormField>

            {/* Selected Users */}
            {notification.sentTo === 'specific' && notification.selectedUsers && notification.selectedUsers.length > 0 && (
              <FormField>
                <FormLabel>Selected Users</FormLabel>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {notification.selectedUsers.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              </FormField>
            )}

            {/* Recipients List - Show all users for "All Users" */}
            <FormField>
              <FormLabel>Recipients List</FormLabel>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {/* Header with expand/collapse */}
                <button
                  type="button"
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {notification.sentTo === 'all' 
                        ? `All Registered Users (${mockAllUsers.length})`
                        : `Selected Users (${notification.selectedUsers?.length || 0})`
                      }
                    </span>
                  </div>
                  {showAllUsers ? (
                    <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  )}
                </button>

                {/* User list */}
                {showAllUsers && (
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {notification.sentTo === 'all' ? (
                          // Show all users
                          mockAllUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          // Show specific users
                          notification.selectedUsers?.map((email, index) => {
                            const user = mockAllUsers.find(u => u.email === email);
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                    {user?.name || 'Unknown User'}
                                  </div>
                                  <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                    {email}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormField>

            {/* Notification Content */}
            <FormField>
              <FormLabel>Notification Content</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
                {notification.content}
              </div>
            </FormField>

            {/* Status */}
            <FormField>
              <FormLabel>Status</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                {getStatusBadge(notification.status)}
              </div>
            </FormField>

            {/* Date Added */}
            <FormField>
              <FormLabel>Date Added</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {formatDateTime(notification.dateAdded)}
              </div>
            </FormField>

            {/* Date Sent */}
            <FormField>
              <FormLabel>Date Sent</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {notification.dateSent ? formatDateTime(notification.dateSent) : '-'}
              </div>
            </FormField>

            {/* Added By */}
            <FormField>
              <FormLabel>Added By</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {notification.addedBy}
              </div>
            </FormField>
          </FormSection>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 mt-6 border-t border-neutral-200 dark:border-neutral-800">
            <SecondaryButton
              onClick={() => onNavigate('bulk-notifications')}
            >
              Close
            </SecondaryButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}