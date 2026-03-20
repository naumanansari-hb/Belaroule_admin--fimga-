import { useState, useMemo } from 'react';
import {
  Bell,
  RefreshCw,
  Edit,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, FilterChips, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormModal, FormSection, FormFooter, FormLabel, FormSelect } from './hb/common/Form';
import { PrimaryButton } from './hb/listing';
import { toast } from 'sonner';
import SystemNotificationDetail from './SystemNotificationDetail';

// System Notification interface
interface SystemNotification {
  id: string;
  notificationCode: string;
  notificationTitle: string;
  notificationMessage: string;
  status: 'active' | 'inactive';
  lastUpdatedDate: string;
  variables: { key: string; description: string }[];
}

// Mock System Notifications
const mockSystemNotifications: SystemNotification[] = [
  {
    id: 'SN001',
    notificationCode: 'WELCOME_USER',
    notificationTitle: 'Welcome New User',
    notificationMessage: 'Welcome {{user_name}}! Your account has been created successfully.',
    status: 'active',
    lastUpdatedDate: '2024-01-15 10:30',
    variables: [
      { key: '{{user_name}}', description: 'Name of the user' },
    ],
  },
  {
    id: 'SN002',
    notificationCode: 'PASSWORD_RESET',
    notificationTitle: 'Password Reset Request',
    notificationMessage: 'Hi {{user_name}}, we received a request to reset your password. Click the link to proceed.',
    status: 'active',
    lastUpdatedDate: '2024-01-14 14:20',
    variables: [
      { key: '{{user_name}}', description: 'Name of the user' },
    ],
  },
  {
    id: 'SN003',
    notificationCode: 'NEW_POST_LIKE',
    notificationTitle: 'New Like on Your Post',
    notificationMessage: '{{liker_name}} liked your post "{{post_title}}".',
    status: 'active',
    lastUpdatedDate: '2024-01-13 16:45',
    variables: [
      { key: '{{liker_name}}', description: 'Name of the user who liked the post' },
      { key: '{{post_title}}', description: 'Title of the post that was liked' },
    ],
  },
  {
    id: 'SN004',
    notificationCode: 'NEW_FOLLOWER',
    notificationTitle: 'New Follower Notification',
    notificationMessage: '{{follower_name}} started following you.',
    status: 'active',
    lastUpdatedDate: '2024-01-12 11:15',
    variables: [
      { key: '{{follower_name}}', description: 'Name of the new follower' },
    ],
  },
  {
    id: 'SN005',
    notificationCode: 'COMMENT_ON_POST',
    notificationTitle: 'New Comment on Your Post',
    notificationMessage: '{{commenter_name}} commented on your post: "{{comment_text}}".',
    status: 'inactive',
    lastUpdatedDate: '2024-01-11 09:30',
    variables: [
      { key: '{{commenter_name}}', description: 'Name of the commenter' },
      { key: '{{comment_text}}', description: 'Text of the comment' },
    ],
  },
  {
    id: 'SN006',
    notificationCode: 'REWARD_POINTS_EARNED',
    notificationTitle: 'Reward Points Earned',
    notificationMessage: 'Congratulations {{user_name}}! You earned {{points}} reward points.',
    status: 'active',
    lastUpdatedDate: '2024-01-10 13:25',
    variables: [
      { key: '{{user_name}}', description: 'Name of the user' },
      { key: '{{points}}', description: 'Number of reward points earned' },
    ],
  },
  {
    id: 'SN007',
    notificationCode: 'OUTFIT_APPROVED',
    notificationTitle: 'Outfit Approved',
    notificationMessage: 'Your outfit "{{outfit_name}}" has been approved by our team.',
    status: 'active',
    lastUpdatedDate: '2024-01-09 15:40',
    variables: [
      { key: '{{outfit_name}}', description: 'Name of the approved outfit' },
    ],
  },
  {
    id: 'SN008',
    notificationCode: 'POST_FLAGGED',
    notificationTitle: 'Post Flagged for Review',
    notificationMessage: 'Your post "{{post_title}}" has been flagged for review. Reason: {{flag_reason}}.',
    status: 'inactive',
    lastUpdatedDate: '2024-01-08 08:50',
    variables: [
      { key: '{{post_title}}', description: 'Title of the flagged post' },
      { key: '{{flag_reason}}', description: 'Reason for flagging' },
    ],
  },
];

