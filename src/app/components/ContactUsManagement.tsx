import { useState, useMemo } from 'react';
import {
  Mail,
  RefreshCw,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { PageHeader, IconButton, SearchBar, AdvancedSearchPanel, FilterChips, Pagination, ViewModeSwitcher } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import { toast } from 'sonner';
import ContactUsDetail from './ContactUsDetail';
import { formatDate } from '@/utils/dateFormatter';

interface ContactTicket {
  ticketId: string;
  userName: string;
  userEmail: string;
  subject: string;
  contactedDate: string;
  status: 'open' | 'closed';
}

const mockContactTickets: ContactTicket[] = [
  {
    ticketId: 'TCK-10021',
    userName: 'Aanya Sharma',
    userEmail: 'aanya@example.com',
    subject: 'Unable to redeem Bella Coins',
    contactedDate: '2026-01-25',
    status: 'open',
  },
  {
    ticketId: 'TCK-10020',
    userName: 'Rohan Verma',
    userEmail: 'rohan@example.com',
    subject: 'App crashing on login',
    contactedDate: '2026-01-24',
    status: 'closed',
  },
  {
    ticketId: 'TCK-10019',
    userName: 'Priya Singh',
    userEmail: 'priya@example.com',
    subject: 'Payment not processing',
    contactedDate: '2026-01-23',
    status: 'open',
  },
  {
    ticketId: 'TCK-10018',
    userName: 'Arjun Patel',
    userEmail: 'arjun@example.com',
    subject: 'Profile picture not updating',
    contactedDate: '2026-01-22',
    status: 'closed',
  },
  {
    ticketId: 'TCK-10017',
    userName: 'Sneha Kumar',
    userEmail: 'sneha@example.com',
    subject: 'Cannot access wardrobe',
    contactedDate: '2026-01-21',
    status: 'open',
  },
  {
    ticketId: 'TCK-10016',
    userName: 'Vikram Reddy',
    userEmail: 'vikram@example.com',
    subject: 'Missing notification settings',
    contactedDate: '2026-01-20',
    status: 'closed',
  },
  {
    ticketId: 'TCK-10015',
    userName: 'Kavya Nair',
    userEmail: 'kavya@example.com',
    subject: 'OOTD not generating',
    contactedDate: '2026-01-19',
    status: 'open',
  },
  {
    ticketId: 'TCK-10014',
    userName: 'Aditya Mehta',
    userEmail: 'aditya@example.com',
    subject: 'Virtual Try-On not working',
    contactedDate: '2026-01-18',
    status: 'open',
  },
  {
    ticketId: 'TCK-10013',
    userName: 'Ishita Gupta',
    userEmail: 'ishita@example.com',
    subject: 'Wishlist items disappeared',
    contactedDate: '2026-01-17',
    status: 'closed',
  },
  {
    ticketId: 'TCK-10012',
    userName: 'Karan Shah',
    userEmail: 'karan@example.com',
    subject: 'Account deletion request',
    contactedDate: '2026-01-16',
    status: 'open',
  },
];

type ViewMode = 'grid' | 'list' | 'table';

interface ContactUsManagementProps {
  onNavigate?: (page: string, ticketId?: string) => void;
}

export default function ContactUsManagement({ onNavigate }: ContactUsManagementProps = {}) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [contactTickets] = useState<ContactTicket[]>(mockContactTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<ContactTicket | null>(null);

  const filterOptions = {
    'Status': ['Open', 'Closed'],
  };

  const filteredData = useMemo(() => {
    let filtered = contactTickets;

    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const searchFields = [item.ticketId, item.userName, item.userEmail, item.status, item.subject];
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    const matchesFilters = (item: ContactTicket) => {
      return filters.every(filter => {
        if (filter.values.length === 0) return true;
        if (filter.field === 'Status') {
          return filter.values.some(v => {
            const statusMap: Record<string, string> = { 'Open': 'open', 'Closed': 'closed' };
            return statusMap[v] === item.status;
          });
        }
        return true;
      });
    };

    filtered = filtered.filter(matchesFilters);
    return filtered;
  }, [contactTickets, searchQuery, filters]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleAddFilter = (field: string, values: string[]) => {
    const existingFilterIndex = filters.findIndex(f => f.field === field);
    if (existingFilterIndex !== -1) {
      const newFilters = [...filters];
      newFilters[existingFilterIndex] = { field, values };
      setFilters(newFilters);
    } else {
      setFilters([...filters, { field, values }]);
    }
    setCurrentPage(1);
  };

  const handleRemoveFilter = (field: string) => {
    setFilters(filters.filter(f => f.field !== field));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    toast.success('Contact tickets refreshed');
  };

  const handleTicketClick = (ticket: ContactTicket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  const handleUpdateTicket = (status: 'open' | 'closed', conclusion: string) => {
    // Update ticket in state
    const updatedTickets = contactTickets.map(t => 
      t.ticketId === selectedTicket?.ticketId 
        ? { ...t, status } 
        : t
    );
    // In a real app, this would update the state properly
    toast.success('Ticket updated successfully');
    setSelectedTicket(null);
  };

  // Show detail view if a ticket is selected
  if (selectedTicket) {
    return (
      <ContactUsDetail
        ticketId={selectedTicket.ticketId}
        userName={selectedTicket.userName}
        userEmail={selectedTicket.userEmail}
        subject={selectedTicket.subject}
        contactedDate={selectedTicket.contactedDate}
        status={selectedTicket.status}
        onBack={handleBackToList}
        onUpdate={handleUpdateTicket}
      />
    );
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PAGE HEADER */}
        <PageHeader
          title="Contact Us"
          breadcrumbs={[
            { label: 'Communication Management', href: '#' },
            { label: 'Contact Us', current: true },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onAdvancedSearch={() => setShowAdvancedSearch(true)}
            activeFilterCount={filters.filter(f => f.values.length > 0).length}
            placeholder="Search by Ticket ID, Name, Email, Status"
          />
          <IconButton
            icon={RefreshCw}
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
        </PageHeader>

        {/* ADVANCED SEARCH PANEL */}
        <AdvancedSearchPanel
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          filters={filters}
          onFiltersChange={setFilters}
          filterOptions={filterOptions}
        />

        {/* FILTER CHIPS */}
        {filters.length > 0 && (
          <div className="mb-4">
            <FilterChips
              filters={filters}
              onRemoveFilter={(index) => setFilters(filters.filter((_, i) => i !== index))}
              onClearAll={() => setFilters([])}
            />
          </div>
        )}

        {/* TABLE VIEW */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    User Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    User Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Contacted Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-sm font-medium">No contact ticket data found.</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((ticket) => (
                    <tr
                      key={ticket.ticketId}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketClick(ticket);
                          }}
                        >
                          {ticket.ticketId}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                              {ticket.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {ticket.userName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {ticket.userEmail}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {ticket.subject}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(ticket.contactedDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.status === 'open'
                              ? 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300 border border-warning-200 dark:border-warning-800'
                              : 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800'
                          }`}
                        >
                          {ticket.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredData.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}