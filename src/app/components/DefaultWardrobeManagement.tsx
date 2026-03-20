import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Shirt,
  Plus,
  Edit,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  MoreVertical,
  Eye,
  Trash2,
  Filter,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import DefaultWardrobeDetail from './DefaultWardrobeDetail';
import DefaultWardrobeAdd from './DefaultWardrobeAdd';

// Default Wardrobe Item interface
interface DefaultWardrobeItem {
  id: string;
  imageUrl: string;
  category: string;
  ageGroup?: string;
  bodyShape?: string;
  aiStatus: 'processed' | 'failed' | 'pending';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdDate: string;
}

// Mock Default Wardrobe Items
const mockDefaultWardrobeItems: DefaultWardrobeItem[] = [
  {
    id: 'DW001',
    imageUrl: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400',
    category: 'Tops',
    ageGroup: 'Young Adults',
    bodyShape: 'Rectangle',
    aiStatus: 'processed',
    approvalStatus: 'approved',
    isActive: true,
    createdDate: '2024-01-15',
  },
  {
    id: 'DW002',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    category: 'Bottoms',
    ageGroup: 'Adults',
    bodyShape: 'Pear',
    aiStatus: 'processed',
    approvalStatus: 'approved',
    isActive: true,
    createdDate: '2024-01-14',
  },
  {
    id: 'DW003',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    category: 'Footwear',
    aiStatus: 'processed',
    approvalStatus: 'pending',
    isActive: false,
    createdDate: '2024-01-13',
  },
  {
    id: 'DW004',
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400',
    category: 'Accessories',
    ageGroup: 'Teens',
    aiStatus: 'processed',
    approvalStatus: 'rejected',
    isActive: false,
    createdDate: '2024-01-12',
  },
  {
    id: 'DW005',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    category: 'Outerwear',
    ageGroup: 'Young Adults',
    bodyShape: 'Hour Glass',
    aiStatus: 'failed',
    approvalStatus: 'pending',
    isActive: false,
    createdDate: '2024-01-11',
  },
  {
    id: 'DW006',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    category: 'Tops',
    ageGroup: 'Teens',
    bodyShape: 'Triangle',
    aiStatus: 'processed',
    approvalStatus: 'approved',
    isActive: true,
    createdDate: '2024-01-10',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function DefaultWardrobeManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [wardrobeItems, setWardrobeItems] = useState<DefaultWardrobeItem[]>(mockDefaultWardrobeItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<DefaultWardrobeItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedBodyShape, setSelectedBodyShape] = useState<string>('all');
  const [selectedAIStatus, setSelectedAIStatus] = useState<string>('all');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<string>('all');

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options for the AdvancedSearchPanel
  const filterOptions = {
    'Category': ['Headwear', 'Tops', 'Bottoms', 'Footwear', 'Accessories'],
    'Approval Status': ['Pending', 'Approved', 'Rejected'],
    'AI Status': ['Processed', 'Failed', 'Pending'],
  };

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = wardrobeItems;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const searchFields = [item.id, item.category];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply advanced filters
    const matchesFilters = (item: DefaultWardrobeItem) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Category') {
          return filter.values.includes(item.category);
        }
        
        if (filter.field === 'Approval Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Pending': 'pending',
              'Approved': 'approved',
              'Rejected': 'rejected'
            };
            return statusMap[v] === item.approvalStatus;
          });
        }
        
        if (filter.field === 'AI Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Processed': 'processed',
              'Failed': 'failed',
              'Pending': 'pending'
            };
            return statusMap[v] === item.aiStatus;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);

    return filtered;
  }, [wardrobeItems, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const approvedCount = wardrobeItems.filter(item => item.approvalStatus === 'approved').length;
    const pendingCount = wardrobeItems.filter(item => item.approvalStatus === 'pending').length;
    const activeCount = wardrobeItems.filter(item => item.isActive).length;
    
    return [
      { label: 'Total Items', value: wardrobeItems.length.toString(), icon: Shirt },
      { label: 'Approved', value: approvedCount.toString(), icon: CheckCircle2 },
      { label: 'Pending Review', value: pendingCount.toString(), icon: Clock },
      { label: 'Active', value: activeCount.toString(), icon: CheckCircle2 },
    ];
  };

  // Format date helper (DD/MM/YYYY as per spec)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle add new (upload)
  const handleAddNew = () => {
    setIsCreatingNew(true);
  };

  // Handle view/edit
  const handleViewEdit = (item: DefaultWardrobeItem) => {
    setSelectedItem(item);
    setIsCreatingNew(false);
  };

  // Handle save from Add screen
  const handleSaveNew = (items: any[]) => {
    // Generate new IDs and add items
    const newItems = items.map((item, index) => ({
      id: `DW${String(wardrobeItems.length + index + 1).padStart(3, '0')}`,
      imageUrl: item.imageUrl,
      category: item.category,
      ageGroup: item.ageGroup || undefined,
      bodyShape: item.bodyShape || undefined,
      aiStatus: 'processed' as const,
      approvalStatus: 'approved' as const,
      isActive: item.isActive,
      createdDate: new Date().toISOString().split('T')[0],
    }));
    
    setWardrobeItems([...wardrobeItems, ...newItems]);
    setIsCreatingNew(false);
    toast.success(`${newItems.length} default wardrobe item(s) created successfully`);
  };

  // Handle save from detail
  const handleSave = (item: DefaultWardrobeItem) => {
    setWardrobeItems(wardrobeItems.map(wi => 
      wi.id === item.id ? item : wi
    ));
    setSelectedItem(null);
    toast.success('Wardrobe item updated successfully');
  };

  // Get AI status icon and color
  const getAIStatusDisplay = (status: string) => {
    switch (status) {
      case 'processed':
        return { icon: CheckCircle2, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-100 dark:bg-success-900/30', label: 'Processed' };
      case 'failed':
        return { icon: XCircle, color: 'text-error-600 dark:text-error-400', bg: 'bg-error-100 dark:bg-error-900/30', label: 'Failed' };
      case 'pending':
        return { icon: Clock, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-100 dark:bg-warning-900/30', label: 'Pending' };
      default:
        return { icon: AlertCircle, color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-50 dark:bg-neutral-950', label: 'Unknown' };
    }
  };

  // Get approval status icon and color
  const getApprovalStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-100 dark:bg-success-900/30', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-error-600 dark:text-error-400', bg: 'bg-error-100 dark:bg-error-900/30', label: 'Rejected' };
      case 'pending':
        return { icon: Clock, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-100 dark:bg-warning-900/30', label: 'Pending' };
      default:
        return { icon: AlertCircle, color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-50 dark:bg-neutral-950', label: 'Unknown' };
    }
  };

  // If creating new item(s)
  if (isCreatingNew) {
    return (
      <DefaultWardrobeAdd
        onBack={() => setIsCreatingNew(false)}
        onSave={handleSaveNew}
      />
    );
  }

  // If viewing item detail
  if (selectedItem) {
    return (
      <DefaultWardrobeDetail
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Default Wardrobe"
          breadcrumbs={[
            { label: 'Master Management', href: '#' },
            { label: 'Default Wardrobe', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Item ID or Category..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleAddNew}
            icon={Plus}
            size="sm"
          >
            Add Default Set
          </PrimaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setWardrobeItems(mockDefaultWardrobeItems);
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

        {/* ========== FILTERS SECTION ========== */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <FormSelect
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Headwear">Headwear</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </FormSelect>
                </div>

                {/* Age Group Filter */}
                <div>
                  <FormLabel htmlFor="ageGroup">Age Group</FormLabel>
                  <FormSelect
                    id="ageGroup"
                    value={selectedAgeGroup}
                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  >
                    <option value="all">All Age Groups</option>
                    <option value="Infants">Infants</option>
                    <option value="Toddlers">Toddlers</option>
                    <option value="Children">Children</option>
                    <option value="Teens">Teens</option>
                    <option value="Young Adults">Young Adults</option>
                    <option value="Adults">Adults</option>
                  </FormSelect>
                </div>

                {/* Body Shape Filter */}
                <div>
                  <FormLabel htmlFor="bodyShape">Body Shape</FormLabel>
                  <FormSelect
                    id="bodyShape"
                    value={selectedBodyShape}
                    onChange={(e) => setSelectedBodyShape(e.target.value)}
                  >
                    <option value="all">All Body Shapes</option>
                    <option value="Triangle">Triangle</option>
                    <option value="Inverted Triangle">Inverted Triangle</option>
                    <option value="Hour Glass">Hour Glass</option>
                    <option value="Pear">Pear</option>
                    <option value="Circle">Circle</option>
                    <option value="Rectangle">Rectangle</option>
                  </FormSelect>
                </div>

                {/* AI Status Filter */}
                <div>
                  <FormLabel htmlFor="aiStatus">AI Status</FormLabel>
                  <FormSelect
                    id="aiStatus"
                    value={selectedAIStatus}
                    onChange={(e) => setSelectedAIStatus(e.target.value)}
                  >
                    <option value="all">All AI Status</option>
                    <option value="processed">Processed</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </FormSelect>
                </div>

                {/* Approval Status Filter */}
                <div>
                  <FormLabel htmlFor="approvalStatus">Approval Status</FormLabel>
                  <FormSelect
                    id="approvalStatus"
                    value={selectedApprovalStatus}
                    onChange={(e) => setSelectedApprovalStatus(e.target.value)}
                  >
                    <option value="all">All Approval Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </FormSelect>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Filter by Created Date:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">to</span>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      toast.success('Filters applied');
                    }}
                    className="px-3 py-1.5 text-xs bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedAgeGroup('all');
                      setSelectedBodyShape('all');
                      setSelectedAIStatus('all');
                      setSelectedApprovalStatus('all');
                      setDateRange({ startDate: '', endDate: '' });
                      toast.success('Filters cleared');
                    }}
                    className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Item ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Age Group</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Body Shape</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">AI Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Approval Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((item) => {
                    const aiStatus = getAIStatusDisplay(item.aiStatus);
                    const approvalStatus = getApprovalStatusDisplay(item.approvalStatus);
                    const AIIcon = aiStatus.icon;
                    const ApprovalIcon = approvalStatus.icon;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                            {item.id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <img
                            src={item.imageUrl}
                            alt={item.category}
                            className="w-12 h-12 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {item.ageGroup || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {item.bodyShape || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${aiStatus.bg} ${aiStatus.color}`}>
                            <AIIcon className="w-3 h-3" />
                            {aiStatus.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${approvalStatus.bg} ${approvalStatus.color}`}>
                            <ApprovalIcon className="w-3 h-3" />
                            {approvalStatus.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(item.createdDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewEdit(item)}
                            className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            View/Edit
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

        {/* ========== GRID VIEW ========== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((item) => {
              const approvalStatus = getApprovalStatusDisplay(item.approvalStatus);
              const ApprovalIcon = approvalStatus.icon;

              return (
                <div
                  key={item.id}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={item.imageUrl}
                      alt={item.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.id}</span>
                        <div className="text-xs font-medium text-neutral-900 dark:text-white mt-0.5">{item.category}</div>
                      </div>
                      {/* 3-dot menu */}
                      <div className="relative" ref={showActionMenu === item.id ? actionMenuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(showActionMenu === item.id ? null : item.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        {showActionMenu === item.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEdit(item);
                                setShowActionMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEdit(item);
                                setShowActionMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info('Delete functionality');
                                setShowActionMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {item.ageGroup && (
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Age: {item.ageGroup}
                        </div>
                      )}
                      {item.bodyShape && (
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Shape: {item.bodyShape}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(item.createdDate)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${approvalStatus.bg} ${approvalStatus.color}`}>
                          <ApprovalIcon className="w-3 h-3" />
                          {approvalStatus.label}
                        </span>
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((item) => {
              const aiStatus = getAIStatusDisplay(item.aiStatus);
              const approvalStatus = getApprovalStatusDisplay(item.approvalStatus);
              const AIIcon = aiStatus.icon;
              const ApprovalIcon = approvalStatus.icon;

              return (
                <div
                  key={item.id}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.category}
                      className="w-16 h-16 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {item.category}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.id}
                        </span>
                        {item.isActive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                        {item.ageGroup && <span>Age: {item.ageGroup}</span>}
                        {item.bodyShape && <span>Shape: {item.bodyShape}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${aiStatus.bg} ${aiStatus.color}`}>
                        <AIIcon className="w-3 h-3" />
                        {aiStatus.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${approvalStatus.bg} ${approvalStatus.color}`}>
                        <ApprovalIcon className="w-3 h-3" />
                        {approvalStatus.label}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 w-20">
                        {formatDate(item.createdDate)}
                      </span>
                      <button
                        onClick={() => handleViewEdit(item)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        View/Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <ImageIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              {searchQuery || filters.length > 0 ? 'No wardrobe items found' : 'No Default Wardrobe Sets Available'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by uploading wardrobe item images'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}