export default function SystemNotifications() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(mockSystemNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedNotification, setSelectedNotification] = useState<SystemNotification | null>(null);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [statusToggleData, setStatusToggleData] = useState<{ id: string; newStatus: 'active' | 'inactive' } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states (temporary - before Apply)
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Applied filters (only update on Apply button)
  const [appliedStatus, setAppliedStatus] = useState<string>('all');

  // Filter options
  const filterOptions = {
    'Status': ['Active', 'Inactive'],
  };

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = notifications;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((notification) => {
        const searchFields = [notification.notificationTitle, notification.notificationCode];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply dropdown filter
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(n => n.status === appliedStatus);
    }

    // Apply advanced filters
    const matchesFilters = (notification: SystemNotification) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === notification.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);
    return filtered;
  }, [notifications, searchQuery, appliedStatus, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = notifications.filter(n => n.status === 'active').length;
    
    return [
      { label: 'Total Templates', value: notifications.length.toString(), icon: Bell },
      { label: 'Active Templates', value: activeCount.toString(), icon: Bell },
    ];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart}`;
  };

  // Handle edit notification
  const handleEditNotification = (notification: SystemNotification) => {
    setSelectedNotification(notification);
  };

  // Handle update notification
  const handleUpdateNotification = (updatedNotification: SystemNotification) => {
    setNotifications(notifications.map(n => n.id === updatedNotification.id ? updatedNotification : n));
    setSelectedNotification(null);
    toast.success('System notification updated successfully');
  };

  // Handle status toggle click
  const handleStatusToggleClick = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setStatusToggleData({ id, newStatus });
    setShowStatusConfirmation(true);
  };

  // Handle confirm status update
  const handleConfirmStatusUpdate = () => {
    if (!statusToggleData) return;

    setNotifications(notifications.map(n => 
      n.id === statusToggleData.id 
        ? { ...n, status: statusToggleData.newStatus, lastUpdatedDate: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : n
    ));

    setShowStatusConfirmation(false);
    setStatusToggleData(null);
    toast.success('System notification status updated successfully');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedStatus('all');
    toast.success('Filters cleared');
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedStatus(selectedStatus);
    toast.success('Filters applied');
  };

  // If viewing notification detail
  if (selectedNotification) {
    return (
      <SystemNotificationDetail
        notification={selectedNotification}
        onBack={() => setSelectedNotification(null)}
        onSave={handleUpdateNotification}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="System Notifications"
          breadcrumbs={[
            { label: 'Configuration', href: '#' },
            { label: 'System Notifications', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search notifications..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setNotifications(mockSystemNotifications);
              setSearchQuery('');
              clearAllFilters();
              toast.success('Data refreshed');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
        </PageHeader>

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* INFO BANNER */}
        <div className="mb-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
          <p className="text-xs text-primary-800 dark:text-primary-200">
            <strong>Super Admin Only:</strong> System notifications are sent to users automatically. Use variables like {"{{user_name}}"} for dynamic content.
          </p>
        </div>

        {/* FILTERS SECTION */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <FormSelect
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Reset Filter
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-md transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE FILTERS */}
        {filters.length > 0 && (
          <FilterChips
            filters={filters}
            onRemoveFilter={(index) => setFilters(filters.filter((_, i) => i !== index))}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Notification Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Notification Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Message Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((notification) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium font-mono">
                        {notification.notificationCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {notification.notificationTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-md">
                        {notification.notificationMessage}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusToggleClick(notification.id, notification.status);
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          notification.status === 'active'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 hover:bg-success-100 dark:hover:bg-success-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {notification.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(notification.lastUpdatedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditNotification(notification)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
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
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No system notifications found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 ? 'Try adjusting your search or filters' : 'No system notifications available'}
            </p>
          </div>
        )}

        {/* STATUS CONFIRMATION MODAL */}
        <FormModal
          isOpen={showStatusConfirmation}
          onClose={() => {
            setShowStatusConfirmation(false);
            setStatusToggleData(null);
          }}
          title="Confirm Status Change"
        >
          <FormSection>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  Are you sure you want to change the status?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This notification will be {statusToggleData?.newStatus === 'active' ? 'activated' : 'deactivated'} and 
                  {statusToggleData?.newStatus === 'active' ? ' will be sent' : ' will not be sent'} to users.
                </p>
              </div>
            </div>
          </FormSection>
          <FormFooter>
            <SecondaryButton
              onClick={() => {
                setShowStatusConfirmation(false);
                setStatusToggleData(null);
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmStatusUpdate}>
              Confirm
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
