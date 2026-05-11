import { useState, useMemo } from 'react';
import {
  FileText,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import PromptDetail from './PromptDetail';

// Prompt interface
interface Prompt {
  id: string;
  promptKey: string;
  promptName: string;
  promptContent: string;
  moduleContext: string;
  variablesCount: number;
  currentVersion: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
  status: 'active' | 'inactive';
  modelUsed: string;
  provider: string;
}

// Mock Prompts
const mockPrompts: Prompt[] = [
  {
    id: 'P001',
    promptKey: 'OOTD_GENERATION_V1',
    promptName: 'OOTD Generation Prompt',
    promptContent: '<p>Generate an outfit of the day recommendation for <strong>{{user_name}}</strong> based on the following context: {{module_context}}.</p><p>Please consider:</p><ul><li>Current weather conditions</li><li>User style preferences</li><li>Occasion type</li></ul>',
    moduleContext: 'OOTD',
    variablesCount: 5,
    currentVersion: 'v5',
    lastUpdatedBy: 'John Doe',
    lastUpdatedOn: '2024-01-15 14:30',
    status: 'active',
    modelUsed: 'gpt-4o',
    provider: 'OpenAI',
  },
  {
    id: 'P002',
    promptKey: 'WARDROBE_MATCH_V2',
    promptName: 'Wardrobe Item Matching',
    promptContent: '<p>Match wardrobe items for <strong>{{user_name}}</strong> in the context of {{module_context}}.</p><p>Focus on:</p><ol><li>Color coordination</li><li>Style consistency</li><li>Seasonal appropriateness</li></ol>',
    moduleContext: 'Wardrobe AI',
    variablesCount: 3,
    currentVersion: 'v3',
    lastUpdatedBy: 'Jane Smith',
    lastUpdatedOn: '2024-01-14 11:20',
    status: 'active',
    modelUsed: 'claude-3',
    provider: 'Anthropic',
  },
  {
    id: 'P003',
    promptKey: 'MOOD_ANALYSIS_V1',
    promptName: 'User Mood Analysis',
    promptContent: '<p>Analyze the mood of <strong>{{user_name}}</strong> based on {{module_context}}.</p><p>Provide insights on their emotional state and suggest appropriate style recommendations.</p>',
    moduleContext: 'Mood Analysis',
    variablesCount: 4,
    currentVersion: 'v2',
    lastUpdatedBy: 'Alice Johnson',
    lastUpdatedOn: '2024-01-13 09:15',
    status: 'active',
    modelUsed: 'gemini-1.5',
    provider: 'Gemini',
  },
  {
    id: 'P004',
    promptKey: 'STYLE_RECOMMENDATION_V1',
    promptName: 'Style Recommendation Engine',
    promptContent: '<p>Create personalized style recommendations for <strong>{{user_name}}</strong> in {{module_context}}.</p><p>Consider the following factors:</p><ul><li>Past purchase history</li><li>Style quiz results</li><li>Current trends</li><li>Body type preferences</li></ul>',
    moduleContext: 'Style AI',
    variablesCount: 6,
    currentVersion: 'v4',
    lastUpdatedBy: 'Bob Smith',
    lastUpdatedOn: '2024-01-12 16:45',
    status: 'inactive',
    modelUsed: 'gpt-3.5',
    provider: 'OpenAI',
  },
];

export default function PromptManagement() {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states (temporary - before Apply)
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });

  // Applied filters (only update on Apply button)
  const [appliedModule, setAppliedModule] = useState<string>('all');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');
  const [appliedDateRange, setAppliedDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });

  // Filter options
  const filterOptions = {
    'Module / Context': ['OOTD', 'Wardrobe AI', 'Mood Analysis', 'Style AI'],
    'Status': ['Active', 'Inactive'],
  };

  // Get unique modules
  const uniqueModules = Array.from(new Set(prompts.map(p => p.moduleContext)));

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = prompts;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((prompt) => {
        const searchFields = [prompt.promptKey, prompt.promptName];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply dropdown filters
    if (appliedModule !== 'all') {
      filtered = filtered.filter(p => p.moduleContext === appliedModule);
    }

    if (appliedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === appliedStatus);
    }

    // Apply date range filter
    if (appliedDateRange.startDate && appliedDateRange.endDate) {
      filtered = filtered.filter(p => {
        const promptDate = new Date(p.lastUpdatedOn);
        const startDate = new Date(appliedDateRange.startDate);
        const endDate = new Date(appliedDateRange.endDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return promptDate >= startDate && promptDate <= endDate;
      });
    }

    // Apply advanced filters
    const matchesFilters = (prompt: Prompt) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Module / Context') {
          return filter.values.includes(prompt.moduleContext);
        }
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === prompt.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);

    // Sort by Last Updated On (desc) - default
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.lastUpdatedOn).getTime();
      const dateB = new Date(b.lastUpdatedOn).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [prompts, searchQuery, appliedModule, appliedStatus, appliedDateRange, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const activeCount = prompts.filter(p => p.status === 'active').length;
    const totalModules = new Set(prompts.map(p => p.moduleContext)).size;
    
    return [
      { label: 'Total Prompts', value: prompts.length.toString(), icon: FileText },
      { label: 'Active Prompts', value: activeCount.toString(), icon: FileText },
      { label: 'Modules', value: totalModules.toString(), icon: FileText },
    ];
  };

  // Format date (DD/MM/YYYY HH:MM)
  const formatDateTime = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart}`;
  };

  // Handle row click
  const handleRowClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  // Handle update prompt
  const handleUpdatePrompt = (updatedPrompt: Prompt) => {
    setPrompts(prompts.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
    setSelectedPrompt(null);
    toast.success('Prompt updated successfully');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedModule('all');
    setSelectedStatus('all');
    setDateRange({ startDate: '', endDate: '' });
    setFilters([]);
    toast.success('Filters cleared');
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedModule(selectedModule);
    setAppliedStatus(selectedStatus);
    setAppliedDateRange(dateRange);
    toast.success('Filters applied');
  };

  // If viewing prompt detail
  if (selectedPrompt) {
    return (
      <PromptDetail
        prompt={selectedPrompt}
        onBack={() => setSelectedPrompt(null)}
        onSave={(formData) => {
          const updatedPrompt: Prompt = {
            ...selectedPrompt,
            promptName: formData.promptName,
            promptContent: formData.promptContent,
            status: formData.status,
          };
          handleUpdatePrompt(updatedPrompt);
        }}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Prompt Configurations"
          breadcrumbs={[
            { label: 'Prompt Management', href: '#' },
            { label: 'Prompt Configurations', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search by Prompt Key or Name..."
            />

            <AdvancedSearchPanel
              isOpen={showAdvancedSearch}
              onClose={() => setShowAdvancedSearch(false)}
              filters={filters}
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
            />
          </div>
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setPrompts(mockPrompts);
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
            <strong>Super Admin Only:</strong> Prompts are system-defined and cannot be created or deleted. Click any prompt to view details and manage versions.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Module Filter */}
                <div>
                  <FormLabel htmlFor="module">Module / Context</FormLabel>
                  <FormSelect
                    id="module"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                  >
                    <option value="all">All Modules</option>
                    {uniqueModules.map(module => (
                      <option key={module} value={module}>{module}</option>
                    ))}
                  </FormSelect>
                </div>

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

              {/* Date Range Filter */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Filter by Last Updated Date:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">to</span>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
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
            onRemoveFilter={(index) => {
              setFilters(filters.filter((_, i) => i !== index));
            }}
            onClearAll={() => setFilters([])}
          />
        )}

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Prompt Key</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Prompt Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Model Used</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Module / Context</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Variables</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Version</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated On</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((prompt) => (
                  <tr
                    key={prompt.id}
                    onClick={() => handleRowClick(prompt)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-mono">
                        {prompt.promptKey}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-900 dark:text-white font-medium">
                        {prompt.promptName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {prompt.modelUsed}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {prompt.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {prompt.moduleContext}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {prompt.variablesCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {prompt.currentVersion}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {prompt.lastUpdatedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(prompt.lastUpdatedOn)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        prompt.status === 'active'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {prompt.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
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
            <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              {searchQuery || filters.length > 0 || selectedModule !== 'all' || selectedStatus !== 'all'
                ? 'No prompts match the selected criteria'
                : 'No prompts are configured in the system'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 || selectedModule !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Prompts will appear here once configured'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}