import { useState, useMemo } from 'react';
import {
  Shirt,
  Filter,
  Download,
  User,
  FileText,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormInput } from './hb/common/Form';
import { toast } from 'sonner';

// OOTD Report interface
interface OOTDReport {
  id: string;
  ootdId: string;
  userId: string;
  userName: string;
  dateTime: string;
  country: string;
  platform: 'Android' | 'iOS';
  defaultOutfit: boolean;
}

// Mock OOTD Reports
const mockOOTDReports: OOTDReport[] = [
  {
    id: 'OOTD001',
    ootdId: 'OOTD-2024-001',
    userId: 'USER001',
    userName: 'Emma Johnson',
    dateTime: '2024-01-15T10:30:00',
    country: 'United States',
    platform: 'iOS',
    defaultOutfit: true,
  },
  {
    id: 'OOTD002',
    ootdId: 'OOTD-2024-002',
    userId: 'USER002',
    userName: 'Sophia Williams',
    dateTime: '2024-01-15T14:20:00',
    country: 'United Kingdom',
    platform: 'Android',
    defaultOutfit: false,
  },
  {
    id: 'OOTD003',
    ootdId: 'OOTD-2024-003',
    userId: 'USER003',
    userName: 'Olivia Brown',
    dateTime: '2024-01-15T16:45:00',
    country: 'Canada',
    platform: 'iOS',
    defaultOutfit: true,
  },
  {
    id: 'OOTD004',
    ootdId: 'OOTD-2024-004',
    userId: 'USER004',
    userName: 'Ava Davis',
    dateTime: '2024-01-16T09:15:00',
    country: 'Australia',
    platform: 'Android',
    defaultOutfit: false,
  },
  {
    id: 'OOTD005',
    ootdId: 'OOTD-2024-005',
    userId: 'USER005',
    userName: 'Isabella Martinez',
    dateTime: '2024-01-16T11:30:00',
    country: 'Germany',
    platform: 'iOS',
    defaultOutfit: true,
  },
  {
    id: 'OOTD006',
    ootdId: 'OOTD-2024-006',
    userId: 'USER006',
    userName: 'Mia Garcia',
    dateTime: '2024-01-16T13:00:00',
    country: 'France',
    platform: 'Android',
    defaultOutfit: false,
  },
  {
    id: 'OOTD007',
    ootdId: 'OOTD-2024-007',
    userId: 'USER007',
    userName: 'Charlotte Rodriguez',
    dateTime: '2024-01-17T08:45:00',
    country: 'Spain',
    platform: 'iOS',
    defaultOutfit: true,
  },
  {
    id: 'OOTD008',
    ootdId: 'OOTD-2024-008',
    userId: 'USER008',
    userName: 'Amelia Wilson',
    dateTime: '2024-01-17T10:15:00',
    country: 'Italy',
    platform: 'Android',
    defaultOutfit: false,
  },
  {
    id: 'OOTD009',
    ootdId: 'OOTD-2024-009',
    userId: 'USER009',
    userName: 'Harper Anderson',
    dateTime: '2024-01-17T15:30:00',
    country: 'Japan',
    platform: 'iOS',
    defaultOutfit: true,
  },
  {
    id: 'OOTD010',
    ootdId: 'OOTD-2024-010',
    userId: 'USER010',
    userName: 'Evelyn Taylor',
    dateTime: '2024-01-18T09:00:00',
    country: 'United States',
    platform: 'Android',
    defaultOutfit: false,
  },
];

// Get unique countries
const countries = Array.from(new Set(mockOOTDReports.map(r => r.country))).sort();

export default function OOTDReport() {
  const [reports] = useState<OOTDReport[]>(mockOOTDReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
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

  // Filter data based on applied filters
  const filteredData = useMemo(() => {
    let filtered = reports;

    // Apply search
    if (appliedFilters.searchQuery) {
      filtered = filtered.filter((r) =>
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
    const totalGenerated = filteredData.length;
    const defaultOutfits = filteredData.filter(r => r.defaultOutfit).length;
    const customOutfits = filteredData.filter(r => !r.defaultOutfit).length;
    
    return [
      { 
        label: 'Total Generated', 
        value: totalGenerated.toLocaleString(), 
        icon: Shirt 
      },
      { 
        label: 'Default Outfits', 
        value: defaultOutfits.toLocaleString(), 
        icon: Shirt 
      },
      { 
        label: 'Custom Outfits', 
        value: customOutfits.toLocaleString(), 
        icon: Shirt 
      },
    ];
  };

  // Format date and time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const datePart = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} ${timePart}`;
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
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);

    setAppliedFilters({
      searchQuery: '',
      country: 'all',
      platform: 'all',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    });

    setCurrentPage(1);
    toast.success('Filters reset');
  };

  // Handle Export
  const handleExport = () => {
    // Create CSV content
    const headers = ['OOTD ID', 'User ID', 'User Name', 'Date & Time', 'Country', 'Platform', 'Default Outfit'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(r => [
        r.ootdId,
        r.userId,
        `"${r.userName}"`,
        `"${formatDateTime(r.dateTime)}"`,
        `"${r.country}"`,
        r.platform,
        r.defaultOutfit ? 'Yes' : 'No',
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ootd_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('OOTD report exported successfully');
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
          title="OOTD Generation Report"
          breadcrumbs={[
            { label: 'Reports', href: '#' },
            { label: 'OOTD Generation Report', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by User Name..."
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
        {(appliedFilters.searchQuery || appliedFilters.country !== 'all' || appliedFilters.platform !== 'all') && (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">OOTD ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Default Outfit</th>
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
                        {report.ootdId}
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
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDateTime(report.dateTime)}
                        </span>
                      </div>
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
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        report.defaultOutfit
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {report.defaultOutfit ? 'Yes' : 'No'}
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
            <Shirt className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No Data Available</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No OOTD generation data found for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}