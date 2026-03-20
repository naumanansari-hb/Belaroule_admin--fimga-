import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Shield,
  Plus,
  RefreshCw,
  Edit,
  CheckCircle2,
  XCircle,
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  Filter,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, ViewModeSwitcher, AdvancedSearchPanel, FilterChips, SearchBar, Pagination } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { SecondaryButton } from './hb/listing';
import RoleDetail from './RoleDetail';
import { formatDate } from '@/utils/dateFormatter';
import { FormSelect } from './hb/common/Form';
import { toast } from 'sonner';

// Role interface
interface Role {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModifiedDate: string;
  assignedCount?: number; // Number of sub-admins assigned to this role
}

// Mock Role data
const mockRoles: Role[] = [
  {
    id: 'RL001',
    name: 'Content Manager',
    description: 'Manages all content-related tasks including posts, categories, and user-generated content moderation',
    status: 'active',
    createdDate: '2023-01-15',
    lastModifiedDate: '2024-01-05',
    assignedCount: 5,
  },
  {
    id: 'RL002',
    name: 'User Support',
    description: 'Handles user queries, manages user accounts, and assists with user-related issues',
    status: 'active',
    createdDate: '2023-02-20',
    lastModifiedDate: '2023-12-18',
    assignedCount: 8,
  },
  {
    id: 'RL003',
    name: 'Moderator',
    description: 'Reviews and moderates flagged content, users, and community guidelines enforcement',
    status: 'active',
    createdDate: '2023-03-10',
    lastModifiedDate: '2024-01-02',
    assignedCount: 3,
  },
  {
    id: 'RL004',
    name: 'Analytics Manager',
    description: 'Access to reports, analytics, and business intelligence dashboards',
    status: 'active',
    createdDate: '2023-05-22',
    lastModifiedDate: '2023-11-30',
    assignedCount: 2,
  },
  {
    id: 'RL005',
    name: 'Marketing Admin',
    description: 'Manages marketing campaigns, email notifications, and promotional content',
    status: 'inactive',
    createdDate: '2023-06-12',
    lastModifiedDate: '2023-10-15',
    assignedCount: 0,
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function RoleManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  
  // Status filter states
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [appliedStatus, setAppliedStatus] = useState<'all' | 'active' | 'inactive'>('all');

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

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = mockRoles;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((role) => {
        const searchFields = [role.id, role.name, role.description];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(role => role.status === appliedStatus);
    }

    return filtered;
  }, [searchQuery, appliedStatus]);

  // Handle Apply filters
  const handleApplyFilters = () => {
    setAppliedStatus(selectedStatus);
    toast.success('Filters applied');
  };

  // Handle Reset filters
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setAppliedStatus('all');
    toast.success('Filters reset');
  };

  // Apply date range filter
  const applyDateRange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      // Check if date range filter already exists
      const existingIndex = filters.findIndex(f => f.field === 'Date Range');
      if (existingIndex >= 0) {
        // Update existing filter
        const newFilters = [...filters];
        newFilters[existingIndex] = {
          ...newFilters[existingIndex],
          values: [dateRange.startDate, dateRange.endDate],
        };
        setFilters(newFilters);
      } else {
        // Add new filter
        setFilters([...filters, {
          id: `filter-${Date.now()}`,
          field: 'Date Range',
          values: [dateRange.startDate, dateRange.endDate],
        }]);
      }
    }
  };

  // Clear date range
  const clearDateRange = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFilters(filters.filter(f => f.field !== 'Date Range'));
  };

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = mockRoles.filter(r => r.status === 'active').length;
    const totalAssigned = mockRoles.reduce((sum, r) => sum + (r.assignedCount || 0), 0);
    
    return [
      { label: 'Total Roles', value: mockRoles.length.toString(), icon: Shield },
      { label: 'Active Roles', value: activeCount.toString(), icon: CheckCircle2 },
      { label: 'Inactive Roles', value: (mockRoles.length - activeCount).toString(), icon: XCircle },
      { label: 'Sub Admins Assigned', value: totalAssigned.toString(), icon: Shield },
    ];
  };

  // Status badge helper - Pattern 1 from BADGE_GUIDELINES.md
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-500', label: 'Active' },
      inactive: { color: 'bg-error-500', label: 'Inactive' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  // Handle edit role
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsCreatingNew(false);
  };

  // Handle create new role
  const handleCreateNew = () => {
    setSelectedRole({
      id: '',
      name: '',
      description: '',
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
      assignedCount: 0,
    });
    setIsCreatingNew(true);
  };

  // If viewing or creating a role detail
  if (selectedRole) {
    return (
      <RoleDetail
        role={selectedRole}
        isCreating={isCreatingNew}
        onBack={() => {
          setSelectedRole(null);
          setIsCreatingNew(false);
        }}
        onSave={(role) => {
          console.log('Save role:', role);
          setSelectedRole(null);
          setIsCreatingNew(false);
        }}
        onDelete={(role) => {
          console.log('Delete role:', role);
          setSelectedRole(null);
          setIsCreatingNew(false);
        }}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Roles"
          breadcrumbs={[
            { label: 'User Management', href: '#' },
            { label: 'Roles', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Role ID or Name..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleCreateNew}
            icon={Plus}
            size="sm"
          >
            Add Role
          </PrimaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              console.log('Refresh data');
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Status
                    </label>
                    <FormSelect
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </FormSelect>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
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
          </div>
        )}

        {/* Active Filters Display */}
        {appliedStatus !== 'all' && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
              Status: {appliedStatus.charAt(0).toUpperCase() + appliedStatus.slice(1)}
            </span>
          </div>
        )}

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Role ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Role Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Modified</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                          {role.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">{role.name}</span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(role.status)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(role.createdDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(role.lastModifiedDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative" ref={showActionMenu === role.id ? actionMenuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === role.id ? null : role.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          {showActionMenu === role.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowActionMenu(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditRole(role);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Mark inactive:', role);
                                    setShowActionMenu(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Mark Inactive
                                </button>
                              </div>
                            </>
                          )}
                        </div>
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
            {paginatedData.map((role) => (
              <div
                key={role.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">{role.name}</h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{role.id}</p>
                  </div>
                  {/* 3-dot menu */}
                  <div className="relative" ref={showActionMenu === role.id ? actionMenuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === role.id ? null : role.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                    {showActionMenu === role.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRole(role);
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
                            handleEditRole(role);
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
                            console.log('Delete role:', role);
                            setShowActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{role.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {formatDate(role.createdDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Modified: {formatDate(role.lastModifiedDate)}</span>
                  </div>
                  {role.assignedCount !== undefined && (
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>{role.assignedCount} Sub Admins</span>
                      </div>
                      {getStatusBadge(role.status)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((role) => (
              <div
                key={role.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{role.name}</h3>
                      <span className="text-xs text-primary-600 dark:text-primary-400">{role.id}</span>
                      {getStatusBadge(role.status)}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{role.description}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Created: {formatDate(role.createdDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Modified: {formatDate(role.lastModifiedDate)}
                      </span>
                      {role.assignedCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" />
                          {role.assignedCount} Sub Admins
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditRole(role)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
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
            <Shield className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No roles found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}