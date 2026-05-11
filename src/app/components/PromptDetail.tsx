import { useState } from 'react';
import { ArrowLeft, FileText, Pen, Clock, RefreshCw, Eye, X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import {
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
} from './hb/common/Form';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@/styles/quill-custom.css';
import { ModelMaster } from '../types/modelMaster';
import { mockModels } from './ModelMasterManagement';

interface Prompt {
  id: string;
  promptKey: string;
  promptName: string;
  promptContent?: string;
  moduleContext: string;
  variablesCount: number;
  currentVersion: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
  status: 'active' | 'inactive';
}

interface PromptDetailProps {
  prompt: Prompt;
  onBack: () => void;
  onSave: (formData: {
    promptName: string;
    promptContent: string;
    status: 'active' | 'inactive';
  }) => void;
}

export default function PromptDetail({
  prompt,
  onBack,
  onSave,
}: PromptDetailProps) {
  const [formData, setFormData] = useState({
    promptName: prompt.promptName,
    promptContent: prompt.promptContent || '',
    status: prompt.status,
    promptNote: '',
    modelId: (prompt as any).modelUsed || '',
    timeout: '30000',
    maxTokens: '2048',
    temperature: '0.7',
  });

  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const itemsPerPage = 10;

  // Mock audit log data
  const auditLogs = [
    {
      id: 'AL001',
      action: 'Prompt edited',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-15 14:30:25',
      promptKey: prompt.promptKey,
      newVersion: 'v5',
    },
    {
      id: 'AL002',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-15 14:28:15',
      promptKey: prompt.promptKey,
      newVersion: 'v5',
    },
    {
      id: 'AL003',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2024-01-14 11:45:10',
      promptKey: prompt.promptKey,
      newVersion: 'v4',
    },
    {
      id: 'AL004',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-13 16:20:30',
      promptKey: prompt.promptKey,
      newVersion: 'v4',
    },
    {
      id: 'AL005',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2024-01-12 09:15:45',
      promptKey: prompt.promptKey,
      newVersion: 'v3',
    },
    {
      id: 'AL006',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-11 13:22:18',
      promptKey: prompt.promptKey,
      newVersion: 'v3',
    },
    {
      id: 'AL007',
      action: 'Prompt edited',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-10 10:05:33',
      promptKey: prompt.promptKey,
      newVersion: 'v2',
    },
    {
      id: 'AL008',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2024-01-09 15:40:22',
      promptKey: prompt.promptKey,
      newVersion: 'v2',
    },
    {
      id: 'AL009',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-08 08:12:50',
      promptKey: prompt.promptKey,
      newVersion: 'v2',
    },
    {
      id: 'AL010',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2024-01-07 14:55:11',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL011',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-06 11:30:45',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL012',
      action: 'Prompt edited',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-05 09:18:33',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL013',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2024-01-04 16:42:20',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL014',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-03 13:25:55',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL015',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2024-01-02 10:10:12',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL016',
      action: 'Status changed',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2024-01-01 15:35:40',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL017',
      action: 'Prompt edited',
      adminUser: 'Admin User',
      adminId: 'ADM001',
      isSuperAdmin: false,
      timestamp: '2023-12-31 12:20:28',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
    {
      id: 'AL018',
      action: 'Prompt edited',
      adminUser: 'Super Admin',
      adminId: null,
      isSuperAdmin: true,
      timestamp: '2023-12-30 09:45:15',
      promptKey: prompt.promptKey,
      newVersion: 'v1',
    },
  ];

  // Mock version history data
  const versionHistory = [
    {
      id: 'VH001',
      version: 'v5',
      savedOn: '15/01/2024 14:30',
      savedBy: 'Admin User',
      changeSummary: 'Updated variables to improve personalization and added seasonal recommendations',
      promptContent: '<p>Generate an outfit of the day recommendation for <strong>{{user_name}}</strong> based on the following context: {{module_context}}.</p><p>Please consider:</p><ul><li>Current weather conditions</li><li>User style preferences</li><li>Occasion type</li><li>Seasonal trends</li></ul>',
      isCurrentVersion: true,
    },
    {
      id: 'VH002',
      version: 'v4',
      savedOn: '14/01/2024 11:45',
      savedBy: 'Super Admin',
      changeSummary: 'Enhanced prompt structure for better AI comprehension',
      promptContent: '<p>Generate an outfit of the day recommendation for <strong>{{user_name}}</strong> based on the following context: {{module_context}}.</p><p>Please consider:</p><ul><li>Current weather conditions</li><li>User style preferences</li><li>Occasion type</li></ul>',
      isCurrentVersion: false,
    },
    {
      id: 'VH003',
      version: 'v3',
      savedOn: '12/01/2024 09:15',
      savedBy: 'Super Admin',
      changeSummary: 'Added occasion type consideration to improve recommendations',
      promptContent: '<p>Generate an outfit of the day recommendation for <strong>{{user_name}}</strong> based on {{module_context}}.</p><p>Consider weather and user preferences.</p>',
      isCurrentVersion: false,
    },
    {
      id: 'VH004',
      version: 'v2',
      savedOn: '10/01/2024 10:05',
      savedBy: 'Admin User',
      changeSummary: 'Simplified prompt structure and improved clarity',
      promptContent: '<p>Create a daily outfit for <strong>{{user_name}}</strong> in {{module_context}}.</p>',
      isCurrentVersion: false,
    },
    {
      id: 'VH005',
      version: 'v1',
      savedOn: '07/01/2024 14:55',
      savedBy: 'Super Admin',
      changeSummary: '',
      promptContent: '<p>Generate outfit for {{user_name}}.</p>',
      isCurrentVersion: false,
    },
  ];

  // Rich text editor modules configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'header'
  ];

  const handleSave = () => {
    // Validate required fields
    if (!formData.promptName.trim()) {
      toast.error('Prompt name is required');
      return;
    }

    // Strip HTML tags to check if content is truly empty
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    const textContent = stripHtml(formData.promptContent).trim();
    if (!textContent) {
      toast.error('Prompt content is required');
      return;
    }

    // In real implementation, validate variables match
    const requiredVariables = ['{{user_name}}', '{{module_context}}'];
    const missingVariables = requiredVariables.filter(
      v => !formData.promptContent.includes(v)
    );

    if (missingVariables.length > 0) {
      toast.error(`Missing required variables: ${missingVariables.join(', ')}`);
      return;
    }

    onSave(formData);
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
            Back to Prompts & API Setting
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Edit Prompt
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Edit prompt safely with immutable variables and full versioning
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              Prompt Details
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <>
            {/* Prompt Metadata Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Prompt Metadata
                </h2>
              </div>
              <div className="p-6">
                <FormSection>
                  {/* Read-only: Prompt Key */}
                  <FormField>
                    <FormLabel htmlFor="promptKey">Prompt Key</FormLabel>
                    <FormInput
                      id="promptKey"
                      type="text"
                      value={prompt.promptKey}
                      disabled
                      className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed font-mono"
                    />
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Immutable system identifier
                    </p>
                  </FormField>

                  {/* Editable: Prompt Name */}
                  <FormField>
                    <FormLabel htmlFor="promptName" required>Prompt Name</FormLabel>
                    <FormInput
                      id="promptName"
                      type="text"
                      value={formData.promptName}
                      onChange={(e) => setFormData({ ...formData, promptName: e.target.value })}
                      placeholder="Enter prompt name"
                    />
                  </FormField>

                  {/* Read-only: Module/Context */}
                  <FormField>
                    <FormLabel htmlFor="moduleContext">Module / Context</FormLabel>
                    <FormInput
                      id="moduleContext"
                      type="text"
                      value={prompt.moduleContext}
                      disabled
                      className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                    />
                  </FormField>

                  {/* Read-only: Current Version */}
                  <FormField>
                    <FormLabel htmlFor="currentVersion">Current Version</FormLabel>
                    <FormInput
                      id="currentVersion"
                      type="text"
                      value={prompt.currentVersion}
                      disabled
                      className="bg-neutral-50 dark:bg-neutral-900 cursor-not-allowed"
                    />
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
                  </FormField>
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
                  <FormField>
                    <FormLabel htmlFor="modelId" required>Select Model</FormLabel>
                    <FormSelect
                      id="modelId"
                      value={formData.modelId}
                      onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                    >
                      <option value="">Select a model</option>
                      {mockModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.id} ({model.provider})
                        </option>
                      ))}
                    </FormSelect>
                  </FormField>
                  
                  {formData.modelId && (() => {
                    const selectedModel = mockModels.find(m => m.id === formData.modelId);
                    if (!selectedModel) return null;
                    
                    const inputCost = selectedModel.inputCosts[0]?.costPerMillion || 0;
                    const outputCost = selectedModel.outputCosts[0]?.costPerMillion || 0;
                    
                    return (
                      <div className="mt-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-3">
                        <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Token Consumption Costs</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-primary-600 dark:text-primary-400 font-medium">Input:</span>
                            <span className="text-neutral-700 dark:text-neutral-300">${inputCost.toFixed(2)} per 1M tokens</span>
                          </div>
                          <div className="hidden sm:block text-primary-300 dark:text-primary-700">|</div>
                          <div className="flex items-center gap-2">
                            <span className="text-primary-600 dark:text-primary-400 font-medium">Output:</span>
                            <span className="text-neutral-700 dark:text-neutral-300">${outputCost.toFixed(2)} per 1M tokens</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </FormSection>
              </div>
            </div>

            {/* Prompt Content Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Prompt Content
                </h2>
                <button
                  onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <Pen className="w-3.5 h-3.5" />
                  {isEditingPrompt ? 'Disable Editing' : 'Enable Editing'}
                </button>
              </div>
              <div className="p-6">
                <FormSection>
                  <FormField>
                    <FormLabel htmlFor="promptContent" required>Prompt Text</FormLabel>
                    
                    {isEditingPrompt ? (
                      <div className="rich-text-editor">
                        <ReactQuill
                          theme="snow"
                          value={formData.promptContent}
                          onChange={(content) => setFormData({ ...formData, promptContent: content })}
                          modules={modules}
                          formats={formats}
                          placeholder="Enter prompt content. Use {{variable_name}} for variables."
                          className="bg-white dark:bg-neutral-950"
                        />
                      </div>
                    ) : (
                      <div 
                        className="min-h-[200px] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm"
                        dangerouslySetInnerHTML={{ __html: formData.promptContent || '<p class="text-neutral-400 dark:text-neutral-600">No content</p>' }}
                      />
                    )}
                    
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Variables must match configured variables exactly. Use {'{{variable_name}}'}. Supports line breaks, bullet points, and paragraph formatting.
                    </p>
                  </FormField>

                  {/* Editable: Prompt Note */}
                  <FormField>
                    <FormLabel htmlFor="promptNote">Prompt Note</FormLabel>
                    <Textarea
                      id="promptNote"
                      value={formData.promptNote}
                      onChange={(e) => setFormData({ ...formData, promptNote: e.target.value })}
                      placeholder="Add notes about changes made and reasons for prompt modifications..."
                      rows={4}
                      className="resize-none"
                    />
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Use this field to track changes, document reasons for modifications, or leave notes for other admins.
                    </p>
                  </FormField>
                </FormSection>
              </div>
            </div>

            {/* Variables Configuration Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Variables Configuration (Read-only)
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Variable Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Data Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Required</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Used in Prompt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      <tr>
                        <td className="px-3 py-2 text-sm font-mono text-primary-600 dark:text-primary-400">{'{{user_name}}'}</td>
                        <td className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300">User's display name</td>
                        <td className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400">string</td>
                        <td className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400">Yes</td>
                        <td className="px-3 py-2 text-sm text-success-600 dark:text-success-400">Yes</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm font-mono text-primary-600 dark:text-primary-400">{'{{module_context}}'}</td>
                        <td className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300">Module identifier</td>
                        <td className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400">string</td>
                        <td className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400">Yes</td>
                        <td className="px-3 py-2 text-sm text-success-600 dark:text-success-400">Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg px-3 py-2">
                  <p className="text-xs text-warning-800 dark:text-warning-200">
                    <strong>Important:</strong> Variables cannot be edited, renamed, or deleted. Unknown variables will block save.
                  </p>
                </div>
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
                        onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                        placeholder="30000"
                      />
                    </FormField>

                    {/* Max Tokens */}
                    <FormField>
                      <FormLabel htmlFor="maxTokens">Max Tokens</FormLabel>
                      <FormInput
                        id="maxTokens"
                        type="number"
                        value={formData.maxTokens}
                        onChange={(e) => setFormData({ ...formData, maxTokens: e.target.value })}
                        placeholder="2048"
                      />
                    </FormField>

                    {/* Temperature */}
                    <FormField>
                      <FormLabel htmlFor="temperature">Temperature (0.0-1.0)</FormLabel>
                      <FormInput
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                        placeholder="0.7"
                      />
                    </FormField>
                  </div>
                </FormSection>
              </div>
            </div>

            {/* Audit & Logging Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Audit & Logging
                </h2>
              </div>
              <div className="p-6">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                  All changes to this prompt are automatically logged. Each log entry includes the admin user, timestamp, prompt key, and new version number.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Admin User</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Timestamp</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Prompt Key</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">New Version</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {(() => {
                        // Calculate pagination
                        const totalItems = auditLogs.length;
                        const totalPages = Math.ceil(totalItems / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedLogs = auditLogs.slice(startIndex, endIndex);
                        
                        return paginatedLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                                log.action === 'Prompt edited'
                                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                  : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
                              }`}>
                                {log.action === 'Prompt edited' ? (
                                  <Pen className="w-3 h-3" />
                                ) : (
                                  <RefreshCw className="w-3 h-3" />
                                )}
                                {log.action}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              {log.isSuperAdmin ? (
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                  {log.adminUser}
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    // Navigate to sub-admin detail page
                                    toast.info(`Navigating to ${log.adminUser}'s detail page`);
                                    // In real implementation: navigate(`/sub-admins/${log.adminId}`);
                                  }}
                                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
                                >
                                  {log.adminUser}
                                </button>
                              )}
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {log.timestamp}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm font-mono text-primary-600 dark:text-primary-400">
                                {log.promptKey}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                {log.newVersion}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {(() => {
                  const totalItems = auditLogs.length;
                  const totalPages = Math.ceil(totalItems / itemsPerPage);
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

                  return (
                    <div className="mt-4 flex items-center justify-between">
                      {/* Results info */}
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                      </div>

                      {/* Pagination controls */}
                      <div className="flex items-center gap-1">
                        {/* Previous button */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                              currentPage === page
                                ? 'border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next button */}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-3 py-2">
                  <p className="text-xs text-primary-800 dark:text-primary-200">
                    <strong>Note:</strong> Audit logs are immutable and cannot be deleted. They are retained for compliance and security purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <SecondaryButton onClick={onBack}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleSave}>
                Save
              </PrimaryButton>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden mb-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Version History
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Version Number</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Saved On</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Saved By</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Change Summary</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {(() => {
                        // Calculate pagination for history
                        const totalItems = versionHistory.length;
                        const totalPages = Math.ceil(totalItems / itemsPerPage);
                        const startIndex = (historyCurrentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedHistory = versionHistory.slice(startIndex, endIndex);
                        
                        return paginatedHistory.map((version) => (
                          <tr key={version.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                  {version.version}
                                </span>
                                {version.isCurrentVersion && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                {version.savedOn}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                {version.savedBy}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {version.changeSummary || <em className="text-neutral-400 dark:text-neutral-600">No summary provided</em>}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() => setSelectedVersion(version)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Prompt
                              </button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Pagination for History */}
                {(() => {
                  const totalItems = versionHistory.length;
                  const totalPages = Math.ceil(totalItems / itemsPerPage);
                  const startIndex = (historyCurrentPage - 1) * itemsPerPage;
                  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

                  return (
                    <div className="mt-4 flex items-center justify-between">
                      {/* Results info */}
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                      </div>

                      {/* Pagination controls */}
                      <div className="flex items-center gap-1">
                        {/* Previous button */}
                        <button
                          onClick={() => setHistoryCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={historyCurrentPage === 1}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setHistoryCurrentPage(page)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                              historyCurrentPage === page
                                ? 'border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next button */}
                        <button
                          onClick={() => setHistoryCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={historyCurrentPage === totalPages}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Version View Modal */}
            {selectedVersion && (
              <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Prompt Version {selectedVersion.version}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Last updated: {selectedVersion.savedOn}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedVersion(null)}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-4">
                      {/* Version Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Saved By</label>
                          <p className="text-sm text-neutral-900 dark:text-white mt-1">{selectedVersion.savedBy}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Version Number</label>
                          <p className="text-sm text-neutral-900 dark:text-white mt-1">{selectedVersion.version}</p>
                        </div>
                      </div>

                      {/* Change Summary */}
                      {selectedVersion.changeSummary && (
                        <div>
                          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Change Summary</label>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{selectedVersion.changeSummary}</p>
                        </div>
                      )}

                      {/* Prompt Content */}
                      <div>
                        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Prompt Content</label>
                        <div 
                          className="mt-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm"
                          dangerouslySetInnerHTML={{ __html: selectedVersion.promptContent }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
                    <SecondaryButton onClick={() => setSelectedVersion(null)}>
                      Close
                    </SecondaryButton>
                    {!selectedVersion.isCurrentVersion && (
                      <PrimaryButton 
                        onClick={() => {
                          // Restore this version
                          setFormData({
                            ...formData,
                            promptContent: selectedVersion.promptContent,
                          });
                          setSelectedVersion(null);
                          setActiveTab('details');
                          toast.success(`Restored to version ${selectedVersion.version}. Remember to save changes.`);
                        }}
                      >
                        Restore
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}