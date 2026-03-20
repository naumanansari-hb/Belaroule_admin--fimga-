import { useState, useMemo } from 'react';
import {
  Activity,
  Download,
  TrendingUp,
  Filter,
  DollarSign,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormInput } from './hb/common/Form';
import { toast } from 'sonner';

// API Consumption Report interface
interface APIConsumptionReport {
  id: string;
  uID: string;
  apiName: string;
  usedFor: string;
  tokenUsed: number;
  cost: number;
  apiStatus: 'Success' | 'Failed';
  dateTime: string;
}

// Mock API Consumption Reports
const mockAPIConsumptionReports: APIConsumptionReport[] = [
  {
    id: 'API001',
    uID: 'TXN001',
    apiName: 'OpenAI GPT-4',
    usedFor: 'OOTD Generation',
    tokenUsed: 1250.5,
    cost: 0.0625,
    apiStatus: 'Success',
    dateTime: '2025-01-15T10:30:00',
  },
  {
    id: 'API002',
    uID: 'TXN002',
    apiName: 'Stability AI',
    usedFor: 'Virtual Try On',
    tokenUsed: 2100.0,
    cost: 0.105,
    apiStatus: 'Success',
    dateTime: '2025-01-15T11:45:00',
  },
  {
    id: 'API003',
    uID: 'TXN003',
    apiName: 'OpenAI DALL-E',
    usedFor: 'Image Validation',
    tokenUsed: 800.25,
    cost: 0.040,
    apiStatus: 'Failed',
    dateTime: '2025-01-15T14:20:00',
  },
  {
    id: 'API004',
    uID: 'TXN004',
    apiName: 'Google Vision API',
    usedFor: 'Extractions',
    tokenUsed: 450.0,
    cost: 0.023,
    apiStatus: 'Success',
    dateTime: '2025-01-16T09:15:00',
  },
  {
    id: 'API005',
    uID: 'TXN005',
    apiName: 'OpenAI GPT-4',
    usedFor: 'Compositions',
    tokenUsed: 1875.75,
    cost: 0.094,
    apiStatus: 'Success',
    dateTime: '2025-01-16T13:30:00',
  },
  {
    id: 'API006',
    uID: 'TXN006',
    apiName: 'Weather API',
    usedFor: 'Weather API',
    tokenUsed: 150.0,
    cost: 0.008,
    apiStatus: 'Success',
    dateTime: '2025-01-17T08:45:00',
  },
  {
    id: 'API007',
    uID: 'TXN007',
    apiName: 'Anthropic Claude',
    usedFor: 'Wardrobe Quotient',
    tokenUsed: 3200.5,
    cost: 0.160,
    apiStatus: 'Success',
    dateTime: '2025-01-17T15:20:00',
  },
  {
    id: 'API008',
    uID: 'TXN008',
    apiName: 'OpenAI GPT-4',
    usedFor: 'Key Trending Pieces',
    tokenUsed: 980.25,
    cost: 0.049,
    apiStatus: 'Failed',
    dateTime: '2025-01-18T10:10:00',
  },
  {
    id: 'API009',
    uID: 'TXN009',
    apiName: 'Stability AI',
    usedFor: 'OOTD Generation',
    tokenUsed: 2400.0,
    cost: 0.120,
    apiStatus: 'Success',
    dateTime: '2025-01-18T12:35:00',
  },
  {
    id: 'API010',
    uID: 'TXN010',
    apiName: 'Google Vision API',
    usedFor: 'Image Validation',
    tokenUsed: 620.5,
    cost: 0.031,
    apiStatus: 'Success',
    dateTime: '2025-01-19T16:50:00',
  },
  {
    id: 'API011',
    uID: 'TXN011',
    apiName: 'OpenAI GPT-4',
    usedFor: 'Sorting',
    tokenUsed: 1100.0,
    cost: 0.055,
    apiStatus: 'Success',
    dateTime: '2025-01-20T09:25:00',
  },
  {
    id: 'API012',
    uID: 'TXN012',
    apiName: 'Anthropic Claude',
    usedFor: 'Compositions',
    tokenUsed: 2750.25,
    cost: 0.138,
    apiStatus: 'Success',
    dateTime: '2025-01-20T14:40:00',
  },
];

// Get unique API names
const apiNames = Array.from(new Set(mockAPIConsumptionReports.map(r => r.apiName))).sort();

// Used For options
const usedForOptions = [
  'Extractions',
  'Compositions',
  'OOTD Generation',
  'Virtual Try On',
  'Wardrobe Quotient',
  'Key Trending Pieces',
  'Image Validation',
  'Weather API',
  'Sorting',
];

