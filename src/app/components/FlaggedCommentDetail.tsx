import { useState } from 'react';
import { ArrowLeft, MessageSquare, Flag, AlertCircle } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormTextarea } from './hb/common/Form';
import { toast } from 'sonner';

interface FlaggedCommentDetailProps {
  flagId: string;
  commentId: string;
  commentOwner: string;
  commentOwnerEmail: string;
  postId: string;
  postOwner: string;
  postOwnerEmail: string;
  commentText: string;
  flaggedBy: string;
  flaggedByEmail: string;
  flaggedDate: string;
  flagReason: string;
  flagStatus: 'Flagged' | 'Resolved';
  currentCommentStatus: 'active' | 'inactive';
  totalFlagsCount: number;
  onBack: () => void;
  onUpdate: (status: 'active' | 'inactive', adminNote: string) => void;
}

export default function FlaggedCommentDetail({
  flagId,
  commentId,
  commentOwner,
  commentOwnerEmail,
  postId,
  postOwner,
  postOwnerEmail,
  commentText,
  flaggedBy,
  flaggedByEmail,
  flaggedDate,
  flagReason,
  flagStatus,
  currentCommentStatus,
  totalFlagsCount,
  onBack,
  onUpdate,
}: FlaggedCommentDetailProps) {
  const [commentStatus, setCommentStatus] = useState<'active' | 'inactive'>(currentCommentStatus);
  const [adminNote, setAdminNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      toast.success('Comment status updated successfully for all flags.');
    } else {
      toast.success('Comment status updated successfully.');
    }
    
    onUpdate(commentStatus, adminNote);
  };

  const handleNavigateToUser = (email: string) => {
    toast.info(`Navigate to user: ${email}`);
  };

  const handleNavigateToPost = (postId: string) => {
    toast.info(`Navigate to post: ${postId}`);
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Flagged Comment Details"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Comments', href: '#', onClick: onBack },
            { label: 'Comment Details', current: true },
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
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">{flagId}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged By</p>
                  <button
                    onClick={() => handleNavigateToUser(flaggedByEmail)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {flaggedBy}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged Date</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(flaggedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Reason</p>
                  <p className="text-sm text-neutral-900 dark:text-white" title={flagReason}>
                    {flagReason.length > 250 ? `${flagReason.substring(0, 250)}...` : flagReason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    flagStatus === 'Flagged'
                      ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
                      : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                  }`}>
                    {flagStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Comment Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Comment ID</p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{commentId}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Comment Owner</p>
                  <button
                    onClick={() => handleNavigateToUser(commentOwnerEmail)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {commentOwner}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Post ID</p>
                  <button
                    onClick={() => handleNavigateToPost(postId)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {postId}
                  </button>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Comment Text</p>
                  <div className="mt-2 p-4 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{commentText}</p>
                  </div>
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
                {/* Update Comment Status */}
                <div>
                  <FormLabel htmlFor="commentStatus" required>
                    Comment Status
                  </FormLabel>
                  <FormSelect
                    id="commentStatus"
                    value={commentStatus}
                    onChange={(e) => setCommentStatus(e.target.value as 'active' | 'inactive')}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                  {commentStatus === 'inactive' && (
                    <p className="mt-1 text-xs text-warning-600 dark:text-warning-400">
                      ⚠️ Setting comment to Inactive will remove it from the application
                    </p>
                  )}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-end">
            <SecondaryButton onClick={onBack} size="md">
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleUpdate} size="md">
              Update
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
                    Update Comment Status
                  </h3>
                  {totalFlagsCount === 1 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Are you sure that you want to update the comment status?
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      The following comment is also flagged <strong>{totalFlagsCount - 1}</strong> more time{totalFlagsCount - 1 > 1 ? 's' : ''}. Do you also want to update the status of other flags?
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