import { useState, useMemo } from 'react';
import {
  Coins,
  Plus,
  Edit,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Filter,
  Trash2,
  Move,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SearchBar, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import BccPackageDetail from './BccPackageDetail';
import type { BccPackage } from './BccPackageDetail';

// Mock BCC Packages
const initialBccPackages: BccPackage[] = [
  {
    id: 'PKG-001',
    name: 'Warm Up',
    tagline: 'Entry level pack for quick start',
    description: ['Get 300 base coins', 'Receive instant credit', 'Special entry level bonus'],
    productIdentifier: 'package_warm_up_300',
    price: 6.99,
    currency: 'USD',
    coinsCount: 300,
    actionButtonLabel: 'Keep Moving Forward',
    status: 'active',
    displayOrder: 1,
    createdDate: '2025-02-15 10:30',
    lastModifiedDate: '2025-03-10 14:20',
    lastModifiedBy: 'Super Admin',
  },
  {
    id: 'PKG-002',
    name: 'Accelerate',
    tagline: 'The most popular pack for regular play',
    description: ['Get 600 base coins', 'Priority support access', 'Double engagement rewards'],
    productIdentifier: 'package_accelerate_600',
    price: 13.99,
    currency: 'USD',
    coinsCount: 600,
    actionButtonLabel: 'Accelerate Now',
    status: 'active',
    displayOrder: 2,
    createdDate: '2025-02-15 11:00',
    lastModifiedDate: '2025-03-12 09:15',
    lastModifiedBy: 'Super Admin',
  },
  {
    id: 'PKG-003',
    name: 'Elite',
    tagline: 'Best value pack for serious players',
    description: ['Get 900 base coins', 'VIP channel access', 'Exclusive avatar frame item'],
    productIdentifier: 'package_elite_900',
    price: 20.99,
    currency: 'USD',
    coinsCount: 900,
    actionButtonLabel: 'Become Elite',
    status: 'inactive',
    displayOrder: 3,
    createdDate: '2025-02-16 09:45',
    lastModifiedDate: '2025-03-15 16:40',
    lastModifiedBy: 'Super Admin',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type SortField = 'coinsCount' | 'price' | 'displayOrder' | 'lastModifiedDate';
type SortDirection = 'asc' | 'desc';

export default function BccPackageManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [packages, setPackages] = useState<BccPackage[]>(initialBccPackages);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filters state
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('lastModifiedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Detail view state
  const [selectedPackage, setSelectedPackage] = useState<BccPackage | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    // Search query: ID or Title (name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        pkg => pkg.id.toLowerCase().includes(q) || pkg.name.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(pkg => pkg.status === statusFilter);
    }



    // Sort logic
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'lastModifiedDate') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [packages, searchQuery, statusFilter, sortField, sortDirection]);

  // Paginated packages
  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPackages.slice(start, start + itemsPerPage);
  }, [filteredPackages, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.includes(':')) {
      const [datePart, timePart] = dateString.split(' ');
      const date = new Date(datePart);
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${formattedDate} ${timePart}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for newly clicked fields
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setCurrencyFilter('all');
    toast.success('Filters cleared');
  };

  // Add Package Trigger
  const handleCreateNew = () => {
    const nextId = `PKG-${String(packages.length + 1).padStart(3, '0')}`;
    const newPkg: BccPackage = {
      id: nextId,
      name: '',
      tagline: '',
      description: [''],
      productIdentifier: '',
      price: 0,
      currency: 'USD',
      coinsCount: 0,
      actionButtonLabel: 'Purchase',
      status: 'active',
      displayOrder: packages.length + 1,
      createdDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
      lastModifiedBy: 'Super Admin',
    };
    setSelectedPackage(newPkg);
    setIsCreatingNew(true);
  };

  const handleEdit = (pkg: BccPackage) => {
    setSelectedPackage(pkg);
    setIsCreatingNew(false);
  };

  const handleSave = (savedPkg: BccPackage) => {
    if (isCreatingNew) {
      setPackages([...packages, savedPkg]);
      toast.success('BCC Package created successfully');
    } else {
      setPackages(packages.map(p => (p.id === savedPkg.id ? savedPkg : p)));
      toast.success('BCC Package updated successfully');
    }
    setSelectedPackage(null);
    setIsCreatingNew(false);
  };

  // Bulk operation handlers
  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    setPackages(
      packages.map(pkg => {
        if (selectedIds.includes(pkg.id)) {
          return { ...pkg, status, lastModifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16) };
        }
        return pkg;
      })
    );
    toast.success(`Successfully ${status === 'active' ? 'activated' : 'deactivated'} selected packages`);
    setSelectedIds([]);
  };

  // Checkbox selections
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedPackages.map(pkg => pkg.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(item => item !== id));
    }
  };

  // Drag and Drop handlers (Native HTML5)
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...packages];
    const filteredDraggedPkg = filteredPackages[draggedIndex];
    const filteredTargetPkg = filteredPackages[index];
    
    const rawDraggedIdx = packages.findIndex(p => p.id === filteredDraggedPkg.id);
    const rawTargetIdx = packages.findIndex(p => p.id === filteredTargetPkg.id);
    
    if (rawDraggedIdx !== -1 && rawTargetIdx !== -1) {
      const draggedItem = updated[rawDraggedIdx];
      updated.splice(rawDraggedIdx, 1);
      updated.splice(rawTargetIdx, 0, draggedItem);

      // Resequence displayOrder based on the new array order
      const resequenced = updated.map((pkg, i) => ({
        ...pkg,
        displayOrder: i + 1,
      }));

      setDraggedIndex(index);
      setPackages(resequenced);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    toast.success('Sequence reordered successfully');
  };

  const clearAllFilters = () => {
    setSelectedStatusFilter('all');
    setStatusFilter('all');
    toast.success('Filters cleared');
  };

  const applyFilters = () => {
    setStatusFilter(selectedStatusFilter);
    toast.success('Filters applied');
  };

  // Render detail view if a package is selected
  if (selectedPackage) {
    return (
      <BccPackageDetail
        packageData={selectedPackage}
        allPackages={packages}
        isCreating={isCreatingNew}
        onBack={() => {
          setSelectedPackage(null);
          setIsCreatingNew(false);
        }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        
        {/* Page Header */}
        <PageHeader
          title="BCC Packages"
          breadcrumbs={[
            { label: 'BCA & BCC Management', href: '#' },
            { label: 'BCC Packages', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Title or Package ID..."
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
            Add Package
          </PrimaryButton>
          
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setPackages(initialBccPackages);
              setSearchQuery('');
              setSelectedStatusFilter('all');
              setStatusFilter('all');
              setSelectedIds([]);
              toast.success('Data refreshed');
            }}
            title="Refresh"
          />
          
          <ViewModeSwitcher
            currentMode={viewMode}
            onChange={setViewMode}
          />
        </PageHeader>



        {/* Collapsible Filters */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status dropdown */}
                <div>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <FormSelect
                    id="status"
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
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

        {/* Sort Pills */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Sort by:</span>
          
          <button
            onClick={() => handleSort('coinsCount')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'coinsCount'
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-medium'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Coins {sortField === 'coinsCount' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('price')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'price'
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-medium'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('displayOrder')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'displayOrder'
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-medium'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Display Order {sortField === 'displayOrder' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          
          <button
            onClick={() => handleSort('lastModifiedDate')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              sortField === 'lastModifiedDate'
                ? 'bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-medium'
                : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
            }`}
          >
            Last Modified {sortField === 'lastModifiedDate' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* ========== GRID VIEW (Default) ========== */}
        {viewMode === 'grid' && filteredPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedPackages.map((pkg, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              const isDragActive = draggedIndex === globalIndex;
              return (
                <div
                  key={pkg.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, globalIndex)}
                  onDragOver={(e) => handleDragOver(e, globalIndex)}
                  onDragEnd={handleDragEnd}
                  className={`border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow relative bg-white dark:bg-neutral-950 flex flex-col justify-between min-h-[220px] cursor-grab active:cursor-grabbing ${
                    isDragActive ? 'opacity-40 border-2 border-dashed border-primary-500' : ''
                  }`}
                >
                {/* Display Order Badge Circle */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {pkg.displayOrder}
                  </span>
                </div>

                <div>
                  <div className="flex items-start gap-3 mb-3">
                    {/* Top-left: Small gift/coin icon in light purple rounded square */}
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <Coins className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">{pkg.id}</span>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <Coins className="w-4 h-4 text-warning-500" />
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {pkg.coinsCount.toLocaleString()} coins
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                      ${pkg.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {pkg.currency}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 mt-auto">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    pkg.status === 'active'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {pkg.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && filteredPackages.length > 0 && (
          <div className="space-y-2">
            {paginatedPackages.map((pkg, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              const isDragActive = draggedIndex === globalIndex;
              return (
                <div
                  key={pkg.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, globalIndex)}
                  onDragOver={(e) => handleDragOver(e, globalIndex)}
                  onDragEnd={handleDragEnd}
                  className={`border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors bg-white dark:bg-neutral-950 cursor-grab active:cursor-grabbing ${
                    isDragActive ? 'opacity-40 border-2 border-dashed border-primary-500' : ''
                  }`}
                >
                <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <Coins className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {pkg.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          {pkg.id}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Order: {pkg.displayOrder}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate mb-1">
                        {pkg.tagline}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-warning-500" />
                          <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
                            {pkg.coinsCount.toLocaleString()} coins
                          </span>
                        </div>
                        <span className="text-neutral-600 dark:text-neutral-400">•</span>
                        <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
                          {pkg.currency} {pkg.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      pkg.status === 'active'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {pkg.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 w-32 hidden lg:inline">
                      {formatDateTime(pkg.lastModifiedDate)}
                    </span>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && filteredPackages.length > 0 && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="w-10 px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Package ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Product Identifier</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Package Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">BCC Coins</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedPackages.map((pkg, index) => {
                    const globalIndex = (currentPage - 1) * itemsPerPage + index;
                    const isDragActive = draggedIndex === globalIndex;
                    return (
                      <tr
                        key={pkg.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, globalIndex)}
                        onDragOver={(e) => handleDragOver(e, globalIndex)}
                        onDragEnd={handleDragEnd}
                        className={`transition-colors cursor-grab active:cursor-grabbing ${
                          isDragActive ? 'opacity-40 bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-primary-500' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <td className="px-4 py-3 text-center text-neutral-400 hover:text-neutral-650" onClick={(e) => e.stopPropagation()}>
                          <Move className="w-4 h-4" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            {pkg.id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                            {pkg.productIdentifier}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white font-medium">
                            {pkg.name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white font-semibold">
                            ${pkg.price.toFixed(2)} <span className="text-xs text-neutral-400 font-normal">{pkg.currency}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Coins className="w-4 h-4 text-warning-500" />
                            <span className="text-sm text-neutral-900 dark:text-white font-semibold">
                              {pkg.coinsCount.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            pkg.status === 'active'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}>
                            {pkg.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== EMPTY STATE ========== */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950">
            <Coins className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">No packages available. Click '+ Add Package' to create one.</p>
            {searchQuery || statusFilter !== 'all' ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Try refining or resetting your filters.</p>
            ) : null}
          </div>
        )}

        {/* ========== PAGINATION ========== */}
        {filteredPackages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPackages.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}

      </div>
    </div>
  );
}
