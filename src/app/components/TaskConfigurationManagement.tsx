import { useState, useMemo } from 'react';
import {
  Award,
  RefreshCw,
  Filter,
  Edit,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import TaskConfigurationDetail from './TaskConfigurationDetail';

// Task Configuration interface
interface TaskConfiguration {
  id: string;
  taskName: string;
  taskCategory: string;
  taskType: 'Earn' | 'Spend';
  triggerCondition: string;
  rewardPoints: number;
  frequencyType: 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Lifetime' | 'Per Use';
  maxCount: number | null;
  status: 'enabled' | 'disabled';
  lastModifiedBy: string;
  lastModifiedDate: string;
  taskDescription?: string;
  isSystemCalculated?: boolean;
}

// Mock Task Configurations
const mockTaskConfigurations: TaskConfiguration[] = [
  {
    id: 'TASK001',
    taskName: 'User Registration',
    taskCategory: 'Onboarding & Profile',
    taskType: 'Earn',
    triggerCondition: 'User completes registration',
    rewardPoints: 50,
    frequencyType: 'Once',
    maxCount: 1,
    status: 'enabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-15 14:30',
    taskDescription: 'Reward user for completing initial registration',
  },
  {
    id: 'TASK002',
    taskName: 'Onboarding Completed',
    taskCategory: 'Onboarding & Profile',
    taskType: 'Earn',
    triggerCondition: 'Auto-calculated when all onboarding tasks completed',
    rewardPoints: 200,
    frequencyType: 'Once',
    maxCount: 1,
    status: 'enabled',
    lastModifiedBy: 'System',
    lastModifiedDate: '2024-01-15 10:00',
    taskDescription: 'Auto-calculated reward for completing all onboarding steps',
    isSystemCalculated: true,
  },
  {
    id: 'TASK003',
    taskName: 'Daily Login Day 1',
    taskCategory: 'Login & Streak',
    taskType: 'Earn',
    triggerCondition: 'User logs in on day 1 of streak',
    rewardPoints: 10,
    frequencyType: 'Daily',
    maxCount: null,
    status: 'enabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-14 11:20',
  },
  {
    id: 'TASK004',
    taskName: 'Weekly Streak Bonus',
    taskCategory: 'Login & Streak',
    taskType: 'Earn',
    triggerCondition: 'User maintains 7-day login streak',
    rewardPoints: 100,
    frequencyType: 'Weekly',
    maxCount: null,
    status: 'enabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-13 09:15',
  },
  {
    id: 'TASK005',
    taskName: 'Like Post',
    taskCategory: 'Community Engagement',
    taskType: 'Earn',
    triggerCondition: 'User likes another user\'s post',
    rewardPoints: 2,
    frequencyType: 'Per Use',
    maxCount: 20,
    status: 'enabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-12 16:45',
  },
  {
    id: 'TASK006',
    taskName: 'Add Wardrobe Slot',
    taskCategory: 'Wardrobe & Outfit',
    taskType: 'Spend',
    triggerCondition: 'User purchases additional wardrobe slot',
    rewardPoints: -50,
    frequencyType: 'Per Use',
    maxCount: null,
    status: 'enabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-11 13:25',
  },
  {
    id: 'TASK007',
    taskName: 'Virtual Try On',
    taskCategory: 'Feature Consumption',
    taskType: 'Spend',
    triggerCondition: 'User uses virtual try-on feature',
    rewardPoints: -10,
    frequencyType: 'Per Use',
    maxCount: null,
    status: 'enabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-10 15:40',
  },
  {
    id: 'TASK008',
    taskName: 'Restore Streak',
    taskCategory: 'Login & Streak',
    taskType: 'Spend',
    triggerCondition: 'User purchases streak restoration',
    rewardPoints: -200,
    frequencyType: 'Per Use',
    maxCount: null,
    status: 'disabled',
    lastModifiedBy: 'Super Admin',
    lastModifiedDate: '2024-01-09 08:50',
  },
];

export default function TaskConfigurationManagement() {
  const [tasks, setTasks] = useState<TaskConfiguration[]>(mockTaskConfigurations);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTask, setSelectedTask] = useState<TaskConfiguration | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states (temporary - before Apply)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Applied filters (only update on Apply button)
  const [appliedCategory, setAppliedCategory] = useState<string>('all');
  const [appliedTaskType, setAppliedTaskType] = useState<string>('all');
  const [appliedFrequency, setAppliedFrequency] = useState<string>('all');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');

  // Filter options
  const filterOptions = {
    'Task Category': ['Onboarding & Profile', 'Login & Streak', 'Wardrobe & Outfit', 'Community Engagement', 'Feature Consumption'],
    'Task Type': ['Earn', 'Spend'],
    'Frequency Type': ['Once', 'Daily', 'Weekly', 'Monthly', 'Lifetime', 'Per Use'],
    'Status': ['Enabled', 'Disabled'],
  };

  // Get unique categories
  const uniqueCategories = Array.from(new Set(tasks.map(t => t.taskCategory)));

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = tasks;

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((task) => {
        return task.taskName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply dropdown filters
    if (appliedCategory !== 'all') {
      filtered = filtered.filter(t => t.taskCategory === appliedCategory);
    }

    if (appliedTaskType !== 'all') {
      filtered = filtered.filter(t => t.taskType === appliedTaskType);
    }

    if (appliedFrequency !== 'all') {
      filtered = filtered.filter(t => t.frequencyType === appliedFrequency);
    }

    if (appliedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === appliedStatus);
    }

    // Apply advanced filters
    const matchesFilters = (task: TaskConfiguration) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Task Category') {
          return filter.values.includes(task.taskCategory);
        }
        
        if (filter.field === 'Task Type') {
          return filter.values.includes(task.taskType);
        }

        if (filter.field === 'Frequency Type') {
          return filter.values.includes(task.frequencyType);
        }
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Enabled': 'enabled',
              'Disabled': 'disabled'
            };
            return statusMap[v] === task.status;
          });
        }
        
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);

    // Sort by Last Modified Date (desc) - default
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.lastModifiedDate).getTime();
      const dateB = new Date(b.lastModifiedDate).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [tasks, searchQuery, appliedCategory, appliedTaskType, appliedFrequency, appliedStatus, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get summary widgets
  const getSummaryWidgets = () => {
    const enabledCount = tasks.filter(t => t.status === 'enabled').length;
    const earnTasksCount = tasks.filter(t => t.taskType === 'Earn').length;
    const spendTasksCount = tasks.filter(t => t.taskType === 'Spend').length;
    
    return [
      { label: 'Total Tasks', value: tasks.length.toString(), icon: Award },
      { label: 'Enabled Tasks', value: enabledCount.toString(), icon: Award },
      { label: 'Earn Tasks', value: earnTasksCount.toString(), icon: Award },
      { label: 'Spend Tasks', value: spendTasksCount.toString(), icon: Award },
    ];
  };

  // Format date (DD/MM/YYYY HH:MM)
  const formatDateTime = (dateString: string) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year} ${timePart}`;
  };

  // Handle edit
  const handleEdit = (task: TaskConfiguration) => {
    setSelectedTask(task);
  };

  // Handle update
  const handleUpdate = (updatedTask: TaskConfiguration) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(null);
    toast.success('Task configuration updated successfully');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedTaskType('all');
    setSelectedFrequency('all');
    setSelectedStatus('all');
    setFilters([]);
    toast.success('Filters cleared');
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedCategory(selectedCategory);
    setAppliedTaskType(selectedTaskType);
    setAppliedFrequency(selectedFrequency);
    setAppliedStatus(selectedStatus);
    toast.success('Filters applied');
  };

  // If viewing task detail
  if (selectedTask) {
    return (
      <TaskConfigurationDetail
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
        onUpdate={handleUpdate}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Task Configurations"
          breadcrumbs={[
            { label: 'Reward Management', href: '#' },
            { label: 'Task Configurations', current: true },
          ]}
        >
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onAdvancedSearch={() => setShowAdvancedSearch(true)}
              activeFilterCount={filters.filter(f => f.values.length > 0).length}
              placeholder="Search by Task Name..."
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
              setTasks(mockTaskConfigurations);
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
            <strong>Super Admin Only:</strong> Tasks are system-defined. You can edit reward points, frequency, and enable/disable tasks, but cannot create or delete tasks.
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
                {/* Task Category Filter */}
                <div>
                  <FormLabel htmlFor="category">Task Category</FormLabel>
                  <FormSelect
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </FormSelect>
                </div>

                {/* Task Type Filter */}
                <div>
                  <FormLabel htmlFor="taskType">Task Type</FormLabel>
                  <FormSelect
                    id="taskType"
                    value={selectedTaskType}
                    onChange={(e) => setSelectedTaskType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Earn">Earn</option>
                    <option value="Spend">Spend</option>
                  </FormSelect>
                </div>

                {/* Frequency Type Filter */}
                <div>
                  <FormLabel htmlFor="frequency">Frequency Type</FormLabel>
                  <FormSelect
                    id="frequency"
                    value={selectedFrequency}
                    onChange={(e) => setSelectedFrequency(e.target.value)}
                  >
                    <option value="all">All Frequencies</option>
                    <option value="Once">Once</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Lifetime">Lifetime</option>
                    <option value="Per Use">Per Use</option>
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
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Task Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Task Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Task Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Trigger Condition</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Reward Points</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Frequency Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Max Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Modified By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Modified Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                    onClick={() => handleEdit(task)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {task.taskName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {task.taskCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.taskType === 'Earn'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300'
                      }`}>
                        {task.taskType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {task.triggerCondition}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        task.rewardPoints >= 0
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-error-600 dark:text-error-400'
                      }`}>
                        {task.rewardPoints >= 0 ? '+' : ''}{task.rewardPoints}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {task.frequencyType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {task.maxCount !== null ? task.maxCount : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'enabled'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {task.status === 'enabled' ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {task.lastModifiedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(task.lastModifiedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task);
                        }}
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
            <Award className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              {searchQuery || filters.length > 0 || selectedCategory !== 'all' || selectedTaskType !== 'all'
                ? 'No tasks match the selected criteria'
                : 'No task configurations available'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 || selectedCategory !== 'all' || selectedTaskType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Tasks will appear here once configured'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}