import { useState } from 'react';
import { PageHeader } from './hb/listing';
import { SecondaryButton, PrimaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
} from './hb/common/Form';
import { Trash2, Plus, Info } from 'lucide-react';
import { toast } from 'sonner';

export interface BccPackage {
  id: string;
  name: string;
  tagline: string;
  description: string[]; // Bullet list input
  productIdentifier: string;
  price: number;
  currency: string;
  coinsCount: number;
  actionButtonLabel: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  createdDate: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

interface BccPackageDetailProps {
  packageData: BccPackage;
  allPackages: BccPackage[];
  isCreating: boolean;
  onBack: () => void;
  onSave: (pkg: BccPackage) => void;
}

export default function BccPackageDetail({
  packageData,
  allPackages,
  isCreating,
  onBack,
  onSave,
}: BccPackageDetailProps) {
  const [formData, setFormData] = useState({
    name: packageData.name || '',
    tagline: packageData.tagline || '',
    description: packageData.description && packageData.description.length > 0 
      ? [...packageData.description] 
      : [''],
    productIdentifier: packageData.productIdentifier || '',
    price: packageData.price,
    currency: packageData.currency || 'USD',
    coinsCount: packageData.coinsCount,
    actionButtonLabel: packageData.actionButtonLabel || 'Purchase',
    status: packageData.status || 'active',
    displayOrder: packageData.displayOrder,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.includes(':')) {
      const [datePart, timePart] = dateString.split(' ');
      const date = new Date(datePart);
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${formattedDate} ${timePart}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...formData.description];
    newBullets[index] = value;
    setFormData({ ...formData, description: newBullets });
    if (errors.description) {
      setErrors({ ...errors, description: '' });
    }
  };

  const addBulletPoint = () => {
    if (formData.description.length >= 5) {
      toast.error('Maximum 5 description bullet points allowed.');
      return;
    }
    setFormData({ ...formData, description: [...formData.description, ''] });
  };

  const removeBulletPoint = (index: number) => {
    if (formData.description.length <= 1) {
      toast.error('Minimum 1 description bullet point is required.');
      return;
    }
    const newBullets = formData.description.filter((_, i) => i !== index);
    setFormData({ ...formData, description: newBullets });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Package name/title is required.';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Title cannot exceed 50 characters.';
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required.';
    } else if (formData.tagline.trim().length > 50) {
      newErrors.tagline = 'Tagline cannot exceed 50 characters.';
    }

    const emptyBullets = formData.description.some(bullet => !bullet.trim());
    if (emptyBullets) {
      newErrors.description = 'All description bullet points must have text.';
    }

    if (!formData.productIdentifier.trim()) {
      newErrors.productIdentifier = 'Product identifier is required.';
    } else if (/\s/.test(formData.productIdentifier)) {
      newErrors.productIdentifier = 'Product identifier cannot contain spaces.';
    } else {
      const duplicate = allPackages.some(
        pkg => pkg.id !== packageData.id && pkg.productIdentifier.toLowerCase() === formData.productIdentifier.toLowerCase()
      );
      if (duplicate) {
        newErrors.productIdentifier = 'This Product Identifier is already in use by another package.';
      }
    }

    if (formData.price === undefined || formData.price < 0 || isNaN(formData.price)) {
      newErrors.price = 'Please enter a valid non-negative price.';
    }

    if (!formData.coinsCount || formData.coinsCount <= 0 || isNaN(formData.coinsCount)) {
      newErrors.coinsCount = 'BCC Coins count must be a positive integer.';
    }

    if (!formData.actionButtonLabel.trim()) {
      newErrors.actionButtonLabel = 'Action button label is required.';
    } else if (formData.actionButtonLabel.trim().length > 15) {
      newErrors.actionButtonLabel = 'Action button label cannot exceed 15 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors.');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5); // HH:MM

    onSave({
      ...packageData,
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      description: formData.description.map(b => b.trim()),
      productIdentifier: formData.productIdentifier.trim(),
      price: formData.price,
      currency: formData.currency,
      coinsCount: formData.coinsCount,
      actionButtonLabel: formData.actionButtonLabel.trim(),
      status: formData.status as 'active' | 'inactive',
      lastModifiedDate: `${dateStr} ${timeStr}`,
      lastModifiedBy: 'Super Admin',
    });
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        
        {/* Page Header (using reusable PageHeader matching reference) */}
        <PageHeader
          title={isCreating ? 'Add BCC Package' : 'Edit BCC Package'}
          subtitle="Configure package details, pricing reference, and status."
          breadcrumbs={[
            { label: 'BCA & BCC Management', href: '#' },
            { label: 'BCC Packages', onClick: onBack },
            { label: isCreating ? 'Add Package' : 'Edit Package', current: true },
          ]}
        />

