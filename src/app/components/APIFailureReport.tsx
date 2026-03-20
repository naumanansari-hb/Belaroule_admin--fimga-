import { useState, useMemo } from 'react';
import { Download, AlertTriangle, Clock, Filter } from 'lucide-react';
import { PageHeader, IconButton, SearchBar } from './hb/listing/PageHeader';
import { SecondaryButton, Pagination, SummaryWidgets } from './hb/listing';
import { FormLabel, FormInput } from './hb/common/Form';
import { toast } from 'sonner';
import { formatDate, formatDateTime } from '@/utils/dateFormatter';

// API Failure Report interface
interface APIFailureReport {
  id: string;
  apiName: string;
  dateTime: string;
  request: string;
  response: string;
  failureReason: string;
  status: 'Failed';
  errorCode?: number;
}

// Mock API Failure Reports
const mockAPIFailureReports: APIFailureReport[] = [
  {
    id: 'API001',
    apiName: '/api/v1/users/login',
    dateTime: '2026-01-05T10:30:00',
    request: '{\"email\": \"user@example.com\", \"password\": \"***\"}',
    response: '{\"error\": \"Invalid credentials\"}',
    failureReason: 'Authentication Failed - Invalid credentials',
    status: 'Failed',
    errorCode: 401,
  },
  {
    id: 'API002',
    apiName: '/api/v1/outfits/generate',
    dateTime: '2026-01-06T14:20:00',
    request: '{\"userId\": \"USER123\", \"preferences\": {...}}',
    response: '{\"error\": \"Service temporarily unavailable\"}',
    failureReason: 'Service Unavailable - Database connection timeout',
    status: 'Failed',
    errorCode: 503,
  },
  {
    id: 'API003',
    apiName: '/api/v1/wardrobe/items',
    dateTime: '2026-01-07T16:45:00',
    request: '{\"userId\": \"USER456\", \"itemId\": \"ITEM789\"}',
    response: '{\"error\": \"Resource not found\"}',
    failureReason: 'Not Found - Requested wardrobe item does not exist',
    status: 'Failed',
    errorCode: 404,
  },
  {
    id: 'API004',
    apiName: '/api/v1/rewards/redeem',
    dateTime: '2026-01-08T09:15:00',
    request: '{\"userId\": \"USER789\", \"points\": 500}',
    response: '{\"error\": \"Insufficient points balance\"}',
    failureReason: 'Validation Failed - Insufficient reward points',
    status: 'Failed',
    errorCode: 400,
  },
  {
    id: 'API005',
    apiName: '/api/v1/posts/create',
    dateTime: '2026-01-09T11:30:00',
    request: '{\"userId\": \"USER101\", \"content\": \"...\"}',
    response: '{\"error\": \"Rate limit exceeded\"}',
    failureReason: 'Rate Limit Exceeded - Too many requests',
    status: 'Failed',
    errorCode: 429,
  },
  {
    id: 'API006',
    apiName: '/api/v1/payment/process',
    dateTime: '2026-01-10T13:00:00',
    request: '{\"userId\": \"USER202\", \"amount\": 29.99}',
    response: '{\"error\": \"Payment gateway timeout\"}',
    failureReason: 'Gateway Timeout - Payment provider not responding',
    status: 'Failed',
    errorCode: 504,
  },
  {
    id: 'API007',
    apiName: '/api/v1/users/profile',
    dateTime: '2026-01-11T08:45:00',
    request: '{\"userId\": \"USER303\"}',
    response: '{\"error\": \"Internal server error\"}',
    failureReason: 'Internal Server Error - Unexpected exception occurred',
    status: 'Failed',
    errorCode: 500,
  },
  {
    id: 'API008',
    apiName: '/api/v1/social/follow',
    dateTime: '2026-01-12T10:15:00',
    request: '{\"userId\": \"USER404\", \"followId\": \"USER505\"}',
    response: '{\"error\": \"Bad request - Invalid user ID\"}',
    failureReason: 'Bad Request - Invalid or malformed user ID',
    status: 'Failed',
    errorCode: 400,
  },
  {
    id: 'API009',
    apiName: '/api/v1/outfits/save',
    dateTime: '2026-01-13T15:30:00',
    request: '{\"userId\": \"USER606\", \"outfitData\": {...}}',
    response: '{\"error\": \"Forbidden - User quota exceeded\"}',
    failureReason: 'Forbidden - Maximum outfit limit reached',
    status: 'Failed',
    errorCode: 403,
  },
  {
    id: 'API010',
    apiName: '/api/v1/search/users',
    dateTime: '2026-01-14T09:00:00',
    request: '{\"query\": \"john\"}',
    response: '{\"error\": \"Service degraded\"}',
    failureReason: 'Service Degraded - Search service performance issue',
    status: 'Failed',
    errorCode: 503,
  },
];

