import { useState, useMemo } from 'react';
import {
  Settings,
  RefreshCw,
  Plus,
  Filter,
  Edit,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import APIConfigurationDetail from './APIConfigurationDetail';

// API Configuration interface
interface APIConfiguration {
  id: string;
  providerName: string;
  apiBaseUrl: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
}

// Mock API Configurations
const mockAPIConfigurations: APIConfiguration[] = [
  {
    id: 'API001',
    providerName: 'OpenAI',
    apiBaseUrl: 'https://api.openai.com/v1/***',
    lastUpdatedBy: 'Super Admin',
    lastUpdatedOn: '2024-01-15 14:30',
  },
  {
    id: 'API002',
    providerName: 'Gemini',
    apiBaseUrl: 'https://generativelanguage.***',
    lastUpdatedBy: 'Admin User',
    lastUpdatedOn: '2024-01-12 16:45',
  },
];

interface APIConfigurationManagementProps {
  onNavigate?: (pageId: string) => void;
}

export default function APIConfigurationManagement({ onNavigate }: APIConfigurationManagementProps) {
  const [configurations, setConfigurations] = useState<APIConfiguration[]>(mockAPIConfigurations);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedConfig, setSelectedConfig] = useState<APIConfiguration | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states (temporary - before Apply)
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  // Applied filters (only update on Apply button)
  const [appliedProvider, setAppliedProvider] = useState<string>('all');

  // Filter options
  const filterOptions = {
    'Provider Name': ['OpenAI', 'Gemini'],
  };

  // Get unique providers
  const uniqueProviders = Array.from(new Set(configurations.map(c => c.providerName)));

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = configurations;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((config) => {
        const searchFields = [config.providerName];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply dropdown filters
    if (appliedProvider !== 'all') {
      filtered = filtered.filter(c => c.providerName === appliedProvider);
    }

    // Apply advanced filters
    const matchesFilters = (config: APIConfiguration) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Provider Name') {
          return filter.values.includes(config.providerName);
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
  }, [configurations, searchQuery, appliedProvider, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const totalProviders = new Set(configurations.map(c => c.providerName)).size;
    
    return [
      { label: 'Total Configurations', value: configurations.length.toString(), icon: Settings },
      { label: 'Providers', value: totalProviders.toString(), icon: Settings },
    ];
  };

  // Format date (DD/MM/YYYY HH:MM)
  const formatDateTime = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart}`;
  };

  // Handle add new
  const handleAddNew = () => {
    setIsCreatingNew(true);
  };

  // Handle edit
  const handleEdit = (config: APIConfiguration) => {
    setSelectedConfig(config);
  };

  // Handle save
  const handleSave = (config: APIConfiguration) => {
    if (isCreatingNew) {
      setConfigurations([...configurations, { ...config, id: `API${String(configurations.length + 1).padStart(3, '0')}` }]);
      toast.success('API Configuration added successfully');
    } else {
      setConfigurations(configurations.map(c => c.id === config.id ? config : c));
      toast.success('API Configuration updated successfully');
    }
    setSelectedConfig(null);
    setIsCreatingNew(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedProvider('all');
    setFilters([]);
    toast.success('Filters cleared');
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedProvider(selectedProvider);
    toast.success('Filters applied');
  };

  // If viewing/editing config detail
  if (selectedConfig || isCreatingNew) {
    return (
      <APIConfigurationDetail
        configuration={selectedConfig}
        isCreating={isCreatingNew}
        onBack={() => {
          setSelectedConfig(null);
          setIsCreatingNew(false);
        }}
        onSave={handleSave}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="AI API Configuration"
          breadcrumbs={[
            { label: 'Prompt Management', href: '#' },
            { label: 'AI API Configuration', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search by Provider..."
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
              setConfigurations(mockAPIConfigurations);
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
            <strong>Super Admin Only:</strong> Configure LLM providers and models. API keys are encrypted and never displayed in full.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Provider Filter */}
                <div>
                  <FormLabel htmlFor="provider">Provider Name</FormLabel>
                  <FormSelect
                    id="provider"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <option value="all">All Providers</option>
                    {uniqueProviders.map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </FormSelect>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">API Provider Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">API Base URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Updated On</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((config) => (
                  <tr
                    key={config.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {config.providerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                        {config.apiBaseUrl}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {config.lastUpdatedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(config.lastUpdatedOn)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(config)}
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
            <Settings className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              {searchQuery || filters.length > 0 || selectedProvider !== 'all'
                ? 'No configurations match the selected criteria'
                : 'No LLM configurations available'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 || selectedProvider !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add a new configuration to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}