import {
  Users,
  Plus,
  Edit,
  RefreshCw,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, ViewModeSwitcher, SearchBar, Pagination } from './hb/listing';
import { toast } from 'sonner';
import AgeGroupDetail from './AgeGroupDetail';

// Age Group interface
interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  createdDate: string;
}

// Seeded Age Groups (system-defined, cannot be added/deleted - fixed at 6)
const mockAgeGroups: AgeGroup[] = [
  {
    id: 'AG001',
    name: 'Infants',
    ageRange: '0-2 years',
    createdDate: '2023-01-10',
  },
  {
    id: 'AG002',
    name: 'Toddlers',
    ageRange: '3-5 years',
    createdDate: '2023-01-10',
  },
  {
    id: 'AG003',
    name: 'Children',
    ageRange: '6-12 years',
    createdDate: '2023-01-10',
  },
  {
    id: 'AG004',
    name: 'Teens',
    ageRange: '13-17 years',
    createdDate: '2023-01-10',
  },
  {
    id: 'AG005',
    name: 'Young Adults',
    ageRange: '18-30 years',
    createdDate: '2023-01-10',
  },
  {
    id: 'AG006',
    name: 'Adults',
    ageRange: '31+ years',
    createdDate: '2023-01-10',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function AgeGroupManagement() {
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>(mockAgeGroups);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

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

  // Filter data based on search
  const filteredData = useMemo(() => {
    let filtered = ageGroups;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((ageGroup) => {
        const searchFields = [ageGroup.id, ageGroup.name, ageGroup.ageRange];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [ageGroups, searchQuery]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    return [
      { label: 'Total Age Groups', value: ageGroups.length.toString(), icon: Users },
      { label: 'Active System', value: 'Live', icon: CheckCircle2 },
      { label: 'Last Updated', value: 'Today', icon: Calendar },
    ];
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle edit age group
  const handleEditAgeGroup = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
  };

  // Handle view details
  const handleViewDetails = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
  };

  // Handle update from detail page
  const handleUpdateAgeGroup = (updatedAgeGroup: AgeGroup) => {
    setAgeGroups(ageGroups.map(ag => 
      ag.id === updatedAgeGroup.id ? updatedAgeGroup : ag
    ));
    setSelectedAgeGroup(null);
    toast.success('Age group updated successfully.');
  };

  // If viewing age group detail
  if (selectedAgeGroup) {
    return (
      <AgeGroupDetail
        ageGroup={selectedAgeGroup}
        allAgeGroups={ageGroups}
        onBack={() => setSelectedAgeGroup(null)}
        onSave={handleUpdateAgeGroup}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Age Group"
          breadcrumbs={[
            { label: 'Master Management', href: '#' },
            { label: 'Age Group', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Age Group ID, Name, or Range..."
            />
          </div>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setAgeGroups(mockAgeGroups);
              setSearchQuery('');
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

        {/* ========== SYSTEM INFO BANNER ========== */}
        <div className="mb-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
          <p className="text-xs text-primary-800 dark:text-primary-200">
            <strong>Note:</strong> Age groups are system-defined and pre-seeded. Total age groups fixed at 6. You can only edit age group names. Age ranges are fixed and non-editable. Add/Delete/Status actions are not available.
          </p>
        </div>

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Age Group ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Age Range</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Age Group Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((ageGroup) => (
                    <tr
                      key={ageGroup.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                          {ageGroup.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {ageGroup.ageRange}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {ageGroup.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(ageGroup.createdDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative" ref={showActionMenu === ageGroup.id ? actionMenuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === ageGroup.id ? null : ageGroup.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          {showActionMenu === ageGroup.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(ageGroup);
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
                                  handleEditAgeGroup(ageGroup);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            </div>
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
            {paginatedData.map((ageGroup) => (
              <div
                key={ageGroup.id}
                onClick={() => handleViewDetails(ageGroup)}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">{ageGroup.id}</p>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{ageGroup.name}</h3>
                  </div>
                  {/* 3-dot menu */}
                  <div className="relative" ref={showActionMenu === ageGroup.id ? actionMenuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === ageGroup.id ? null : ageGroup.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                    {showActionMenu === ageGroup.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(ageGroup);
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
                            handleEditAgeGroup(ageGroup);
                            setShowActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Baby className="w-3.5 h-3.5" />
                    <span>Range: {ageGroup.ageRange}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {formatDate(ageGroup.createdDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((ageGroup) => (
              <div
                key={ageGroup.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{ageGroup.name}</h3>
                      <span className="text-xs text-primary-600 dark:text-primary-400">{ageGroup.id}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Baby className="w-3.5 h-3.5" />
                        Range: {ageGroup.ageRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Created: {formatDate(ageGroup.createdDate)}
                      </span>
                    </div>
                  </div>
                  <div className="relative" ref={showActionMenu === ageGroup.id ? actionMenuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === ageGroup.id ? null : ageGroup.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                    {showActionMenu === ageGroup.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(ageGroup);
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
                            handleEditAgeGroup(ageGroup);
                            setShowActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    )}
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
            <Baby className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No age groups found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Try adjusting your search
            </p>
          </div>
        )}

        {/* System Info Footer */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Baby className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">System Age Groups</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                These age groups are pre-defined and essential to the system. The total count is fixed at 6 age groups.
              </p>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((ag) => (
                  <span
                    key={ag.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs text-neutral-700 dark:text-neutral-300"
                  >
                    <Baby className="w-3 h-3" />
                    {ag.name} ({ag.ageRange})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}