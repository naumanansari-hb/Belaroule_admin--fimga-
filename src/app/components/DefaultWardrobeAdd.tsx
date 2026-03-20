import { useState, useRef } from 'react';
import { ArrowLeft, Upload, CheckCircle2, XCircle, AlertCircle, Shirt, X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
} from './hb/common/Form';
import { toast } from 'sonner';

interface DefaultWardrobeAddProps {
  onBack: () => void;
  onSave: (items: any[]) => void;
}

interface ExtractedItem {
  id: string;
  imageUrl: string;
  category: string;
  ageGroup: string;
  bodyShape: string;
  itemName: string;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export default function DefaultWardrobeAdd({ onBack, onSave }: DefaultWardrobeAddProps) {
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [viewMode, setViewMode] = useState<'form' | 'table'>('form');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock AI processing
  const simulateAIProcessing = (file: File) => {
    setIsProcessing(true);
    toast.info('Image uploading in progress');

    // Simulate AI processing delay
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);

        // Mock extracted items based on upload mode
        if (uploadMode === 'bulk') {
          // Simulate bulk extraction
          const mockExtractedItems: ExtractedItem[] = [
            {
              id: 'temp-1',
              imageUrl: imageUrl,
              category: 'Tops',
              ageGroup: '',
              bodyShape: '',
              itemName: '',
              isActive: true,
              approvalStatus: 'pending',
            },
            {
              id: 'temp-2',
              imageUrl: imageUrl,
              category: 'Bottoms',
              ageGroup: '',
              bodyShape: '',
              itemName: '',
              isActive: true,
              approvalStatus: 'pending',
            },
          ];
          setExtractedItems(mockExtractedItems);
        } else {
          // Single item extraction
          const mockExtractedItem: ExtractedItem = {
            id: 'temp-1',
            imageUrl: imageUrl,
            category: 'Tops',
            ageGroup: '',
            bodyShape: '',
            itemName: '',
            isActive: true,
            approvalStatus: 'pending',
          };
          setExtractedItems([mockExtractedItem]);
        }

        setIsProcessing(false);
        setProcessingComplete(true);
        toast.success('Image processed successfully. Please review the details.');
      };
      reader.readAsDataURL(file);
    }, 2000);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG formats are supported');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    simulateAIProcessing(file);
  };

  // Handle item update
  const handleItemUpdate = (index: number, field: string, value: string | boolean) => {
    const updatedItems = [...extractedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setExtractedItems(updatedItems);
  };

  // Handle remove item
  const handleRemoveItem = (index: number) => {
    const updatedItems = extractedItems.filter((_, i) => i !== index);
    setExtractedItems(updatedItems);
  };

  // Handle save all items
  const handleSaveAll = () => {
    // Validate all items
    const invalidItems = extractedItems.filter(item => !item.category || !item.itemName);
    if (invalidItems.length > 0) {
      toast.error('All items must have Category and Item Name filled');
      return;
    }

    onSave(extractedItems);
    toast.success('Default wardrobe items created successfully');
  };

  // Handle reset
  const handleReset = () => {
    setUploadedImage(null);
    setProcessingComplete(false);
    setExtractedItems([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-6xl mx-auto">
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
                Add Default Wardrobe Item
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Upload wardrobe item images. AI will process and extract item details for your review.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Upload Section */}
        {!processingComplete && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Step 1: Upload Image
              </h2>
            </div>

            <div className="px-6 py-6">
              <FormSection>
                {/* File Upload */}
                <FormField>
                  <FormLabel htmlFor="imageUpload" required>Upload Image</FormLabel>
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="imageUpload"
                      accept="image/jpeg,image/png"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="w-full px-4 py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {isProcessing ? 'Processing...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          JPG or PNG • Max 5MB
                        </p>
                      </div>
                    </button>

                    {/* Processing indicator */}
                    {isProcessing && (
                      <div className="flex items-center justify-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                        <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Image uploading in progress</span>
                      </div>
                    )}
                  </div>
                </FormField>
              </FormSection>
            </div>
          </div>
        )}

        {/* Step 2: Review & Approval Section */}
        {processingComplete && extractedItems.length > 0 && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Step 2: Review & Configure Items ({extractedItems.length} item{extractedItems.length > 1 ? 's' : ''} detected)
                </h2>
                <SecondaryButton onClick={handleReset} size="sm">
                  Upload New Image
                </SecondaryButton>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Bulk Upload View Mode Selector */}
              <FormSection>
                <FormField>
                  <FormLabel htmlFor="viewMode">View Mode</FormLabel>
                  <FormSelect
                    id="viewMode"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as 'form' | 'table')}
                  >
                    <option value="form">Form View</option>
                    <option value="table">Bulk Upload Table</option>
                  </FormSelect>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {viewMode === 'form' 
                      ? 'Edit items individually with detailed forms' 
                      : 'View and manage all items in a table format'}
                  </p>
                </FormField>
              </FormSection>

              {/* Form View for Individual Items */}
              {viewMode === 'form' && extractedItems.map((item, index) => (
                <div key={item.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                      Item {index + 1}
                    </h3>
                    {extractedItems.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 rounded transition-colors"
                        title="Remove this item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Preview */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                        Item Image
                      </label>
                      <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        <img
                          src={item.imageUrl}
                          alt={`Item ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Form Fields */}
                    <FormSection>
                      <FormField>
                        <FormLabel htmlFor={`itemName-${index}`} required>Item Name</FormLabel>
                        <FormInput
                          id={`itemName-${index}`}
                          type="text"
                          value={item.itemName}
                          onChange={(e) => handleItemUpdate(index, 'itemName', e.target.value)}
                          placeholder="Enter item name"
                        />
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor={`category-${index}`} required>Category</FormLabel>
                        <FormSelect
                          id={`category-${index}`}
                          value={item.category}
                          onChange={(e) => handleItemUpdate(index, 'category', e.target.value)}
                        >
                          <option value="">Select Category</option>
                          <option value="Tops">Tops</option>
                          <option value="Bottoms">Bottoms</option>
                          <option value="Footwear">Footwear</option>
                        </FormSelect>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          AI-detected. You can correct if needed.
                        </p>
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor={`ageGroup-${index}`}>Age Group</FormLabel>
                        <FormSelect
                          id={`ageGroup-${index}`}
                          value={item.ageGroup}
                          onChange={(e) => handleItemUpdate(index, 'ageGroup', e.target.value)}
                        >
                          <option value="">Generic (All Ages)</option>
                          <option value="Infants">Infants (0-2 years)</option>
                          <option value="Toddlers">Toddlers (3-5 years)</option>
                          <option value="Children">Children (6-12 years)</option>
                          <option value="Teens">Teens (13-17 years)</option>
                          <option value="Young Adults">Young Adults (18-30 years)</option>
                          <option value="Adults">Adults (31+ years)</option>
                        </FormSelect>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          Optional. Select specific age group or leave as Generic.
                        </p>
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor={`bodyShape-${index}`}>Body Shape</FormLabel>
                        <FormSelect
                          id={`bodyShape-${index}`}
                          value={item.bodyShape}
                          onChange={(e) => handleItemUpdate(index, 'bodyShape', e.target.value)}
                        >
                          <option value="">Generic (All Body Shapes)</option>
                          <option value="Rectangle">Rectangle</option>
                          <option value="Pear">Pear</option>
                          <option value="Apple">Apple</option>
                          <option value="Hourglass">Hourglass</option>
                          <option value="Triangle">Triangle</option>
                        </FormSelect>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          Optional. Select specific body shape or leave as Generic.
                        </p>
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor={`status-${index}`}>Status</FormLabel>
                        <FormSelect
                          id={`status-${index}`}
                          value={item.isActive ? 'active' : 'inactive'}
                          onChange={(e) => handleItemUpdate(index, 'isActive', e.target.value === 'active')}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </FormSelect>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          Only Active items appear in user suggestions.
                        </p>
                      </FormField>
                    </FormSection>
                  </div>
                </div>
              ))}

              {/* Assignment Priority Info - Only show in Form View */}
              {viewMode === 'form' && (
                <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3">
                  <h4 className="text-xs font-medium text-primary-900 dark:text-primary-100 mb-2">
                    Assignment Priority Logic
                  </h4>
                  <ul className="space-y-1 text-xs text-primary-800 dark:text-primary-200">
                    <li>• <strong>Age Group + Body Shape:</strong> Highest priority</li>
                    <li>• <strong>Age Group + Generic Body Shape:</strong> Second priority</li>
                    <li>• <strong>Body Shape + Generic Age Group:</strong> Third priority</li>
                    <li>• <strong>Fully Generic:</strong> Fallback option</li>
                    <li className="mt-2">• Only <strong>Active</strong> items are used in suggestions</li>
                  </ul>
                </div>
              )}

              {/* Table View for Bulk Upload - Shows in the position of Assignment Priority Logic */}
              {viewMode === 'table' && (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Item No.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Item Image</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Age Group</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Body Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">AI Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Approval Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {extractedItems.map((item, index) => (
                          <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                            <td className="px-4 py-3">
                              <span className="text-sm text-neutral-900 dark:text-white font-medium">
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                                <img
                                  src={item.imageUrl}
                                  alt={`Item ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <FormSelect
                                value={item.category}
                                onChange={(e) => handleItemUpdate(index, 'category', e.target.value)}
                                className="text-sm"
                              >
                                <option value="">Select Category</option>
                                <option value="Tops">Tops</option>
                                <option value="Bottoms">Bottoms</option>
                                <option value="Footwear">Footwear</option>
                              </FormSelect>
                            </td>
                            <td className="px-4 py-3">
                              <FormSelect
                                value={item.ageGroup}
                                onChange={(e) => handleItemUpdate(index, 'ageGroup', e.target.value)}
                                className="text-sm"
                              >
                                <option value="">Generic</option>
                                <option value="Infants">Infants</option>
                                <option value="Toddlers">Toddlers</option>
                                <option value="Children">Children</option>
                                <option value="Teens">Teens</option>
                                <option value="Young Adults">Young Adults</option>
                                <option value="Adults">Adults</option>
                              </FormSelect>
                            </td>
                            <td className="px-4 py-3">
                              <FormSelect
                                value={item.bodyShape}
                                onChange={(e) => handleItemUpdate(index, 'bodyShape', e.target.value)}
                                className="text-sm"
                              >
                                <option value="">Generic</option>
                                <option value="Rectangle">Rectangle</option>
                                <option value="Pear">Pear</option>
                                <option value="Apple">Apple</option>
                                <option value="Hourglass">Hourglass</option>
                                <option value="Triangle">Triangle</option>
                              </FormSelect>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                                <CheckCircle2 className="w-3 h-3" />
                                Processed
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <FormSelect
                                value={item.approvalStatus}
                                onChange={(e) => handleItemUpdate(index, 'approvalStatus', e.target.value)}
                                className="text-sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </FormSelect>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <SecondaryButton onClick={onBack}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleSaveAll}>
                  Save All Items ({extractedItems.length})
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}

        {/* No valid items detected */}
        {processingComplete && extractedItems.length === 0 && (
          <div className="border border-error-200 dark:border-error-800 rounded-lg overflow-hidden">
            <div className="px-6 py-12 text-center">
              <XCircle className="w-12 h-12 text-error-600 dark:text-error-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                No Valid Items Detected
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                This image does not contain any supported wardrobe item. Please upload a different image.
              </p>
              <SecondaryButton onClick={handleReset}>
                Upload Another Image
              </SecondaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}