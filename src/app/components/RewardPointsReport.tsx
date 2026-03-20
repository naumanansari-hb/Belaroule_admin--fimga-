import { useState, useMemo } from 'react';
import {
  Gift,
  Filter,
  User,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { PageHeader, SummaryWidgets, SearchBar, Pagination, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormInput } from './hb/common/Form';
import { toast } from 'sonner';

// Reward Points Report interface
interface RewardPointsReport {
  id: string;
  transactionId: string;
  transactionType: 'Credit' | 'Debit';
  userId: string;
  userName: string;
  country: string;
  platform: 'Android' | 'iOS';
  points: number;
  dateTime: string;
}

// Mock Reward Points Reports
const mockRewardPointsReports: RewardPointsReport[] = [
  {
    id: 'RPT001',
    transactionId: 'TXN-2026-001',
    transactionType: 'Credit',
    userId: 'USER001',
    userName: 'Emma Johnson',
    country: 'United States',
    platform: 'iOS',
    points: 500,
    dateTime: '2026-01-05T10:30:00',
  },
  {
    id: 'RPT002',
    transactionId: 'TXN-2026-002',
    transactionType: 'Debit',
    userId: 'USER002',
    userName: 'Sophia Williams',
    country: 'United Kingdom',
    platform: 'Android',
    points: 250,
    dateTime: '2026-01-06T14:20:00',
  },
  {
    id: 'RPT003',
    transactionId: 'TXN-2026-003',
    transactionType: 'Credit',
    userId: 'USER003',
    userName: 'Olivia Brown',
    country: 'Canada',
    platform: 'iOS',
    points: 1000,
    dateTime: '2026-01-07T16:45:00',
  },
  {
    id: 'RPT004',
    transactionId: 'TXN-2026-004',
    transactionType: 'Credit',
    userId: 'USER004',
    userName: 'Ava Davis',
    country: 'Australia',
    platform: 'Android',
    points: 750,
    dateTime: '2026-01-08T09:15:00',
  },
  {
    id: 'RPT005',
    transactionId: 'TXN-2026-005',
    transactionType: 'Debit',
    userId: 'USER005',
    userName: 'Isabella Martinez',
    country: 'Germany',
    platform: 'iOS',
    points: 300,
    dateTime: '2026-01-09T11:30:00',
  },
  {
    id: 'RPT006',
    transactionId: 'TXN-2026-006',
    transactionType: 'Credit',
    userId: 'USER006',
    userName: 'Mia Garcia',
    country: 'France',
    platform: 'Android',
    points: 600,
    dateTime: '2026-01-10T13:00:00',
  },
  {
    id: 'RPT007',
    transactionId: 'TXN-2026-007',
    transactionType: 'Debit',
    userId: 'USER007',
    userName: 'Charlotte Rodriguez',
    country: 'Spain',
    platform: 'iOS',
    points: 450,
    dateTime: '2026-01-11T08:45:00',
  },
  {
    id: 'RPT008',
    transactionId: 'TXN-2026-008',
    transactionType: 'Credit',
    userId: 'USER008',
    userName: 'Amelia Wilson',
    country: 'Italy',
    platform: 'Android',
    points: 850,
    dateTime: '2026-01-12T10:15:00',
  },
  {
    id: 'RPT009',
    transactionId: 'TXN-2026-009',
    transactionType: 'Credit',
    userId: 'USER009',
    userName: 'Harper Anderson',
    country: 'Japan',
    platform: 'iOS',
    points: 1200,
    dateTime: '2026-01-13T15:30:00',
  },
  {
    id: 'RPT010',
    transactionId: 'TXN-2026-010',
    transactionType: 'Debit',
    userId: 'USER010',
    userName: 'Evelyn Taylor',
    country: 'United States',
    platform: 'Android',
    points: 200,
    dateTime: '2026-01-14T09:00:00',
  },
];

// Get unique countries
const countries = Array.from(new Set(mockRewardPointsReports.map(r => r.country))).sort();

export default function RewardPointsReport() {
  const [reports] = useState<RewardPointsReport[]>(mockRewardPointsReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState<string>(() => {
    // Default to first day of current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    // Default to last day of current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  });

  // Applied filters (only update on Apply button)
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: '',
    country: 'all',
    platform: 'all',
    transactionType: 'all',
    sortBy: '',
    sortOrder: 'desc' as 'asc' | 'desc',
    startDate: (() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    })(),
    endDate: (() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    })(),
  });

  const [showFilters, setShowFilters] = useState(true);

  // Filter and sort data based on applied filters
  const filteredData = useMemo(() => {
    let filtered = reports;

    // Apply search
    if (appliedFilters.searchQuery) {
      filtered = filtered.filter((r) =>
        r.transactionId.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase()) ||
        r.userName.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase())
      );
    }

    // Apply country filter
    if (appliedFilters.country !== 'all') {
      filtered = filtered.filter(r => r.country === appliedFilters.country);
    }

    // Apply platform filter
    if (appliedFilters.platform !== 'all') {
      filtered = filtered.filter(r => r.platform === appliedFilters.platform);
    }

    // Apply transaction type filter
    if (appliedFilters.transactionType !== 'all') {
      filtered = filtered.filter(r => r.transactionType === appliedFilters.transactionType);
    }

    // Apply sorting
    if (appliedFilters.sortBy === 'points') {
      filtered = [...filtered].sort((a, b) => {
        const comparison = a.points > b.points ? 1 : -1;
        return appliedFilters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [reports, appliedFilters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const totalTransactions = filteredData.length;
    const creditTransactions = filteredData.filter(r => r.transactionType === 'Credit').length;
    const debitTransactions = filteredData.filter(r => r.transactionType === 'Debit').length;
    const totalCredits = filteredData.filter(r => r.transactionType === 'Credit').reduce((sum, r) => sum + r.points, 0);
    const totalDebits = filteredData.filter(r => r.transactionType === 'Debit').reduce((sum, r) => sum + r.points, 0);
    const netPoints = totalCredits - totalDebits;
    
    return [
      { 
        label: 'Total Transactions', 
        value: totalTransactions.toLocaleString(), 
        icon: Gift 
      },
      { 
        label: 'Total Credits', 
        value: `${totalCredits.toLocaleString()} pts (${creditTransactions})`, 
        icon: TrendingUp 
      },
      { 
        label: 'Total Debits', 
        value: `${totalDebits.toLocaleString()} pts (${debitTransactions})`, 
        icon: TrendingDown 
      },
      { 
        label: 'Net Points', 
        value: `${netPoints >= 0 ? '+' : ''}${netPoints.toLocaleString()} pts`, 
        icon: Gift 
      },
    ];
  };

  // Handle Apply filters
  const handleApplyFilters = () => {
    // Validate date range
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setAppliedFilters({
      searchQuery,
      country: selectedCountry,
      platform: selectedPlatform,
      transactionType: selectedTransactionType,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    });

    setCurrentPage(1); // Reset to first page
    toast.success('Filters applied successfully');
  };

  // Handle Reset filters
  const handleResetFilters = () => {
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedPlatform('all');
    setSelectedTransactionType('all');
    setSortBy('');
    setSortOrder('desc');
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);

    setAppliedFilters({
      searchQuery: '',
      country: 'all',
      platform: 'all',
      transactionType: 'all',
      sortBy: '',
      sortOrder: 'desc' as 'asc' | 'desc',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    });

    setCurrentPage(1);
    toast.success('Filters reset');
  };

  // Handle Export
  const handleExport = () => {
    // Create CSV content
    const headers = ['Transaction ID', 'Transaction Type', 'User ID', 'User Name', 'Country', 'Platform', 'Points', 'Date & Time'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(r => [
        r.transactionId,
        r.transactionType,
        r.userId,
        `"${r.userName}"`,
        `"${r.country}"`,
        r.platform,
        r.points,
        `"${new Date(r.dateTime).toLocaleString()}"`,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reward_points_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Reward points report exported successfully');
  };

  // Handle user click
  const handleUserClick = (userId: string, userName: string) => {
    toast.info(`View details for ${userName} (${userId})`);
    // In a real app, this would navigate to the user detail page
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Reward Points Report"
          breadcrumbs={[
            { label: 'Reports', href: '#' },
            { label: 'Reward Points Report', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Transaction ID or User Name..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
        </PageHeader>

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* SORTING UI */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          
          <button
            onClick={() => {
              if (sortBy === 'points') {
                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                setSortOrder(newOrder);
                setAppliedFilters({
                  ...appliedFilters,
                  sortBy: 'points',
                  sortOrder: newOrder,
                });
              } else {
                setSortBy('points');
                setSortOrder('desc');
                setAppliedFilters({
                  ...appliedFilters,
                  sortBy: 'points',
                  sortOrder: 'desc',
                });
              }
            }}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortBy === 'points'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Points {sortBy === 'points' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Country Filter */}
                <div>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <FormSelect
                    id="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    <option value="all">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </FormSelect>
                </div>

                {/* Platform Filter */}
                <div>
                  <FormLabel htmlFor="platform">Platform</FormLabel>
                  <FormSelect
                    id="platform"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    <option value="all">All Platforms</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                  </FormSelect>
                </div>

                {/* Transaction Type Filter */}
                <div>
                  <FormLabel htmlFor="transactionType">Transaction Type</FormLabel>
                  <FormSelect
                    id="transactionType"
                    value={selectedTransactionType}
                    onChange={(e) => setSelectedTransactionType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                  </FormSelect>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
                {/* Start Date */}
                <div>
                  <FormLabel htmlFor="startDate" required>Start Date</FormLabel>
                  <FormInput
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div>
                  <FormLabel htmlFor="endDate" required>End Date</FormLabel>
                  <FormInput
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
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
        )}

        {/* Active Filters Display */}
        {(appliedFilters.searchQuery || appliedFilters.country !== 'all' || appliedFilters.platform !== 'all' || appliedFilters.transactionType !== 'all') && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            {appliedFilters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Search: {appliedFilters.searchQuery}
              </span>
            )}
            {appliedFilters.country !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Country: {appliedFilters.country}
              </span>
            )}
            {appliedFilters.platform !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Platform: {appliedFilters.platform}
              </span>
            )}
            {appliedFilters.transactionType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Type: {appliedFilters.transactionType}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
              Date Range: {new Date(appliedFilters.startDate).toLocaleDateString()} - {new Date(appliedFilters.endDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {report.transactionId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          report.transactionType === 'Credit'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                            : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                        }`}>
                          {report.transactionType === 'Credit' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {report.transactionType}
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {report.transactionType === 'Credit' ? '+' : '-'}{report.points} pts
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {report.transactionType === 'Credit' ? 'Points earned' : 'Points Spent'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUserClick(report.userId, report.userName)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-900 dark:text-white font-medium">
                            {report.userName}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {report.userId}
                          </p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {report.country}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        report.platform === 'Android'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}>
                        {report.platform}
                      </span>
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
            <Gift className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No Data Available</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No reward points transactions found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}