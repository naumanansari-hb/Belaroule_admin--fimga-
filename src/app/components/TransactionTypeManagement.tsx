import { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Edit,
  RefreshCw,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, ViewModeSwitcher } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { toast } from 'sonner';
import TransactionTypeDetail from './TransactionTypeDetail';

// Transaction Type interface
interface TransactionType {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModifiedDate?: string;
}

// Mock Transaction Types
const mockTransactionTypes: TransactionType[] = [
  {
    id: 'TT001',
    name: 'Credit',
    description: 'Credit transaction for rewards and deposits',
    status: 'active',
    createdDate: '2023-01-10',
    lastModifiedDate: '2023-12-15',
  },
  {
    id: 'TT002',
    name: 'Debit',
    description: 'Debit transaction for withdrawals and purchases',
    status: 'active',
    createdDate: '2023-01-10',
    lastModifiedDate: '2023-12-15',
  },
  {
    id: 'TT003',
    name: 'Refund',
    description: 'Refund transaction for returned items',
    status: 'active',
    createdDate: '2023-02-15',
    lastModifiedDate: '2023-11-20',
  },
  {
    id: 'TT004',
    name: 'Penalty',
    description: 'Penalty transaction for violations',
    status: 'inactive',
    createdDate: '2023-03-20',
    lastModifiedDate: '2023-10-10',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function TransactionTypeManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(mockTransactionTypes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Filter options for the AdvancedSearchPanel
  const filterOptions = {
    'Status': ['Active', 'Inactive'],
  };

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = transactionTypes;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((tt) => {
        const searchFields = [tt.id, tt.name, tt.description];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply advanced filters
    const matchesFilters = (tt: TransactionType) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === tt.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);

    return filtered;
  }, [transactionTypes, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = transactionTypes.filter(tt => tt.status === 'active').length;
    const inactiveCount = transactionTypes.filter(tt => tt.status === 'inactive').length;
    
    return [
      { label: 'Total Transaction Types', value: transactionTypes.length.toString(), icon: DollarSign },
      { label: 'Active', value: activeCount.toString(), icon: CheckCircle2 },
      { label: 'Inactive', value: inactiveCount.toString(), icon: XCircle },
    ];
  };

  // Format date helper (DD/MM/YYYY as per spec)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle create new
  const handleCreateNew = () => {
    const newTransactionType: TransactionType = {
      id: `TT${String(transactionTypes.length + 1).padStart(3, '0')}`,
      name: '',
      description: '',
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
    };
    setSelectedTransactionType(newTransactionType);
    setIsCreatingNew(true);
  };

  // Handle edit
  const handleEdit = (transactionType: TransactionType) => {
    setSelectedTransactionType(transactionType);
    setIsCreatingNew(false);
  };

  // Handle save
  const handleSave = (transactionType: TransactionType) => {
    if (isCreatingNew) {
      setTransactionTypes([...transactionTypes, transactionType]);
      toast.success('Transaction type created successfully');
    } else {
      setTransactionTypes(transactionTypes.map(tt => 
        tt.id === transactionType.id ? transactionType : tt
      ));
      toast.success('Transaction type updated successfully');
    }
    setSelectedTransactionType(null);
    setIsCreatingNew(false);
  };

  // Handle export
  const handleExport = () => {
    console.log('Exporting transaction types:', transactionTypes);
    toast.success('Transaction types exported successfully');
  };

  // If viewing/creating transaction type detail
  if (selectedTransactionType) {
    return (
      <TransactionTypeDetail
        transactionType={selectedTransactionType}
        allTransactionTypes={transactionTypes}
        isCreating={isCreatingNew}
        onBack={() => {
          setSelectedTransactionType(null);
          setIsCreatingNew(false);
        }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Transaction Type"
          breadcrumbs={[
            { label: 'Master Management', href: '#' },
            { label: 'Transaction Type', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search by Transaction Type ID or Name..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>
          <PrimaryButton
            onClick={handleCreateNew}
            icon={Plus}
            size="sm"
          >
            Add Transaction Type
          </PrimaryButton>
          <IconButton
            icon={Download}
            onClick={handleExport}
            variant="ghost"
            size="sm"
            tooltip="Export"
          />
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setTransactionTypes(mockTransactionTypes);
              setSearchQuery('');
              setFilters([]);
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

        {/* ========== ACTIVE FILTERS ========== */}
        {filters.length > 0 && (
          <FilterChips
            filters={filters}
            onRemoveFilter={(index) => {
              setFilters(filters.filter((_, i) => i !== index));
            }}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction Type ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction Type Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((tt) => (
                    <tr
                      key={tt.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                          {tt.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {tt.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {tt.description || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tt.status === 'active'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}>
                          {tt.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {tt.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(tt.createdDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(tt)}
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
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
        )}

        {/* ========== GRID VIEW ========== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((tt) => (
              <div
                key={tt.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{tt.id}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    tt.status === 'active'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {tt.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  {tt.name}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                  {tt.description || 'No description'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(tt.createdDate)}
                  </span>
                  <button
                    onClick={() => handleEdit(tt)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((tt) => (
              <div
                key={tt.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {tt.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {tt.id}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        {tt.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      tt.status === 'active'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {tt.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(tt.createdDate)}
                    </span>
                    <button
                      onClick={() => handleEdit(tt)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== PAGINATION ========== */}
        {filteredData.length >= 20 && (
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
            <DollarSign className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No transaction types found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding a new transaction type'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}