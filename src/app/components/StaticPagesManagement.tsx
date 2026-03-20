import { useState, useMemo } from 'react';
import {
  FileText,
  RefreshCw,
  Download,
  Edit,
  Search,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, FilterChips, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import StaticPageDetail from './StaticPageDetail';

// Static Page interface
interface StaticPage {
  id: string;
  pageTitle: string;
  slug: string;
  content: string;
  status: 'active' | 'inactive';
  lastUpdatedDate: string;
}

// Mock Static Pages
const mockStaticPages: StaticPage[] = [
  {
    id: 'SP001',
    pageTitle: 'About Us',
    slug: 'about-us',
    content: '<h1>About BellaRoules</h1><p>We are a leading fashion platform...</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-15',
  },
  {
    id: 'SP002',
    pageTitle: 'Terms & Conditions',
    slug: 'terms-conditions',
    content: '<h1>Terms & Conditions</h1><p>By using our service, you agree to...</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-14',
  },
  {
    id: 'SP003',
    pageTitle: 'Privacy Policy',
    slug: 'privacy-policy',
    content: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-13',
  },
  {
    id: 'SP004',
    pageTitle: 'Contact Us',
    slug: 'contact-us',
    content: '<h1>Contact Us</h1><p>Get in touch with our team...</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-12',
  },
  {
    id: 'SP005',
    pageTitle: 'Return Policy',
    slug: 'return-policy',
    content: '<h1>Return Policy</h1><p>We accept returns within 30 days...</p>',
    status: 'inactive',
    lastUpdatedDate: '2024-01-11',
  },
];

export default function StaticPagesManagement() {
  const [pages, setPages] = useState<StaticPage[]>(mockStaticPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
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
    let filtered = pages;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((page) => {
        const searchFields = [page.pageTitle, page.slug, page.id];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply dropdown filter
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === appliedStatus);
    }

    // Apply advanced filters
    const matchesFilters = (page: StaticPage) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === page.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);
    return filtered;
  }, [pages, searchQuery, appliedStatus, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = pages.filter(p => p.status === 'active').length;
    
    return [
      { label: 'Total Pages', value: pages.length.toString(), icon: FileText },
      { label: 'Active Pages', value: activeCount.toString(), icon: FileText },
    ];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle edit page
  const handleEditPage = (page: StaticPage) => {
    setSelectedPage(page);
  };

  // Handle update page
  const handleUpdatePage = (updatedPage: StaticPage) => {
    setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
    setSelectedPage(null);
    toast.success('Static page updated successfully');
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

  // If viewing page detail
  if (selectedPage) {
    return (
      <StaticPageDetail
        page={selectedPage}
        onBack={() => setSelectedPage(null)}
        onSave={handleUpdatePage}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Static Pages"
          breadcrumbs={[
            { label: 'Configuration', href: '#' },
            { label: 'Static Pages', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Page Title..."
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
              setPages(mockStaticPages);
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
            <strong>Super Admin Only:</strong> Static pages contain important legal and informational content. Edit with care to ensure compliance.
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Page ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Page Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {page.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {page.pageTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        /{page.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        page.status === 'active'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {page.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(page.lastUpdatedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditPage(page)}
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
            <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No static pages found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 ? 'Try adjusting your search or filters' : 'No static pages available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
