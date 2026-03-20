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
import BodyShapeDetail from './BodyShapeDetail';

// Body Shape interface
interface BodyShape {
  id: string;
  name: string;
  createdDate: string;
}

// Seeded Body Shapes (system-defined, cannot be added/deleted - fixed at 6)
const mockBodyShapes: BodyShape[] = [
  {
    id: 'BS001',
    name: 'Triangle',
    createdDate: '2023-01-10',
  },
  {
    id: 'BS002',
    name: 'Rectangle',
    createdDate: '2023-01-10',
  },
  {
    id: 'BS003',
    name: 'Circle',
    createdDate: '2023-01-10',
  },
  {
    id: 'BS004',
    name: 'Pear',
    createdDate: '2023-01-10',
  },
  {
    id: 'BS005',
    name: 'Inverted Triangle',
    createdDate: '2023-01-10',
  },
  {
    id: 'BS006',
    name: 'Hour Glass',
    createdDate: '2023-01-10',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

export default function BodyShapeManagement() {
  const [bodyShapes, setBodyShapes] = useState<BodyShape[]>(mockBodyShapes);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBodyShape, setSelectedBodyShape] = useState<BodyShape | null>(null);
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
    let filtered = bodyShapes;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((bodyShape) => {
        const searchFields = [bodyShape.id, bodyShape.name];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [bodyShapes, searchQuery]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    return [
      { label: 'Total Body Shapes', value: bodyShapes.length.toString(), icon: Shapes },
      { label: 'Active System', value: 'Live', icon: CheckCircle2 },
      { label: 'Last Updated', value: 'Today', icon: Calendar },
    ];
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle edit body shape
  const handleEditBodyShape = (bodyShape: BodyShape) => {
    setSelectedBodyShape(bodyShape);
  };

  // Handle view details
  const handleViewDetails = (bodyShape: BodyShape) => {
    setSelectedBodyShape(bodyShape);
  };

  // Handle update from detail page
  const handleUpdateBodyShape = (updatedBodyShape: BodyShape) => {
    setBodyShapes(bodyShapes.map(bs => 
      bs.id === updatedBodyShape.id ? updatedBodyShape : bs
    ));
    setSelectedBodyShape(null);
    toast.success('Body shape updated successfully.');
  };

  // If viewing body shape detail
  if (selectedBodyShape) {
    return (
      <BodyShapeDetail
        bodyShape={selectedBodyShape}
        allBodyShapes={bodyShapes}
        onBack={() => setSelectedBodyShape(null)}
        onSave={handleUpdateBodyShape}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title="Body Shape"
          breadcrumbs={[
            { label: 'Master Management', href: '#' },
            { label: 'Body Shape', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Body Shape ID or Name..."
            />
          </div>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setBodyShapes(mockBodyShapes);
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
            <strong>Note:</strong> Body shapes are system-defined and pre-seeded. Total body shapes fixed at 6. You can only edit body shape names. Add/Delete/Status actions are not available.
          </p>
        </div>

        {/* ========== TABLE VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Body Shape ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Body Shape Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((bodyShape) => (
                    <tr
                      key={bodyShape.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                          {bodyShape.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {bodyShape.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(bodyShape.createdDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative" ref={showActionMenu === bodyShape.id ? actionMenuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === bodyShape.id ? null : bodyShape.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          {showActionMenu === bodyShape.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(bodyShape);
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
                                  handleEditBodyShape(bodyShape);
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
            {paginatedData.map((bodyShape) => (
              <div
                key={bodyShape.id}
                onClick={() => handleViewDetails(bodyShape)}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">{bodyShape.id}</p>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{bodyShape.name}</h3>
                  </div>
                  {/* 3-dot menu */}
                  <div className="relative" ref={showActionMenu === bodyShape.id ? actionMenuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === bodyShape.id ? null : bodyShape.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                    {showActionMenu === bodyShape.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(bodyShape);
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
                            handleEditBodyShape(bodyShape);
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
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {formatDate(bodyShape.createdDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((bodyShape) => (
              <div
                key={bodyShape.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{bodyShape.name}</h3>
                      <span className="text-xs text-primary-600 dark:text-primary-400">{bodyShape.id}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Created: {formatDate(bodyShape.createdDate)}
                      </span>
                    </div>
                  </div>
                  <div className="relative" ref={showActionMenu === bodyShape.id ? actionMenuRef : null}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === bodyShape.id ? null : bodyShape.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    </button>
                    {showActionMenu === bodyShape.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(bodyShape);
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
                            handleEditBodyShape(bodyShape);
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
            <Shapes className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No body shapes found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Try adjusting your search
            </p>
          </div>
        )}

        {/* System Info Footer */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Shapes className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">System Body Shapes</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                These body shapes are pre-defined and essential to the system. The total count is fixed at 6 body shapes.
              </p>
              <div className="flex flex-wrap gap-2">
                {bodyShapes.map((bs) => (
                  <span
                    key={bs.id}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs text-neutral-700 dark:text-neutral-300"
                  >
                    <Shapes className="w-3 h-3" />
                    {bs.name}
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