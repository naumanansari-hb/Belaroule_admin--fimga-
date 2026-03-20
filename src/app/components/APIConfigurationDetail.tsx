import { useState } from 'react';
import { ArrowLeft, Settings, AlertCircle, Eye, EyeOff } from 'lucide-react';
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

interface APIConfigurationDetailProps {
  configuration: {
    id: string;
    providerName: string;
    modelName: string;
    providerType: 'OpenAI' | 'Google' | 'Anthropic' | 'Custom';
    apiBaseUrl: string;
    isDefaultModel: boolean;
    status: 'active' | 'inactive';
    lastUpdatedBy: string;
    lastUpdatedOn: string;
  } | null;
  isCreating: boolean;
  onBack: () => void;
  onSave: (config: any) => void;
}

export default function APIConfigurationDetail({ configuration, isCreating, onBack, onSave }: APIConfigurationDetailProps) {
  const [formData, setFormData] = useState({
    providerName: configuration?.providerName || '',
    providerType: configuration?.providerType || 'OpenAI' as 'OpenAI' | 'Google' | 'Anthropic' | 'Custom',
    apiBaseUrl: configuration?.apiBaseUrl || '',
    modelName: configuration?.modelName || '',
    modelVersion: '',
    isDefaultModel: configuration?.isDefaultModel || false,
    apiKey: '',
    keyLabel: '',
    timeout: '30000',
    maxTokens: '2048',
    temperature: '0.7',
    status: configuration?.status || 'active' as 'active' | 'inactive',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.modelName.trim()) {
      newErrors.modelName = 'Model name is required';
    }

    if (isCreating && !formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }

    if (formData.timeout && (parseInt(formData.timeout) < 1000 || parseInt(formData.timeout) > 120000)) {
      newErrors.timeout = 'Timeout must be between 1000 and 120000 ms';
    }

    if (formData.maxTokens && (parseInt(formData.maxTokens) < 1 || parseInt(formData.maxTokens) > 100000)) {
      newErrors.maxTokens = 'Max tokens must be between 1 and 100000';
    }

    if (formData.temperature && (parseFloat(formData.temperature) < 0 || parseFloat(formData.temperature) > 1)) {
      newErrors.temperature = 'Temperature must be between 0.0 and 1.0';
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
                {/* LLM Provider Name */}
                <FormField>
                  <FormLabel htmlFor="providerName" required>LLM Provider Name</FormLabel>
                  <FormInput
                    id="providerName"
                    type="text"
                    value={formData.providerName}
                    onChange={(e) => {
                      setFormData({ ...formData, providerName: e.target.value });
                      setErrors({ ...errors, providerName: '' });
                    }}
                    placeholder="e.g., OpenAI"
                    className={errors.providerName ? 'border-error-500' : ''}
                  />
                  {errors.providerName && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.providerName}</p>
                  )}
                </FormField>

                {/* Provider Type */}
                <FormField>
                  <FormLabel htmlFor="providerType" required>Provider Type</FormLabel>
                  <FormSelect
                    id="providerType"
                    value={formData.providerType}
                    onChange={(e) => setFormData({ ...formData, providerType: e.target.value as any })}
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Google">Google</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Custom">Custom</option>
                  </FormSelect>
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

        {/* Model Configuration Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Model Configuration
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model Name */}
                <FormField>
                  <FormLabel htmlFor="modelName" required>Model Name</FormLabel>
                  <FormInput
                    id="modelName"
                    type="text"
                    value={formData.modelName}
                    onChange={(e) => {
                      setFormData({ ...formData, modelName: e.target.value });
                      setErrors({ ...errors, modelName: '' });
                    }}
                    placeholder="e.g., GPT-4"
                    className={errors.modelName ? 'border-error-500' : ''}
                  />
                  {errors.modelName && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.modelName}</p>
                  )}
                </FormField>

                {/* Model Version */}
                <FormField>
                  <FormLabel htmlFor="modelVersion">Model Version (Optional)</FormLabel>
                  <FormInput
                    id="modelVersion"
                    type="text"
                    value={formData.modelVersion}
                    onChange={(e) => setFormData({ ...formData, modelVersion: e.target.value })}
                    placeholder="e.g., 1.0.0"
                  />
                </FormField>

                {/* Default Model Toggle */}
                <FormField className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefaultModel"
                      checked={formData.isDefaultModel}
                      onChange={(e) => setFormData({ ...formData, isDefaultModel: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                    />
                    <FormLabel htmlFor="isDefaultModel" className="mb-0">
                      Set as Default Model for this provider
                    </FormLabel>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Only one default model per provider allowed
                  </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* API Key */}
                <FormField className="md:col-span-2">
                  <FormLabel htmlFor="apiKey" required={isCreating}>
                    API Key {!isCreating && '(Leave blank to keep existing)'}
                  </FormLabel>
                  <div className="relative">
                    <input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.apiKey}
                      onChange={(e) => {
                        setFormData({ ...formData, apiKey: e.target.value });
                        setErrors({ ...errors, apiKey: '' });
                      }}
                      placeholder={isCreating ? 'Enter API Key' : '••••••••••••••••'}
                      className={`w-full px-3 py-2 pr-10 border ${errors.apiKey ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-700'} rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.apiKey && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.apiKey}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    API key will be encrypted and never displayed in full again
                  </p>
                </FormField>

                {/* Key Label */}
                <FormField>
                  <FormLabel htmlFor="keyLabel">Key Label (Optional)</FormLabel>
                  <FormInput
                    id="keyLabel"
                    type="text"
                    value={formData.keyLabel}
                    onChange={(e) => setFormData({ ...formData, keyLabel: e.target.value })}
                    placeholder="e.g., Production Key"
                  />
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Runtime Controls Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Runtime Controls
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Timeout */}
                <FormField>
                  <FormLabel htmlFor="timeout">Timeout (ms)</FormLabel>
                  <FormInput
                    id="timeout"
                    type="number"
                    value={formData.timeout}
                    onChange={(e) => {
                      setFormData({ ...formData, timeout: e.target.value });
                      setErrors({ ...errors, timeout: '' });
                    }}
                    placeholder="30000"
                    className={errors.timeout ? 'border-error-500' : ''}
                  />
                  {errors.timeout && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.timeout}</p>
                  )}
                </FormField>

                {/* Max Tokens */}
                <FormField>
                  <FormLabel htmlFor="maxTokens">Max Tokens</FormLabel>
                  <FormInput
                    id="maxTokens"
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => {
                      setFormData({ ...formData, maxTokens: e.target.value });
                      setErrors({ ...errors, maxTokens: '' });
                    }}
                    placeholder="2048"
                    className={errors.maxTokens ? 'border-error-500' : ''}
                  />
                  {errors.maxTokens && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.maxTokens}</p>
                  )}
                </FormField>

                {/* Temperature */}
                <FormField>
                  <FormLabel htmlFor="temperature">Temperature (0.0-1.0)</FormLabel>
                  <FormInput
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => {
                      setFormData({ ...formData, temperature: e.target.value });
                      setErrors({ ...errors, temperature: '' });
                    }}
                    placeholder="0.7"
                    className={errors.temperature ? 'border-error-500' : ''}
                  />
                  {errors.temperature && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.temperature}</p>
                  )}
                </FormField>
              </div>
            </FormSection>
          </div>
        </div>

        {/* Status Section */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
              Status
            </h2>
          </div>
          <div className="p-6">
            <FormSection>
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
                    ? 'This configuration can be used at runtime' 
                    : 'This configuration is disabled'}
                </p>
              </FormField>
            </FormSection>
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
                {formData.isDefaultModel && (
                  <p className="text-xs text-warning-700 dark:text-warning-300 mt-2">
                    Note: Setting this as default will unset any previous default model for this provider.
                  </p>
                )}
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