export default function APIFailureReport() {
  const [reports] = useState<APIFailureReport[]>(mockAPIFailureReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [startDateTime, setStartDateTime] = useState<string>(() => {
    // Default to first day of current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 16);
  });
  const [endDateTime, setEndDateTime] = useState<string>(() => {
    // Default to current date/time
    return new Date().toISOString().slice(0, 16);
  });

  // Applied filters (only update on Apply button)
  const [appliedFilters, setAppliedFilters] = useState({
    apiName: 'all',
    status: 'all',
    startDateTime: (() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 16);
    })(),
    endDateTime: new Date().toISOString().slice(0, 16),
  });

  const [showFilters, setShowFilters] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter data based on applied filters
  const filteredData = useMemo(() => {
    let filtered = reports;

    // Apply search
    if (appliedFilters.apiName !== 'all') {
      filtered = filtered.filter((r) =>
        r.apiName.toLowerCase().includes(appliedFilters.apiName.toLowerCase())
      );
    }

    // Apply status filter
    if (appliedFilters.status !== 'all') {
      filtered = filtered.filter((r) => r.status === appliedFilters.status);
    }

    // Apply date/time range filter
    if (appliedFilters.startDateTime && appliedFilters.endDateTime) {
      const startTime = new Date(appliedFilters.startDateTime).getTime();
      const endTime = new Date(appliedFilters.endDateTime).getTime();
      
      filtered = filtered.filter(r => {
        const reportTime = new Date(r.dateTime).getTime();
        return reportTime >= startTime && reportTime <= endTime;
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
    const totalFailures = filteredData.length;
    const authErrors = filteredData.filter(r => r.errorCode === 401 || r.errorCode === 403).length;
    const serverErrors = filteredData.filter(r => r.errorCode && r.errorCode >= 500).length;
    const clientErrors = filteredData.filter(r => r.errorCode && r.errorCode >= 400 && r.errorCode < 500).length;
    
    return [
      { 
        label: 'Total Failures', 
        value: totalFailures.toLocaleString(), 
        icon: AlertTriangle 
      },
      { 
        label: 'Client Errors (4xx)', 
        value: clientErrors.toLocaleString(), 
        icon: AlertTriangle 
      },
      { 
        label: 'Server Errors (5xx)', 
        value: serverErrors.toLocaleString(), 
        icon: AlertTriangle 
      },
      { 
        label: 'Auth Errors', 
        value: authErrors.toLocaleString(), 
        icon: AlertTriangle 
      },
    ];
  };

  // Handle Apply filters
  const handleApplyFilters = () => {
    // Validate date range
    if (!startDateTime || !endDateTime) {
      toast.error('Please select both start and end date/time');
      return;
    }

    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();

    if (start > end) {
      toast.error('Start date/time must be before end date/time');
      return;
    }

    setAppliedFilters({
      apiName: searchQuery,
      status: 'all',
      startDateTime,
      endDateTime,
    });

    setCurrentPage(1); // Reset to first page
    toast.success('Filters applied successfully');
  };

  // Handle Reset filters
  const handleResetFilters = () => {
    const now = new Date();
    const defaultStartDateTime = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 16);
    const defaultEndDateTime = now.toISOString().slice(0, 16);

    setSearchQuery('');
    setStartDateTime(defaultStartDateTime);
    setEndDateTime(defaultEndDateTime);

    setAppliedFilters({
      apiName: 'all',
      status: 'all',
      startDateTime: defaultStartDateTime,
      endDateTime: defaultEndDateTime,
    });

    setCurrentPage(1);
    toast.success('Filters reset');
  };

  // Handle Export
  const handleExport = () => {
    // Create CSV content
    const headers = ['API Name', 'Date & Time', 'Request', 'Response', 'Failure Reason', 'Status', 'Error Code'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(r => [
        `"${r.apiName}"`,
        `"${formatDateTime(r.dateTime)}"`,
        `"${r.request.replace(/"/g, '""')}"`,
        `"${r.response.replace(/"/g, '""')}"`,
        `"${r.failureReason}"`,
        r.status,
        r.errorCode || '',
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `api_failure_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('API failure report exported successfully');
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Get error color based on error code
  const getErrorColor = (errorCode?: number) => {
    if (!errorCode) return 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300';
    if (errorCode >= 500) return 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300';
    if (errorCode === 429) return 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300';
    if (errorCode === 401 || errorCode === 403) return 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300';
    return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400';
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="AI API Failure Report"
          breadcrumbs={[
            { label: 'Reports', href: '#' },
            { label: 'AI API Failure Report', current: true },
          ]}
        >
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search by API Name */}
                <div>
                  <FormLabel htmlFor="search">Search by API Name</FormLabel>
                  <FormInput
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter API name..."
                  />
                </div>

                {/* Start Date & Time */}
                <div>
                  <FormLabel htmlFor="startDateTime">Start Date & Time</FormLabel>
                  <FormInput
                    id="startDateTime"
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                  />
                </div>

                {/* End Date & Time */}
                <div>
                  <FormLabel htmlFor="endDateTime">End Date & Time</FormLabel>
                  <FormInput
                    id="endDateTime"
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
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
        {appliedFilters.searchQuery && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            {appliedFilters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Search: {appliedFilters.searchQuery}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
              Date Range: {new Date(appliedFilters.startDateTime).toLocaleString()} - {new Date(appliedFilters.endDateTime).toLocaleString()}
            </span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">API Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Request</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Response</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Failure Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium font-mono">
                          {report.apiName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDateTime(report.dateTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowExpansion(`${report.id}-request`)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <Download className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                        <span className="text-sm text-primary-600 dark:text-primary-400 underline">
                          View
                        </span>
                      </button>
                      {expandedRows.has(`${report.id}-request`) && (
                        <div className="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono overflow-x-auto">
                          <pre className="whitespace-pre-wrap text-neutral-900 dark:text-white">{report.request}</pre>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowExpansion(`${report.id}-response`)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <Download className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                        <span className="text-sm text-primary-600 dark:text-primary-400 underline">
                          View
                        </span>
                      </button>
                      {expandedRows.has(`${report.id}-response`) && (
                        <div className="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono overflow-x-auto">
                          <pre className="whitespace-pre-wrap text-neutral-900 dark:text-white">{report.response}</pre>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {report.failureReason}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getErrorColor(report.errorCode)}`}>
                          {report.status}
                        </span>
                        {report.errorCode && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Code: {report.errorCode}
                          </span>
                        )}
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
            <AlertTriangle className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No API Failures Available</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No API failures found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}