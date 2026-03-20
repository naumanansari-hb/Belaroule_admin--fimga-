import { useState, useMemo } from 'react';
import {
  Bell,
  Plus,
  Eye,
  Users,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton, IconButton, SummaryWidgets, SearchBar, Pagination } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
  FormTextarea,
} from './hb/common/Form';
import { toast } from 'sonner';

// Bulk Notification interface
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

// Mock Bulk Notifications
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

// Mock users for selection
const mockUsers = [
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
];

interface BulkNotificationsProps {
  onNavigate: (pageId: string) => void;
  onViewNotification: (notificationId: string) => void;
}

export default function BulkNotifications({ onNavigate, onViewNotification }: BulkNotificationsProps) {
  const [notifications, setNotifications] = useState<BulkNotification[]>(mockBulkNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedNotification, setSelectedNotification] = useState<BulkNotification | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sentToFilter, setSentToFilter] = useState<string>('all');

  // Form states
  const [formData, setFormData] = useState({
    sentTo: 'all' as 'all' | 'specific',
    selectedUsers: [] as string[],
    content: '',
  });

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = notifications;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((notification) => {
        const searchFields = [notification.content, notification.addedBy, notification.id];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(notification => notification.status === statusFilter);
    }

    // Apply sent to filter
    if (sentToFilter !== 'all') {
      filtered = filtered.filter(notification => notification.sentTo === sentToFilter);
    }

    // Sort by date added (latest first)
    filtered = [...filtered].sort((a, b) => 
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );

    return filtered;
  }, [notifications, searchQuery, statusFilter, sentToFilter]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const totalNotifications = notifications.length;
    const sentNotifications = notifications.filter(n => n.status === 'sent').length;
    const inProgressNotifications = notifications.filter(n => n.status === 'in-progress').length;
    const failedNotifications = notifications.filter(n => n.status === 'failed').length;
    
    return [
      { label: 'Total Notifications', value: totalNotifications.toString(), icon: Bell },
      { label: 'Sent', value: sentNotifications.toString(), icon: CheckCircle },
      { label: 'In Progress', value: inProgressNotifications.toString(), icon: Clock },
      { label: 'Failed', value: failedNotifications.toString(), icon: AlertCircle },
    ];
  };

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

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 60) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Handle view notification
  const handleViewNotification = (notification: BulkNotification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  // Handle add new notification
  const handleAddNotification = () => {
    if (!formData.content.trim()) {
      toast.error('Please enter notification content');
      return;
    }

    if (formData.sentTo === 'specific' && formData.selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    const newNotification: BulkNotification = {
      id: `BN${String(notifications.length + 1).padStart(3, '0')}`,
      content: formData.content,
      sentTo: formData.sentTo,
      recipientCount: formData.sentTo === 'all' ? 1250 : formData.selectedUsers.length,
      addedBy: 'John Doe',
      dateAdded: new Date().toISOString(),
      dateSent: null,
      status: 'in-progress',
      adminEmail: 'admin@bellaroules.com',
      selectedUsers: formData.sentTo === 'specific' ? formData.selectedUsers : undefined,
    };

    setNotifications([newNotification, ...notifications]);
    setShowAddModal(false);
    setFormData({
      sentTo: 'all',
      selectedUsers: [],
      content: '',
    });
    toast.success('Bulk notification queued successfully');
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusLabel[status as keyof typeof statusLabel]}
      </span>
    );
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Bulk Notifications"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Bulk Notifications', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by content, added by, or notification ID..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => onNavigate('add-bulk-notification')}
            size="sm"
            icon={Plus}
          >
            Send New
          </PrimaryButton>
        </PageHeader>

        {/* FILTERS */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <FormLabel htmlFor="statusFilter">Status</FormLabel>
                  <FormSelect
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="in-progress">In Progress</option>
                    <option value="failed">Failed</option>
                  </FormSelect>
                </div>

                {/* Sent To Filter */}
                <div>
                  <FormLabel htmlFor="sentToFilter">Sent To</FormLabel>
                  <FormSelect
                    id="sentToFilter"
                    value={sentToFilter}
                    onChange={(e) => setSentToFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="all">All Users</option>
                    <option value="specific">Specific Users</option>
                  </FormSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Notification Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Sent To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Added By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date Added</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date Sent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {truncateContent(notification.content)}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            ID: {notification.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {notification.sentTo === 'all' ? (
                          <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        ) : (
                          <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        )}
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {notification.sentTo === 'all' ? 'All Users' : 'Specific Users'}
                        </span>
                      </div>
                      {notification.recipientCount && (
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {notification.recipientCount} recipients
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {notification.addedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(notification.dateAdded)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {notification.dateSent ? formatDateTime(notification.dateSent) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(notification.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          icon={Eye}
                          onClick={() => onViewNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          tooltip="View Notification"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* NO RESULTS */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No bulk notification data found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No bulk notifications match your current filters
            </p>
          </div>
        )}

        {/* ADD NEW BULK NOTIFICATION MODAL */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({
              sentTo: 'all',
              selectedUsers: [],
              content: '',
            });
          }}
          title="Send New Bulk Notification"
          description="Create and send push notification to users"
          maxWidth="max-w-2xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddNotification();
            }}
          >
            <FormSection>
              {/* Administrator Email */}
              <FormField>
                <FormLabel htmlFor="adminEmail">Administrator Email</FormLabel>
                <FormInput
                  id="adminEmail"
                  type="email"
                  value="admin@bellaroules.com"
                  disabled
                  className="bg-neutral-100 dark:bg-neutral-800"
                />
              </FormField>

              {/* Send Type */}
              <FormField>
                <FormLabel htmlFor="sentTo" required>Send Type</FormLabel>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sentTo"
                      value="all"
                      checked={formData.sentTo === 'all'}
                      onChange={(e) => setFormData({ ...formData, sentTo: 'all', selectedUsers: [] })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">All Users</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sentTo"
                      value="specific"
                      checked={formData.sentTo === 'specific'}
                      onChange={(e) => setFormData({ ...formData, sentTo: 'specific' })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">Specific Users</span>
                  </label>
                </div>
              </FormField>

              {/* Users (Visible only when Specific Users is selected) */}
              {formData.sentTo === 'specific' && (
                <FormField>
                  <FormLabel htmlFor="userSearch">Select Users</FormLabel>
                  
                  {/* Custom Multi-Select Dropdown with Checkboxes */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <span>
                        {formData.selectedUsers.length === 0
                          ? 'Select users...'
                          : `${formData.selectedUsers.length} user${formData.selectedUsers.length > 1 ? 's' : ''} selected`}
                      </span>
                      {showUserDropdown ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      )}
                    </button>

                    {/* Dropdown List */}
                    {showUserDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {mockUsers.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedUsers.includes(user.email)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    selectedUsers: [...formData.selectedUsers, user.email],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    selectedUsers: formData.selectedUsers.filter(
                                      (email) => email !== user.email
                                    ),
                                  });
                                }
                              }}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                            />
                            <span className="text-sm text-neutral-900 dark:text-white flex-1">
                              {user.name} <span className="text-neutral-500">({user.email})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Users Chips */}
                  {formData.selectedUsers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.selectedUsers.map((email) => {
                        const user = mockUsers.find((u) => u.email === email);
                        return (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md text-xs border border-primary-200 dark:border-primary-800"
                          >
                            <span>{user?.name || email}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  selectedUsers: formData.selectedUsers.filter(
                                    (e) => e !== email
                                  ),
                                });
                              }}
                              className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Select multiple users from the dropdown. Only active users can receive notifications.
                  </p>
                </FormField>
              )}

              {/* Notification Content */}
              <FormField>
                <FormLabel htmlFor="content" required>Notification Content</FormLabel>
                <FormTextarea
                  id="content"
                  placeholder="Enter notification message (plain text only)"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Plain text only. Keep it concise for better user experience.
                </p>
              </FormField>
            </FormSection>

            <FormFooter>
              <SecondaryButton
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    sentTo: 'all',
                    selectedUsers: [],
                    content: '',
                  });
                }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton 
                type="submit"
                disabled={!formData.content.trim() || (formData.sentTo === 'specific' && formData.selectedUsers.length === 0)}
              >
                Send Notification
              </PrimaryButton>
            </FormFooter>
          </form>
        </FormModal>

        {/* VIEW BULK NOTIFICATION MODAL */}
        <FormModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedNotification(null);
          }}
          title="View Notification"
          description="Notification details and delivery information"
          maxWidth="max-w-2xl"
        >
          {selectedNotification && (
            <div>
              <FormSection>
                {/* Administrator Email */}
                <FormField>
                  <FormLabel>Administrator Email</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {selectedNotification.adminEmail}
                  </div>
                </FormField>

                {/* Sent To */}
                <FormField>
                  <FormLabel>Sent To</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                      {selectedNotification.sentTo === 'all' ? (
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
                    {selectedNotification.recipientCount && (
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {selectedNotification.recipientCount} recipients
                      </div>
                    )}
                  </div>
                </FormField>

                {/* Selected Users */}
                {selectedNotification.sentTo === 'specific' && selectedNotification.selectedUsers && (
                  <FormField>
                    <FormLabel>Selected Users</FormLabel>
                    <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedNotification.selectedUsers.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FormField>
                )}

                {/* Notification Content */}
                <FormField>
                  <FormLabel>Notification Content</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
                    {selectedNotification.content}
                  </div>
                </FormField>

                {/* Status */}
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    {getStatusBadge(selectedNotification.status)}
                  </div>
                </FormField>

                {/* Date Added */}
                <FormField>
                  <FormLabel>Date Added</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {formatDateTime(selectedNotification.dateAdded)}
                  </div>
                </FormField>

                {/* Date Sent */}
                <FormField>
                  <FormLabel>Date Sent</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {selectedNotification.dateSent ? formatDateTime(selectedNotification.dateSent) : '-'}
                  </div>
                </FormField>
              </FormSection>

              <FormFooter>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedNotification(null);
                  }}
                >
                  Close
                </SecondaryButton>
              </FormFooter>
            </div>
          )}
        </FormModal>
      </div>
    </div>
  );
}