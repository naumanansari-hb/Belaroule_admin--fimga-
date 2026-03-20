import { useState } from 'react';
import { ArrowLeft, Mail, Flag, AlertCircle, User, ExternalLink, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormTextarea } from './hb/common/Form';
import { toast } from 'sonner';

interface WardrobeItem {
  wardrobeItemId: string;
  wardrobeItemName: string;
  itemImageUrl: string;
  itemCategory: string;
  itemOwner: string;
}

interface FlaggedMessageDetailProps {
  flagId: string;
  senderEmail: string;
  receiverEmail: string;
  flaggedBy: string;
  flaggedDate: string;
  flagStatus: 'flagged' | 'resolved';
  messageId: string;
  messageType: 'text' | 'image' | 'video' | 'wardrobe';
  messageContent: string;
  mediaUrl?: string;
  wardrobeItem?: WardrobeItem;
  sentTimestamp: string;
  flagReason: string;
  senderId: string;
  senderName: string;
  currentSenderStatus: 'active' | 'inactive';
  onBack: () => void;
  onUpdate: (status: 'active' | 'inactive', adminNote: string) => void;
}

export default function FlaggedMessageDetail({
  flagId,
  senderEmail,
  receiverEmail,
  flaggedBy,
  flaggedDate,
  flagStatus,
  messageId,
  messageType,
  messageContent,
  mediaUrl,
  wardrobeItem,
  sentTimestamp,
  flagReason,
  senderId,
  senderName,
  currentSenderStatus,
  onBack,
  onUpdate,
}: FlaggedMessageDetailProps) {
  const [userStatus, setUserStatus] = useState<'active' | 'inactive'>(currentSenderStatus);
  const [adminNote, setAdminNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Format datetime
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleUpdate = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = () => {
    setShowConfirmModal(false);
    toast.success('User status updated successfully.');
    onUpdate(userStatus, adminNote);
  };

  const handleViewUserDetail = (email: string) => {
    toast.info(`Navigate to User Detail: ${email}`);
    // In real app, this would navigate to the user detail page
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Flagged Message Details"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Messages', href: '#', onClick: onBack },
            { label: 'Message Details', current: true },
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag ID</p>
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">{flagId}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged By</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{flaggedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged Date</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(flaggedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Reason</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 rounded text-xs font-medium">
                    <Flag className="w-3 h-3" />
                    {flagReason}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    flagStatus === 'flagged'
                      ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                      : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                  }`}>
                    {flagStatus === 'flagged' ? 'Flagged' : 'Resolved'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Message Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Message ID</p>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{messageId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sent Timestamp</p>
                    <p className="text-sm text-neutral-900 dark:text-white">{formatDateTime(sentTimestamp)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Message Type</p>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium">
                      {messageType === 'text' && <><FileText className="w-3 h-3" /> Text (Including Emojis)</>}
                      {messageType === 'image' && <><ImageIcon className="w-3 h-3" /> Images (JPG, PNG)</>}
                      {messageType === 'video' && <><Video className="w-3 h-3" /> Video (MP4/MP3)</>}
                      {messageType === 'wardrobe' && <><Mail className="w-3 h-3" /> Wardrobe Item</>}
                    </span>
                  </div>
                </div>

                {/* Message Content - Dynamic based on type */}
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Message Content</p>
                  
                  {/* Text Message */}
                  {messageType === 'text' && (
                    <div className="mt-2 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{messageContent}</p>
                    </div>
                  )}

                  {/* Image Message */}
                  {messageType === 'image' && mediaUrl && (
                    <div className="space-y-2">
                      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 max-w-2xl">
                        <img 
                          src={mediaUrl} 
                          alt="Message image" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {messageContent && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Caption:</p>
                          <p className="text-sm text-neutral-900 dark:text-white">{messageContent}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Message */}
                  {messageType === 'video' && mediaUrl && (
                    <div className="space-y-2">
                      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 max-w-2xl">
                        <video 
                          src={mediaUrl} 
                          controls 
                          className="w-full h-full object-contain"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      {messageContent && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Caption:</p>
                          <p className="text-sm text-neutral-900 dark:text-white">{messageContent}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wardrobe Item Message */}
                  {messageType === 'wardrobe' && wardrobeItem && (
                    <div className="space-y-3">
                      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                          {/* Wardrobe Item Image */}
                          <div className="md:col-span-1">
                            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                              <img 
                                src={wardrobeItem.itemImageUrl} 
                                alt={wardrobeItem.wardrobeItemName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Wardrobe Item Details */}
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Wardrobe Item Name</p>
                              <p className="text-sm text-neutral-900 dark:text-white font-medium">{wardrobeItem.wardrobeItemName}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Wardrobe Item ID</p>
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{wardrobeItem.wardrobeItemId}</p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Item Category</p>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium">
                                  {wardrobeItem.itemCategory}
                                </span>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Item Owner</p>
                                <button
                                  onClick={() => handleViewUserDetail(wardrobeItem.itemOwner)}
                                  className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                  {wardrobeItem.itemOwner}
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {messageContent && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Message:</p>
                          <p className="text-sm text-neutral-900 dark:text-white">{messageContent}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sender Email</p>
                    <button
                      onClick={() => handleViewUserDetail(senderEmail)}
                      className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {senderEmail}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Receiver Email</p>
                    <button
                      onClick={() => handleViewUserDetail(receiverEmail)}
                      className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {receiverEmail}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sender Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Sender Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sender ID</p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{senderId}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sender Name</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{senderName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sender Email</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{senderEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sender Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    currentSenderStatus === 'active'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {currentSenderStatus === 'active' ? 'Active' : 'Inactive'}
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
                    Update User Status
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Are you sure that you want to update the user status?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <SecondaryButton
                  onClick={() => setShowConfirmModal(false)}
                  size="sm"
                >
                  Discard
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleConfirmUpdate}
                  size="sm"
                >
                  Update
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}