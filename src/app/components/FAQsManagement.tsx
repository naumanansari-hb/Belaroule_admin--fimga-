import { useState, useMemo } from 'react';
import {
  HelpCircle,
  RefreshCw,
  Edit,
  Plus,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, FilterChips, Pagination, PrimaryButton, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import FAQDetail from './FAQDetail';

// FAQ interface
interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  createdDate: string;
  sequence: number;
}

// Mock FAQs
const mockFAQs: FAQ[] = [
  {
    id: 'FAQ001',
    question: 'How do I create an account?',
    answer: '<p>To create an account, click on the "Sign Up" button on the homepage and fill in your details including your email address and password. You will receive a verification email to complete the registration process.</p>',
    status: 'active',
    createdDate: '2024-01-15',
    sequence: 1,
  },
  {
    id: 'FAQ002',
    question: 'What payment methods do you accept?',
    answer: '<p>We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway.</p>',
    status: 'active',
    createdDate: '2024-01-14',
    sequence: 2,
  },
  {
    id: 'FAQ003',
    question: 'How long does shipping take?',
    answer: '<p>Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery. International orders may take 7-14 business days depending on the destination.</p>',
    status: 'active',
    createdDate: '2024-01-13',
    sequence: 3,
  },
  {
    id: 'FAQ004',
    question: 'Can I return items?',
    answer: '<p>Yes, we offer a 30-day return policy for all items in their original condition with tags attached. Please refer to our Return Policy page for detailed instructions.</p>',
    status: 'active',
    createdDate: '2024-01-12',
    sequence: 4,
  },
  {
    id: 'FAQ005',
    question: 'How do I track my order?',
    answer: '<p>Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.</p>',
    status: 'inactive',
    createdDate: '2024-01-11',
    sequence: 5,
  },
];

export default function FAQsManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isAdding, setIsAdding] = useState(false);
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
    let filtered = faqs;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((faq) => {
        const searchFields = [faq.question, faq.answer, faq.id];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply dropdown filter
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(f => f.status === appliedStatus);
    }

    // Apply advanced filters
    const matchesFilters = (faq: FAQ) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === faq.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);
    return filtered;
  }, [faqs, searchQuery, appliedStatus, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = faqs.filter(f => f.status === 'active').length;
    
    return [
      { label: 'Total FAQs', value: faqs.length.toString(), icon: HelpCircle },
      { label: 'Active FAQs', value: activeCount.toString(), icon: HelpCircle },
    ];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle edit FAQ
  const handleEditFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsAdding(false);
  };

  // Handle add FAQ
  const handleAddFAQ = () => {
    setSelectedFAQ({
      id: '',
      question: '',
      answer: '',
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      sequence: faqs.length + 1,
    });
    setIsAdding(true);
  };

  // Handle save FAQ
  const handleSaveFAQ = (faq: FAQ) => {
    if (isAdding) {
      const newFAQ = {
        ...faq,
        id: `FAQ${String(faqs.length + 1).padStart(3, '0')}`,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setFaqs([newFAQ, ...faqs]);
      toast.success('FAQ created successfully');
    } else {
      setFaqs(faqs.map(f => f.id === faq.id ? faq : f));
      toast.success('FAQ updated successfully');
    }
    setSelectedFAQ(null);
    setIsAdding(false);
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

  // If viewing FAQ detail
  if (selectedFAQ) {
    return (
      <FAQDetail
        faq={selectedFAQ}
        isNew={isAdding}
        onBack={() => {
          setSelectedFAQ(null);
          setIsAdding(false);
        }}
        onSave={handleSaveFAQ}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="FAQs"
          breadcrumbs={[
            { label: 'Configuration', href: '#' },
            { label: 'FAQs', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Question..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleAddFAQ}
            size="sm"
            icon={Plus}
          >
            Add FAQ
          </PrimaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setFaqs(mockFAQs);
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">FAQ ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Sequence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((faq) => (
                  <tr
                    key={faq.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {faq.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {faq.sequence}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-900 dark:text-white font-medium truncate">
                            {faq.question}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                            {faq.answer.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        faq.status === 'active'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {faq.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(faq.createdDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditFAQ(faq)}
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
            <HelpCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No FAQs found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 ? 'Try adjusting your search or filters' : 'No FAQs available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
