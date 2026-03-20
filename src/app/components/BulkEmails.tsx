import { useState, useMemo } from 'react';
import {
  Mail,
  Plus,
  Eye,
  Users,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  Paperclip,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton, IconButton, SummaryWidgets, SearchBar, Pagination } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
  FormTextarea,
  FormFileInput,
} from './hb/common/Form';
import { toast } from 'sonner';

// Bulk Email interface
interface BulkEmail {
  id: string;
  subject: string;
  sentTo: 'all' | 'specific';
  recipientCount?: number;
  addedBy: string;
  dateAdded: string;
  dateSent: string | null;
  status: 'in-progress' | 'sent' | 'failed';
  adminEmail: string;
  description: string;
  attachment?: {
    name: string;
    size: number;
    url: string;
  };
  selectedUsers?: string[];
}

// Mock Bulk Emails
const mockBulkEmails: BulkEmail[] = [
  {
    id: 'BE001',
    subject: 'Welcome to New Fashion Collection 2024',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-15T10:30:00',
    dateSent: '2024-01-15T11:00:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
    description: '<h2>Welcome to our New Collection!</h2><p>We are excited to present our latest fashion collection for 2024.</p>',
    attachment: {
      name: 'collection-catalog.pdf',
      size: 2.5,
      url: '#',
    },
  },
  {
    id: 'BE002',
    subject: 'Important: System Maintenance Notice',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-14T09:00:00',
    dateSent: '2024-01-14T09:30:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
    description: '<p>Our system will undergo scheduled maintenance on January 20th from 2 AM to 6 AM.</p>',
  },
  {
    id: 'BE003',
    subject: 'Special Offer for Premium Members',
    sentTo: 'specific',
    recipientCount: 85,
    addedBy: 'John Doe',
    dateAdded: '2024-01-13T14:20:00',
    dateSent: '2024-01-13T15:00:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
    description: '<p>Exclusive offer for our premium members - Get 30% off on all items!</p>',
    selectedUsers: ['user1@email.com', 'user2@email.com'],
  },
  {
    id: 'BE004',
    subject: 'Weekly Style Tips and Trends',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-12T11:00:00',
    dateSent: null,
    status: 'in-progress',
    adminEmail: 'admin@bellaroules.com',
    description: '<h3>This Week\'s Fashion Trends</h3><p>Discover the latest style tips and fashion trends.</p>',
  },
  {
    id: 'BE005',
    subject: 'Account Security Update Required',
    sentTo: 'specific',
    recipientCount: 320,
    addedBy: 'John Doe',
    dateAdded: '2024-01-11T16:45:00',
    dateSent: null,
    status: 'failed',
    adminEmail: 'admin@bellaroules.com',
    description: '<p>Please update your account security settings to continue using our services.</p>',
    selectedUsers: ['user3@email.com', 'user4@email.com'],
  },
];

// Mock users for selection
const mockUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@email.com', status: 'active' },
  { id: '3', name: 'Carol Williams', email: 'carol@email.com', status: 'active' },
  { id: '4', name: 'David Brown', email: 'david@email.com', status: 'active' },
  { id: '5', name: 'Emma Davis', email: 'emma@email.com', status: 'active' },
  { id: '6', name: 'Frank Miller', email: 'frank@email.com', status: 'active' },
  { id: '7', name: 'Grace Lee', email: 'grace@email.com', status: 'active' },
  { id: '8', name: 'Henry Wilson', email: 'henry@email.com', status: 'active' },
  { id: '9', name: 'Iris Chen', email: 'iris@email.com', status: 'active' },
  { id: '10', name: 'Jack Taylor', email: 'jack@email.com', status: 'active' },
];

interface BulkEmailsProps {
  onNavigate: (pageId: string) => void;
  onViewEmail: (emailId: string) => void;
}

