import { useState, useMemo } from 'react';
import {
  Flag,
  RefreshCw,
  Eye,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import FlaggedPostDetail from './FlaggedPostDetail';

// Flagged Post interface
interface FlaggedPost {
  flagId: string;
  postId: string;
  postOwner: string;
  postOwnerEmail: string;
  flaggedBy: string;
  flaggedByEmail: string;
  flagReason: string;
  totalFlagsCount: number;
  status: 'Flagged' | 'Resolved';
  postStatus: 'active' | 'inactive';
  flaggedDate: string;
  caption?: string;
  hashtags?: string[];
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
}

// Mock Flagged Posts
const mockFlaggedPosts: FlaggedPost[] = [
  {
    flagId: 'FLG-POST-001',
    postId: 'POST001',
    postOwner: 'Jane Smith',
    postOwnerEmail: 'jane.smith@example.com',
    flaggedBy: 'Reporter User',
    flaggedByEmail: 'reporter@example.com',
    flagReason: 'Inappropriate Content',
    totalFlagsCount: 5,
    status: 'Flagged',
    postStatus: 'active',
    flaggedDate: '2024-01-15',
    caption: 'Check out this amazing view! #sunset #nature',
    hashtags: ['sunset', 'nature', 'photography'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  },
  {
    flagId: 'FLG-POST-002',
    postId: 'POST004',
    postOwner: 'Mike Johnson',
    postOwnerEmail: 'mike.j@example.com',
    flaggedBy: 'Admin User',
    flaggedByEmail: 'admin@example.com',
    flagReason: 'Spam',
    totalFlagsCount: 12,
    status: 'Resolved',
    postStatus: 'inactive',
    flaggedDate: '2024-01-14',
    caption: 'Buy now! Limited offer! Click here for amazing deals!',
    hashtags: ['sale', 'deals'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
  },
  {
    flagId: 'FLG-POST-003',
    postId: 'POST007',
    postOwner: 'Tom Brown',
    postOwnerEmail: 'tom.b@example.com',
    flaggedBy: 'Multiple Users',
    flaggedByEmail: 'system@example.com',
    flagReason: 'Harassment',
    totalFlagsCount: 3,
    status: 'Flagged',
    postStatus: 'active',
    flaggedDate: '2024-01-13',
    caption: 'This is completely unacceptable behavior!',
    hashtags: ['complaint'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
  },
  {
    flagId: 'FLG-POST-004',
    postId: 'POST012',
    postOwner: 'Sarah Wilson',
    postOwnerEmail: 'sarah.w@example.com',
    flaggedBy: 'Moderator Team',
    flaggedByEmail: 'moderator@example.com',
    flagReason: 'False Information',
    totalFlagsCount: 8,
    status: 'Resolved',
    postStatus: 'inactive',
    flaggedDate: '2024-01-12',
    caption: 'Breaking news that is completely fabricated!',
    hashtags: ['news', 'breaking'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type SortOrder = 'asc' | 'desc';

export default function FlaggedPostsManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>(mockFlaggedPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPost, setSelectedPost] = useState<FlaggedPost | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedStatus(selectedStatus);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    toast.success('Filters applied');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setFromDate('');
    setToDate('');
    setAppliedStatus('all');
    setAppliedFromDate('');
    setAppliedToDate('');
    toast.success('Filters reset');
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedStatus !== 'all') count++;
    if (appliedFromDate || appliedToDate) count++;
    return count;
  };

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = flaggedPosts;

    // Search: Flag ID or Post ID
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const searchFields = [item.flagId, item.postId];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply filters
    const matchesFilters = (item: FlaggedPost) => {
      if (appliedStatus !== 'all' && appliedStatus.toLowerCase() !== item.status.toLowerCase()) return false;
      
      if (appliedFromDate && appliedToDate) {
        const flagDate = new Date(item.flaggedDate);
        const startDate = new Date(appliedFromDate);
        const endDate = new Date(appliedToDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return flagDate >= startDate && flagDate <= endDate;
      }
      
      return true;
    };

    filtered = filtered.filter(matchesFilters);

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.flaggedDate).getTime();
      const dateB = new Date(b.flaggedDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [flaggedPosts, searchQuery, appliedStatus, appliedFromDate, appliedToDate, sortOrder]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const totalFlags = flaggedPosts.reduce((sum, item) => sum + item.totalFlagsCount, 0);
    
    return [
      { label: 'Total Flagged Posts', value: flaggedPosts.length.toString(), icon: Flag },
      { label: 'Total Flags', value: totalFlags.toString(), icon: AlertTriangle },
    ];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle edit post
  const handleEditPost = (post: FlaggedPost) => {
    setSelectedPost(post);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedPost(null);
  };

  // Handle update post
  const handleUpdatePost = (status: 'active' | 'inactive', adminNote: string) => {
    if (selectedPost) {
      // Update the post in the list
      setFlaggedPosts(prev =>
        prev.map(item =>
          item.postId === selectedPost.postId
            ? { ...item, postStatus: status, status: status === 'inactive' ? 'Resolved' : item.status }
            : item
        )
      );
      setSelectedPost(null);
    }
  };

  // If a post is selected, show the detail view
  if (selectedPost) {
    return (
      <FlaggedPostDetail
        flagId={selectedPost.flagId}
        postId={selectedPost.postId}
        postOwner={selectedPost.postOwner}
        postOwnerEmail={selectedPost.postOwnerEmail}
        flaggedBy={selectedPost.flaggedBy}
        flaggedByEmail={selectedPost.flaggedByEmail}
        flaggedDate={selectedPost.flaggedDate}
        flagReason={selectedPost.flagReason}
        flagStatus={selectedPost.status}
        currentPostStatus={selectedPost.postStatus}
        totalFlagsCount={selectedPost.totalFlagsCount}
        caption={selectedPost.caption}
        hashtags={selectedPost.hashtags}
        mediaType={selectedPost.mediaType}
        mediaUrl={selectedPost.mediaUrl}
        onBack={handleBackToList}
        onUpdate={handleUpdatePost}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Flagged Posts"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Posts', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Flag ID or Post ID..."
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
              setSearchQuery('');
              handleResetFilters();
              toast.success('Data refreshed');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
          <ViewModeSwitcher currentMode={viewMode} onChange={setViewMode} />
        </PageHeader>

        {/* SUMMARY WIDGETS */}
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
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <FormSelect
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="flagged">Flagged</option>
                      <option value="resolved">Resolved</option>
                    </FormSelect>
                  </div>

                  {/* Date Range - From Date */}
                  <div>
                    <FormLabel htmlFor="fromDate">From Date</FormLabel>
                    <input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Date Range - To Date */}
                  <div>
                    <FormLabel htmlFor="toDate">To Date</FormLabel>
                    <input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
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
        {getActiveFiltersCount() > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            {appliedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Status: {appliedStatus.charAt(0).toUpperCase() + appliedStatus.slice(1)}
              </span>
            )}
            {(appliedFromDate || appliedToDate) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Date: {appliedFromDate || '...'} to {appliedToDate || '...'}
              </span>
            )}
          </div>
        )}

        <div className="mb-4 bg-error-100 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg px-4 py-2">
          <p className="text-xs text-error-800 dark:text-error-200">
            <strong>Attention Required:</strong> These posts have been flagged for violations. Review and take appropriate action.
          </p>
        </div>

        {/* SORTING OPTIONS */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 text-xs rounded-lg border transition-colors bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
          >
            Date {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Post ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Post Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flagged By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Total Flags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flagged Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((item) => (
                    <tr key={item.flagId} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{item.flagId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white">{item.postId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white">{item.postOwner}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.postOwnerEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white">{item.flaggedBy}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.flaggedByEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white max-w-xs truncate" title={item.flagReason}>
                          {item.flagReason}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 text-sm font-semibold">
                          {item.totalFlagsCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Flagged'
                            ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                            : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(item.flaggedDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEditPost(item)}
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((item) => (
              <div key={item.flagId} className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {item.mediaUrl && (
                  <div className="aspect-square bg-neutral-100 dark:bg-neutral-900">
                    <img src={item.mediaUrl} alt="Post" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.flagId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'Flagged'
                        ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                        : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-900 dark:text-white mb-2 line-clamp-2">{item.caption}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 rounded text-xs">
                      <Flag className="w-3 h-3" />
                      {item.totalFlagsCount}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => handleEditPost(item)}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((item) => (
              <div key={item.flagId} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-4">
                  {item.mediaUrl && (
                    <img src={item.mediaUrl} alt="Post" className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.flagId}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.postId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'Flagged'
                          ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                          : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 truncate">{item.caption}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>By {item.postOwner}</span>
                      <span>•</span>
                      <span>{formatDate(item.flaggedDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 rounded text-xs">
                      <Flag className="w-3 h-3" />
                      {item.totalFlagsCount}
                    </span>
                    <button
                      onClick={() => handleEditPost(item)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            <Flag className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No flagged posts found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || getActiveFiltersCount() > 0 ? 'Try adjusting your search or filters' : 'No flagged posts available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}