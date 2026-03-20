import { useState } from 'react';
import { ArrowLeft, Shirt, Flag, AlertCircle, ExternalLink } from 'lucide-react';
import { PageHeader, PrimaryButton, SecondaryButton } from './hb/listing';
import { FormLabel, FormSelect, FormTextarea } from './hb/common/Form';
import { toast } from 'sonner';

interface FlaggedWardrobeItem {
  flagId: string;
  wardrobeItemId: string;
  wardrobeItemName: string;
  itemOwner: string;
  flaggedBy: string;
  flaggedDate: string;
  status: 'flagged' | 'resolved';
  flagReason: string;
  itemImageUrl: string;
  itemCategory: string;
  wardrobeItemStatus: 'active' | 'inactive';
  totalFlagsCount: number;
}

interface FlaggedWardrobeItemDetailProps {
  item: FlaggedWardrobeItem;
  onBack: () => void;
  onUpdate: (status: 'active' | 'inactive', adminNote: string) => void;
}

export default function FlaggedWardrobeItemDetail({
  item,
  onBack,
  onUpdate,
}: FlaggedWardrobeItemDetailProps) {
  const [itemStatus, setItemStatus] = useState<'active' | 'inactive'>(item.wardrobeItemStatus);
  const [adminNote, setAdminNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleUpdate = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = (applyToAll = false) => {
    setShowConfirmModal(false);
    
    if (applyToAll) {
      toast.success('Wardrobe item status updated successfully for all flags.');
    } else {
      toast.success('Wardrobe item status updated successfully.');
    }
    
    onUpdate(itemStatus, adminNote);
  };

  const handleViewUser = (email: string) => {
    toast.info(`Navigate to User Detail: ${email}`);
    // In real app, this would navigate to the user detail page
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Flagged Wardrobe Item Details"
          breadcrumbs={[
            { label: 'Flagged Content Management', href: '#' },
            { label: 'Flagged Wardrobe Items', href: '#', onClick: onBack },
            { label: 'Item Details', current: true },
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
                  <p className="text-sm text-neutral-900 dark:text-white font-medium">{item.flagId}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged By</p>
                  <button
                    onClick={() => handleViewUser(item.flaggedBy)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {item.flaggedBy}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flagged Date</p>
                  <p className="text-sm text-neutral-900 dark:text-white">{formatDate(item.flaggedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Reason</p>
                  <p className="text-sm text-neutral-900 dark:text-white" title={item.flagReason}>
                    {item.flagReason.length > 250 ? `${item.flagReason.substring(0, 250)}...` : item.flagReason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Flag Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'flagged'
                      ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                      : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                  }`}>
                    {item.status === 'flagged' ? 'Flagged' : 'Resolved'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wardrobe Item Details Section */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Wardrobe Item Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Item Image */}
                <div className="lg:col-span-1">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Item Image</p>
                  <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <img 
                      src={item.itemImageUrl} 
                      alt={item.wardrobeItemName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Item Information */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Wardrobe Item Name</p>
                      <p className="text-sm text-neutral-900 dark:text-white font-medium">{item.wardrobeItemName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Item Owner</p>
                      <button
                        onClick={() => handleViewUser(item.itemOwner)}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {item.itemOwner}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Wardrobe Item ID</p>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{item.wardrobeItemId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Item Category</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium">
                        {item.itemCategory}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Current Item Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.wardrobeItemStatus === 'active'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {item.wardrobeItemStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total Flags</p>
                      <p className="text-sm text-neutral-900 dark:text-white font-semibold">{item.totalFlagsCount}</p>
                    </div>
                  </div>

                  {itemStatus === 'inactive' && (
                    <div className="bg-info-50 dark:bg-info-950 border border-info-200 dark:border-info-800 rounded-lg px-4 py-3">
                      <p className="text-xs text-info-800 dark:text-info-200">
                        <strong>Note:</strong> When marked as Inactive, this item will be removed from community visibility but will remain visible to the user in their wardrobe. Outfit generation and wardrobe functionality will not be impacted.
                      </p>
                    </div>
                  )}
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
                {/* Wardrobe Item Status */}
                <div>
                  <FormLabel htmlFor="itemStatus" required>
                    Wardrobe Item Status
                  </FormLabel>
                  <FormSelect
                    id="itemStatus"
                    value={itemStatus}
                    onChange={(e) => setItemStatus(e.target.value as 'active' | 'inactive')}
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
                    Update Wardrobe Item Status
                  </h3>
                  {item.totalFlagsCount === 1 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Are you sure that you want to update the wardrobe item status?
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This wardrobe item is also flagged <strong>{item.totalFlagsCount - 1}</strong> more time{item.totalFlagsCount - 1 > 1 ? 's' : ''}. Do you also want to update the status of other flags?
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
                {item.totalFlagsCount === 1 ? (
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