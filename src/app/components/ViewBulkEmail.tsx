import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Users, User, Download, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormCard,
} from './hb/common/Form';
import { toast } from 'sonner';

interface ViewBulkEmailProps {
  onNavigate: (pageId: string) => void;
  emailId?: string;
}

// Bulk Email interface (should match the one in BulkEmails.tsx)
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

// Mock Bulk Emails (this should ideally come from a shared data source or context)
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
    description: 'Welcome to our New Collection!\n\nWe are excited to present our latest fashion collection for 2024. Discover trending styles, exclusive designs, and must-have pieces for the season.\n\nVisit our app today to explore the collection!',
    attachment: {
      name: 'collection-catalog.pdf',
      size: 2.5,
      url: '#',
    },
  },
  {
    id: 'BE002',
    subject: 'Important: System Maintenance Scheduled',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-14T09:00:00',
    dateSent: '2024-01-14T09:30:00',
    status: 'sent',
    adminEmail: 'admin@bellaroules.com',
    description: 'Dear Users,\n\nWe will be performing scheduled system maintenance on January 20th from 2 AM to 6 AM (EST). During this time, the app will be temporarily unavailable.\n\nWe apologize for any inconvenience and appreciate your understanding.',
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
    description: 'Exclusive Offer!\n\nAs a valued premium member, enjoy 30% off on all items in your wardrobe for the next 48 hours. This is our way of saying thank you for being part of the BellaRoules community.\n\nShop now and save big!',
    selectedUsers: ['alice@email.com', 'bob@email.com', 'carol@email.com'],
  },
  {
    id: 'BE004',
    subject: 'Weekly Style Tips - January Edition',
    sentTo: 'all',
    recipientCount: 1250,
    addedBy: 'John Doe',
    dateAdded: '2024-01-12T11:00:00',
    dateSent: null,
    status: 'in-progress',
    adminEmail: 'admin@bellaroules.com',
    description: 'This Week\'s Fashion Tips:\n\n1. Layer your outfits for a chic winter look\n2. Mix and match textures for visual interest\n3. Don\'t be afraid to experiment with bold colors\n\nStay stylish!',
    attachment: {
      name: 'style-guide.pdf',
      size: 1.8,
      url: '#',
    },
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
    description: 'Action Required:\n\nWe have detected that your account security settings need to be updated. Please log in to your account and update your password to continue using our services.\n\nIf you need assistance, please contact our support team.',
    selectedUsers: ['user1@email.com', 'user2@email.com'],
  },
];

// Mock users database (represents all registered users in the system)
const mockAllUsers = [
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
  { id: '11', name: 'Karen Martinez', email: 'karen@email.com', status: 'active' },
  { id: '12', name: 'Liam Anderson', email: 'liam@email.com', status: 'active' },
  { id: '13', name: 'Mia Thompson', email: 'mia@email.com', status: 'active' },
  { id: '14', name: 'Noah Garcia', email: 'noah@email.com', status: 'active' },
  { id: '15', name: 'Olivia Rodriguez', email: 'olivia@email.com', status: 'active' },
];

export default function ViewBulkEmail({ onNavigate, emailId }: ViewBulkEmailProps) {
  const [email, setEmail] = useState<BulkEmail | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    // Find the email by ID
    if (emailId) {
      const foundEmail = mockBulkEmails.find(e => e.id === emailId);
      if (foundEmail) {
        setEmail(foundEmail);
      } else {
        toast.error('Email not found');
        onNavigate('bulk-emails');
      }
    } else {
      toast.error('No email ID provided');
      onNavigate('bulk-emails');
    }
  }, [emailId, onNavigate]);

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
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {statusLabel[status as keyof typeof statusLabel]}
      </span>
    );
  };

  // Format file size
  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(2)} MB`;
  };

  if (!email) {
    return (
      <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
        <div className="text-center py-12">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading email details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Email Details"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Bulk Emails', onClick: () => onNavigate('bulk-emails') },
            { label: email.id, current: true },
          ]}
        >
          <SecondaryButton
            onClick={() => onNavigate('bulk-emails')}
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </SecondaryButton>
        </PageHeader>

        {/* DETAILS CARD */}
        <FormCard
          title="Email Details and Delivery Information"
          description={`Viewing details for email ${email.id}`}
          icon={Mail}
        >
          <FormSection>
            {/* Administrator Email */}
            <FormField>
              <FormLabel>Administrator Email</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {email.adminEmail}
              </div>
            </FormField>

            {/* Subject */}
            <FormField>
              <FormLabel>Subject</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {email.subject}
              </div>
            </FormField>

            {/* Sent To */}
            <FormField>
              <FormLabel>Sent To</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                  {email.sentTo === 'all' ? (
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
                {email.recipientCount && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {email.recipientCount} recipients
                  </div>
                )}
              </div>
            </FormField>

            {/* Selected Users */}
            {email.sentTo === 'specific' && email.selectedUsers && email.selectedUsers.length > 0 && (
              <FormField>
                <FormLabel>Selected Users</FormLabel>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {email.selectedUsers.map((userEmail, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs"
                      >
                        {userEmail}
                      </span>
                    ))}
                  </div>
                </div>
              </FormField>
            )}

            {/* Recipients List - Show all users for "All Users" */}
            <FormField>
              <FormLabel>Recipients List</FormLabel>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {/* Header with expand/collapse */}
                <button
                  type="button"
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {email.sentTo === 'all' 
                        ? `All Registered Users (${mockAllUsers.length})`
                        : `Selected Users (${email.selectedUsers?.length || 0})`
                      }
                    </span>
                  </div>
                  {showAllUsers ? (
                    <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  )}
                </button>

                {/* User list */}
                {showAllUsers && (
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {email.sentTo === 'all' ? (
                          // Show all users
                          mockAllUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          // Show specific users
                          email.selectedUsers?.map((userEmail, index) => {
                            const user = mockAllUsers.find(u => u.email === userEmail);
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                    {user?.name || 'Unknown User'}
                                  </div>
                                  <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                    {userEmail}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormField>

            {/* Description */}
            <FormField>
              <FormLabel>Description</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
                {email.description}
              </div>
            </FormField>

            {/* Attachment */}
            {email.attachment && (
              <FormField>
                <FormLabel>Attachment</FormLabel>
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {email.attachment.name}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        ({formatFileSize(email.attachment.size)})
                      </span>
                    </div>
                    <a
                      href={email.attachment.url}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              </FormField>
            )}

            {/* Status */}
            <FormField>
              <FormLabel>Status</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                {getStatusBadge(email.status)}
              </div>
            </FormField>

            {/* Date Added */}
            <FormField>
              <FormLabel>Date Added</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {formatDateTime(email.dateAdded)}
              </div>
            </FormField>

            {/* Date Sent */}
            <FormField>
              <FormLabel>Date Sent</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {email.dateSent ? formatDateTime(email.dateSent) : '-'}
              </div>
            </FormField>

            {/* Added By */}
            <FormField>
              <FormLabel>Added By</FormLabel>
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                {email.addedBy}
              </div>
            </FormField>
          </FormSection>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 mt-6 border-t border-neutral-200 dark:border-neutral-800">
            <SecondaryButton
              onClick={() => onNavigate('bulk-emails')}
            >
              Close
            </SecondaryButton>
          </div>
        </FormCard>
      </div>
    </div>
  );
}