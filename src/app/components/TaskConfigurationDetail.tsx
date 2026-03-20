import { useState } from 'react';
import { ArrowLeft, Award, AlertCircle, Info } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
} from './hb/common/Form';
import { toast } from 'sonner';

interface TaskConfigurationDetailProps {
  task: {
    id: string;
    taskName: string;
    taskCategory: string;
    taskType: 'Earn' | 'Spend';
    triggerCondition: string;
    rewardPoints: number;
    frequencyType: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Lifetime' | 'Per Use';
    maxCount: number | null;
    status: 'enabled' | 'disabled';
    lastModifiedBy: string;
    lastModifiedDate: string;
    taskDescription?: string;
    isSystemCalculated?: boolean;
  };
  onBack: () => void;
  onUpdate: (task: any) => void;
}

export default function TaskConfigurationDetail({ task, onBack, onUpdate }: TaskConfigurationDetailProps) {
  const [formData, setFormData] = useState({
    rewardPoints: task.rewardPoints.toString(),
    frequencyType: task.frequencyType,
    maxCount: task.maxCount !== null ? task.maxCount.toString() : '',
    status: task.status,
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rewardPoints.trim()) {
      newErrors.rewardPoints = 'Reward points is required';
    } else if (isNaN(parseInt(formData.rewardPoints))) {
      newErrors.rewardPoints = 'Must be a valid number';
    }

    if (formData.maxCount && isNaN(parseInt(formData.maxCount))) {
      newErrors.maxCount = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save click
  const handleSaveClick = () => {
    if (validateForm()) {
      setShowSaveModal(true);
    } else {
      toast.error('Please fix validation errors');
    }
  };

  // Handle confirm save
  const handleConfirmSave = () => {
    const updatedTask = {
      ...task,
      rewardPoints: parseInt(formData.rewardPoints),
      frequencyType: formData.frequencyType,
      maxCount: formData.maxCount ? parseInt(formData.maxCount) : null,
      status: formData.status,
      lastModifiedBy: 'Super Admin',
      lastModifiedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onUpdate(updatedTask);
    setShowSaveModal(false);
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
            Back to Task Configurations
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {task.taskName}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Configure reward points, frequency, and status for this task.
              </p>
            </div>
          </div>
        </div>

        {/* System Calculated Warning */}
        {task.isSystemCalculated && (
          <div className="mb-6 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-warning-800 dark:text-warning-200">
                  <strong>System-Calculated Task:</strong> This task's points are auto-calculated by summing related onboarding tasks. You can override the final reward points, but calculation logic cannot be modified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Information Section (Read-only) */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Task Information (Read-only)
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Task Name */}
                <FormField>
                  <FormLabel htmlFor="taskName">Task Name</FormLabel>
                  <FormInput
                    id="taskName"
                    type="text"
                    value={task.taskName}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                  />
                </FormField>

                {/* Task Category */}
                <FormField>
                  <FormLabel htmlFor="taskCategory">Task Category</FormLabel>
                  <FormInput
                    id="taskCategory"
                    type="text"
                    value={task.taskCategory}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                  />
                </FormField>

                {/* Task Type */}
                <FormField>
                  <FormLabel htmlFor="taskType">Task Type</FormLabel>
                  <FormInput
                    id="taskType"
                    type="text"
                    value={task.taskType}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                  />
                </FormField>

                {/* Trigger Condition */}
                <FormField className="md:col-span-2">
                  <FormLabel htmlFor="triggerCondition">Trigger Condition</FormLabel>
                  <FormInput
                    id="triggerCondition"
                    type="text"
                    value={task.triggerCondition}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    System-defined and immutable
                  </p>
                </FormField>

                {/* Task Description */}
                {task.taskDescription && (
                  <FormField className="md:col-span-2">
                    <FormLabel htmlFor="taskDescription">Task Description</FormLabel>
                    <FormInput
                      id="taskDescription"
                      type="text"
                      value={task.taskDescription}
                      disabled
                      className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                    />
                  </FormField>
                )}
              </div>
            </FormSection>
          </div>
        </div>

        {/* Reward Configuration Section (Editable) */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Reward Configuration (Editable)
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reward Points */}
                <FormField>
                  <FormLabel htmlFor="rewardPoints" required>Reward Points</FormLabel>
                  <FormInput
                    id="rewardPoints"
                    type="number"
                    value={formData.rewardPoints}
                    onChange={(e) => {
                      setFormData({ ...formData, rewardPoints: e.target.value });
                      setErrors({ ...errors, rewardPoints: '' });
                    }}
                    placeholder="Enter reward points"
                    className={errors.rewardPoints ? 'border-error-500' : ''}
                  />
                  {errors.rewardPoints && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.rewardPoints}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Use negative values for Spend tasks (e.g., -50)
                  </p>
                </FormField>

                {/* Frequency Type */}
                <FormField>
                  <FormLabel htmlFor="frequencyType" required>Frequency Type</FormLabel>
                  <FormSelect
                    id="frequencyType"
                    value={formData.frequencyType}
                    onChange={(e) => setFormData({ ...formData, frequencyType: e.target.value as any })}
                    disabled={task.isSystemCalculated}
                  >
                    <option value="Once">Once</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Lifetime">Lifetime</option>
                    <option value="Per Use">Per Use</option>
                  </FormSelect>
                  {task.isSystemCalculated && (
                    <p className="mt-1 text-xs text-warning-600 dark:text-warning-400">
                      Fixed by system logic
                    </p>
                  )}
                </FormField>

                {/* Max Count */}
                <FormField>
                  <FormLabel htmlFor="maxCount">Max Count (Optional)</FormLabel>
                  <FormInput
                    id="maxCount"
                    type="number"
                    value={formData.maxCount}
                    onChange={(e) => {
                      setFormData({ ...formData, maxCount: e.target.value });
                      setErrors({ ...errors, maxCount: '' });
                    }}
                    placeholder="Leave empty for unlimited"
                    className={errors.maxCount ? 'border-error-500' : ''}
                  />
                  {errors.maxCount && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.maxCount}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Maximum number of times this task can be completed
                  </p>
                </FormField>

                {/* Status */}
                <FormField>
                  <FormLabel htmlFor="status" required>Status</FormLabel>
                  <FormSelect
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'enabled' | 'disabled' })}
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </FormSelect>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {formData.status === 'enabled' 
                      ? 'Task will grant/consume points when triggered' 
                      : 'Task is disabled and will not affect points'}
                  </p>
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Audit Information Section (Read-only) */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Audit Information
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Last Modified By */}
                <FormField>
                  <FormLabel htmlFor="lastModifiedBy">Last Modified By</FormLabel>
                  <FormInput
                    id="lastModifiedBy"
                    type="text"
                    value={task.lastModifiedBy}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                  />
                </FormField>

                {/* Last Modified Date */}
                <FormField>
                  <FormLabel htmlFor="lastModifiedDate">Last Modified Date</FormLabel>
                  <FormInput
                    id="lastModifiedDate"
                    type="text"
                    value={task.lastModifiedDate}
                    disabled
                    className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                  />
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Info Notice */}
        <div className="mb-6 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-primary-900 dark:text-primary-100 mb-1">
                Important Notes
              </h4>
              <ul className="space-y-1 text-xs text-primary-800 dark:text-primary-200">
                <li>• Task name, category, type, and trigger conditions are system-defined and cannot be modified</li>
                <li>• Changes apply immediately after saving</li>
                <li>• Disabled tasks will not grant or consume reward points</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <SecondaryButton onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleSaveClick}>
            Save
          </PrimaryButton>
        </div>

        {/* Save Confirmation Modal */}
        <FormModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          title="Update Task Configuration"
          maxWidth="max-w-md"
        >
          <FormSection>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Update Task Configuration?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Changes will apply immediately and affect all future reward calculations.
                </p>
              </div>
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton onClick={() => setShowSaveModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              Save
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
