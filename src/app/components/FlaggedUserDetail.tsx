import { useState } from 'react';
import { ArrowLeft, User, Flag, AlertCircle } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormTextarea } from './hb/common/Form';
import { toast } from 'sonner';

interface FlaggedUserDetailProps {
  userId: string;
  userName: string;
  userEmail: string;
  flagReason: string;
  totalFlagsCount: number;
  currentUserStatus: 'active' | 'inactive';
  lastFlagDate: string;
  onBack: () => void;
  onUpdate: (status: 'active' | 'inactive', adminNote: string) => void;
  onNavigateToUser?: (userId: string) => void;
}

export default function FlaggedUserDetail({
  userId,
  userName,
  userEmail,
  flagReason,
  totalFlagsCount,
  currentUserStatus,
  lastFlagDate,
  onBack,
  onUpdate,
  onNavigateToUser,
}: FlaggedUserDetailProps) {
  const [userStatus, setUserStatus] = useState<'active' | 'inactive'>(currentUserStatus);
  const [adminNote, setAdminNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAllFlags, setShowAllFlags] = useState(false);

  // Mock flag history data
  const mockFlagHistory = [
    {
      id: 'FLG-001',
      flaggedBy: 'user_reporter_1',
      flaggedDate: '2024-01-15',
      reason: 'Spam Content',
      status: 'Resolved',
      adminNote: 'User warned, content removed',
    },
    {
      id: 'FLG-002',
      flaggedBy: 'user_reporter_2',
      flaggedDate: '2024-01-18',
      reason: 'Inappropriate Behavior',
      status: 'Under Review',
      adminNote: '',
    },
    {
      id: 'FLG-003',
      flaggedBy: 'System',
      flaggedDate: '2024-01-20',
      reason: 'Suspicious Activity',
      status: 'Flagged',
      adminNote: '',
    },
    {
      id: 'FLG-004',
      flaggedBy: 'user_reporter_3',
      flaggedDate: '2024-01-22',
      reason: 'Spam Content',
      status: 'Resolved',
      adminNote: 'Account temporarily suspended',
    },
    {
      id: 'FLG-005',
      flaggedBy: 'user_reporter_4',
      flaggedDate: '2024-01-25',
      reason: 'Harassment',
      status: 'Flagged',
      adminNote: '',
    },
  ];

  // Show only first 3 flags initially
  const displayedFlags = showAllFlags ? mockFlagHistory : mockFlagHistory.slice(0, 3);
  const hasMoreFlags = mockFlagHistory.length > 3;

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleUpdate = () => {
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = (applyToAll = false) => {
    setShowConfirmModal(false);
    
    if (applyToAll) {
      toast.success('User status updated successfully for all flags.');
    } else {
      toast.success('User status updated successfully.');
    }
    
    onUpdate(userStatus, adminNote);
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Flagged User Details"
          breadcrumbs={[
            { label: 'Content Moderation', href: '#' },
            { label: 'Flagged Users', href: '#', onClick: onBack },
            { label: 'User Details', current: true },
          ]}
        >
          <SecondaryButton onClick={onBack} size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </SecondaryButton>
        </PageHeader>

        {/* MAIN CONTENT */}
        <div className="space-y-6">
          {/* Flag Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-error-600 dark:text-error-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Flag Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag ID</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">FLG-{userId}-001</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged By</p>
                  <p className="text-sm text-neutral-900 dark:text-white">System / Multiple Users</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged Date</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(lastFlagDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Reason</p>
                  <p className="text-sm text-neutral-900 dark:text-white" title={flagReason}>
                    {flagReason.length > 250 ? `${flagReason.substring(0, 250)}...` : flagReason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total Flags Count</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-semibold">{totalFlagsCount}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Status</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 rounded-full text-xs font-medium">
                    Flagged
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  User Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">User ID</p>
                  <button
                    onClick={() => {
                      if (onNavigateToUser) {
                        onNavigateToUser(userId);
                        toast.success(`Navigating to User Detail page for ${userId}`);
                      } else {
                        toast.info('User detail navigation not configured');
                      }
                    }}
                    className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer text-left"
                  >
                    {userId}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">User Name</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{userName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">User Email</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">User Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    currentUserStatus === 'active'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {currentUserStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Admin Actions
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Update User Status */}
                <div>
                  <FormLabel htmlFor="userStatus" required>
                    Update User Status
                  </FormLabel>
                  <FormSelect
                    id="userStatus"
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value as 'active' | 'inactive')}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                </div>

                {/* Admin Note */}
                <div>
                  <FormLabel htmlFor="adminNote">Admin Note (Optional)</FormLabel>
                  <FormTextarea
                    id="adminNote"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter internal notes about this action..."
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Internal only - not visible to users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flag History Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                  <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                    Flag History
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Total: {mockFlagHistory.length} flags
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {displayedFlags.map((flag, index) => (
                  <div 
                    key={flag.id}
                    className={`pb-4 ${index !== displayedFlags.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-800' : ''}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag ID</p>
                        <p className="text-sm text-neutral-900 dark:text-white font-medium">{flag.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged By</p>
                        <p className="text-sm text-neutral-900 dark:text-white">{flag.flaggedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged Date</p>
                        <p className="text-sm text-neutral-900 dark:text-white">{formatDate(flag.flaggedDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Reason</p>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 rounded text-xs font-medium">
                          <Flag className="w-3 h-3" />
                          {flag.reason}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          flag.status === 'Resolved'
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                            : flag.status === 'Under Review'
                            ? 'bg-info-50 dark:bg-info-950 text-info-700 dark:text-info-300'
                            : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
                        }`}>
                          {flag.status}
                        </span>
                      </div>
                      {flag.adminNote && (
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Admin Note</p>
                          <p className="text-sm text-neutral-900 dark:text-white">{flag.adminNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              {hasMoreFlags && (
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => setShowAllFlags(!showAllFlags)}
                    className="w-full text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    {showAllFlags ? 'View Less' : `View More (${mockFlagHistory.length - 3} more flags)`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-end">
            <SecondaryButton onClick={onBack} size="md">
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleUpdate} size="md">
              Update Status
            </PrimaryButton>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                    Update Flag Status
                  </h3>
                  {totalFlagsCount === 1 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Are you sure that you want to update the flag status?
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      The following user is also flagged <strong>{totalFlagsCount - 1}</strong> more time{totalFlagsCount - 1 > 1 ? 's' : ''}. Do you also want to update the status of other flags?
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <SecondaryButton
                  onClick={() => setShowConfirmModal(false)}
                  size="sm"
                >
                  Discard
                </SecondaryButton>
                {totalFlagsCount === 1 ? (
                  <PrimaryButton
                    onClick={() => handleConfirmUpdate(false)}
                    size="sm"
                  >
                    Update
                  </PrimaryButton>
                ) : (
                  <>
                    <SecondaryButton
                      onClick={() => handleConfirmUpdate(false)}
                      size="sm"
                    >
                      Apply Here
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={() => handleConfirmUpdate(true)}
                      size="sm"
                    >
                      Apply All
                    </PrimaryButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}