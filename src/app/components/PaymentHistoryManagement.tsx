import { useState, useMemo } from 'react';
import {
  CreditCard,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Smartphone,
  X,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';

// Payment Transaction interface
interface PaymentTransaction {
  transactionId: string;
  transactionDate: string;
  userName: string;
  userId: string;
  planId: string;
  planPurchased: string;
  coinsPurchased: number;
  amountPaid: number;
  currency: string;
  platform: 'Android' | 'iOS';
  status: 'success' | 'failed' | 'pending';
}

// Mock Payment Transactions
const mockTransactions: PaymentTransaction[] = [
  {
    transactionId: 'TXN001234567',
    transactionDate: '2024-01-15 14:32',
    userName: 'Sarah Johnson',
    userId: 'USR001',
    planId: 'RP002',
    planPurchased: '250 Coins Pack',
    coinsPurchased: 250,
    amountPaid: 9.99,
    currency: 'USD',
    platform: 'iOS',
    status: 'success',
  },
  {
    transactionId: 'TXN001234568',
    transactionDate: '2024-01-15 13:45',
    userName: 'Michael Chen',
    userId: 'USR002',
    planId: 'RP003',
    planPurchased: '500 Coins Pack',
    coinsPurchased: 500,
    amountPaid: 19.99,
    currency: 'USD',
    platform: 'Android',
    status: 'success',
  },
  {
    transactionId: 'TXN001234569',
    transactionDate: '2024-01-15 12:18',
    userName: 'Emily Davis',
    userId: 'USR003',
    planId: 'RP001',
    planPurchased: '100 Coins Pack',
    coinsPurchased: 100,
    amountPaid: 4.99,
    currency: 'USD',
    platform: 'iOS',
    status: 'failed',
  },
  {
    transactionId: 'TXN001234570',
    transactionDate: '2024-01-15 11:05',
    userName: 'James Wilson',
    userId: 'USR004',
    planId: 'RP004',
    planPurchased: '1000 Coins Pack',
    coinsPurchased: 1000,
    amountPaid: 34.99,
    currency: 'USD',
    platform: 'Android',
    status: 'success',
  },
  {
    transactionId: 'TXN001234571',
    transactionDate: '2024-01-15 10:22',
    userName: 'Olivia Martinez',
    userId: 'USR005',
    planId: 'RP002',
    planPurchased: '250 Coins Pack',
    coinsPurchased: 250,
    amountPaid: 9.99,
    currency: 'USD',
    platform: 'iOS',
    status: 'pending',
  },
  {
    transactionId: 'TXN001234572',
    transactionDate: '2024-01-14 18:44',
    userName: 'Daniel Brown',
    userId: 'USR006',
    planId: 'RP003',
    planPurchased: '500 Coins Pack',
    coinsPurchased: 500,
    amountPaid: 19.99,
    currency: 'USD',
    platform: 'Android',
    status: 'success',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function PaymentHistoryManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [transactions] = useState<PaymentTransaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');
  const [appliedPlatform, setAppliedPlatform] = useState<string>('all');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');

  // Filter data based on search
  const filteredData = useMemo(() => {
    let filtered = transactions;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((txn) => {
        const searchFields = [txn.transactionId, txn.userName, txn.userId];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply filters
    if (appliedFromDate) {
      filtered = filtered.filter(txn => new Date(txn.transactionDate) >= new Date(appliedFromDate));
    }
    if (appliedToDate) {
      filtered = filtered.filter(txn => new Date(txn.transactionDate) <= new Date(appliedToDate));
    }
    if (appliedPlatform !== 'all') {
      filtered = filtered.filter(txn => txn.platform === appliedPlatform);
    }
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(txn => txn.status === appliedStatus);
    }

    return filtered;
  }, [transactions, searchQuery, appliedFromDate, appliedToDate, appliedPlatform, appliedStatus]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const successCount = transactions.filter(t => t.status === 'success').length;
    const failedCount = transactions.filter(t => t.status === 'failed').length;
    const pendingCount = transactions.filter(t => t.status === 'pending').length;
    const totalRevenue = transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amountPaid, 0);
    
    return [
      { label: 'Total Transactions', value: transactions.length.toString(), icon: CreditCard },
      { label: 'Successful', value: successCount.toString(), icon: CheckCircle2 },
      { label: 'Failed', value: failedCount.toString(), icon: XCircle },
      { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: CreditCard },
    ];
  };

  // Format date helper
  const formatDateTime = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const date = new Date(datePart);
    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${formattedDate} ${timePart}`;
  };

  // Handle row click to show details
  const handleRowClick = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle2, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-100 dark:bg-success-900/30', label: 'Success' };
      case 'failed':
        return { icon: XCircle, color: 'text-error-600 dark:text-error-400', bg: 'bg-error-100 dark:bg-error-900/30', label: 'Failed' };
      case 'pending':
        return { icon: Clock, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-100 dark:bg-warning-900/30', label: 'Pending' };
      default:
        return { icon: Clock, color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-50 dark:bg-neutral-950', label: 'Unknown' };
    }
  };

  // Handle Apply filters
  const handleApplyFilters = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedPlatform(selectedPlatform);
    setAppliedStatus(selectedStatus);
    toast.success('Filters applied');
  };

  // Handle Reset filters
  const handleResetFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedPlatform('all');
    setSelectedStatus('all');
    setAppliedFromDate('');
    setAppliedToDate('');
    setAppliedPlatform('all');
    setAppliedStatus('all');
    toast.success('Filters reset');
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedFromDate || appliedToDate) count++;
    if (appliedPlatform !== 'all') count++;
    if (appliedStatus !== 'all') count++;
    return count;
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Payment History"
          breadcrumbs={[
            { label: 'Plan Management', href: '#' },
            { label: 'Payment History', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              activeFilterCount={getActiveFiltersCount()}
              placeholder="Search by Transaction ID or User Name..."
            />
          </div>
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setSearchQuery('');
              toast.success('Data refreshed');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
          <ViewModeSwitcher
            currentMode={viewMode}
            onChange={setViewMode}
          />
        </PageHeader>

        {/* ========== SUMMARY WIDGETS ========== */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                  {/* Transaction Status Filter */}
                  <div>
                    <FormLabel htmlFor="status">Transaction Status</FormLabel>
                    <FormSelect
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                    </FormSelect>
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
            {(appliedFromDate || appliedToDate) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Date: {appliedFromDate || '...'} to {appliedToDate || '...'}
              </span>
            )}
            {appliedPlatform !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Platform: {appliedPlatform}
              </span>
            )}
            {appliedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Status: {appliedStatus.charAt(0).toUpperCase() + appliedStatus.slice(1)}
              </span>
            )}
          </div>
        )}

        {/* ========== READ-ONLY INFO BANNER ========== */}
        <div className="mb-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
          <p className="text-xs text-primary-800 dark:text-primary-200">
            <strong>Note:</strong> Payment history is read-only. Click on any transaction to view detailed information. No payment actions (refund, retry, cancel) are available from this panel.
          </p>
        </div>

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Plan Purchased</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Coins</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Amount Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((txn) => {
                    const statusDisplay = getStatusDisplay(txn.status);
                    const StatusIcon = statusDisplay.icon;

                    return (
                      <tr
                        key={txn.transactionId}
                        onClick={() => handleRowClick(txn)}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                            {txn.transactionId}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDateTime(txn.transactionDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {txn.userName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {txn.planPurchased}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white font-medium">
                            {txn.coinsPurchased.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white font-medium">
                            {txn.currency} {txn.amountPaid.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              {txn.platform}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusDisplay.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== GRID VIEW ========== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((txn) => {
              const statusDisplay = getStatusDisplay(txn.status);
              const StatusIcon = statusDisplay.icon;

              return (
                <div
                  key={txn.transactionId}
                  onClick={() => handleRowClick(txn)}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 block">{txn.transactionId}</span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{formatDateTime(txn.transactionDate)}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusDisplay.bg} ${statusDisplay.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusDisplay.label}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{txn.userName}</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{txn.planPurchased}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Amount</span>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {txn.currency} {txn.amountPaid.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Coins</span>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {txn.coinsPurchased.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">{txn.platform}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((txn) => {
              const statusDisplay = getStatusDisplay(txn.status);
              const StatusIcon = statusDisplay.icon;

              return (
                <div
                  key={txn.transactionId}
                  onClick={() => handleRowClick(txn)}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {txn.userName}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {txn.transactionId}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                          <span>{txn.planPurchased}</span>
                          <span>•</span>
                          <span>{txn.coinsPurchased.toLocaleString()} coins</span>
                          <span>•</span>
                          <span>{txn.currency} {txn.amountPaid.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{txn.platform}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusDisplay.bg} ${statusDisplay.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusDisplay.label}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 w-32">
                        {formatDateTime(txn.transactionDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========== PAGINATION ========== */}
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

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No payment history found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery
                ? 'Try adjusting your search'
                : 'No transactions available'}
            </p>
          </div>
        )}

        {/* ========== TRANSACTION DETAILS MODAL ========== */}
        {showDetailsModal && selectedTransaction && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <div
              className="bg-white dark:bg-neutral-950 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Transaction Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Transaction ID
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.transactionId}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Transaction Date & Time
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {formatDateTime(selectedTransaction.transactionDate)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      User Name
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.userName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      User ID
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.userId}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Plan ID
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.planId}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Plan Name
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.planPurchased}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Coins Purchased
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.coinsPurchased.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Amount Paid
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.amountPaid.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Currency
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.currency}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Platform
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-neutral-500" />
                      {selectedTransaction.platform}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Transaction Status
                    </label>
                    <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      {(() => {
                        const statusDisplay = getStatusDisplay(selectedTransaction.status);
                        const StatusIcon = statusDisplay.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 ${statusDisplay.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{statusDisplay.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                    Status Information
                  </h3>
                  <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {selectedTransaction.status === 'success' && (
                      <li>✓ Payment successful - Coins have been credited to the user's account</li>
                    )}
                    {selectedTransaction.status === 'failed' && (
                      <li>✗ Payment failed - No coins were credited</li>
                    )}
                    {selectedTransaction.status === 'pending' && (
                      <li>⏳ Payment pending - Awaiting confirmation from payment gateway</li>
                    )}
                    <li>• Transaction status cannot be modified from Admin Panel</li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}