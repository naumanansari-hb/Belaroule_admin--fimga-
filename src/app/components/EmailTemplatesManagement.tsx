import { useState, useMemo } from 'react';
import {
  Mail,
  RefreshCw,
  Edit,
  Search,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, FilterChips, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import EmailTemplateDetail from './EmailTemplateDetail';

// Email Template interface
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

// Mock Email Templates
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'TPL001',
    templateName: 'Welcome Email',
    cc: 'marketing@bellaroules.com',
    bcc: 'admin@bellaroules.com',
    subject: 'Welcome to BellaRoules!',
    emailBody: '<h1>Welcome!</h1><p>Thank you for joining BellaRoules. We\'re excited to have you on board.</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-15',
  },
  {
    id: 'TPL002',
    templateName: 'Password Reset',
    bcc: 'security@bellaroules.com',
    subject: 'Reset Your Password',
    emailBody: '<h1>Password Reset Request</h1><p>Click the link below to reset your password.</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-14',
  },
  {
    id: 'TPL003',
    templateName: 'Email Verification',
    subject: 'Verify Your Email Address',
    emailBody: '<h1>Email Verification</h1><p>Please verify your email address by clicking the button below.</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-13',
  },
  {
    id: 'TPL004',
    templateName: 'Order Confirmation',
    cc: 'sales@bellaroules.com',
    subject: 'Your Order has been Confirmed',
    emailBody: '<h1>Order Confirmed</h1><p>Thank you for your purchase! Your order has been confirmed.</p>',
    status: 'inactive',
    lastUpdatedDate: '2024-01-12',
  },
  {
    id: 'TPL005',
    templateName: 'Weekly Newsletter',
    cc: 'marketing@bellaroules.com',
    bcc: 'analytics@bellaroules.com',
    subject: 'Your Weekly Style Update',
    emailBody: '<h1>This Week\'s Fashion Trends</h1><p>Check out the latest fashion trends and styling tips.</p>',
    status: 'active',
    lastUpdatedDate: '2024-01-11',
  },
];

export default function EmailTemplatesManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states (temporary - before Apply)
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Applied filters (only update on Apply button)
  const [appliedStatus, setAppliedStatus] = useState<string>('all');

  // Filter options
  const filterOptions = {
    'Status': ['Active', 'Inactive'],
  };

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = templates;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((template) => {
        const searchFields = [template.templateName, template.subject, template.id];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply dropdown filter
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === appliedStatus);
    }

    // Apply advanced filters
    const matchesFilters = (template: EmailTemplate) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === template.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);
    return filtered;
  }, [templates, searchQuery, appliedStatus, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = templates.filter(t => t.status === 'active').length;
    
    return [
      { label: 'Total Templates', value: templates.length.toString(), icon: Mail },
      { label: 'Active Templates', value: activeCount.toString(), icon: Mail },
    ];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Handle edit template
  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
  };

  // Handle update template
  const handleUpdateTemplate = (updatedTemplate: EmailTemplate) => {
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(null);
    toast.success('Email template updated successfully');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedStatus('all');
    toast.success('Filters cleared');
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedStatus(selectedStatus);
    toast.success('Filters applied');
  };

  // If viewing template detail
  if (selectedTemplate) {
    return (
      <EmailTemplateDetail
        template={selectedTemplate}
        onBack={() => setSelectedTemplate(null)}
        onSave={handleUpdateTemplate}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Email Notifications"
          breadcrumbs={[
            { label: 'Configuration', href: '#' },
            { label: 'Email Notifications', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Template Name..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setTemplates(mockEmailTemplates);
              setSearchQuery('');
              clearAllFilters();
              toast.success('Data refreshed');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
        </PageHeader>

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* INFO BANNER */}
        <div className="mb-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
          <p className="text-xs text-primary-800 dark:text-primary-200">
            <strong>Super Admin Only:</strong> Email templates control system-generated emails. Edit templates carefully to maintain professional communication.
          </p>
        </div>

        {/* FILTERS SECTION */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <FormSelect
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Reset Filter
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-md transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE FILTERS */}
        {filters.length > 0 && (
          <FilterChips
            filters={filters}
            onRemoveFilter={(index) => setFilters(filters.filter((_, i) => i !== index))}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Template ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Template Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((template) => (
                  <tr
                    key={template.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {template.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {template.templateName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {template.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        template.status === 'active'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {template.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(template.lastUpdatedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* NO RESULTS */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No email templates found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 ? 'Try adjusting your search or filters' : 'No email templates available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}