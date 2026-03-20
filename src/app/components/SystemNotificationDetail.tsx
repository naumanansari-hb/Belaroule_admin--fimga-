import { useState } from 'react';
import { ArrowLeft, Bell, AlertCircle, Info } from 'lucide-react';
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
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface SystemNotificationDetailProps {
  notification: {
    id: string;
    notificationCode: string;
    notificationTitle: string;
    notificationMessage: string;
    status: 'active' | 'inactive';
    lastUpdatedDate: string;
    variables: { key: string; description: string }[];
  };
  onBack: () => void;
  onSave: (updatedNotification: any) => void;
}

export default function SystemNotificationDetail({ notification, onBack, onSave }: SystemNotificationDetailProps) {
  const [formData, setFormData] = useState({
    notificationTitle: notification.notificationTitle,
    notificationMessage: notification.notificationMessage,
    status: notification.status,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<{
    notificationTitle?: string;
    notificationMessage?: string;
  }>({});

  // Validate form
  const validateForm = () => {
    const newErrors: {
      notificationTitle?: string;
      notificationMessage?: string;
    } = {};

    if (!formData.notificationTitle.trim()) {
      newErrors.notificationTitle = 'Notification title is required';
    }

    if (!formData.notificationMessage.trim()) {
      newErrors.notificationMessage = 'Notification message is required';
    }

    // Validate variables used in message
    const allowedVariables = notification.variables.map(v => v.key);
    const variablesInMessage = formData.notificationMessage.match(/\{\{[^}]+\}\}/g) || [];
    
    const invalidVariables = variablesInMessage.filter(v => !allowedVariables.includes(v));
    if (invalidVariables.length > 0) {
      newErrors.notificationMessage = `Invalid variable used in notification content: ${invalidVariables.join(', ')}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle update click
  const handleUpdateClick = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    } else {
      toast.error('Required fields are missing');
    }
  };

  // Handle confirm update
  const handleConfirmUpdate = () => {
    const updatedNotification = {
      ...notification,
      notificationTitle: formData.notificationTitle,
      notificationMessage: formData.notificationMessage,
      status: formData.status,
      lastUpdatedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    onSave(updatedNotification);
    setShowConfirmation(false);
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
            Back to System Notifications
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Edit System Notification
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Update notification template content. Use allowed variables only.
              </p>
            </div>
          </div>
        </div>

        {/* INFO BANNER */}
        <div className="mb-6 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-primary-800 dark:text-primary-200">
                <strong>Note:</strong> Changes to notification templates affect all future notifications sent by the system. Use variables as placeholders for dynamic content.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Notification Details
            </h2>
          </div>

          <div className="px-6 py-6">
            <FormSection>
              {/* Read-only: Notification Code */}
              <FormField>
                <FormLabel htmlFor="notificationCode">Notification Code</FormLabel>
                <FormInput
                  id="notificationCode"
                  type="text"
                  value={notification.notificationCode}
                  disabled
                  className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  System-generated code (read-only)
                </p>
              </FormField>

              {/* Editable: Notification Title */}
              <FormField>
                <FormLabel htmlFor="notificationTitle" required>Notification Title</FormLabel>
                <FormInput
                  id="notificationTitle"
                  type="text"
                  value={formData.notificationTitle}
                  onChange={(e) => {
                    setFormData({ ...formData, notificationTitle: e.target.value });
                    setErrors({ ...errors, notificationTitle: undefined });
                  }}
                  placeholder="Enter notification title"
                  className={errors.notificationTitle ? 'border-error-500' : ''}
                />
                {errors.notificationTitle && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                    {errors.notificationTitle}
                  </p>
                )}
              </FormField>

              {/* Editable: Notification Message */}
              <FormField>
                <FormLabel htmlFor="notificationMessage" required>Notification Message</FormLabel>
                <Textarea
                  id="notificationMessage"
                  value={formData.notificationMessage}
                  onChange={(e) => {
                    setFormData({ ...formData, notificationMessage: e.target.value });
                    setErrors({ ...errors, notificationMessage: undefined });
                  }}
                  placeholder="Enter notification message. Use variables like {{user_name}}"
                  rows={4}
                  maxLength={150}
                  className={errors.notificationMessage ? 'border-error-500' : ''}
                />
                {errors.notificationMessage && (
                  <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                    {errors.notificationMessage}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Language: English only. Supports variables/placeholders.
                </p>
              </FormField>

              {/* Editable: Status */}
              <FormField>
                <FormLabel htmlFor="status" required>Status</FormLabel>
                <FormSelect
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {formData.status === 'active' 
                    ? 'This notification will be sent to users when triggered.' 
                    : 'This notification is disabled and will not be sent to users.'}
                </p>
              </FormField>
            </FormSection>
          </div>
        </div>

        {/* VARIABLES SECTION */}
        <div className="mt-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Available Variables
            </h2>
          </div>

          <div className="px-6 py-6">
            {notification.variables.length > 0 ? (
              <div className="space-y-3">
                {notification.variables.map((variable, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded">
                          {variable.key}
                        </code>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {variable.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No variables available for this notification template.
              </p>
            )}

            <div className="mt-4 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg px-3 py-2">
              <p className="text-xs text-warning-800 dark:text-warning-200">
                <strong>Important:</strong> Only use the variables listed above. Using invalid variables will cause validation errors.
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <SecondaryButton onClick={onBack}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={handleUpdateClick}>
            Update
          </PrimaryButton>
        </div>

        {/* CONFIRMATION MODAL */}
        <FormModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          title="Update System Notification"
          maxWidth="max-w-md"
        >
          <FormSection>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Update System Notification?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Are you sure you want to update the system notification? This will affect all future notifications sent to users.
                </p>
              </div>
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton onClick={() => setShowConfirmation(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmUpdate}>
              Update
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}