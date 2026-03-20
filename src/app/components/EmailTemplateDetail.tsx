import { useState } from 'react';
import { ArrowLeft, Mail, Eye } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormSection, FormField, FormLabel, FormInput, FormSelect } from './hb/common/Form';
import RichTextEditor from './RichTextEditor';

interface EmailTemplate {
  id: string;
  templateName: string;
  cc?: string;
  bcc?: string;
  subject: string;
  emailBody: string;
  status: 'active' | 'inactive';
  lastUpdatedDate: string;
}

interface EmailTemplateDetailProps {
  template: EmailTemplate;
  onBack: () => void;
  onSave: (template: EmailTemplate) => void;
}

export default function EmailTemplateDetail({ template, onBack, onSave }: EmailTemplateDetailProps) {
  const [formData, setFormData] = useState({
    cc: template.cc,
    bcc: template.bcc,
    subject: template.subject,
    emailBody: template.emailBody,
    status: template.status,
  });

  const [showPreview, setShowPreview] = useState(false);

  // Handle save
  const handleSave = () => {
    onSave({
      ...template,
      cc: formData.cc,
      bcc: formData.bcc,
      subject: formData.subject,
      emailBody: formData.emailBody,
      status: formData.status,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
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
            Back to Email Templates
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Edit Email Template
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Modify the email template content and settings. Changes will affect all future emails of this type.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Template Information (Read-only) */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Template Information
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Template ID
                </label>
                <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {template.id}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Template Name (Read-only)
                </label>
                <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {template.templateName}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Email Content
              </h2>
            </div>
            <div className="p-4">
              <FormSection>
                <FormField>
                  <FormLabel htmlFor="cc">
                    CC
                  </FormLabel>
                  <FormInput
                    id="cc"
                    type="text"
                    value={formData.cc}
                    onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                    placeholder="Enter CC email addresses"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Comma-separated list of email addresses
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="bcc">
                    BCC
                  </FormLabel>
                  <FormInput
                    id="bcc"
                    type="text"
                    value={formData.bcc}
                    onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                    placeholder="Enter BCC email addresses"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Comma-separated list of email addresses
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="subject" required>
                    Subject Line
                  </FormLabel>
                  <FormInput
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    This will appear in the recipient's inbox
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="emailBody" required>
                    Email Body (HTML)
                  </FormLabel>
                  <RichTextEditor
                    value={formData.emailBody}
                    onChange={(value) => setFormData({ ...formData, emailBody: value })}
                    placeholder="Enter email content"
                    className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Use the formatting toolbar above. The editor generates HTML automatically.
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

                {/* Email Preview */}
                {showPreview && (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Email Preview
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-950">
                      <div className="mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Subject:</p>
                        <p className="text-sm text-neutral-900 dark:text-white font-medium">{formData.subject}</p>
                      </div>
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.emailBody }}
                      />
                    </div>
                  </div>
                )}

                <FormField>
                  <FormLabel htmlFor="status" required>
                    Template Status
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
                      ? '✓ This template is active and will be used for email sending'
                      : '✗ This template is inactive and will not be used'}
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
              Save Changes
            </PrimaryButton>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-warning-900 dark:text-warning-100 mb-2">
            Email Template Guidelines
          </h3>
          <ul className="space-y-1 text-xs text-warning-800 dark:text-warning-200">
            <li>• Use inline CSS styles for maximum email client compatibility</li>
            <li>• Test templates across multiple email clients before activating</li>
            <li>• Keep subject lines concise (under 50 characters recommended)</li>
            <li>• Use responsive HTML for mobile devices</li>
            <li>• Avoid JavaScript - it's not supported in most email clients</li>
            <li>• Include unsubscribe links and company information where required</li>
            <li>• Preview the template before saving to ensure formatting is correct</li>
          </ul>
        </div>
      </div>
    </div>
  );
}