import { useState, useMemo } from 'react';
import {
  UserX,
  RefreshCw,
  Eye,
  Flag,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import FlaggedUserDetail from './FlaggedUserDetail';

interface FlaggedUser {
  userId: string;
  userName: string;
  userEmail: string;
  flagReason: string;
  totalFlagsCount: number;
  currentUserStatus: 'active' | 'inactive';
  lastFlagDate: string;
  flagStatus: 'flagged' | 'resolved';
  flagId: string;
}

const mockFlaggedUsers: FlaggedUser[] = [
  {
    userId: 'USR001',
    userName: 'John Spammer',
    userEmail: 'john.spam@example.com',
    flagReason: 'Repeated Spam Posts',
    totalFlagsCount: 23,
    currentUserStatus: 'inactive',
    lastFlagDate: '2026-01-15',
    flagStatus: 'flagged',
    flagId: 'FLG001',
  },
  {
    userId: 'USR002',
    userName: 'Jane Troll',
    userEmail: 'jane.troll@example.com',
    flagReason: 'Harassment',
    totalFlagsCount: 8,
    currentUserStatus: 'active',
    lastFlagDate: '2026-01-14',
    flagStatus: 'flagged',
    flagId: 'FLG002',
  },
  {
    userId: 'USR003',
    userName: 'Mike Abusive',
    userEmail: 'mike.abuse@example.com',
    flagReason: 'Abusive Behavior',
    totalFlagsCount: 15,
    currentUserStatus: 'inactive',
    lastFlagDate: '2026-01-13',
    flagStatus: 'resolved',
    flagId: 'FLG003',
  },
  {
    userId: 'USR004',
    userName: 'Sarah Fake',
    userEmail: 'sarah.fake@example.com',
    flagReason: 'Fake Account',
    totalFlagsCount: 5,
    currentUserStatus: 'active',
    lastFlagDate: '2026-01-12',
    flagStatus: 'flagged',
    flagId: 'FLG004',
  },
  {
    userId: 'USR005',
    userName: 'Tom Violator',
    userEmail: 'tom.violator@example.com',
    flagReason: 'Inappropriate Content',
    totalFlagsCount: 12,
    currentUserStatus: 'inactive',
    lastFlagDate: '2026-01-11',
    flagStatus: 'resolved',
    flagId: 'FLG005',
  },
  {
    userId: 'USR006',
    userName: 'Lisa Scammer',
    userEmail: 'lisa.scam@example.com',
    flagReason: 'Scam Activity',
    totalFlagsCount: 18,
    currentUserStatus: 'inactive',
    lastFlagDate: '2026-01-10',
    flagStatus: 'flagged',
    flagId: 'FLG006',
  },
  {
    userId: 'USR007',
    userName: 'Alex Bully',
    userEmail: 'alex.bully@example.com',
    flagReason: 'Harassment',
    totalFlagsCount: 3,
    currentUserStatus: 'active',
    lastFlagDate: '2026-01-09',
    flagStatus: 'flagged',
    flagId: 'FLG007',
  },
  {
    userId: 'USR008',
    userName: 'Rachel Spam',
    userEmail: 'rachel.spam@example.com',
    flagReason: 'Repeated Spam Posts',
    totalFlagsCount: 30,
    currentUserStatus: 'inactive',
    lastFlagDate: '2026-01-08',
    flagStatus: 'flagged',
    flagId: 'FLG008',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type SortOrder = 'asc' | 'desc';

interface FlaggedUsersManagementProps {
  onNavigate?: (page: string, userId?: string) => void;
}

export default function FlaggedUsersManagement({ onNavigate }: FlaggedUsersManagementProps = {}) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [flaggedUsers] = useState<FlaggedUser[]>(mockFlaggedUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedStatus(selectedStatus);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    toast.success('Filters applied');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setFromDate('');
    setToDate('');
    setAppliedStatus('all');
    setAppliedFromDate('');
    setAppliedToDate('');
    toast.success('Filters reset');
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedStatus !== 'all') count++;
    if (appliedFromDate || appliedToDate) count++;
    return count;
  };

  const filteredData = useMemo(() => {
    let filtered = flaggedUsers;

    // Apply search: Flag ID or Flagged User
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const searchFields = [item.flagId, item.userId, item.userName];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply filters
    const matchesFilters = (item: FlaggedUser) => {
      if (appliedStatus !== 'all' && appliedStatus !== item.flagStatus) return false;
      
      if (appliedFromDate && appliedToDate) {
        const flagDate = new Date(item.lastFlagDate);
        const startDate = new Date(appliedFromDate);
        const endDate = new Date(appliedToDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return flagDate >= startDate && flagDate <= endDate;
      }
      
      return true;
    };

    filtered = filtered.filter(matchesFilters);

    // Apply sorting by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.lastFlagDate).getTime();
      const dateB = new Date(b.lastFlagDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [flaggedUsers, searchQuery, appliedStatus, appliedFromDate, appliedToDate, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const getSummaryWidgets = () => {
    const totalFlags = flaggedUsers.reduce((sum, item) => sum + item.totalFlagsCount, 0);
    const activeCount = flaggedUsers.filter(item => item.currentUserStatus === 'active').length;
    
    return [
      { label: 'Total Flagged Users', value: flaggedUsers.length.toString(), icon: UserX },
      { label: 'Total Flags', value: totalFlags.toString(), icon: Flag },
      { label: 'Active Users', value: activeCount.toString(), icon: Eye },
    ];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleViewUser = (userId: string) => {
    const user = flaggedUsers.find(u => u.userId === userId);
    if (user) {
      setSelectedUser(user);
      toast.info(`Navigate to User Detail: ${userId}`);
    }
  };

  const getFlagSeverityColor = (count: number) => {
    if (count >= 15) return 'text-error-700 dark:text-error-300 bg-error-100 dark:bg-error-900/30';
    if (count >= 8) return 'text-warning-700 dark:text-warning-300 bg-warning-100 dark:bg-warning-900/30';
    return 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800';
  };

  // Show detail view if a user is selected
  if (selectedUser) {
    return (
      <FlaggedUserDetail
        userId={selectedUser.userId}
        userName={selectedUser.userName}
        userEmail={selectedUser.userEmail}
        flagReason={selectedUser.flagReason}
        totalFlagsCount={selectedUser.totalFlagsCount}
        currentUserStatus={selectedUser.currentUserStatus}
        lastFlagDate={selectedUser.lastFlagDate}
        onBack={() => setSelectedUser(null)}
        onUpdate={(status, adminNote) => {
          console.log('Update user status:', status, adminNote);
          setSelectedUser(null);
        }}
        onNavigateToUser={(userId) => {
          if (onNavigate) {
            onNavigate('user-detail', userId);
          } else {
            toast.info('Navigation not configured');
          }
        }}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        <PageHeader
          title="Flagged Users"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Users', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Flag ID or Flagged User..."
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
              setSearchQuery('');
              handleResetFilters();
              toast.success('Data refreshed');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </PageHeader>

        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* ========== FILTERS SECTION ========== */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <FormSelect
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="flagged">Flagged</option>
                      <option value="resolved">Resolved</option>
                    </FormSelect>
                  </div>

                  {/* Date Range - From Date */}
                  <div>
                    <FormLabel htmlFor="fromDate">From Date</FormLabel>
                    <input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Date Range - To Date */}
                  <div>
                    <FormLabel htmlFor="toDate">To Date</FormLabel>
                    <input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-md transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            {appliedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Status: {appliedStatus.charAt(0).toUpperCase() + appliedStatus.slice(1)}
              </span>
            )}
            {(appliedFromDate || appliedToDate) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Date: {appliedFromDate || '...'} to {appliedToDate || '...'}
              </span>
            )}
          </div>
        )}

        <div className="mb-4 bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg px-4 py-2">
          <p className="text-xs text-error-800 dark:text-error-200">
            <strong>Attention Required:</strong> These users have been flagged for repeated violations. Review and take appropriate action via User Detail page.
          </p>
        </div>

        {/* SORTING OPTIONS */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 text-xs rounded-lg border transition-colors bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            Date {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Total Flags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flagged Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((item) => (
                    <tr key={item.userId} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{item.flagId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white">{item.userId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white">{item.userName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.userEmail}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white max-w-xs truncate" title={item.flagReason}>
                          {item.flagReason}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getFlagSeverityColor(item.totalFlagsCount)}`}>
                          {item.totalFlagsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.flagStatus === 'flagged'
                            ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                            : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        }`}>
                          {item.flagStatus === 'flagged' ? 'Flagged' : 'Resolved'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(item.lastFlagDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewUser(item.userId)}
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((item) => (
              <div key={item.userId} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-error-100 dark:bg-error-900 flex items-center justify-center">
                      <UserX className="w-4 h-4 text-error-600 dark:text-error-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{item.userName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.flagId}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${getFlagSeverityColor(item.totalFlagsCount)}`}>
                    {item.totalFlagsCount}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 rounded text-xs font-medium mb-2">
                    {item.flagReason}
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.userEmail}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.flagStatus === 'flagged'
                      ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                      : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                  }`}>
                    {item.flagStatus === 'flagged' ? 'Flagged' : 'Resolved'}
                  </span>
                  <button
                    onClick={() => handleViewUser(item.userId)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((item) => (
              <div key={item.userId} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-error-100 dark:bg-error-900 flex items-center justify-center flex-shrink-0">
                      <UserX className="w-5 h-5 text-error-600 dark:text-error-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.userName}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.flagId}</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getFlagSeverityColor(item.totalFlagsCount)}`}>
                      {item.totalFlagsCount}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.flagStatus === 'flagged'
                        ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                        : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                    }`}>
                      {item.flagStatus === 'flagged' ? 'Flagged' : 'Resolved'}
                    </span>
                    <button
                      onClick={() => handleViewUser(item.userId)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No flagged users found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || getActiveFiltersCount() > 0 ? 'Try adjusting your search or filters' : 'No flagged users available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}