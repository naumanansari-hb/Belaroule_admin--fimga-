import { useState, useMemo } from 'react';
import {
  Mail,
  RefreshCw,
  Eye,
  Flag,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, Pagination, ViewModeSwitcher, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import FlaggedMessageDetail from './FlaggedMessageDetail';

interface FlaggedMessage {
  flagId: string;
  senderEmail: string;
  receiverEmail: string;
  flaggedBy: string;
  flaggedDate: string;
  status: 'flagged' | 'resolved';
  messageId: string;
  messageType: 'text' | 'image' | 'video' | 'wardrobe';
  messageContent: string;
  mediaUrl?: string;
  wardrobeItem?: {
    wardrobeItemId: string;
    wardrobeItemName: string;
    itemImageUrl: string;
    itemCategory: string;
    itemOwner: string;
  };
  sentTimestamp: string;
  flagReason: string;
  senderId: string;
  senderName: string;
  senderStatus: 'active' | 'inactive';
}

const mockFlaggedMessages: FlaggedMessage[] = [
  {
    flagId: 'FLG001',
    senderEmail: 'john.spam@example.com',
    receiverEmail: 'user1@example.com',
    flaggedBy: 'user1@example.com',
    flaggedDate: '2026-01-15',
    status: 'flagged',
    messageId: 'MSG001',
    messageType: 'text',
    messageContent: 'Hey! Check out this amazing offer! Click here to get 90% off on all products! Limited time only! 🎉🎁',
    sentTimestamp: '2026-01-15 09:30:00',
    flagReason: 'Spam Content',
    senderId: 'USR101',
    senderName: 'John Spammer',
    senderStatus: 'active',
  },
  {
    flagId: 'FLG002',
    senderEmail: 'abusive.user@example.com',
    receiverEmail: 'victim@example.com',
    flaggedBy: 'victim@example.com',
    flaggedDate: '2026-01-14',
    status: 'flagged',
    messageId: 'MSG002',
    messageType: 'image',
    messageContent: 'Look at this inappropriate image I found',
    mediaUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea533f8b?w=800',
    sentTimestamp: '2026-01-14 15:45:00',
    flagReason: 'Harassment',
    senderId: 'USR102',
    senderName: 'Abusive User',
    senderStatus: 'inactive',
  },
  {
    flagId: 'FLG003',
    senderEmail: 'suspicious@example.com',
    receiverEmail: 'user2@example.com',
    flaggedBy: 'user2@example.com',
    flaggedDate: '2026-01-13',
    status: 'resolved',
    messageId: 'MSG003',
    messageType: 'video',
    messageContent: 'Check out this suspicious video',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    sentTimestamp: '2026-01-13 11:20:00',
    flagReason: 'Phishing Attempt',
    senderId: 'USR103',
    senderName: 'Suspicious Account',
    senderStatus: 'inactive',
  },
  {
    flagId: 'FLG004',
    senderEmail: 'troll@example.com',
    receiverEmail: 'user3@example.com',
    flaggedBy: 'user3@example.com',
    flaggedDate: '2026-01-12',
    status: 'flagged',
    messageId: 'MSG004',
    messageType: 'wardrobe',
    messageContent: 'What do you think about this outfit? 😍',
    wardrobeItem: {
      wardrobeItemId: 'WRDB001',
      wardrobeItemName: 'Red Summer Dress',
      itemImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      itemCategory: 'Dresses',
      itemOwner: 'troll@example.com',
    },
    sentTimestamp: '2026-01-12 14:10:00',
    flagReason: 'Inappropriate Content',
    senderId: 'USR104',
    senderName: 'Internet Troll',
    senderStatus: 'active',
  },
  {
    flagId: 'FLG005',
    senderEmail: 'scammer@example.com',
    receiverEmail: 'target@example.com',
    flaggedBy: 'target@example.com',
    flaggedDate: '2026-01-11',
    status: 'resolved',
    messageId: 'MSG005',
    messageType: 'text',
    messageContent: 'Congratulations! You have won $1,000,000! Send $500 processing fee to claim your prize now!',
    sentTimestamp: '2026-01-11 10:05:00',
    flagReason: 'Scam / Fraud',
    senderId: 'USR105',
    senderName: 'Scammer Account',
    senderStatus: 'inactive',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type SortOrder = 'asc' | 'desc';

export default function FlaggedMessagesManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [flaggedMessages] = useState<FlaggedMessage[]>(mockFlaggedMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState<FlaggedMessage | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMessageType, setSelectedMessageType] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');
  const [appliedMessageType, setAppliedMessageType] = useState<string>('all');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedStatus(selectedStatus);
    setAppliedMessageType(selectedMessageType);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    toast.success('Filters applied');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSelectedMessageType('all');
    setFromDate('');
    setToDate('');
    setAppliedStatus('all');
    setAppliedMessageType('all');
    setAppliedFromDate('');
    setAppliedToDate('');
    toast.success('Filters reset');
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedStatus !== 'all') count++;
    if (appliedMessageType !== 'all') count++;
    if (appliedFromDate || appliedToDate) count++;
    return count;
  };

  const filteredData = useMemo(() => {
    let filtered = flaggedMessages;

    // Search: Flag ID, Sender Email, or Receiver Email
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const searchFields = [item.flagId, item.senderEmail, item.receiverEmail];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply filters
    const matchesFilters = (item: FlaggedMessage) => {
      if (appliedStatus !== 'all' && appliedStatus !== item.status) return false;
      
      if (appliedMessageType !== 'all' && appliedMessageType !== item.messageType) return false;
      
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
  }, [flaggedMessages, searchQuery, appliedStatus, appliedMessageType, appliedFromDate, appliedToDate, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const getSummaryWidgets = () => {
    const activeSenders = flaggedMessages.filter(item => item.senderStatus === 'active').length;
    const flaggedCount = flaggedMessages.filter(item => item.status === 'flagged').length;
    
    return [
      { label: 'Total Flagged Messages', value: flaggedMessages.length.toString(), icon: Mail },
      { label: 'Flagged', value: flaggedCount.toString(), icon: Flag },
      { label: 'Active Senders', value: activeSenders.toString(), icon: Eye },
    ];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleViewMessage = (message: FlaggedMessage) => {
    setSelectedMessage(message);
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const handleUpdateMessage = (status: 'active' | 'inactive', adminNote: string) => {
    console.log('Update message status:', status, adminNote);
    setSelectedMessage(null);
    toast.success('Message updated successfully');
  };

  if (selectedMessage) {
    return (
      <FlaggedMessageDetail
        flagId={selectedMessage.flagId}
        senderEmail={selectedMessage.senderEmail}
        receiverEmail={selectedMessage.receiverEmail}
        flaggedBy={selectedMessage.flaggedBy}
        flaggedDate={selectedMessage.flaggedDate}
        flagStatus={selectedMessage.status}
        messageId={selectedMessage.messageId}
        messageType={selectedMessage.messageType}
        messageContent={selectedMessage.messageContent}
        mediaUrl={selectedMessage.mediaUrl}
        wardrobeItem={selectedMessage.wardrobeItem}
        sentTimestamp={selectedMessage.sentTimestamp}
        flagReason={selectedMessage.flagReason}
        senderId={selectedMessage.senderId}
        senderName={selectedMessage.senderName}
        currentSenderStatus={selectedMessage.senderStatus}
        onBack={handleBackToList}
        onUpdate={handleUpdateMessage}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        <PageHeader
          title="Flagged Messages"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Messages', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Flag ID, Sender Email, or Receiver Email..."
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

                  {/* Message Type Filter */}
                  <div>
                    <FormLabel htmlFor="messageType">Message Type</FormLabel>
                    <FormSelect
                      id="messageType"
                      value={selectedMessageType}
                      onChange={(e) => setSelectedMessageType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="wardrobe">Wardrobe Item</option>
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
            {appliedMessageType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Type: {appliedMessageType.charAt(0).toUpperCase() + appliedMessageType.slice(1)}
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
            <strong>Attention Required:</strong> These messages have been flagged for violations. Review and take appropriate action.
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

        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Message ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Sender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Receiver</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Message Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Flag Reason</th>
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
                        <span className="text-sm text-neutral-900 dark:text-white">{item.messageId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white">{item.senderName}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{item.senderEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">{item.receiverEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-900 dark:text-white capitalize">
                          {item.messageType === 'text' && 'Text'}
                          {item.messageType === 'image' && 'Image'}
                          {item.messageType === 'video' && 'Video'}
                          {item.messageType === 'wardrobe' && 'Wardrobe Item'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900 dark:text-white max-w-xs truncate" title={item.flagReason}>
                          {item.flagReason}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'flagged'
                            ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                            : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                        }`}>
                          {item.status === 'flagged' ? 'Flagged' : 'Resolved'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(item.flaggedDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewMessage(item)}
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

        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((item) => (
              <div key={item.flagId} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.flagId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'flagged'
                          ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                          : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      }`}>
                        {item.status === 'flagged' ? 'Flagged' : 'Resolved'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-900 dark:text-white mb-2 line-clamp-2">{item.messageContent}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>From: {item.senderEmail}</span>
                      <span>•</span>
                      <span>To: {item.receiverEmail}</span>
                      <span>•</span>
                      <span>{formatDate(item.flaggedDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 rounded text-xs">
                      <Flag className="w-3 h-3" />
                      {item.flagReason}
                    </span>
                    <button
                      onClick={() => handleViewMessage(item)}
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

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No flagged messages found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || getActiveFiltersCount() > 0 ? 'Try adjusting your search or filters' : 'No flagged messages available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}