import { useState } from 'react';
import { ArrowLeft, Mail, X, ChevronDown, ChevronUp, User, Users } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormFileInput,
  FormCard,
} from './hb/common/Form';
import { toast } from 'sonner';

interface AddBulkEmailProps {
  onNavigate: (pageId: string) => void;
}

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
  { id: '11', name: 'Karen Martinez', email: 'karen@email.com', status: 'active' },
  { id: '12', name: 'Liam Anderson', email: 'liam@email.com', status: 'active' },
  { id: '13', name: 'Mia Thompson', email: 'mia@email.com', status: 'active' },
  { id: '14', name: 'Noah Garcia', email: 'noah@email.com', status: 'active' },
  { id: '15', name: 'Olivia Rodriguez', email: 'olivia@email.com', status: 'active' },
];

export default function AddBulkEmail({ onNavigate }: AddBulkEmailProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRecipientsPreview, setShowRecipientsPreview] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    subject: '',
    sentTo: 'all' as 'all' | 'specific',
    selectedUsers: [] as string[],
    description: '',
    attachment: null as File | null,
  });

  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('Attachment size must not exceed 5 MB');
      return;
    }
    setFormData({ ...formData, attachment: file });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Success - in production, this would make an API call
    toast.success('Bulk email queued successfully');
    
    // Navigate back to listing
    setTimeout(() => {
      onNavigate('bulk-emails');
    }, 1000);
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Send New Bulk Email"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Bulk Emails', onClick: () => onNavigate('bulk-emails') },
            { label: 'Send New', current: true },
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

        {/* FORM CARD */}
        <FormCard
          title="Compose Email"
          description="Fill in the details below to send bulk email to users"
          icon={Mail}
        >
          <form onSubmit={handleSubmit}>
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

              {/* Recipients Preview */}
              <FormField>
                <FormLabel>Recipients Preview</FormLabel>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  {/* Header with expand/collapse */}
                  <button
                    type="button"
                    onClick={() => setShowRecipientsPreview(!showRecipientsPreview)}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formData.sentTo === 'all' 
                          ? `All Registered Users (${mockUsers.length} users will receive this email)`
                          : formData.selectedUsers.length > 0
                          ? `${formData.selectedUsers.length} user${formData.selectedUsers.length > 1 ? 's' : ''} will receive this email`
                          : 'No users selected'
                        }
                      </span>
                    </div>
                    {showRecipientsPreview ? (
                      <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    )}
                  </button>

                  {/* User list */}
                  {showRecipientsPreview && (
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4">
                        {formData.sentTo === 'all' && mockUsers.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {mockUsers.map((user) => (
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
                            ))}
                          </div>
                        ) : formData.sentTo === 'specific' && formData.selectedUsers.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {formData.selectedUsers.map((email) => {
                              const user = mockUsers.find(u => u.email === email);
                              return (
                                <div
                                  key={email}
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
                                      {email}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {formData.sentTo === 'specific' 
                                ? 'Select users from the dropdown above to see who will receive this email'
                                : 'No users available'
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  This email will be sent to {formData.sentTo === 'all' ? 'all active users' : `${formData.selectedUsers.length} selected user${formData.selectedUsers.length !== 1 ? 's' : ''}`} when you click "Send Email"
                </p>
              </FormField>
            </FormSection>

            {/* Form Footer */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 mt-6 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton
                type="button"
                onClick={() => onNavigate('bulk-emails')}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit">
                Send Email
              </PrimaryButton>
            </div>
          </form>
        </FormCard>
      </div>
    </div>
  );
}