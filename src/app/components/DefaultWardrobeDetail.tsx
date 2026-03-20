import { useState } from 'react';
import { ArrowLeft, Shirt, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormSelect,
} from './hb/common/Form';
import { toast } from 'sonner';

interface DefaultWardrobeItem {
  id: string;
  imageUrl: string;
  category: string;
  ageGroup?: string;
  bodyShape?: string;
  aiStatus: 'processed' | 'failed' | 'pending';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdDate: string;
}

interface DefaultWardrobeDetailProps {
  item: DefaultWardrobeItem;
  onBack: () => void;
  onSave: (item: DefaultWardrobeItem) => void;
}

export default function DefaultWardrobeDetail({ item, onBack, onSave }: DefaultWardrobeDetailProps) {
  const [formData, setFormData] = useState({
    category: item.category,
    ageGroup: item.ageGroup || '',
    bodyShape: item.bodyShape || '',
    approvalStatus: item.approvalStatus,
    isActive: item.isActive,
  });

  // Format date helper (DD/MM/YYYY as per spec)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle save
  const handleSave = () => {
    // Category is mandatory
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    onSave({
      ...item,
      category: formData.category,
      ageGroup: formData.ageGroup || undefined,
      bodyShape: formData.bodyShape || undefined,
      approvalStatus: formData.approvalStatus,
      isActive: formData.isActive,
    });
  };

  // Handle approve
  const handleApprove = () => {
    if (!formData.category) {
      toast.error('Category is required before approval');
      return;
    }

    onSave({
      ...item,
      category: formData.category,
      ageGroup: formData.ageGroup || undefined,
      bodyShape: formData.bodyShape || undefined,
      approvalStatus: 'approved',
      isActive: true,
    });
  };

  // Handle reject
  const handleReject = () => {
    onSave({
      ...item,
      category: formData.category,
      ageGroup: formData.ageGroup || undefined,
      bodyShape: formData.bodyShape || undefined,
      approvalStatus: 'rejected',
      isActive: false,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    onBack();
  };

  // Get AI status display
  const getAIStatusDisplay = () => {
    switch (item.aiStatus) {
      case 'processed':
        return { icon: CheckCircle2, color: 'text-success-600 dark:text-success-400', label: 'AI Processing Complete' };
      case 'failed':
        return { icon: XCircle, color: 'text-error-600 dark:text-error-400', label: 'AI Processing Failed' };
      case 'pending':
        return { icon: AlertCircle, color: 'text-warning-600 dark:text-warning-400', label: 'AI Processing Pending' };
      default:
        return { icon: AlertCircle, color: 'text-neutral-600 dark:text-neutral-400', label: 'Unknown Status' };
    }
  };

  const aiStatusDisplay = getAIStatusDisplay();
  const AIStatusIcon = aiStatusDisplay.icon;

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Default Wardrobe List
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Shirt className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Default Wardrobe Item Details
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Review AI-extracted data and manage wardrobe item settings. Item ID and Created Date are system-generated and cannot be modified.
              </p>
            </div>
          </div>
        </div>

        {/* Default Wardrobe Detail Card */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Read-only Section */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              View Section (Read-only)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Item ID
                </label>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {item.id}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Created Date
                </label>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {formatDate(item.createdDate)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  AI Status
                </label>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm">
                  <div className={`flex items-center gap-2 ${aiStatusDisplay.color}`}>
                    <AIStatusIcon className="w-4 h-4" />
                    <span>{aiStatusDisplay.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Section */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              Editable Section
            </h2>
            
            {/* Image Preview */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Uploaded Image
              </label>
              <div className="max-w-xs">
                <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <img
                    src={item.imageUrl}
                    alt="Wardrobe item"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <FormSection>
              <FormField>
                <FormLabel htmlFor="category" required>
                  Category
                </FormLabel>
                <FormSelect
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled
                >
                  <option value="">Select Category</option>
                  <option value="Headwear">Headwear</option>
                  <option value="Top">Top</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Bottom">Bottom</option>
                  <option value="Footwear">Footwear</option>
                </FormSelect>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Mandatory. AI-detected category can be corrected.
                </p>
              </FormField>

              <FormField>
                <FormLabel htmlFor="ageGroup">
                  Age Group
                </FormLabel>
                <FormSelect
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                >
                  <option value="">Select Age Group (Optional)</option>
                  <option value="Infants">Infants (0-2 years)</option>
                  <option value="Toddlers">Toddlers (3-5 years)</option>
                  <option value="Children">Children (6-12 years)</option>
                  <option value="Teens">Teens (13-17 years)</option>
                  <option value="Young Adults">Young Adults (18-30 years)</option>
                  <option value="Adults">Adults (31+ years)</option>
                </FormSelect>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Optional. Assign age group for targeted recommendations.
                </p>
              </FormField>

              <FormField>
                <FormLabel htmlFor="bodyShape">
                  Body Shape
                </FormLabel>
                <FormSelect
                  id="bodyShape"
                  value={formData.bodyShape}
                  onChange={(e) => setFormData({ ...formData, bodyShape: e.target.value })}
                >
                  <option value="">Select Body Shape (Optional)</option>
                  <option value="Triangle">Triangle</option>
                  <option value="Rectangle">Rectangle</option>
                  <option value="Circle">Circle</option>
                  <option value="Pear">Pear</option>
                  <option value="Inverted Triangle">Inverted Triangle</option>
                  <option value="Hour Glass">Hour Glass</option>
                </FormSelect>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Optional. Assign body shape for personalized suggestions.
                </p>
              </FormField>

              <FormField>
                <FormLabel htmlFor="approvalStatus">
                  Approval Status
                </FormLabel>
                <FormSelect
                  id="approvalStatus"
                  value={formData.approvalStatus}
                  onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value as any })}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </FormSelect>
              </FormField>

              <FormField>
                <FormLabel htmlFor="isActive">
                  Active Status
                </FormLabel>
                <FormSelect
                  id="isActive"
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active (Used at runtime)</option>
                  <option value="false">Inactive (Not used)</option>
                </FormSelect>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Only active items are suggested to users.
                </p>
              </FormField>
            </FormSection>
          </div>

          {/* Action Buttons */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <div className="flex items-center justify-end gap-3">
              <SecondaryButton
                onClick={handleCancel}
                size="sm"
              >
                Cancel
              </SecondaryButton>
              {item.approvalStatus === 'pending' && (
                <>
                  <SecondaryButton
                    onClick={handleReject}
                    size="sm"
                  >
                    Reject
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleApprove}
                    size="sm"
                  >
                    Approve
                  </PrimaryButton>
                </>
              )}
              {item.approvalStatus !== 'pending' && (
                <PrimaryButton
                  onClick={handleSave}
                  size="sm"
                >
                  Save
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Review Guidelines
          </h3>
          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <li>• <strong>Category is mandatory</strong> - AI will auto-detect, but you can correct if needed</li>
            <li>• Age Group and Body Shape are optional but improve recommendation accuracy</li>
            <li>• Only <strong>Approved</strong> items are used as default wardrobe suggestions</li>
            <li>• Only <strong>Active</strong> items appear in runtime user suggestions</li>
            <li>• Rejected items remain in the system but are not used</li>
            <li>• If AI processing failed, you can manually enter correct data and approve</li>
          </ul>
        </div>
      </div>
    </div>
  );
}