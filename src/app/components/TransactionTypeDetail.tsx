import { useState } from 'react';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
} from './hb/common/Form';
import { toast } from 'sonner';

interface TransactionType {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastModifiedDate?: string;
}

interface TransactionTypeDetailProps {
  transactionType: TransactionType;
  allTransactionTypes: TransactionType[];
  isCreating: boolean;
  onBack: () => void;
  onSave: (transactionType: TransactionType) => void;
}

export default function TransactionTypeDetail({
  transactionType,
  allTransactionTypes,
  isCreating,
  onBack,
  onSave,
}: TransactionTypeDetailProps) {
  const [formData, setFormData] = useState({
    name: transactionType.name,
    description: transactionType.description,
    status: transactionType.status,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format date helper (DD/MM/YYYY as per spec)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Transaction type name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Transaction type name is required.';
    }
    // Max 100 characters
    else if (formData.name.trim().length > 100) {
      newErrors.name = 'Transaction type name must not exceed 100 characters.';
    }
    // Check uniqueness (case-insensitive, excluding current transaction type if editing)
    else {
      const isDuplicate = allTransactionTypes.some(
        tt => tt.id !== transactionType.id && tt.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (isDuplicate) {
        newErrors.name = 'Transaction type name already exists.';
      }
    }

    // Description max 250 characters
    if (formData.description && formData.description.trim().length > 250) {
      newErrors.description = 'Description must not exceed 250 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      ...transactionType,
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      lastModifiedDate: new Date().toISOString().split('T')[0],
    });
  };

  // Handle cancel
  const handleCancel = () => {
    onBack();
  };

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
            Back to Transaction Type List
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {isCreating ? 'Add Transaction Type' : 'Edit Transaction Type'}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {isCreating
                  ? 'Create a new transaction type for use in reports and wallet transactions.'
                  : 'Update transaction type details. System-generated fields are read-only.'}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Type Detail Card */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Read-only Section (only show when editing) */}
          {!isCreating && (
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
                View Section (Read-only)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Transaction Type ID
                  </label>
                  <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {transactionType.id}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Created Date
                  </label>
                  <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                    {formatDate(transactionType.createdDate)}
                  </div>
                </div>
                {transactionType.lastModifiedDate && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Last Modified Date
                    </label>
                    <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                      {formatDate(transactionType.lastModifiedDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Editable Section */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              {isCreating ? 'Transaction Type Details' : 'Editable Section'}
            </h2>
            <FormSection>
              <FormField>
                <FormLabel htmlFor="name" required>
                  Transaction Type Name
                </FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter transaction type name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    // Clear error when user starts typing
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                  error={errors.name}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                    {errors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Maximum 100 characters. Must be unique.
                </p>
              </FormField>

              <FormField>
                <FormLabel htmlFor="description">
                  Description
                </FormLabel>
                <FormTextarea
                  id="description"
                  placeholder="Enter transaction type description (optional)"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    // Clear error when user starts typing
                    if (errors.description) {
                      setErrors({ ...errors, description: '' });
                    }
                  }}
                  error={errors.description}
                  rows={3}
                  maxLength={250}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Maximum 250 characters. Optional field.
                </p>
              </FormField>

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
                  Inactive transaction types are hidden from active operations but remain in historical data.
                </p>
              </FormField>
            </FormSection>
          </div>

          {/* Actions Footer */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-end gap-3">
            <SecondaryButton
              onClick={handleCancel}
              size="sm"
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSave}
              size="sm"
            >
              {isCreating ? 'Create' : 'Update'}
            </PrimaryButton>
          </div>
        </div>

        {/* Validation Rules Info */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
            {isCreating ? 'Guidelines' : 'Validation Rules'}
          </h3>
          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <li>• Transaction type name is mandatory and must be unique</li>
            <li>• Maximum name length: 100 characters</li>
            <li>• Description is optional with a maximum of 250 characters</li>
            <li>• Status can be Active or Inactive</li>
            {!isCreating && (
              <>
                <li>• Transaction Type ID and dates are system-generated and read-only</li>
                <li>• Deactivation is allowed even if used in historical transactions</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
