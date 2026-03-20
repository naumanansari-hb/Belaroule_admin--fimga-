import { useState, useMemo } from 'react';
import {
  User,
  Download,
  UserX,
  Calendar,
  Smartphone,
  FileText,
  Filter,
} from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton, SummaryWidgets, SearchBar, Pagination } from './hb/listing';
import {
  FormLabel,
  FormInput,
  FormSelect,
} from './hb/common/Form';
import { toast } from 'sonner';
import { formatDate, formatDateTime } from '@/utils/dateFormatter';

// Deleted User interface
interface DeletedUser {
  deletedUserId: string;
  userName: string;
  reason: string;
  deletedAt: string;
  deviceModel: string | null;
  osVersion: string | null;
}

// Mock Deleted Users data
const mockDeletedUsers: DeletedUser[] = [
  {
    deletedUserId: 'DU-00123',
    userName: 'John Doe',
    reason: 'Not using the app',
    deletedAt: '2026-01-20T12:30:00Z',
    deviceModel: 'iPhone 14 Pro',
    osVersion: 'iOS 17.2',
  },
  {
    deletedUserId: 'DU-00124',
    userName: 'Aanya Sharma',
    reason: 'Privacy concerns',
    deletedAt: '2026-01-18T09:10:00Z',
    deviceModel: null,
    osVersion: null,
  },
  {
    deletedUserId: 'DU-00125',
    userName: 'Michael Chen',
    reason: 'Switching to a different app',
    deletedAt: '2026-01-15T14:22:00Z',
    deviceModel: 'Samsung Galaxy S23',
    osVersion: 'Android 14',
  },
  {
    deletedUserId: 'DU-00126',
    userName: 'Emma Wilson',
    reason: 'Not using the app',
    deletedAt: '2026-01-12T10:45:00Z',
    deviceModel: 'iPhone 13',
    osVersion: 'iOS 17.1',
  },
  {
    deletedUserId: 'DU-00127',
    userName: 'Raj Patel',
    reason: 'Privacy concerns',
    deletedAt: '2026-01-10T16:30:00Z',
    deviceModel: 'Google Pixel 8',
    osVersion: 'Android 14',
  },
  {
    deletedUserId: 'DU-00128',
    userName: 'Sophie Martin',
    reason: 'Account issues',
    deletedAt: '2026-01-08T11:15:00Z',
    deviceModel: 'iPhone 15 Pro Max',
    osVersion: 'iOS 17.3',
  },
  {
    deletedUserId: 'DU-00129',
    userName: 'David Lee',
    reason: 'Not using the app',
    deletedAt: '2026-01-05T08:20:00Z',
    deviceModel: null,
    osVersion: null,
  },
  {
    deletedUserId: 'DU-00130',
    userName: 'Isabella Rodriguez',
    reason: 'Switching to a different app',
    deletedAt: '2026-01-03T13:40:00Z',
    deviceModel: 'Samsung Galaxy S24',
    osVersion: 'Android 14',
  },
  {
    deletedUserId: 'DU-00131',
    userName: 'James Anderson',
    reason: 'Privacy concerns',
    deletedAt: '2025-12-28T09:55:00Z',
    deviceModel: 'iPhone 14',
    osVersion: 'iOS 17.0',
  },
  {
    deletedUserId: 'DU-00132',
    userName: 'Olivia Taylor',
    reason: 'Not using the app',
    deletedAt: '2025-12-25T15:10:00Z',
    deviceModel: 'OnePlus 11',
    osVersion: 'Android 13',
  },
  {
    deletedUserId: 'DU-00133',
    userName: 'Liam Brown',
    reason: 'Account issues',
    deletedAt: '2025-12-22T12:05:00Z',
    deviceModel: null,
    osVersion: null,
  },
  {
    deletedUserId: 'DU-00134',
    userName: 'Ava Garcia',
    reason: 'Privacy concerns',
    deletedAt: '2025-12-20T10:30:00Z',
    deviceModel: 'iPhone 15',
    osVersion: 'iOS 17.2',
  },
  {
    deletedUserId: 'DU-00135',
    userName: 'Noah Martinez',
    reason: 'Not using the app',
    deletedAt: '2025-12-18T14:20:00Z',
    deviceModel: 'Samsung Galaxy A54',
    osVersion: 'Android 13',
  },
  {
    deletedUserId: 'DU-00136',
    userName: 'Mia Johnson',
    reason: 'Switching to a different app',
    deletedAt: '2025-12-15T11:45:00Z',
    deviceModel: 'iPhone 13 Pro',
    osVersion: 'iOS 16.7',
  },
  {
    deletedUserId: 'DU-00137',
    userName: 'Ethan Davis',
    reason: 'Privacy concerns',
    deletedAt: '2025-12-12T16:55:00Z',
    deviceModel: 'Google Pixel 7',
    osVersion: 'Android 14',
  },
];

