import { useState } from 'react';
import { ArrowLeft, FileText, Eye } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './hb/listing';
import { FormSection, FormField, FormLabel, FormInput, FormSelect } from './hb/common/Form';

interface StaticPage {
  id: string;
  pageTitle: string;
  slug: string;
  content: string;
  status: 'active' | 'inactive';
  lastUpdatedDate: string;
}

interface StaticPageDetailProps {
  page: StaticPage;
  onBack: () => void;
  onSave: (page: StaticPage) => void;
}

export default function StaticPageDetail({ page, onBack, onSave }: StaticPageDetailProps) {
  const [formData, setFormData] = useState({
    pageTitle: page.pageTitle,
    content: page.content,
    status: page.status,
  });

  const [showPreview, setShowPreview] = useState(false);

  // Handle save
  const handleSave = () => {
    onSave({
      ...page,
      pageTitle: formData.pageTitle,
      content: formData.content,
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
            Back to Static Pages
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Edit Static Page
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Update the page content and settings. Changes will be reflected on the website immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Page Information */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Page Information
              </h2>
            </div>
            <div className="p-4">
              <FormSection>
                <FormField>
                  <FormLabel htmlFor="pageTitle" required>
                    Page Title
                  </FormLabel>
                  <FormInput
                    id="pageTitle"
                    type="text"
                    value={formData.pageTitle}
                    onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                    placeholder="Enter page title"
                  />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    This will appear as the page heading and browser title
                  </p>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="slug">
                    Slug / Identifier (Read-only)
                  </FormLabel>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <code className="text-sm text-neutral-700 dark:text-neutral-300">
                      /{page.slug}
                    </code>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Page URL identifier - cannot be modified
                  </p>
                </FormField>
              </FormSection>
            </div>
          </div>

          {/* Content Editor */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Page Content
              </h2>
            </div>
            <div className="p-4">
              <FormSection>
                <FormField>
                  <FormLabel htmlFor="content" required>
                    Content Editor (Rich Text / HTML)
                  </FormLabel>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter page content (HTML supported)"
                    rows={14}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono"
                  />
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

                {/* Content Preview */}
                {showPreview && (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Content Preview
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-neutral-950">
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    </div>
                  </div>
                )}

                <FormField>
                  <FormLabel htmlFor="status" required>
                    Page Status
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
                      ? '✓ This page is active and visible to users'
                      : '✗ This page is inactive and hidden from users'}
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
        <div className="mt-6 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
            Content Editor Tips
          </h3>
          <ul className="space-y-1 text-xs text-primary-800 dark:text-primary-200">
            <li>• Use semantic HTML tags for better SEO (h1, h2, p, ul, etc.)</li>
            <li>• Keep content concise and easy to read</li>
            <li>• Preview changes before saving</li>
            <li>• Ensure all links open in appropriate windows</li>
            <li>• Add alt text to images for accessibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
