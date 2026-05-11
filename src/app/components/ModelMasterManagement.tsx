import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  RefreshCw,
  Edit,
  MoreVertical,
  Filter,
  CheckCircle2,
  XCircle,
  Database
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, SearchBar, Pagination, SecondaryButton } from './hb/listing';
import { formatDate } from '@/utils/dateFormatter';
import { FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import { ModelMaster } from '../types/modelMaster';

interface ModelMasterManagementProps {
  onNavigate: (pageId: string) => void;
  onViewDetail: (id: string) => void;
}

export const mockModels: ModelMaster[] = [
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    inputCosts: [{ startRange: 0, endRange: 1000000, costPerMillion: 5 }, { startRange: 1000001, endRange: 10000000, costPerMillion: 2.5 }],
    outputCosts: [{ startRange: 0, endRange: 1000000, costPerMillion: 15 }],
    hasImageOutput: false,
    status: 'active',
    createdAt: '2024-01-09T14:23:00Z',
    updatedAt: '2024-01-09T14:23:00Z',
  },
  {
    id: 'gemini-1.5-pro',
    provider: 'Gemini',
    inputCosts: [{ startRange: 0, endRange: 128000, costPerMillion: 3.5 }, { startRange: 128001, endRange: 10000000, costPerMillion: 7 }],
    outputCosts: [{ startRange: 0, endRange: 128000, costPerMillion: 10.5 }, { startRange: 128001, endRange: 10000000, costPerMillion: 21 }],
    hasImageOutput: true,
    imageOutputCosts: [{ startRange: 0, endRange: 1000, costPerMillion: 2.5 }],
    status: 'active',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-16T11:00:00Z',
  }
];

export default function ModelMasterManagement({ onNavigate, onViewDetail }: ModelMasterManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [appliedStatus, setAppliedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [models, setModels] = useState<ModelMaster[]>(mockModels);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredData = useMemo(() => {
    let filtered = models;
    if (searchQuery) {
      filtered = filtered.filter(m => m.id.toLowerCase().includes(searchQuery.toLowerCase()) || m.provider.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(m => m.status === appliedStatus);
    }
    return filtered;
  }, [searchQuery, appliedStatus, models]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const getSummaryWidgets = () => {
    const activeCount = models.filter(m => m.status === 'active').length;
    return [
      { label: 'Total Models', value: models.length.toString(), icon: Database },
      { label: 'Active Models', value: activeCount.toString(), icon: CheckCircle2 },
      { label: 'Inactive Models', value: (models.length - activeCount).toString(), icon: XCircle },
    ];
  };

  const getStatusBadge = (status: string) => {
    const isAct = status === 'active';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-full ${isAct ? 'bg-success-50 border-success-200 text-success-700 dark:bg-success-900/30 dark:border-success-800 dark:text-success-400' : 'bg-error-50 border-error-200 text-error-700 dark:bg-error-900/30 dark:border-error-800 dark:text-error-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isAct ? 'bg-success-500' : 'bg-error-500'}`}></div>
        <span className="text-xs font-medium">{isAct ? 'Active' : 'Inactive'}</span>
      </span>
    );
  };

  const formatCostRange = (costs: { costPerMillion: number }[]) => {
    if (!costs || costs.length === 0) return '-';
    const values = costs.map(c => c.costPerMillion);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  const formatTotalCostRange = (model: ModelMaster) => {
    const inMin = Math.min(...model.inputCosts.map(c => c.costPerMillion));
    const inMax = Math.max(...model.inputCosts.map(c => c.costPerMillion));
    const outMin = Math.min(...model.outputCosts.map(c => c.costPerMillion));
    const outMax = Math.max(...model.outputCosts.map(c => c.costPerMillion));
    const totalMin = inMin + outMin;
    const totalMax = inMax + outMax;
    return totalMin === totalMax ? `$${totalMin.toFixed(2)}` : `$${totalMin.toFixed(2)} - $${totalMax.toFixed(2)}`;
  };

  const toggleStatus = (id: string) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m));
    toast.success('Status updated successfully');
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        <PageHeader
          title="Model Master"
          breadcrumbs={[
            { label: 'Master Management', href: '#' },
            { label: 'Model Master', current: true },
          ]}
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search Model ID or Provider..." />
          <SecondaryButton onClick={() => setShowFilters(!showFilters)} size="sm" Icon={Filter}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton onClick={() => onNavigate('add-model-master')} icon={Plus} size="sm">
            Add New Model
          </PrimaryButton>
          <IconButton icon={RefreshCw} onClick={() => toast.success('Refreshed')} variant="ghost" size="sm" tooltip="Refresh" />
        </PageHeader>

        <SummaryWidgets widgets={getSummaryWidgets()} />

        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden p-4 bg-neutral-50 dark:bg-neutral-900">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Status</label>
                  <FormSelect value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
               </div>
             </div>
             <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button onClick={() => { setSelectedStatus('all'); setAppliedStatus('all'); }} className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900">Reset</button>
                <button onClick={() => { setAppliedStatus(selectedStatus); toast.success('Filters applied'); }} className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md">Apply Filters</button>
             </div>
          </div>
        )}

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Model ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Input Cost/1M</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Output Cost/1M</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Total Cost/1M</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Created At</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Updated At</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((model) => (
                  <tr key={model.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => onViewDetail(model.id)} className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
                        {model.id}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white font-medium">{model.provider}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatCostRange(model.inputCosts)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatCostRange(model.outputCosts)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatTotalCostRange(model)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(model.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(model.updatedAt)}</td>
                    <td className="px-4 py-3">{getStatusBadge(model.status)}</td>
                    <td className="px-4 py-3">
                      <div className="relative" ref={showActionMenu === model.id ? actionMenuRef : null}>
                        <button onClick={(e) => { e.stopPropagation(); setShowActionMenu(showActionMenu === model.id ? null : model.id); }} className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                          <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        {showActionMenu === model.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                              <button onClick={(e) => { e.stopPropagation(); onViewDetail(model.id); setShowActionMenu(null); }} className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                                <Edit className="w-4 h-4" /> Edit details
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); toggleStatus(model.id); setShowActionMenu(null); }} className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2">
                                {model.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} 
                                Mark {model.status === 'active' ? 'Inactive' : 'Active'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-neutral-500">No models found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredData.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} totalItems={filteredData.length} onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
        )}
      </div>
    </div>
  );
}
