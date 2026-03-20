import { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Edit,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  Coins,
  DollarSign,
  Filter,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import RewardPlanDetail from './RewardPlanDetail';

// Reward Plan interface
interface RewardPlan {
  id: string;
  name: string;
  coinsCount: number;
  price: number;
  currency: string;
  displayOrder: number;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModifiedDate: string;
  productIdentifier: string;
}

// Mock Reward Plans
const mockRewardPlans: RewardPlan[] = [
  {
    id: 'PLN-001',
    name: 'Pack 1',
    coinsCount: 300,
    price: 6.99,
    currency: 'USD',
    displayOrder: 1,
    description: 'Entry level pack for quick start',
    status: 'active',
    createdDate: '2025-02-15 10:30',
    lastModifiedDate: '2025-03-10 14:20',
    productIdentifier: 'coins_300',
  },
  {
    id: 'PLN-002',
    name: 'Pack 2',
    coinsCount: 600,
    price: 13.99,
    currency: 'USD',
    displayOrder: 2,
    description: 'The most popular pack for regular play',
    status: 'active',
    createdDate: '2025-02-15 11:00',
    lastModifiedDate: '2025-03-12 09:15',
    productIdentifier: 'coins_600',
  },
  {
    id: 'PLN-003',
    name: 'Pack 3',
    coinsCount: 900,
    price: 20.99,
    currency: 'USD',
    displayOrder: 3,
    description: 'Best value pack for serious gamers',
    status: 'active',
    createdDate: '2025-02-16 09:45',
    lastModifiedDate: '2025-03-15 16:40',
    productIdentifier: 'coins_900',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type SortField = 'coinsCount' | 'price' | 'displayOrder' | 'lastModifiedDate';
type SortDirection = 'asc' | 'desc';

export default function RewardPlanManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [rewardPlans, setRewardPlans] = useState<RewardPlan[]>(mockRewardPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [sortField, setSortField] = useState<SortField>('lastModifiedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<RewardPlan | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');

  // Filter options for the AdvancedSearchPanel
  const filterOptions = {
    'Status': ['Active', 'Inactive'],
    'Currency': ['USD', 'EUR', 'GBP', 'INR'],
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = rewardPlans;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((plan) => {
        const searchFields = [plan.id, plan.coinsCount.toString(), plan.price.toString(), plan.currency];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply advanced filters
    const matchesFilters = (plan: RewardPlan) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === plan.status;
          });
        }
        
        if (filter.field === 'Currency') {
          return filter.values.includes(plan.currency);
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'lastModifiedDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [rewardPlans, searchQuery, filters, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  // Format date helper
  const formatDateTime = (dateString: string) => {
    // Check if it includes time
    if (dateString.includes(':')) {
      const [datePart, timePart] = dateString.split(' ');
      const date = new Date(datePart);
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${formattedDate} ${timePart}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle create new
  const handleCreateNew = () => {
    const newPlan: RewardPlan = {
      id: `RP${String(rewardPlans.length + 1).padStart(3, '0')}`,
      name: '',
      coinsCount: 0,
      price: 0,
      currency: 'USD',
      displayOrder: rewardPlans.length + 1,
      description: '',
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
      productIdentifier: '',
    };
    setSelectedPlan(newPlan);
    setIsCreatingNew(true);
  };

  // Handle edit
  const handleEdit = (plan: RewardPlan) => {
    setSelectedPlan(plan);
    setIsCreatingNew(false);
  };

  // Handle save
  const handleSave = (plan: RewardPlan) => {
    if (isCreatingNew) {
      setRewardPlans([...rewardPlans, plan]);
      toast.success('Reward plan created successfully');
    } else {
      setRewardPlans(rewardPlans.map(p => 
        p.id === plan.id ? plan : p
      ));
      toast.success('Reward plan updated successfully');
    }
    setSelectedPlan(null);
    setIsCreatingNew(false);
  };

  // Handle export
  const handleExport = () => {
    console.log('Exporting reward plans:', rewardPlans);
    toast.success('Reward plans exported successfully');
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // If viewing/creating plan detail
  if (selectedPlan) {
    return (
      <RewardPlanDetail
        plan={selectedPlan}
        allPlans={rewardPlans}
        isCreating={isCreatingNew}
        onBack={() => {
          setSelectedPlan(null);
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
          title="Reward Plans"
          breadcrumbs={[
            { label: 'Plan Management', href: '#' },
            { label: 'Reward Plans', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search by Plan ID, Coins, or Price..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleCreateNew}
            icon={Plus}
            size="sm"
          >
            Add Reward Plan
          </PrimaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setRewardPlans(mockRewardPlans);
              setSearchQuery('');
              setFilters([]);
              toast.success('Data refreshed');
            }}
            title="Refresh"
          />
          <ViewModeSwitcher
            currentMode={viewMode}
            onChange={setViewMode}
          />
        </PageHeader>


        {/* ========== FILTERS SECTION ========== */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                {/* Currency Filter */}
                <div>
                  <FormLabel htmlFor="currency">Currency</FormLabel>
                  <FormSelect
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    <option value="all">All Currencies</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </FormSelect>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedCurrency('all');
                    toast.success('Filters cleared');
                  }}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========== ACTIVE FILTERS ========== */}
        {filters.length > 0 && (
          <FilterChips
            filters={filters}
            onRemove={(filterId) => {
              setFilters(filters.filter((f) => f.id !== filterId));
            }}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* ========== SORTING OPTIONS ========== */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          <button
            onClick={() => handleSort('coinsCount')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'coinsCount'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Coins {sortField === 'coinsCount' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('price')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'price'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('displayOrder')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'displayOrder'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Display Order {sortField === 'displayOrder' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('lastModifiedDate')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'lastModifiedDate'
                ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Last Modified {sortField === 'lastModifiedDate' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Plan ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Plan Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Coins Count</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Display Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Modified</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Product Identifier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((plan) => (
                    <tr
                      key={plan.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          {plan.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {plan.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-warning-500" />
                          <span className="text-sm text-neutral-900 dark:text-white font-medium">
                            {plan.coinsCount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {plan.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                          {plan.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {plan.displayOrder}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === 'active'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}>
                          {plan.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {plan.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDateTime(plan.lastModifiedDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {plan.productIdentifier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(plan)}
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
            {paginatedData.map((plan) => (
              <div
                key={plan.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow relative"
              >
                {/* Display Order Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    {plan.displayOrder}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-1">{plan.id}</span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-warning-500" />
                      <span className="text-lg font-bold text-neutral-900 dark:text-white">
                        {plan.coinsCount.toLocaleString()}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">coins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {plan.currency === 'USD' ? '$' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : ''}{plan.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {plan.currency}
                  </span>
                </div>

                {plan.description && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                    {plan.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    plan.status === 'active'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {plan.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleEdit(plan)}
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
            {paginatedData.map((plan) => (
              <div
                key={plan.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {plan.id}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Order: {plan.displayOrder}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-warning-500" />
                          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                            {plan.coinsCount.toLocaleString()} coins
                          </span>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-400">•</span>
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          {plan.currency} {plan.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      plan.status === 'active'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {plan.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 w-32">
                      {formatDateTime(plan.lastModifiedDate)}
                    </span>
                    <button
                      onClick={() => handleEdit(plan)}
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
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No reward plans found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding a new reward plan'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}