        {/* Single Form Card Container */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950 mb-6 shadow-sm">
          
          {/* View Section (Read-only) - only visible when editing */}
          {!isCreating && (
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
                View Section (Read-only)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Package ID input (disabled) */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Package ID
                  </label>
                  <input
                    type="text"
                    value={packageData.id}
                    disabled
                    className="h-10 w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white cursor-not-allowed opacity-70"
                  />
                </div>
                {/* Created Date input (disabled) */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Created Date
                  </label>
                  <input
                    type="text"
                    value={formatDateTime(packageData.createdDate)}
                    disabled
                    className="h-10 w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white cursor-not-allowed opacity-70"
                  />
                </div>
                {/* Last Modified Date input (disabled) */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Last Modified Date
                  </label>
                  <input
                    type="text"
                    value={formatDateTime(packageData.lastModifiedDate)}
                    disabled
                    className="h-10 w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Editable Section */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              Editable Section
            </h2>
            
            <FormSection>
              
              {/* First row: Title and Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField>
                  <FormLabel htmlFor="name" required>
                    Title
                  </FormLabel>
                  <FormInput
                    id="name"
                    type="text"
                    placeholder="e.g. Warm Up"
                    value={formData.name}
                    maxLength={50}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={errors.name ? 'border-error-500' : ''}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.name}</p>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="tagline" required>
                    Tagline
                  </FormLabel>
                  <FormInput
                    id="tagline"
                    type="text"
                    placeholder="Short description under title (e.g. Entry level pack)"
                    value={formData.tagline}
                    maxLength={50}
                    onChange={(e) => {
                      setFormData({ ...formData, tagline: e.target.value });
                      if (errors.tagline) setErrors({ ...errors, tagline: '' });
                    }}
                    className={errors.tagline ? 'border-error-500' : ''}
                  />
                  {errors.tagline && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.tagline}</p>
                  )}
                </FormField>
              </div>

              {/* Second row: Price and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField>
                  <FormLabel htmlFor="price" required>
                    Price
                  </FormLabel>
                  <FormInput
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 6.99"
                    value={formData.price || ''}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setFormData({ ...formData, price: isNaN(val) ? 0 : val });
                      if (errors.price) setErrors({ ...errors, price: '' });
                    }}
                    className={errors.price ? 'border-error-500' : ''}
                    min="0"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.price}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    For internal analytics only. Actual price charged to users is always sourced from App Store / Play Store.
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="currency" required>
                    Currency
                  </FormLabel>
                  <FormSelect
                    id="currency"
                    value={formData.currency}
                    disabled
                    onWheel={(e) => e.currentTarget.blur()}
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed opacity-70"
                  >
                    <option value="USD">USD - US Dollar</option>
                  </FormSelect>
                </FormField>
              </div>

              {/* Third row: BCC Coins and Action Button Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField>
                  <FormLabel htmlFor="coinsCount" required>
                    Coins Count
                  </FormLabel>
                  <FormInput
                    id="coinsCount"
                    type="number"
                    placeholder="e.g. 300"
                    value={formData.coinsCount || ''}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFormData({ ...formData, coinsCount: isNaN(val) ? 0 : val });
                      if (errors.coinsCount) setErrors({ ...errors, coinsCount: '' });
                    }}
                    className={errors.coinsCount ? 'border-error-500' : ''}
                    min="1"
                  />
                  {errors.coinsCount && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.coinsCount}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Positive integer. Must be unique.
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="actionButtonLabel" required>
                    Display Order
                  </FormLabel>
                  <FormInput
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed opacity-70"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Controls order shown in mobile app.
                  </p>
                </FormField>
              </div>

              {/* Fourth row: Status and Action Button Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField>
                  <FormLabel htmlFor="status" required>
                    Status
                  </FormLabel>
                  <FormSelect
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Only active plans are exposed to the mobile application.
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="actionButtonLabel" required>
                    Action Button Label
                  </FormLabel>
                  <FormInput
                    id="actionButtonLabel"
                    type="text"
                    placeholder="e.g. Keep Moving Forward"
                    value={formData.actionButtonLabel}
                    maxLength={15}
                    onChange={(e) => {
                      setFormData({ ...formData, actionButtonLabel: e.target.value });
                      if (errors.actionButtonLabel) setErrors({ ...errors, actionButtonLabel: '' });
                    }}
                    className={errors.actionButtonLabel ? 'border-error-500' : ''}
                  />
                  {errors.actionButtonLabel && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.actionButtonLabel}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Text shown on the purchase button for this package in mobile app.
                  </p>
                </FormField>
              </div>

              {/* Fifth row: Product Identifier (Full Width) */}
              <div className="w-full">
                <FormField>
                  <FormLabel htmlFor="productIdentifier" required>
                    Product Identifier
                  </FormLabel>
                  <FormInput
                    id="productIdentifier"
                    type="text"
                    placeholder="e.g. coins_300"
                    value={formData.productIdentifier}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s/g, '');
                      setFormData({ ...formData, productIdentifier: val });
                      if (errors.productIdentifier) setErrors({ ...errors, productIdentifier: '' });
                    }}
                    className={errors.productIdentifier ? 'border-error-500' : ''}
                  />
                  {errors.productIdentifier && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.productIdentifier}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Alphanumeric value, maximum 100 characters.
                  </p>
                </FormField>
              </div>

              {/* Sixth row: Description Bullet Points (Full Width) */}
              <div className="w-full">
                <FormField>
                  <FormLabel required>
                    Description Bullet Points
                  </FormLabel>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    Optional. Displayed to users in the mobile app (1 to 5 bullets).
                  </p>
                  
                  <div className="space-y-2">
                    {formData.description.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-medium w-4">{idx + 1}.</span>
                        <FormInput
                          type="text"
                          placeholder={`Bullet point ${idx + 1}`}
                          value={bullet}
                          onChange={(e) => handleBulletChange(idx, e.target.value)}
                          className={errors.description ? 'border-error-500' : ''}
                        />
                        <button
                          type="button"
                          onClick={() => removeBulletPoint(idx)}
                          className="p-2 text-neutral-400 hover:text-error-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {errors.description && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.description}</p>
                  )}

                  {formData.description.length < 5 && (
                    <button
                      type="button"
                      onClick={addBulletPoint}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Bullet Point
                    </button>
                  )}
                </FormField>
              </div>

            </FormSection>
          </div>

          {/* Footer Actions */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-end gap-3">
            <SecondaryButton onClick={onBack}>
              Discard
            </SecondaryButton>
            <PrimaryButton onClick={handleSave} size="sm">
              {isCreating ? 'Save' : 'Update'}
            </PrimaryButton>
          </div>

        </div>

      </div>
    </div>
  );
}
