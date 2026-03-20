import { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormInput } from './hb/common/Form';
import { toast } from 'sonner';

// Revenue Report interface
interface RevenueReport {
  id: string;
  planId: string;
  planName: string;
  platformType: 'Android' | 'iOS';
  country: string;
  totalPurchases: number;
  grossRevenue: number;
  currency: string;
}

// Mock Revenue Reports
const mockRevenueReports: RevenueReport[] = [
  {
    id: 'REV001',
    planId: 'PLAN001',
    planName: 'Premium Monthly',
    platformType: 'Android',
    country: 'United States',
    totalPurchases: 1250,
    grossRevenue: 12500.00,
    currency: 'USD',
  },
  {
    id: 'REV002',
    planId: 'PLAN002',
    planName: 'Premium Yearly',
    platformType: 'iOS',
    country: 'United States',
    totalPurchases: 850,
    grossRevenue: 85000.00,
    currency: 'USD',
  },
  {
    id: 'REV003',
    planId: 'PLAN001',
    planName: 'Premium Monthly',
    platformType: 'iOS',
    country: 'United Kingdom',
    totalPurchases: 620,
    grossRevenue: 6200.00,
    currency: 'GBP',
  },
  {
    id: 'REV004',
    planId: 'PLAN003',
    planName: 'Basic Monthly',
    platformType: 'Android',
    country: 'Canada',
    totalPurchases: 430,
    grossRevenue: 2150.00,
    currency: 'CAD',
  },
  {
    id: 'REV005',
    planId: 'PLAN002',
    planName: 'Premium Yearly',
    platformType: 'Android',
    country: 'Australia',
    totalPurchases: 380,
    grossRevenue: 38000.00,
    currency: 'AUD',
  },
  {
    id: 'REV006',
    planId: 'PLAN004',
    planName: 'Pro Monthly',
    platformType: 'iOS',
    country: 'Germany',
    totalPurchases: 510,
    grossRevenue: 7650.00,
    currency: 'EUR',
  },
  {
    id: 'REV007',
    planId: 'PLAN001',
    planName: 'Premium Monthly',
    platformType: 'Android',
    country: 'France',
    totalPurchases: 290,
    grossRevenue: 2900.00,
    currency: 'EUR',
  },
  {
    id: 'REV008',
    planId: 'PLAN003',
    planName: 'Basic Monthly',
    platformType: 'iOS',
    country: 'Japan',
    totalPurchases: 670,
    grossRevenue: 67000.00,
    currency: 'JPY',
  },
];

// Get unique countries
const countries = Array.from(new Set(mockRevenueReports.map(r => r.country))).sort();

export default function RevenueReport() {
  const [reports] = useState<RevenueReport[]>(mockRevenueReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
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
    search: '',
    country: 'all',
    platform: 'all',
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

    // Apply search filter
    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.planName.toLowerCase().includes(searchLower) ||
        r.country.toLowerCase().includes(searchLower)
      );
    }

    // Apply country filter
    if (appliedFilters.country !== 'all') {
      filtered = filtered.filter(r => r.country === appliedFilters.country);
    }

    // Apply platform filter
    if (appliedFilters.platform !== 'all') {
      filtered = filtered.filter(r => r.platformType === appliedFilters.platform);
    }

    // Apply sorting
    if (appliedFilters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: number;
        let bValue: number;

        if (appliedFilters.sortBy === 'grossRevenue') {
          aValue = a.grossRevenue;
          bValue = b.grossRevenue;
        } else if (appliedFilters.sortBy === 'totalPurchases') {
          aValue = a.totalPurchases;
          bValue = b.totalPurchases;
        } else {
          return 0;
        }

        const comparison = aValue > bValue ? 1 : -1;
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
    const totalRevenue = filteredData.reduce((sum, r) => sum + r.grossRevenue, 0);
    const totalPurchases = filteredData.reduce((sum, r) => sum + r.totalPurchases, 0);
    const avgRevenue = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;
    
    return [
      { 
        label: 'Total Revenue', 
        value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        icon: DollarSign 
      },
      { 
        label: 'Total Purchases', 
        value: totalPurchases.toLocaleString(), 
        icon: TrendingUp 
      },
      { 
        label: 'Avg Revenue per Plan', 
        value: `$${avgRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        icon: BarChart3 
      },
    ];
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      search: searchTerm,
      country: selectedCountry,
      platform: selectedPlatform,
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

    setSelectedCountry('all');
    setSelectedPlatform('all');
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);

    setAppliedFilters({
      search: '',
      country: 'all',
      platform: 'all',
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
    const headers = ['Plan ID', 'Plan Name', 'Platform Type', 'Country', 'Total Purchases', 'Gross Revenue', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(r => [
        r.planId,
        `\"${r.planName}\"`,
        r.platformType,
        `\"${r.country}\"`,
        r.totalPurchases,
        r.grossRevenue,
        r.currency,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Revenue report exported successfully');
  };

  // Handle Sort
  const handleSort = (field: 'grossRevenue' | 'totalPurchases') => {
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
          title="Revenue Report"
          breadcrumbs={[
            { label: 'Reports', href: '#' },
            { label: 'Revenue Report', current: true },
          ]}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by Plan Name or Country..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}</SecondaryButton>
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
            onClick={() => handleSort('grossRevenue')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortBy === 'grossRevenue'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Gross Revenue {sortBy === 'grossRevenue' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('totalPurchases')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortBy === 'totalPurchases'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Total Purchases {sortBy === 'totalPurchases' && (sortOrder === 'asc' ? '↑' : '↓')}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {(appliedFilters.country !== 'all' || appliedFilters.platform !== 'all') && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Plan ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Plan Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Platform Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Country</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">Total Purchases</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">Gross Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Currency</th>
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
                        {report.planId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {report.planName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        report.platformType === 'Android'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}>
                        {report.platformType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {report.country}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-neutral-900 dark:text-white font-medium">
                        {report.totalPurchases.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-neutral-900 dark:text-white font-semibold">
                        {report.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {report.currency}
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
            <BarChart3 className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No Data Available</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No revenue data found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}