import { useState } from 'react';
import { ArrowLeft, Baby } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
} from './hb/common/Form';
import { toast } from 'sonner';

interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  createdDate: string;
}

interface AgeGroupDetailProps {
  ageGroup: AgeGroup;
  allAgeGroups: AgeGroup[];
  onBack: () => void;
  onSave: (ageGroup: AgeGroup) => void;
}

export default function AgeGroupDetail({ ageGroup, allAgeGroups, onBack, onSave }: AgeGroupDetailProps) {
  const [formData, setFormData] = useState({
    name: ageGroup.name,
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

    // Age group name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Age group name is required.';
    }
    // Max 100 characters
    else if (formData.name.trim().length > 100) {
      newErrors.name = 'Age group name must not exceed 100 characters.';
    }
    // Check uniqueness (case-insensitive, excluding current age group)
    else {
      const isDuplicate = allAgeGroups.some(
        ag => ag.id !== ageGroup.id && ag.name.toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (isDuplicate) {
        newErrors.name = 'Age group name already exist.';
      }
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
      ...ageGroup,
      name: formData.name.trim(),
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
            Back to Age Group List
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Baby className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Edit Age Group
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Update age group display name. Age Group ID, Age Range, and Created Date are system-generated and cannot be modified.
              </p>
            </div>
          </div>
        </div>

        {/* Age Group Detail Card */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          {/* Read-only Section */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              View Section (Read-only)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Age Group ID
                </label>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {ageGroup.id}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Age Range
                </label>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {ageGroup.ageRange}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Created Date
                </label>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {formatDate(ageGroup.createdDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Section */}
          <div className="px-6 py-6">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white mb-4">
              Editable Section
            </h2>
            <FormSection>
              <FormField>
                <FormLabel htmlFor="name" required>
                  Age Group Name
                </FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter age group name"
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
              Update
            </PrimaryButton>
          </div>
        </div>

        {/* Validation Rules Info */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
            Validation Rules
          </h3>
          <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <li>• Age group name is mandatory</li>
            <li>• Maximum length: 100 characters</li>
            <li>• Age group name must be unique (case-insensitive)</li>
            <li>• Only the display name is editable; ID, age range, and created date are read-only</li>
            <li>• Age range values are fixed and cannot be modified</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
