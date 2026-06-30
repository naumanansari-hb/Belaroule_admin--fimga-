import { useState } from 'react';
import { ArrowLeft, BookOpen, Trash2, AlertCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormSection, FormField, FormLabel, FormModal, FormFooter } from './hb/common/Form';
import { toast } from 'sonner';

interface ThingsToKnowCard {
  id: string;
  sequence: number;
  contentEn: string;
  contentEs?: string;
  contentFr?: string;
  contentDe?: string;
  addedDate: string;
  lastModifiedDate: string;
  status: 'active' | 'inactive';
}

interface ThingsToKnowDetailProps {
  card: ThingsToKnowCard;
  isNew?: boolean;
  onBack: () => void;
  onSave: (card: ThingsToKnowCard) => void;
  onDelete?: (id: string) => void;
}

type Language = 'en' | 'es' | 'fr' | 'de';

export default function ThingsToKnowDetail({
  card,
  isNew = false,
  onBack,
  onSave,
  onDelete,
}: ThingsToKnowDetailProps) {
  const [status, setStatus] = useState<'active' | 'inactive'>(card.status);
  const [activeTab, setActiveTab] = useState<Language>('en');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    contentEn: card.contentEn || '',
    contentEs: card.contentEs || '',
    contentFr: card.contentFr || '',
    contentDe: card.contentDe || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contentEn.trim()) {
      newErrors.contentEn = 'English content is mandatory';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      setActiveTab('en'); // Switch to English tab to show the error
      toast.error('English content is mandatory');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    onSave({
      ...card,
      contentEn: formData.contentEn.trim(),
      contentEs: formData.contentEs.trim() || undefined,
      contentFr: formData.contentFr.trim() || undefined,
      contentDe: formData.contentDe.trim() || undefined,
      status,
      lastModifiedDate: now,
      addedDate: card.addedDate || now,
    });
  };

  const handleCancel = () => {
    onBack();
  };

  const handleDeleteConfirm = () => {
    if (onDelete && card.id) {
      onDelete(card.id);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Things to Know
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {isNew ? 'Create Things to Know Card' : 'Edit Things to Know Card'}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Configure multilingual content and status. English content is required.
                </p>
              </div>
            </div>
          </div>

          {!isNew && onDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-error-600 hover:text-error-700 bg-error-50 dark:bg-error-950/30 hover:bg-error-100 rounded-lg transition-colors border border-error-200 dark:border-error-800/30"
            >
              <Trash2 className="w-4 h-4" />
              Delete Card
            </button>
          )}
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950 shadow-sm">
              {/* Language Tabs Header */}
              <div className="bg-neutral-50 dark:bg-neutral-900 px-4 pt-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex gap-2">
                  {(['en', 'es', 'fr', 'de'] as Language[]).map((lang) => {
                    const labelMap = { en: 'English', es: 'Spanish', fr: 'French', de: 'German' };
                    const isSelected = activeTab === lang;
                    const isMandatory = lang === 'en';
                    
                    return (
                      <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 bg-white dark:bg-neutral-950'
                            : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {labelMap[lang]} {isMandatory && <span className="text-error-500">*</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Tab Content */}
              <div className="p-5">
                <FormSection>
                  {activeTab === 'en' && (
                    <FormField>
                      <FormLabel htmlFor="contentEn" required>
                        Content (English)
                      </FormLabel>
                      <textarea
                        id="contentEn"
                        value={formData.contentEn}
                        onChange={(e) => {
                          setFormData({ ...formData, contentEn: e.target.value });
                          if (errors.contentEn) setErrors({ ...errors, contentEn: '' });
                        }}
                        placeholder="Enter content in English (Mandatory)"
                        rows={6}
                        className={`w-full px-3 py-2 bg-white dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                          errors.contentEn ? 'border-error-500 dark:border-error-500' : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                      />
                      {errors.contentEn && (
                        <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.contentEn}</p>
                      )}
                    </FormField>
                  )}

                  {activeTab === 'es' && (
                    <FormField>
                      <FormLabel htmlFor="contentEs">
                        Content (Spanish)
                      </FormLabel>
                      <textarea
                        id="contentEs"
                        value={formData.contentEs}
                        onChange={(e) => setFormData({ ...formData, contentEs: e.target.value })}
                        placeholder="Enter content in Spanish (Optional - falls back to English if empty)"
                        rows={6}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                    </FormField>
                  )}

                  {activeTab === 'fr' && (
                    <FormField>
                      <FormLabel htmlFor="contentFr">
                        Content (French)
                      </FormLabel>
                      <textarea
                        id="contentFr"
                        value={formData.contentFr}
                        onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                        placeholder="Enter content in French (Optional - falls back to English if empty)"
                        rows={6}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                    </FormField>
                  )}

                  {activeTab === 'de' && (
                    <FormField>
                      <FormLabel htmlFor="contentDe">
                        Content (German)
                      </FormLabel>
                      <textarea
                        id="contentDe"
                        value={formData.contentDe}
                        onChange={(e) => setFormData({ ...formData, contentDe: e.target.value })}
                        placeholder="Enter content in German (Optional - falls back to English if empty)"
                        rows={6}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      />
                    </FormField>
                  )}
                </FormSection>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Metadata / Info Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Card Information
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Item ID</span>
                  <span className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    {isNew ? 'System-generated' : card.id}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Sequence Position</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {card.sequence || 'Auto-assigned'}
                  </span>
                </div>

                {!isNew && (
                  <>
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Date Added</span>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{card.addedDate}</span>
                    </div>

                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Last Updated</span>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{card.lastModifiedDate}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Global Settings */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950 shadow-sm p-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Global Settings
              </h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 block">Status</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Active cards are visible to users.
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    status === 'active'
                      ? 'bg-primary-600 dark:bg-primary-500'
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      status === 'active' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800">
          <SecondaryButton onClick={handleCancel}>
            Discard
          </SecondaryButton>
          <PrimaryButton onClick={handleSave}>
            {isNew ? 'Create Card' : 'Update Card'}
          </PrimaryButton>
        </div>

        {/* Delete Confirmation Modal */}
        <FormModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Things to Know Card"
          maxWidth="max-w-md"
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-error-100 dark:bg-error-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Confirm Hard Deletion
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Are you sure you want to delete this card? This action is permanent and cannot be undone. The card will be immediately removed from the API response.
                </p>
              </div>
            </div>
          </div>

          <FormFooter>
            <SecondaryButton onClick={() => setShowDeleteModal(false)}>
              Cancel
            </SecondaryButton>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-error-600 hover:bg-error-700 dark:bg-error-500 dark:hover:bg-error-600 rounded-md transition-colors"
            >
              Delete Permanently
            </button>
          </FormFooter>
        </FormModal>
      </div>
    </div>
  );
}