export default function BulkEmails({ onNavigate, onViewEmail }: BulkEmailsProps) {
  const [emails, setEmails] = useState<BulkEmail[]>(mockBulkEmails);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEmail, setSelectedEmail] = useState<BulkEmail | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sentToFilter, setSentToFilter] = useState<string>('all');

  // Form states
  const [formData, setFormData] = useState({
    subject: '',
    sentTo: 'all' as 'all' | 'specific',
    selectedUsers: [] as string[],
    description: '',
    attachment: null as File | null,
  });

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = emails;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((email) => {
        const searchFields = [email.subject, email.addedBy, email.id];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    // Apply sent to filter
    if (sentToFilter !== 'all') {
      filtered = filtered.filter(email => email.sentTo === sentToFilter);
    }

    // Sort by date added (latest first)
    filtered = [...filtered].sort((a, b) => 
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );

    return filtered;
  }, [emails, searchQuery, statusFilter, sentToFilter]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const totalEmails = emails.length;
    const sentEmails = emails.filter(e => e.status === 'sent').length;
    const inProgressEmails = emails.filter(e => e.status === 'in-progress').length;
    const failedEmails = emails.filter(e => e.status === 'failed').length;
    
    return [
      { label: 'Total Emails', value: totalEmails.toString(), icon: Mail },
      { label: 'Sent', value: sentEmails.toString(), icon: CheckCircle },
      { label: 'In Progress', value: inProgressEmails.toString(), icon: Clock },
      { label: 'Failed', value: failedEmails.toString(), icon: AlertCircle },
    ];
  };

  // Format date and time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  // Handle view email
  const handleViewEmail = (email: BulkEmail) => {
    setSelectedEmail(email);
    setShowViewModal(true);
  };

  // Handle add new email
  const handleAddEmail = () => {
    if (!formData.subject.trim()) {
      toast.error('Please enter email subject');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter email description');
      return;
    }

    if (formData.sentTo === 'specific' && formData.selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (formData.attachment && formData.attachment.size > 5 * 1024 * 1024) {
      toast.error('Attachment size must not exceed 5 MB');
      return;
    }

    const newEmail: BulkEmail = {
      id: `BE${String(emails.length + 1).padStart(3, '0')}`,
      subject: formData.subject,
      sentTo: formData.sentTo,
      recipientCount: formData.sentTo === 'all' ? 1250 : formData.selectedUsers.length,
      addedBy: 'John Doe',
      dateAdded: new Date().toISOString(),
      dateSent: null,
      status: 'in-progress',
      adminEmail: 'admin@bellaroules.com',
      description: formData.description,
      attachment: formData.attachment ? {
        name: formData.attachment.name,
        size: formData.attachment.size / (1024 * 1024),
        url: '#',
      } : undefined,
      selectedUsers: formData.sentTo === 'specific' ? formData.selectedUsers : undefined,
    };

    setEmails([newEmail, ...emails]);
    setShowAddModal(false);
    setFormData({
      subject: '',
      sentTo: 'all',
      selectedUsers: [],
      description: '',
      attachment: null,
    });
    toast.success('Bulk email queued successfully');
  };

  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('Attachment size must not exceed 5 MB');
      return;
    }
    setFormData({ ...formData, attachment: file });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'sent': 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
      'in-progress': 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
      'failed': 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300',
    };

    const statusLabel = {
      'sent': 'Sent',
      'in-progress': 'In Progress',
      'failed': 'Failed',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusLabel[status as keyof typeof statusLabel]}
      </span>
    );
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Bulk Emails"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Bulk Emails', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by subject, added by, or email ID..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => onNavigate('add-bulk-email')}
            size="sm"
            icon={Plus}
          >
            Send New
          </PrimaryButton>
        </PageHeader>

        {/* FILTERS */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <FormLabel htmlFor="statusFilter">Status</FormLabel>
                  <FormSelect
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="in-progress">In Progress</option>
                    <option value="failed">Failed</option>
                  </FormSelect>
                </div>

                {/* Sent To Filter */}
                <div>
                  <FormLabel htmlFor="sentToFilter">Sent To</FormLabel>
                  <FormSelect
                    id="sentToFilter"
                    value={sentToFilter}
                    onChange={(e) => setSentToFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="all">All Users</option>
                    <option value="specific">Specific Users</option>
                  </FormSelect>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Sent To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Added By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date Added</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date Sent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((email) => (
                  <tr
                    key={email.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {email.subject}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            ID: {email.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {email.sentTo === 'all' ? (
                          <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        ) : (
                          <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        )}
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {email.sentTo === 'all' ? 'All Users' : 'Specific Users'}
                        </span>
                      </div>
                      {email.recipientCount && (
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {email.recipientCount} recipients
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {email.addedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(email.dateAdded)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {email.dateSent ? formatDateTime(email.dateSent) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(email.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          icon={Eye}
                          onClick={() => onViewEmail(email.id)}
                          variant="ghost"
                          size="sm"
                          tooltip="View Email"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
            <Mail className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No bulk email data found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No bulk emails match your current filters
            </p>
          </div>
        )}

        {/* ADD NEW BULK EMAIL MODAL */}
        <FormModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({
              subject: '',
              sentTo: 'all',
              selectedUsers: [],
              description: '',
              attachment: null,
            });
          }}
          title="Send New Bulk Email"
          description="Compose and send email to users"
          maxWidth="max-w-3xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddEmail();
            }}
          >
            <FormSection>
              {/* Administrator Email */}
              <FormField>
                <FormLabel htmlFor="adminEmail">Administrator Email</FormLabel>
                <FormInput
                  id="adminEmail"
                  type="email"
                  value="admin@bellaroules.com"
                  disabled
                  className="bg-neutral-100 dark:bg-neutral-800"
                />
              </FormField>

              {/* Subject */}
              <FormField>
                <FormLabel htmlFor="subject" required>Subject</FormLabel>
                <FormInput
                  id="subject"
                  type="text"
                  placeholder="Enter email subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </FormField>

              {/* Send To */}
              <FormField>
                <FormLabel htmlFor="sentTo" required>Send To</FormLabel>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sentTo"
                      value="all"
                      checked={formData.sentTo === 'all'}
                      onChange={(e) => setFormData({ ...formData, sentTo: 'all', selectedUsers: [] })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">All Users</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sentTo"
                      value="specific"
                      checked={formData.sentTo === 'specific'}
                      onChange={(e) => setFormData({ ...formData, sentTo: 'specific' })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">Specific Users</span>
                  </label>
                </div>
              </FormField>

              {/* User Search (Visible only when Specific Users is selected) */}
              {formData.sentTo === 'specific' && (
                <FormField>
                  <FormLabel htmlFor="userSearch">Select Users</FormLabel>
                  
                  {/* Custom Multi-Select Dropdown with Checkboxes */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <span>
                        {formData.selectedUsers.length === 0
                          ? 'Select users...'
                          : `${formData.selectedUsers.length} user${formData.selectedUsers.length > 1 ? 's' : ''} selected`}
                      </span>
                      {showUserDropdown ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      )}
                    </button>

                    {/* Dropdown List */}
                    {showUserDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {mockUsers.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedUsers.includes(user.email)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    selectedUsers: [...formData.selectedUsers, user.email],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    selectedUsers: formData.selectedUsers.filter(
                                      (email) => email !== user.email
                                    ),
                                  });
                                }
                              }}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                            />
                            <span className="text-sm text-neutral-900 dark:text-white flex-1">
                              {user.name} <span className="text-neutral-500">({user.email})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Users Chips */}
                  {formData.selectedUsers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.selectedUsers.map((email) => {
                        const user = mockUsers.find((u) => u.email === email);
                        return (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md text-xs border border-primary-200 dark:border-primary-800"
                          >
                            <span>{user?.name || email}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  selectedUsers: formData.selectedUsers.filter(
                                    (e) => e !== email
                                  ),
                                });
                              }}
                              className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    Select multiple users from the dropdown. Only active users can receive emails.
                  </p>
                </FormField>
              )}

              {/* Description */}
              <FormField>
                <FormLabel htmlFor="description" required>Description</FormLabel>
                <FormTextarea
                  id="description"
                  placeholder="Enter email content"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Rich text editor will be used in production
                </p>
              </FormField>

              {/* Attachment */}
              <FormField>
                <FormLabel htmlFor="attachment">Attachment (Optional)</FormLabel>
                <FormFileInput
                  id="attachment"
                  value={formData.attachment}
                  onChange={handleFileUpload}
                  maxSize={5}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Maximum file size: 5 MB
                </p>
              </FormField>
            </FormSection>

            <FormFooter>
              <SecondaryButton
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    subject: '',
                    sentTo: 'all',
                    selectedUsers: [],
                    description: '',
                    attachment: null,
                  });
                }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit">
                Send Email
              </PrimaryButton>
            </FormFooter>
          </form>
        </FormModal>

        {/* VIEW BULK EMAIL MODAL */}
        <FormModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEmail(null);
          }}
          title="View Sent Email"
          description="Email details and delivery information"
          maxWidth="max-w-3xl"
        >
          {selectedEmail && (
            <div>
              <FormSection>
                {/* Administrator Email */}
                <FormField>
                  <FormLabel>Administrator Email</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {selectedEmail.adminEmail}
                  </div>
                </FormField>

                {/* Subject */}
                <FormField>
                  <FormLabel>Subject</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {selectedEmail.subject}
                  </div>
                </FormField>

                {/* Sent To */}
                <FormField>
                  <FormLabel>Sent To</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                      {selectedEmail.sentTo === 'all' ? (
                        <>
                          <Users className="w-4 h-4" />
                          <span>All Users</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          <span>Specific Users</span>
                        </>
                      )}
                    </div>
                    {selectedEmail.recipientCount && (
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {selectedEmail.recipientCount} recipients
                      </div>
                    )}
                  </div>
                </FormField>

                {/* Selected Users */}
                {selectedEmail.sentTo === 'specific' && selectedEmail.selectedUsers && (
                  <FormField>
                    <FormLabel>Selected Users</FormLabel>
                    <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.selectedUsers.map((email, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FormField>
                )}

                {/* Description */}
                <FormField>
                  <FormLabel>Description</FormLabel>
                  <div 
                    className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.description }}
                  />
                </FormField>

                {/* Attachment */}
                {selectedEmail.attachment && (
                  <FormField>
                    <FormLabel>Attachment</FormLabel>
                    <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <a
                        href={selectedEmail.attachment.url}
                        className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span>{selectedEmail.attachment.name}</span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          ({selectedEmail.attachment.size.toFixed(2)} MB)
                        </span>
                        <Download className="w-4 h-4 ml-auto" />
                      </a>
                    </div>
                  </FormField>
                )}

                {/* Status */}
                <FormField>
                  <FormLabel>Status</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    {getStatusBadge(selectedEmail.status)}
                  </div>
                </FormField>

                {/* Date Added */}
                <FormField>
                  <FormLabel>Date Added</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {formatDateTime(selectedEmail.dateAdded)}
                  </div>
                </FormField>

                {/* Date Sent */}
                <FormField>
                  <FormLabel>Date Sent</FormLabel>
                  <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {selectedEmail.dateSent ? formatDateTime(selectedEmail.dateSent) : '-'}
                  </div>
                </FormField>
              </FormSection>

              <FormFooter>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedEmail(null);
                  }}
                >
                  Close
                </SecondaryButton>
              </FormFooter>
            </div>
          )}
        </FormModal>
      </div>
    </div>
  );
}