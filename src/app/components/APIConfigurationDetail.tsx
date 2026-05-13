import { useState, useMemo } from 'react';
import { ArrowLeft, Settings, AlertCircle, Eye, EyeOff, Edit2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Pagination } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
} from './hb/common/Form';
import { toast } from 'sonner';

interface APIConfigurationDetailProps {
  configuration: {
    id: string;
    providerName: string;
    apiBaseUrl: string;
    lastUpdatedBy: string;
    lastUpdatedOn: string;
  } | null;
  isCreating: boolean;
  onBack: () => void;
  onSave: (config: any) => void;
  onNavigate?: (pageId: string) => void;
}

// Mock Change Log Data
const mockChangeLogs = Array.from({ length: 15 }, (_, i) => ({
  id: `log-${i + 1}`,
  action: i % 2 === 0 ? 'Key Changed' : 'Base URL updated',
  adminUser: 'Nauman Ansari',
  timestamp: `2024-01-15 14:${30 - i}:25`,
}));

export default function APIConfigurationDetail({ configuration, isCreating, onBack, onSave, onNavigate }: APIConfigurationDetailProps) {
  const [formData, setFormData] = useState({
    providerName: configuration?.providerName || '',
    apiBaseUrl: configuration?.apiBaseUrl || '',
    apiKey: '',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeyEditable, setIsApiKeyEditable] = useState(isCreating);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Change Log Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return mockChangeLogs.slice(startIndex, startIndex + pageSize);
  }, [currentPage]);
  const totalPages = Math.ceil(mockChangeLogs.length / pageSize);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.providerName.trim()) {
      newErrors.providerName = 'Provider name is required';
    }

    if (!formData.apiBaseUrl.trim()) {
      newErrors.apiBaseUrl = 'API Base URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.apiBaseUrl)) {
      newErrors.apiBaseUrl = 'Invalid URL format';
    }

    if (isCreating && !formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
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
    const savedConfig = {
      ...configuration,
      ...formData,
      apiBaseUrl: formData.apiBaseUrl.replace(/\/+$/, '') + '/***', // Mask URL
      lastUpdatedOn: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lastUpdatedBy: 'Super Admin',
    };

    onSave(savedConfig);
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
            Back to API Configurations
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {isCreating ? 'Add API Configuration' : 'Edit API Configuration'}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Configure LLM provider settings and runtime controls.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Provider Information
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* API Provider Name */}
                <FormField>
                  <FormLabel htmlFor="providerName">API Provider</FormLabel>
                  <FormInput
                    id="providerName"
                    type="text"
                    value={formData.providerName}
                    readOnly
                    disabled
                    className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                  />
                </FormField>

                {/* API Base URL */}
                <FormField className="md:col-span-2">
                  <FormLabel htmlFor="apiBaseUrl" required>API Base URL</FormLabel>
                  <FormInput
                    id="apiBaseUrl"
                    type="text"
                    value={formData.apiBaseUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, apiBaseUrl: e.target.value });
                      setErrors({ ...errors, apiBaseUrl: '' });
                    }}
                    placeholder="https://api.example.com/v1"
                    className={errors.apiBaseUrl ? 'border-error-500' : ''}
                  />
                  {errors.apiBaseUrl && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.apiBaseUrl}</p>
                  )}
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Authentication & Security Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Authentication & Security
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 gap-4">
                {/* API Key */}
                <FormField>
                  <FormLabel htmlFor="apiKey" required={isCreating}>
                    API Key
                  </FormLabel>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        id="apiKey"
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.apiKey}
                        disabled={!isApiKeyEditable}
                        onChange={(e) => {
                          setFormData({ ...formData, apiKey: e.target.value });
                          setErrors({ ...errors, apiKey: '' });
                        }}
                        placeholder={isCreating ? 'Enter API Key' : '••••••••••••••••'}
                        className={`w-full px-3 py-2 pr-10 border ${errors.apiKey ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-700'} rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:dark:bg-neutral-900 disabled:text-neutral-500`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {!isApiKeyEditable && (
                      <SecondaryButton onClick={() => setIsApiKeyEditable(true)} className="gap-2">
                        <Edit2 className="w-4 h-4" /> Edit
                      </SecondaryButton>
                    )}
                  </div>
                  {errors.apiKey && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.apiKey}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    API key will be encrypted and never displayed in full again
                  </p>
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>
        {/* Change Log Section */}
        {!isCreating && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Change Log
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Admin User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Time Stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">{log.action}</td>
                      <td className="px-4 py-3 text-sm">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (onNavigate) {
                              onNavigate('sub-admins');
                            }
                          }}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline"
                        >
                          {log.adminUser}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {mockChangeLogs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={mockChangeLogs.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={() => {}}
              />
            )}
          </div>
        )}

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
          title={isCreating ? 'Add Configuration' : 'Update Configuration'}
          maxWidth="max-w-md"
        >
          <FormSection>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  {isCreating ? 'Add New Configuration?' : 'Update Configuration?'}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isCreating 
                    ? 'This will add a new LLM provider configuration to the system.' 
                    : 'This will update the LLM provider configuration. Changes will be applied immediately.'}
                </p>
              </div>
            </div>
          </FormSection>

          <FormFooter>
            <SecondaryButton onClick={() => setShowSaveModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleConfirmSave}>
              {isCreating ? 'Add' : 'Update'}
            </PrimaryButton>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
