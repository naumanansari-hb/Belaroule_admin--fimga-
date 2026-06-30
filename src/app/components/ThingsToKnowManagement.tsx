import { useState, useMemo } from 'react';
import {
  BookOpen,
  RefreshCw,
  Plus,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Move,
} from 'lucide-react';
import { PageHeader, IconButton, SummaryWidgets, SearchBar, FilterChips, Pagination, PrimaryButton, SecondaryButton } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { FormLabel, FormSelect } from './hb/common/Form';
import { toast } from 'sonner';
import ThingsToKnowDetail from './ThingsToKnowDetail';

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

const mockThingsToKnow: ThingsToKnowCard[] = [
  {
    id: 'TTK001',
    sequence: 1,
    contentEn: 'You can earn BCA by completing daily logins and streaks.',
    contentEs: 'Puedes ganar BCA completando inicios de sesión diarios y rachas.',
    addedDate: '2026-06-15 10:00',
    lastModifiedDate: '2026-06-15 10:00',
    status: 'active',
  },
  {
    id: 'TTK002',
    sequence: 2,
    contentEn: 'BCA is spent on streak restorations and advanced wardrobe insights.',
    addedDate: '2026-06-16 11:30',
    lastModifiedDate: '2026-06-16 11:30',
    status: 'active',
  },
  {
    id: 'TTK003',
    sequence: 3,
    contentEn: 'BCC Coins power all AI-driven session features like Try-On.',
    addedDate: '2026-06-17 09:15',
    lastModifiedDate: '2026-06-17 09:15',
    status: 'inactive',
  },
];

