import { useState, useMemo } from 'react';
import {
  FileText,
  RefreshCw,
  Heart,
  MessageCircle,
  Bookmark,
  Repeat2,
  Eye,
  Image as ImageIcon,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import PostDetail from './PostDetail';

// Post interface
interface Post {
  id: string;
  postedBy: string;
  postedByEmail: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  hashtags: string[];
  likesCount: number;
  commentCount: number;
  savedCount: number;
  repostCount: number;
  postedDate: string;
  status: 'active' | 'inactive';
}

// Mock Posts
const mockPosts: Post[] = [
  {
    id: 'POST001',
    postedBy: 'Sarah Johnson',
    postedByEmail: 'sarah.j@example.com',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    mediaType: 'image',
    caption: 'Loving my new summer outfit! Perfect for beach days ☀️',
    hashtags: ['#SummerVibes', '#BeachStyle', '#OOTD'],
    likesCount: 342,
    commentCount: 28,
    savedCount: 45,
    repostCount: 12,
    postedDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'POST002',
    postedBy: 'Michael Chen',
    postedByEmail: 'michael.c@example.com',
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    mediaType: 'image',
    caption: 'Casual Friday done right! Who else loves a good blazer combo?',
    hashtags: ['#CasualFriday', '#Menswear', '#StyleInspiration'],
    likesCount: 567,
    commentCount: 42,
    savedCount: 89,
    repostCount: 23,
    postedDate: '2024-01-14',
    status: 'active',
  },
  {
    id: 'POST003',
    postedBy: 'Emma Davis',
    postedByEmail: 'emma.d@example.com',
    mediaUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    mediaType: 'image',
    caption: 'New wardrobe additions! Thanks for all the styling tips 💕',
    hashtags: ['#WardrobeRefresh', '#Shopping', '#FashionHaul'],
    likesCount: 234,
    commentCount: 18,
    savedCount: 56,
    repostCount: 8,
    postedDate: '2024-01-13',
    status: 'active',
  },
  {
    id: 'POST004',
    postedBy: 'James Wilson',
    postedByEmail: 'james.w@example.com',
    mediaUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    mediaType: 'image',
    caption: 'Minimal and chic. Less is more! 🖤',
    hashtags: ['#Minimalist', '#ChicStyle', '#LessIsMore'],
    likesCount: 445,
    commentCount: 31,
    savedCount: 78,
    repostCount: 19,
    postedDate: '2024-01-12',
    status: 'inactive',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type SortField = 'likesCount' | 'commentCount' | 'savedCount';
type SortDirection = 'asc' | 'desc';

export default function PostsManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
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

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = posts;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((post) => {
        const searchFields = [post.id, post.postedBy, post.postedByEmail];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply filters
    const matchesFilters = (post: Post) => {
      if (appliedStatus !== 'all' && appliedStatus !== post.status) return false;
      
      if (appliedFromDate && appliedToDate) {
        const postDate = new Date(post.postedDate);
        const startDate = new Date(appliedFromDate);
        const endDate = new Date(appliedToDate);
        
        // Set time to start and end of day for accurate comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return postDate >= startDate && postDate <= endDate;
      }
      
      return true;
    };

    filtered = filtered.filter(matchesFilters);

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }, [posts, searchQuery, appliedStatus, appliedFromDate, appliedToDate, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = posts.filter(p => p.status === 'active').length;
    const totalLikes = posts.reduce((sum, p) => sum + p.likesCount, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.commentCount, 0);
    
    return [
      { label: 'Total Posts', value: posts.length.toString(), icon: FileText },
      { label: 'Active Posts', value: activeCount.toString(), icon: Eye },
      { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart },
      { label: 'Total Comments', value: totalComments.toLocaleString(), icon: MessageCircle },
    ];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle view post
  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
  };

  // Handle update post
  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setSelectedPost(null);
    toast.success('Post updated successfully');
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // If viewing post detail
  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onSave={handleUpdatePost}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Posts"
          breadcrumbs={[
            { label: 'Content Moderation', href: '#' },
            { label: 'Posts', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Post ID or Posted By..."
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
              setPosts(mockPosts);
              setSearchQuery('');
              handleResetFilters();
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
                  {/* Post Status Filter */}
                  <div>
                    <FormLabel htmlFor="status">Post Status</FormLabel>
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

        {/* READ-ONLY INFO */}
        <div className="mb-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
          <p className="text-xs text-primary-800 dark:text-primary-200">
            <strong>Note:</strong> Post listing is read-only. Click on any post to view details and manage status. Post content cannot be edited.
          </p>
        </div>

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Post ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Posted By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Media</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Caption</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Hashtags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Likes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Comments</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Saves</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Reposts</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Posted Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewPost(post)}
                          className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                        >
                          {post.id}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white">{post.postedBy}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{post.postedByEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <img src={post.mediaUrl} alt="Post" className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white max-w-xs truncate" title={post.caption}>
                          {post.caption}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs truncate" title={post.hashtags.join(' ')}>
                          {post.hashtags.join(' ')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-error-500" />
                          <span className="text-sm text-neutral-900 dark:text-white">{post.likesCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-primary-500" />
                          <span className="text-sm text-neutral-900 dark:text-white">{post.commentCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Bookmark className="w-3.5 h-3.5 text-warning-500" />
                          <span className="text-sm text-neutral-900 dark:text-white">{post.savedCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Repeat2 className="w-3.5 h-3.5 text-success-500" />
                          <span className="text-sm text-neutral-900 dark:text-white">{post.repostCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(post.postedDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewPost(post)}
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
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
            {paginatedData.map((post) => (
              <div
                key={post.id}
                onClick={() => handleViewPost(post)}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-neutral-100 dark:bg-neutral-900">
                  <img src={post.mediaUrl} alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{post.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === 'active'
                        ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {post.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-900 dark:text-white mb-2 line-clamp-2">{post.caption}</p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-error-500" />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-primary-500" />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">{post.commentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-warning-500" />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">{post.savedCount}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{post.postedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((post) => (
              <div
                key={post.id}
                onClick={() => handleViewPost(post)}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img src={post.mediaUrl} alt="Post" className="w-16 h-16 object-cover rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{post.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        post.status === 'active'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {post.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 truncate">{post.caption}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>By {post.postedBy}</span>
                      <span>•</span>
                      <span>{formatDate(post.postedDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-error-500" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-primary-500" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{post.commentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5 text-warning-500" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{post.savedCount}</span>
                    </div>
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
            <ImageIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No posts found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || getActiveFiltersCount() > 0 ? 'Try adjusting your search or filters' : 'No posts available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}