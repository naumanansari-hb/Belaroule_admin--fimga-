import { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Flag, AlertCircle, Hash } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormTextarea } from './hb/common/Form';
import { toast } from 'sonner';

interface FlaggedPostDetailProps {
  flagId: string;
  postId: string;
  postOwner: string;
  postOwnerEmail: string;
  flaggedBy: string;
  flaggedByEmail: string;
  flaggedDate: string;
  flagReason: string;
  flagStatus: 'Flagged' | 'Resolved';
  currentPostStatus: 'active' | 'inactive';
  totalFlagsCount: number;
  caption?: string;
  hashtags?: string[];
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  onBack: () => void;
  onUpdate: (status: 'active' | 'inactive', adminNote: string) => void;
}

export default function FlaggedPostDetail({
  flagId,
  postId,
  postOwner,
  postOwnerEmail,
  flaggedBy,
  flaggedByEmail,
  flaggedDate,
  flagReason,
  flagStatus,
  currentPostStatus,
  totalFlagsCount,
  caption,
  hashtags = [],
  mediaType = 'image',
  mediaUrl,
  onBack,
  onUpdate,
}: FlaggedPostDetailProps) {
  const [postStatus, setPostStatus] = useState<'active' | 'inactive'>(currentPostStatus);
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
      toast.success('Post status updated successfully for all flags.');
    } else {
      toast.success('Post status updated successfully.');
    }
    
    onUpdate(postStatus, adminNote);
  };

  const handleNavigateToUser = (email: string) => {
    toast.info(`Navigate to user: ${email}`);
  };

  const handleNavigateToPost = (postId: string) => {
    toast.info(`Navigate to post detail: ${postId}`);
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Flagged Post Details"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Posts', href: '#', onClick: onBack },
            { label: 'Post Details', current: true },
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

          {/* Post Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Post Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Post ID</p>
                  <button
                    onClick={() => handleNavigateToPost(postId)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    {postId}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Post Owner</p>
                  <button
                    onClick={() => handleNavigateToUser(postOwnerEmail)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {postOwner}
                  </button>
                </div>
              </div>

              {/* Media Preview */}
              {mediaUrl && (
                <div className="mt-6">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Post {mediaType === 'video' ? 'Video' : 'Image'} Preview</p>
                  <div className="relative w-full max-w-md aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                    {mediaType === 'image' ? (
                      <img
                        src={mediaUrl}
                        alt="Post content"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Caption */}
              {caption && (
                <div className="mt-6">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Caption</p>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{caption}</p>
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {hashtags.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Hashtags</p>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium"
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                {/* Update Post Status */}
                <div>
                  <FormLabel htmlFor="postStatus" required>
                    Post Status
                  </FormLabel>
                  <FormSelect
                    id="postStatus"
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value as 'active' | 'inactive')}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                  {postStatus === 'inactive' && (
                    <p className="mt-1 text-xs text-warning-600 dark:text-warning-400">
                      ⚠️ Setting post to Inactive will remove it from the community feed and user profile
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
                    Update Post Status
                  </h3>
                  {totalFlagsCount === 1 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Are you sure that you want to update the post status?
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      The following post is also flagged <strong>{totalFlagsCount - 1}</strong> more time{totalFlagsCount - 1 > 1 ? 's' : ''}. Do you also want to update the status of other flags?
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