export default function ThingsToKnowManagement() {
  const [cards, setCards] = useState<ThingsToKnowCard[]>(mockThingsToKnow);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [selectedCard, setSelectedCard] = useState<ThingsToKnowCard | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');

  const filterOptions = {
    'Status': ['Active', 'Inactive'],
  };

  // Filtered and sorted data (sorted by sequence)
  const filteredData = useMemo(() => {
    let filtered = [...cards];

    // Apply search on English content
    if (searchQuery) {
      filtered = filtered.filter((card) => 
        card.contentEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (appliedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === appliedStatus);
    }

    // Apply advanced chips filter
    const matchesFilters = (card: ThingsToKnowCard) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = {
              'Active': 'active',
              'Inactive': 'inactive'
            };
            return statusMap[v] === card.status;
          });
        }
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);

    // Sort by sequence order
    return filtered.sort((a, b) => a.sequence - b.sequence);
  }, [cards, searchQuery, appliedStatus, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Summary Widgets
  const getSummaryWidgets = () => {
    const activeCount = cards.filter(c => c.status === 'active').length;
    return [
      { label: 'Total Cards', value: cards.length.toString(), icon: BookOpen },
      { label: 'Active Cards', value: activeCount.toString(), icon: BookOpen },
      { label: 'Inactive Cards', value: (cards.length - activeCount).toString(), icon: BookOpen },
    ];
  };

  // Drag and Drop handlers (Native HTML5)
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...cards];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    // Resequence cards
    const resequenced = updated.map((card, i) => ({
      ...card,
      sequence: i + 1,
    }));

    setDraggedIndex(index);
    setCards(resequenced);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    toast.success('Sequence reordered successfully');
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map(c => c.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(item => item !== id));
    }
  };

  // Bulk operations
  const handleBulkActivate = () => {
    if (selectedIds.length === 0) return;
    setCards(cards.map(c => selectedIds.includes(c.id) ? { ...c, status: 'active' } : c));
    setSelectedIds([]);
    toast.success('Selected cards activated successfully');
  };

  const handleBulkDeactivate = () => {
    if (selectedIds.length === 0) return;
    setCards(cards.map(c => selectedIds.includes(c.id) ? { ...c, status: 'inactive' } : c));
    setSelectedIds([]);
    toast.success('Selected cards deactivated successfully');
  };

  // Status toggle
  const handleToggleStatus = (card: ThingsToKnowCard) => {
    const newStatus = card.status === 'active' ? 'inactive' : 'active';
    setCards(cards.map(c => c.id === card.id ? { ...c, status: newStatus } : c));
    toast.success(`Card status updated to ${newStatus}`);
  };

  // Edit / Add actions
  const handleEditCard = (card: ThingsToKnowCard) => {
    setSelectedCard(card);
    setIsAdding(false);
  };

  const handleAddCard = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setSelectedCard({
      id: '',
      sequence: cards.length + 1,
      contentEn: '',
      addedDate: now,
      lastModifiedDate: now,
      status: 'active',
    });
    setIsAdding(true);
  };

  const handleSaveCard = (savedCard: ThingsToKnowCard) => {
    if (isAdding) {
      const newCard = {
        ...savedCard,
        id: `TTK${String(cards.length + 1).padStart(3, '0')}`,
      };
      setCards([...cards, newCard]);
      toast.success('Things to Know card created successfully');
    } else {
      setCards(cards.map(c => c.id === savedCard.id ? savedCard : c));
      toast.success('Things to Know card updated successfully');
    }
    setSelectedCard(null);
    setIsAdding(false);
  };

  const handleDeleteCard = (id: string) => {
    // Delete and re-sequence remaining cards
    const remaining = cards.filter(c => c.id !== id);
    const resequenced = remaining.map((card, i) => ({
      ...card,
      sequence: i + 1,
    }));
    setCards(resequenced);
    setSelectedCard(null);
    setIsAdding(false);
    toast.success('Things to Know card deleted successfully');
  };

  const clearAllFilters = () => {
    setSelectedStatus('all');
    toast.success('Filters cleared');
  };

  const applyFilters = () => {
    setAppliedStatus(selectedStatus);
    toast.success('Filters applied');
  };

  if (selectedCard) {
    return (
      <ThingsToKnowDetail
        card={selectedCard}
        isNew={isAdding}
        onBack={() => {
          setSelectedCard(null);
          setIsAdding(false);
        }}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Things to Know"
          breadcrumbs={[
            { label: 'Configuration', href: '#' },
            { label: 'Things to Know', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Content..."
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleAddCard}
            size="sm"
            icon={Plus}
          >
            Add Card
          </PrimaryButton>
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              setCards(mockThingsToKnow);
              setSearchQuery('');
              clearAllFilters();
              setSelectedIds([]);
              toast.success('Data refreshed');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
        </PageHeader>

        {/* SUMMARY WIDGETS */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* BULK ACTIONS BANNER */}
        {selectedIds.length > 0 && (
          <div className="mb-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800/30 px-4 py-3 rounded-lg flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
              {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkActivate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-success-600 hover:bg-success-700 dark:bg-success-500 dark:hover:bg-success-600 rounded-md transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Activate
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-warning-600 hover:bg-warning-700 dark:bg-warning-500 dark:hover:bg-warning-600 rounded-md transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Deactivate
              </button>
            </div>
          </div>
        )}

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

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-850"
                      checked={paginatedData.length > 0 && paginatedData.every(c => selectedIds.includes(c.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 w-12"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 w-16">Seq</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Item ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 w-1/2">Content (English)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Added Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Modified Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.map((card, index) => {
                  const isSelected = selectedIds.includes(card.id);
                  const isDragActive = draggedIndex === index;
                  
                  return (
                    <tr
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, (currentPage - 1) * pageSize + index)}
                      onDragOver={(e) => handleDragOver(e, (currentPage - 1) * pageSize + index)}
                      onDragEnd={handleDragEnd}
                      className={`transition-colors cursor-grab active:cursor-grabbing ${
                        isDragActive ? 'opacity-40 bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-primary-500' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'
                      } ${isSelected ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''}`}
                    >
                      <td className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-850"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(e.target.checked, card.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3 w-12 text-center text-neutral-400 hover:text-neutral-650">
                        <Move className="w-4 h-4 cursor-grab active:cursor-grabbing" />
                      </td>
                      <td className="px-4 py-3 w-16">
                        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                          {card.sequence}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-semibold font-mono">
                          {card.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-sm text-neutral-900 dark:text-white truncate">
                          {card.contentEn}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {card.addedDate.split(' ')[0]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {card.lastModifiedDate.split(' ')[0]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(card);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
                            card.status === 'active'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 hover:bg-success-200'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                          }`}
                        >
                          {card.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEditCard(card)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors border border-primary-100 dark:border-primary-900"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
            <BookOpen className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No cards found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filters.length > 0 ? 'Try adjusting your search or filters' : 'No Things to Know cards available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
