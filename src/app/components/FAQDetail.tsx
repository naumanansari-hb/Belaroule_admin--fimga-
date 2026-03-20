import { useState } from 'react';
import { ArrowLeft, HelpCircle, Eye } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormSection, FormField, FormLabel, FormInput, FormSelect } from './hb/common/Form';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  createdDate: string;
  sequence: number;
}

interface FAQDetailProps {
  faq: FAQ;
  isNew?: boolean;
  onBack: () => void;
  onSave: (faq: FAQ) => void;
}

export default function FAQDetail({ faq, isNew = false, onBack, onSave }: FAQDetailProps) {
  const [formData, setFormData] = useState({
    question: faq.question,
    answer: faq.answer,
    status: faq.status,
    sequence: faq.sequence || 1,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
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
      ...faq,
      question: formData.question,
      answer: formData.answer,
      status: formData.status,
      sequence: formData.sequence,
    });
  };

  // Handle cancel
  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to FAQs
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {isNew ? 'Add New FAQ' : 'Edit FAQ'}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {isNew 
                  ? 'Create a new frequently asked question to help your users.'
                  : 'Update the FAQ information. Changes will be reflected immediately.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* FAQ Information */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                FAQ Information
              </h2>
            </div>
            <div className="p-4">
              <FormSection>
                <FormField>
                  <FormLabel htmlFor="question" required>
                    Question
                  </FormLabel>
                  <FormInput
                    id="question"
                    type="text"
                    value={formData.question}
                    onChange={(e) => {
                      setFormData({ ...formData, question: e.target.value });
                      if (errors.question) {
                        setErrors({ ...errors, question: '' });
                      }
                    }}
                    placeholder="Enter frequently asked question"
                    className={errors.question ? 'border-error-500 dark:border-error-500' : ''}
                  />
                  {errors.question && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.question}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    This will be displayed as the FAQ question heading
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="answer" required>
                    Answer (Rich Text / HTML)
                  </FormLabel>
                  <textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => {
                      setFormData({ ...formData, answer: e.target.value });
                      if (errors.answer) {
                        setErrors({ ...errors, answer: '' });
                      }
                    }}
                    placeholder="Enter answer (HTML supported)"
                    rows={10}
                    className={`w-full px-3 py-2 bg-white dark:bg-neutral-950 border rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono ${
                      errors.answer 
                        ? 'border-error-500 dark:border-error-500' 
                        : 'border-neutral-200 dark:border-neutral-800'
                    }`}
                  />
                  {errors.answer && (
                    <p className="mt-1 text-xs text-error-600 dark:text-error-400">
                      {errors.answer}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Use HTML for formatting. Standard HTML tags are supported.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </FormField>

                {/* Answer Preview */}
                {showPreview && (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Answer Preview
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-950">
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.answer }}
                      />
                    </div>
                  </div>
                )}

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
                    {formData.status === 'active' 
                      ? '✓ This FAQ is active and visible to users'
                      : '✗ This FAQ is inactive and hidden from users'}
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="sequence" required>
                    Sequence
                  </FormLabel>
                  <FormInput
                    id="sequence"
                    type="number"
                    value={formData.sequence.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, sequence: value });
                    }}
                    placeholder="Enter sequence number"
                    min="1"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Controls the display order of FAQs (lower numbers appear first)
                  </p>
                </FormField>
              </FormSection>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={handleCancel}
              size="sm"
              className="flex-1"
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSave}
              size="sm"
              className="flex-1"
            >
              {isNew ? 'Create FAQ' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
            FAQ Best Practices
          </h3>
          <ul className="space-y-1 text-xs text-primary-800 dark:text-primary-200">
            <li>• Keep questions clear and concise</li>
            <li>• Provide detailed and helpful answers</li>
            <li>• Use formatting to improve readability</li>
            <li>• Group related FAQs together</li>
            <li>• Update answers regularly based on user feedback</li>
            <li>• Include links to related resources when helpful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}