// Mock filter options
const reasonOptions = [
  { key: 'NOT_USING', label: 'Not using the app' },
  { key: 'PRIVACY', label: 'Privacy concerns' },
  { key: 'SWITCHING', label: 'Switching to a different app' },
  { key: 'ACCOUNT_ISSUES', label: 'Account issues' },
];

const deviceModelOptions = [
  'iPhone 14 Pro',
  'iPhone 13',
  'iPhone 15 Pro Max',
  'iPhone 14',
  'iPhone 15',
  'iPhone 13 Pro',
  'Samsung Galaxy S23',
  'Samsung Galaxy S24',
  'Samsung Galaxy A54',
  'Google Pixel 8',
  'Google Pixel 7',
  'OnePlus 11',
];

const osVersionOptions = [
  'iOS 17.2',
  'iOS 17.1',
  'iOS 17.3',
  'iOS 17.0',
  'iOS 16.7',
  'Android 14',
  'Android 13',
];

export default function DeletedUsersManagement({
  onViewDetail,
}: {
  onViewDetail?: (deletedUserId: string) => void;
}) {
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedReason, setSelectedReason] = useState('all');
  const [selectedDeviceModel, setSelectedDeviceModel] = useState('all');
  const [selectedOsVersion, setSelectedOsVersion] = useState('all');
  
  // Applied filters (for filter chips display)
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    reason: 'all',
    deviceModel: 'all',
    osVersion: 'all',
  });
  
  // Sorting
  const [sortField, setSortField] = useState<string>('deletedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Export loading state
  const [isExporting, setIsExporting] = useState(false);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = [...mockDeletedUsers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.userName.toLowerCase().includes(query) ||
        user.reason.toLowerCase().includes(query) ||
        user.deletedUserId.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (appliedFilters.dateFrom) {
      const fromDate = new Date(appliedFilters.dateFrom);
      filtered = filtered.filter(user => new Date(user.deletedAt) >= fromDate);
    }
    if (appliedFilters.dateTo) {
      const toDate = new Date(appliedFilters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire end date
      filtered = filtered.filter(user => new Date(user.deletedAt) <= toDate);
    }

    // Reason filter
    if (appliedFilters.reason !== 'all') {
      const selectedReasonLabel = reasonOptions.find(r => r.key === appliedFilters.reason)?.label;
      filtered = filtered.filter(user => user.reason === selectedReasonLabel);
    }

    // Device Model filter
    if (appliedFilters.deviceModel !== 'all') {
      filtered = filtered.filter(user => user.deviceModel === appliedFilters.deviceModel);
    }

    // OS Version filter
    if (appliedFilters.osVersion !== 'all') {
      filtered = filtered.filter(user => user.osVersion === appliedFilters.osVersion);
    }

    return filtered;
  }, [mockDeletedUsers, searchQuery, appliedFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      let aValue = a[sortField as keyof DeletedUser];
      let bValue = b[sortField as keyof DeletedUser];

      // Handle date fields
      if (sortField === 'deletedAt') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0;
        bValue = bValue ? new Date(bValue as string).getTime() : 0;
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };



  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle Apply Filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      dateFrom,
      dateTo,
      reason: selectedReason,
      deviceModel: selectedDeviceModel,
      osVersion: selectedOsVersion,
    });

    setCurrentPage(1); // Reset to first page
    setShowFilters(false);
    toast.success('Filters applied successfully');
  };

  // Handle Clear Filters
  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedReason('all');
    setSelectedDeviceModel('all');
    setSelectedOsVersion('all');
    setAppliedFilters({
      dateFrom: '',
      dateTo: '',
      reason: 'all',
      deviceModel: 'all',
      osVersion: 'all',
    });
    setCurrentPage(1);
    toast.success('Filters cleared');
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    setIsExporting(true);
    
    // Simulate export delay
    setTimeout(() => {
      try {
        // Create CSV content
        const headers = ['User Name', 'Reason for Deletion', 'Date of Deletion', 'Device Model', 'OS Version'];
        const rows = sortedData.map(user => [
          user.userName,
          user.reason,
          formatDateTime(user.deletedAt),
          user.deviceModel || 'N/A',
          user.osVersion || 'N/A',
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `deleted_users_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('CSV exported successfully');
      } catch (error) {
        toast.error('Unable to export. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }, 1000);
  };

  // Handle user name click
  const handleUserNameClick = (deletedUserId: string) => {
    if (onViewDetail) {
      onViewDetail(deletedUserId);
    }
  };

  // Get summary widgets
  const getSummaryWidgets = () => {
    return [
      { label: 'Total Deleted Users', value: mockDeletedUsers.length.toString(), icon: UserX },
      { label: 'Privacy Concerns', value: mockDeletedUsers.filter(u => u.reason === 'Privacy concerns').length.toString(), icon: FileText },
      { label: 'Not Using App', value: mockDeletedUsers.filter(u => u.reason === 'Not using the app').length.toString(), icon: User },
    ];
  };

  // Check if any filters are active
  const hasActiveFilters = appliedFilters.dateFrom || appliedFilters.dateTo || appliedFilters.reason !== 'all' || appliedFilters.deviceModel !== 'all' || appliedFilters.osVersion !== 'all';

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Deleted Users"
          breadcrumbs={[
            { label: 'User Management', href: '#' },
            { label: 'Deleted Users', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by User Name, Reason for deletion."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <SecondaryButton
            onClick={handleExportCSV}
            disabled={isExporting || sortedData.length === 0}
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </SecondaryButton>
        </PageHeader>

        {/* ========== SUMMARY WIDGETS ========== */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* ========== SORTING UI ========== */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          <button
            onClick={() => handleSort('userName')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'userName'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            User Name {sortField === 'userName' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('reason')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'reason'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Reason {sortField === 'reason' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('deletedAt')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'deletedAt'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Date of Deletion {sortField === 'deletedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('deviceModel')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'deviceModel'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Device Model {sortField === 'deviceModel' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('osVersion')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'osVersion'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            OS Version {sortField === 'osVersion' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* ========== FILTERS SECTION ========== */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Date From */}
                <div>
                  <FormLabel htmlFor="dateFrom">Date From</FormLabel>
                  <FormInput
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div>
                  <FormLabel htmlFor="dateTo">Date To</FormLabel>
                  <FormInput
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                {/* Reason for Deletion */}
                <div>
                  <FormLabel htmlFor="reason">Reason for Deletion</FormLabel>
                  <FormSelect
                    id="reason"
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  >
                    <option value="all">All Reasons</option>
                    {reasonOptions.map(reason => (
                      <option key={reason.key} value={reason.key}>{reason.label}</option>
                    ))}
                  </FormSelect>
                </div>

                {/* Device Model */}
                <div>
                  <FormLabel htmlFor="deviceModel">Device Model</FormLabel>
                  <FormSelect
                    id="deviceModel"
                    value={selectedDeviceModel}
                    onChange={(e) => setSelectedDeviceModel(e.target.value)}
                  >
                    <option value="all">All Devices</option>
                    {deviceModelOptions.map(device => (
                      <option key={device} value={device}>{device}</option>
                    ))}
                  </FormSelect>
                </div>

                {/* OS Version */}
                <div>
                  <FormLabel htmlFor="osVersion">OS Version</FormLabel>
                  <FormSelect
                    id="osVersion"
                    value={selectedOsVersion}
                    onChange={(e) => setSelectedOsVersion(e.target.value)}
                  >
                    <option value="all">All OS Versions</option>
                    {osVersionOptions.map(os => (
                      <option key={os} value={os}>{os}</option>
                    ))}
                  </FormSelect>
                </div>

              </div>

              {/* Apply and Clear Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                {hasActiveFilters && (
                  <SecondaryButton
                    onClick={handleClearFilters}
                    size="sm"
                  >
                    Clear Filters
                  </SecondaryButton>
                )}
                <PrimaryButton
                  onClick={handleApplyFilters}
                  size="sm"
                >
                  Apply Filters
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            {appliedFilters.dateFrom && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                From: {formatDate(appliedFilters.dateFrom)}
              </span>
            )}
            {appliedFilters.dateTo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                To: {formatDate(appliedFilters.dateTo)}
              </span>
            )}
            {appliedFilters.reason !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Reason: {reasonOptions.find(r => r.key === appliedFilters.reason)?.label}
              </span>
            )}
            {appliedFilters.deviceModel !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Device: {appliedFilters.deviceModel}
              </span>
            )}
            {appliedFilters.osVersion !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                OS: {appliedFilters.osVersion}
              </span>
            )}
          </div>
        )}

        {/* ========== DATA TABLE ========== */}
        <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Listing Title */}
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Deleted Users List
            </h2>
          </div>

          {sortedData.length === 0 ? (
            <div className="p-8 text-center">
              <UserX className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {searchQuery || hasActiveFilters ? 'No results found.' : 'No Deleted Users Available.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Reason for Deletion</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date of Deletion</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Device Model</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">OS Version</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedData.map((user) => (
                      <tr
                        key={user.deletedUserId}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleUserNameClick(user.deletedUserId)}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline font-medium"
                          >
                            {user.userName}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-neutral-100">
                            {user.reason}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDateTime(user.deletedAt)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {user.deviceModel || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {user.osVersion || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ========== PAGINATION ========== */}
              <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={sortedData.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}