export default function APIConsumptionReport() {
  const [reports] = useState<APIConsumptionReport[]>(mockAPIConsumptionReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states
  const [selectedAPIName, setSelectedAPIName] = useState<string>('all');
  const [selectedAPIStatus, setSelectedAPIStatus] = useState<string>('all');
  const [selectedUsedFor, setSelectedUsedFor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
    apiName: 'all',
    apiStatus: 'all',
    usedFor: 'all',
    sortBy: '',
    sortOrder: 'asc' as 'asc' | 'desc',
    startDate: (() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    })(),
    endDate: (() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    })(),
    search: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  // Filter and search data based on applied filters
  const filteredData = useMemo(() => {
    let filtered = reports;

    // Apply search filter
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.uID.toLowerCase().includes(searchLower) ||
        r.apiName.toLowerCase().includes(searchLower)
      );
    }

    // Apply API Name filter
    if (appliedFilters.apiName !== 'all') {
      filtered = filtered.filter(r => r.apiName === appliedFilters.apiName);
    }

    // Apply API Status filter
    if (appliedFilters.apiStatus !== 'all') {
      filtered = filtered.filter(r => r.apiStatus === appliedFilters.apiStatus);
    }

    // Apply Used For filter
    if (appliedFilters.usedFor !== 'all') {
      filtered = filtered.filter(r => r.usedFor === appliedFilters.usedFor);
    }

    // Apply sorting
    if (appliedFilters.sortBy === 'cost') {
      filtered = [...filtered].sort((a, b) => {
        return appliedFilters.sortOrder === 'asc' ? a.cost - b.cost : b.cost - a.cost;
      });
    } else if (appliedFilters.sortBy === 'tokenUsed') {
      filtered = [...filtered].sort((a, b) => {
        return appliedFilters.sortOrder === 'asc' ? a.tokenUsed - b.tokenUsed : b.tokenUsed - a.tokenUsed;
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
    const totalCost = filteredData.reduce((sum, r) => sum + r.cost, 0);
    const totalTokens = filteredData.reduce((sum, r) => sum + r.tokenUsed, 0);
    const successRate = filteredData.length > 0
      ? (filteredData.filter(r => r.apiStatus === 'Success').length / filteredData.length) * 100
      : 0;
    
    return [
      { 
        label: 'Total Cost', 
        value: `$${totalCost.toFixed(3)}`, 
        icon: DollarSign 
      },
      { 
        label: 'Total Tokens Used', 
        value: totalTokens.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
        icon: Zap 
      },
      { 
        label: 'Success Rate', 
        value: `${successRate.toFixed(1)}%`, 
        icon: TrendingUp 
      },
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
      apiName: selectedAPIName,
      apiStatus: selectedAPIStatus,
      usedFor: selectedUsedFor,
      sortBy,
      sortOrder,
      startDate,
      endDate,
      search: searchTerm,
    });

    setCurrentPage(1); // Reset to first page
    toast.success('Filters applied successfully');
  };

  // Handle Reset filters
  const handleResetFilters = () => {
    // Reset all filter states to default values
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    setSearchTerm('');
    setSelectedAPIName('all');
    setSelectedAPIStatus('all');
    setSelectedUsedFor('all');
    setSortBy('');
    setSortOrder('asc');
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);

    // Reset applied filters
    setAppliedFilters({
      apiName: 'all',
      apiStatus: 'all',
      usedFor: 'all',
      sortBy: '',
      sortOrder: 'asc',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      search: '',
    });

    setCurrentPage(1); // Reset to first page
    toast.success('All filters have been reset');
  };

  // Handle Export
  const handleExport = () => {
    // Create CSV content
    const headers = ['uID', 'API Name', 'Used For', 'Token Used', 'Cost', 'API Status', 'Date and Time'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(r => [
        r.uID,
        `\"${r.apiName}\"`,
        `\"${r.usedFor}\"`,
        r.tokenUsed,
        r.cost.toFixed(3),
        r.apiStatus,
        `\"${formatDateTime(r.dateTime)}\"`,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `api_consumption_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('API consumption report exported successfully');
  };

  // Handle Sort
  const handleSort = (field: 'cost' | 'tokenUsed') => {
    if (sortBy === field) {
      // Toggle direction if same field
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
      setAppliedFilters({
        ...appliedFilters,
        sortBy: field,
        sortOrder: newOrder,
      });
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortOrder('desc');
      setAppliedFilters({
        ...appliedFilters,
        sortBy: field,
        sortOrder: 'desc',
      });
    }
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="API Consumption Report"
          breadcrumbs={[
            { label: 'Reports', href: '#' },
            { label: 'API Consumption Report', current: true },
          ]}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by Transaction ID or API Name..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <IconButton
            icon={Download}
            onClick={handleExport}
            variant="ghost"
            size="sm"
            tooltip="Export CSV"
          />
        </PageHeader>

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* SORTING UI */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          
          <button
            onClick={() => handleSort('cost')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortBy === 'cost'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Cost {sortBy === 'cost' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('tokenUsed')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortBy === 'tokenUsed'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Token Consumed {sortBy === 'tokenUsed' && (sortOrder === 'asc' ? '↑' : '↓')}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* API Name Filter */}
                <div>
                  <FormLabel htmlFor="apiName">API Name</FormLabel>
                  <FormSelect
                    id="apiName"
                    value={selectedAPIName}
                    onChange={(e) => setSelectedAPIName(e.target.value)}
                  >
                    <option value="all">All APIs</option>
                    {apiNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </FormSelect>
                </div>

                {/* API Status Filter */}
                <div>
                  <FormLabel htmlFor="apiStatus">API Status</FormLabel>
                  <FormSelect
                    id="apiStatus"
                    value={selectedAPIStatus}
                    onChange={(e) => setSelectedAPIStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </FormSelect>
                </div>

                {/* Used For Filter */}
                <div>
                  <FormLabel htmlFor="usedFor">Used For</FormLabel>
                  <FormSelect
                    id="usedFor"
                    value={selectedUsedFor}
                    onChange={(e) => setSelectedUsedFor(e.target.value)}
                  >
                    <option value="all">All</option>
                    {usedForOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </FormSelect>
                </div>

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

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">uID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">API Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Used For</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">Token Used</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">API Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date and Time</th>
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
                        {report.uID}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {report.apiName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {report.usedFor}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-neutral-900 dark:text-white font-medium">
                        {report.tokenUsed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-neutral-900 dark:text-white font-semibold">
                        ${report.cost.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        report.apiStatus === 'Success'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                      }`}>
                        {report.apiStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(report.dateTime)}
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
            <Activity className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No Data Available</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No API consumption data found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}