import { useState, useMemo } from 'react';
import {
  Download,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  Smartphone,
  Globe,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SearchBar, Pagination, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';

// Transaction data interface
export interface Transaction {
  transactionId: string;
  packageId: string;
  userName: string;
  userId: string;
  platform: 'Android' | 'iOS';
  currency: string;
  amount: number;
  status: 'Successful' | 'Failed';
  transactionDate: string; // 'YYYY-MM-DD HH:MM'
}

// Initial mock transactions list
const initialTransactions: Transaction[] = [
  {
    transactionId: 'TXN100000001',
    packageId: 'PKG-001',
    userName: 'Sophie Anderson',
    userId: 'U10234',
    platform: 'iOS',
    currency: 'USD',
    amount: 6.99,
    status: 'Successful',
    transactionDate: '2026-07-06 14:30',
  },
  {
    transactionId: 'TXN100000002',
    packageId: 'PKG-002',
    userName: 'Emma Martinez',
    userId: 'U10235',
    platform: 'Android',
    currency: 'EUR',
    amount: 12.99,
    status: 'Successful',
    transactionDate: '2026-07-06 11:15',
  },
  {
    transactionId: 'TXN100000003',
    packageId: 'PKG-003',
    userName: 'Olivia Brown',
    userId: 'U10236',
    platform: 'iOS',
    currency: 'GBP',
    amount: 18.50,
    status: 'Failed',
    transactionDate: '2026-07-05 16:45',
  },
  {
    transactionId: 'TXN100000004',
    packageId: 'PKG-002',
    userName: 'Ava Johnson',
    userId: 'U10237',
    platform: 'Android',
    currency: 'USD',
    amount: 13.99,
    status: 'Successful',
    transactionDate: '2026-07-05 09:20',
  },
  {
    transactionId: 'TXN100000005',
    packageId: 'PKG-001',
    userName: 'Sophie Anderson',
    userId: 'U10234',
    platform: 'iOS',
    currency: 'USD',
    amount: 6.99,
    status: 'Failed',
    transactionDate: '2026-07-04 18:10',
  },
  {
    transactionId: 'TXN100000006',
    packageId: 'PKG-003',
    userName: 'Emma Martinez',
    userId: 'U10235',
    platform: 'Android',
    currency: 'EUR',
    amount: 19.99,
    status: 'Successful',
    transactionDate: '2026-07-04 15:02',
  },
  {
    transactionId: 'TXN100000007',
    packageId: 'PKG-002',
    userName: 'Lucas Taylor',
    userId: 'U10238', // External user, will link but falls back to user list if not matched
    platform: 'iOS',
    currency: 'CAD',
    amount: 17.99,
    status: 'Successful',
    transactionDate: '2026-07-03 12:40',
  },
  {
    transactionId: 'TXN100000008',
    packageId: 'PKG-001',
    userName: 'Olivia Brown',
    userId: 'U10236',
    platform: 'iOS',
    currency: 'USD',
    amount: 6.99,
    status: 'Successful',
    transactionDate: '2026-07-02 20:30',
  },
  {
    transactionId: 'TXN100000009',
    packageId: 'PKG-003',
    userName: 'Ava Johnson',
    userId: 'U10237',
    platform: 'Android',
    currency: 'GBP',
    amount: 18.50,
    status: 'Successful',
    transactionDate: '2026-07-02 10:15',
  },
  {
    transactionId: 'TXN100000010',
    packageId: 'PKG-002',
    userName: 'Sophie Anderson',
    userId: 'U10234',
    platform: 'iOS',
    currency: 'USD',
    amount: 13.99,
    status: 'Successful',
    transactionDate: '2026-07-01 15:55',
  },
  {
    transactionId: 'TXN100000011',
    packageId: 'PKG-001',
    userName: 'Emma Martinez',
    userId: 'U10235',
    platform: 'Android',
    currency: 'EUR',
    amount: 6.50,
    status: 'Successful',
    transactionDate: '2026-06-30 08:45',
  },
  {
    transactionId: 'TXN100000012',
    packageId: 'PKG-003',
    userName: 'Lucas Taylor',
    userId: 'U10238',
    platform: 'iOS',
    currency: 'CAD',
    amount: 25.99,
    status: 'Failed',
    transactionDate: '2026-06-29 17:12',
  },
  {
    transactionId: 'TXN100000013',
    packageId: 'PKG-002',
    userName: 'Olivia Brown',
    userId: 'U10236',
    platform: 'Android',
    currency: 'USD',
    amount: 13.99,
    status: 'Successful',
    transactionDate: '2026-06-28 11:34',
  },
  {
    transactionId: 'TXN100000014',
    packageId: 'PKG-001',
    userName: 'Ava Johnson',
    userId: 'U10237',
    platform: 'iOS',
    currency: 'USD',
    amount: 6.99,
    status: 'Successful',
    transactionDate: '2026-06-27 19:22',
  },
  {
    transactionId: 'TXN100000015',
    packageId: 'PKG-003',
    userName: 'Emma Martinez',
    userId: 'U10235',
    platform: 'Android',
    currency: 'EUR',
    amount: 19.99,
    status: 'Failed',
    transactionDate: '2026-06-26 14:10',
  },
];

interface TransactionHistoryManagementProps {
  onNavigate: (pageId: string) => void;
  onViewUserDetail: (userId: string) => void;
}

type SortField = 'transactionDate' | 'amount';
type SortDirection = 'asc' | 'desc';

export default function TransactionHistoryManagement({
  onNavigate,
  onViewUserDetail,
}: TransactionHistoryManagementProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Advanced filters state
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState({
    platform: 'all',
    currency: 'all',
    status: 'all',
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('transactionDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get dynamic distinct currencies from the data
  const currencies = useMemo(() => {
    const list = transactions.map((t) => t.currency);
    return Array.from(new Set(list)).sort();
  }, [transactions]);

  // Apply filters, search, and sorting
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(q) ||
          t.packageId.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q)
      );
    }

    // Applied Platform filter
    if (appliedFilters.platform !== 'all') {
      result = result.filter((t) => t.platform === appliedFilters.platform);
    }

    // Applied Currency filter
    if (appliedFilters.currency !== 'all') {
      result = result.filter((t) => t.currency === appliedFilters.currency);
    }

    // Applied Status filter
    if (appliedFilters.status !== 'all') {
      result = result.filter((t) => t.status === appliedFilters.status);
    }

    // Sorting logic
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'transactionDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, appliedFilters, sortField, sortDirection]);

  // Paginated items
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Filter actions
  const applyFilters = () => {
    setAppliedFilters({
      platform: selectedPlatform,
      currency: selectedCurrency,
      status: selectedStatus,
    });
    setCurrentPage(1);
    toast.success('Filters applied');
  };

  const clearAllFilters = () => {
    setSelectedPlatform('all');
    setSelectedCurrency('all');
    setSelectedStatus('all');
    setAppliedFilters({
      platform: 'all',
      currency: 'all',
      status: 'all',
    });
    setCurrentPage(1);
    toast.success('Filters cleared');
  };

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'transactionDate' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  // CSV Export handler
  const handleExport = () => {
    setIsExporting(true);
    toast.info('Preparing export...');

    setTimeout(() => {
      try {
        const headers = [
          'Transaction ID',
          'Package ID',
          'User Name',
          'Platform',
          'Currency',
          'Amount',
          'Status',
          'Transaction Date & Time',
        ];

        const rows = filteredTransactions.map((t) => [
          t.transactionId,
          t.packageId,
          t.userName,
          t.platform,
          t.currency,
          t.amount.toFixed(2),
          t.status,
          formatTxDateTime(t.transactionDate),
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Filename timestamp
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const timestamp = `${yyyy}${mm}${dd}_${hh}${min}`;

        link.href = url;
        link.setAttribute('download', `transaction_history_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('Download started');
      } catch (error) {
        toast.error('Unable to export. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }, 1000);
  };

  // Inline date formatter (DD/MM/YYYY HH:MM)
  const formatTxDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [datePart, timePart] = dateStr.split(' ');
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year} ${timePart}`;
    } catch {
      return dateStr;
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'CAD':
        return 'CA$';
      case 'USD':
      default:
        return '$';
    }
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Transaction History"
          breadcrumbs={[
            { label: 'BCA & BCC Management', href: '#' },
            { label: 'Transaction History', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Transaction ID, Package ID, or User Name..."
            />
          </div>

          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5 animate-fade-in"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>

          <SecondaryButton
            onClick={handleExport}
            className="gap-1.5 animate-fade-in"
            disabled={isExporting || filteredTransactions.length === 0}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Preparing export...' : 'Export'}
          </SecondaryButton>

          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setTransactions(initialTransactions);
              setSearchQuery('');
              setSelectedPlatform('all');
              setSelectedCurrency('all');
              setSelectedStatus('all');
              setAppliedFilters({
                platform: 'all',
                currency: 'all',
                status: 'all',
              });
              setCurrentPage(1);
              toast.success('Data refreshed');
            }}
            title="Refresh"
          />
        </PageHeader>

        {/* Collapsible Filters Section */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950 shadow-sm animate-slide-down">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Platform select */}
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

                {/* Currency select (Dynamic options) */}
                <div>
                  <FormLabel htmlFor="currency">Currency</FormLabel>
                  <FormSelect
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    <option value="all">All Currencies</option>
                    {currencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                {/* Status select */}
                <div>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <FormSelect
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Successful">Successful</option>
                    <option value="Failed">Failed</option>
                  </FormSelect>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <PrimaryButton onClick={applyFilters} size="sm">
                  Apply Filters
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Sort by:</span>

          <button
            onClick={() => handleSort('transactionDate')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1.5 ${
              sortField === 'transactionDate'
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-semibold shadow-sm'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Transaction Date {sortField === 'transactionDate' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>

          <button
            onClick={() => handleSort('amount')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1.5 ${
              sortField === 'amount'
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-semibold shadow-sm'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Transaction Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* Data Table */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Package ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">User Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Currency</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Transaction Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Transaction Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((t) => (
                    <tr
                      key={t.transactionId}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 font-mono">
                          {t.transactionId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold font-mono">
                          {t.packageId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onViewUserDetail(t.userId)}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold text-left focus:outline-none"
                        >
                          {t.userName}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm text-neutral-700 dark:text-neutral-300">
                          <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                          {t.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono uppercase font-semibold">
                          {t.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-neutral-900 dark:text-white font-bold font-mono">
                          {t.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                          t.status === 'Successful'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                            : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                        }`}>
                          {t.status === 'Successful' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatTxDateTime(t.transactionDate)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination controls */}
        {filteredTransactions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={itemsPerPage}
            totalItems={filteredTransactions.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
