import { useState, useMemo, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Shield,
  MoreVertical,
  Plus,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Wallet,
  ShoppingBag,
  Image as ImageIcon,
  Eye,
  Edit,
  Trash2,
  UserX,
  Filter,
  Key,
} from 'lucide-react';
import { PageHeader, PrimaryButton, IconButton, SummaryWidgets, ViewModeSwitcher, AdvancedSearchPanel, FilterChips, SearchBar, Pagination } from './hb/listing';
import type { FilterCondition } from './hb/listing';
import {
  FormModal,
  FormSection,
  FormField,
  FormLabel,
  FormInput,
  FormFooter,
  FormSelect,
} from './hb/common/Form';
import { SecondaryButton } from './hb/listing';
import UserDetail from './UserDetail';
import SubAdminDetail from './SubAdminDetail';
import { toast } from 'sonner';
import { formatDate, formatDateTime } from '@/utils/dateFormatter';

// Sub Admin interface
interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdDate: string;
  avatar: string;
}

// Registered User interface
interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  bio: string;
  wardrobeCount: number;
  itemsCount: number;
  status: 'active' | 'inactive';
  lastLogin: string;
  signupDate: string;
  signupMethod: string;
  country: string;
  location: string;
  dateOfBirth: string;
  zodiacSign: string;
  gender: string;
  ageGroup: string;
  bodyShape: string;
  colorPreference: string;
  stylePreference: string;
  ootdCount: number;
  rewardBalance: number;
  avatar: string;
  platform: string;
  osVersion: string;
  deviceModel: string;
}

// Mood History interface
interface MoodHistory {
  id: string;
  date: string;
  mood: string;
}

// Guest User interface
interface GuestUser {
  sessionId: string;
  country: string;
  platform: string;
  deviceModel: string;
  osVersion: string;
  firstActivity: string;
  lastActivity: string;
}

// Mock Sub Admin data
const mockSubAdmins: SubAdmin[] = [
  {
    id: 'SA001',
    name: 'Alex Thompson',
    email: 'alex.thompson@bellaroules.com',
    role: 'Content Manager',
    status: 'active',
    lastLogin: '2024-01-08',
    createdDate: '2023-06-15',
    avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjgxMDI5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'SA002',
    name: 'Maria Garcia',
    email: 'maria.garcia@bellaroules.com',
    role: 'User Support',
    status: 'active',
    lastLogin: '2024-01-09',
    createdDate: '2023-08-22',
    avatar: 'https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODA3NDUwNHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'SA003',
    name: 'James Wilson',
    email: 'james.wilson@bellaroules.com',
    role: 'Moderator',
    status: 'inactive',
    lastLogin: '2023-12-15',
    createdDate: '2023-04-10',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODEyNjQxNHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

// Mock Registered User data
const mockRegisteredUsers: RegisteredUser[] = [
  {
    id: 'U10234',
    name: 'Sophie Anderson',
    email: 'sophie.anderson@gmail.com',
    emailVerified: true,
    bio: 'Fashion enthusiast and style blogger. Love mixing vintage with modern trends!',
    wardrobeCount: 5,
    itemsCount: 87,
    status: 'active',
    lastLogin: '2024-01-09',
    signupDate: '2023-03-15',
    signupMethod: 'Google',
    country: 'United States',
    location: 'New York, NY',
    dateOfBirth: '1995-06-15',
    zodiacSign: 'Gemini',
    gender: 'Female',
    ageGroup: '25-34',
    bodyShape: 'Hourglass',
    colorPreference: 'Neutrals, Pastels',
    stylePreference: 'Casual Chic, Bohemian',
    ootdCount: 23,
    rewardBalance: 450,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY4MTM2MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    virtualTryOnCount: 42,
    wardrobeIndex: 87,
    avgCostPerWear: 12.45,
    platform: 'iOS',
    osVersion: 'iOS 17.2',
    deviceModel: 'iPhone 14 Pro',
  },
  {
    id: 'U10235',
    name: 'Emma Martinez',
    email: 'emma.m@outlook.com',
    emailVerified: true,
    bio: 'Minimalist wardrobe advocate. Less is more!',
    wardrobeCount: 3,
    itemsCount: 52,
    status: 'active',
    lastLogin: '2024-01-08',
    signupDate: '2023-05-20',
    signupMethod: 'Email',
    country: 'United Kingdom',
    location: 'London',
    dateOfBirth: '1992-11-22',
    zodiacSign: 'Sagittarius',
    gender: 'Female',
    ageGroup: '25-34',
    bodyShape: 'Rectangle',
    colorPreference: 'Monochrome, Earth Tones',
    stylePreference: 'Minimalist, Classic',
    ootdCount: 15,
    rewardBalance: 280,
    avatar: 'https://images.unsplash.com/photo-1652471949169-9c587e8898cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhlYWRzaG90JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2ODIwMDY2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    virtualTryOnCount: 28,
    wardrobeIndex: 92,
    avgCostPerWear: 8.75,
    platform: 'Android',
    osVersion: 'Android 14',
    deviceModel: 'Samsung Galaxy S23',
  },
  {
    id: 'U10236',
    name: 'Olivia Brown',
    email: 'olivia.brown@yahoo.com',
    emailVerified: false,
    bio: 'Trendsetter and fashion experimenter. Always trying new styles!',
    wardrobeCount: 7,
    itemsCount: 134,
    status: 'inactive',
    lastLogin: '2023-12-20',
    signupDate: '2023-01-10',
    signupMethod: 'Facebook',
    country: 'Canada',
    location: 'Toronto, ON',
    dateOfBirth: '1998-03-08',
    zodiacSign: 'Pisces',
    gender: 'Female',
    ageGroup: '18-24',
    bodyShape: 'Pear',
    colorPreference: 'Bold Colors, Patterns',
    stylePreference: 'Trendy, Eclectic',
    ootdCount: 45,
    rewardBalance: 820,
    avatar: 'https://images.unsplash.com/photo-1522206038088-8698bcefa6a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2ODIwMDY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    virtualTryOnCount: 67,
    wardrobeIndex: 74,
    avgCostPerWear: 15.30,
    platform: 'iOS',
    osVersion: 'iOS 16.5',
    deviceModel: 'iPhone 13',
  },
  {
    id: 'U10237',
    name: 'Ava Johnson',
    email: 'ava.johnson@gmail.com',
    emailVerified: true,
    bio: 'Professional stylist helping others find their perfect look.',
    wardrobeCount: 4,
    itemsCount: 68,
    status: 'active',
    lastLogin: '2024-01-07',
    signupDate: '2023-07-12',
    signupMethod: 'Apple',
    country: 'Australia',
    location: 'Sydney, NSW',
    dateOfBirth: '1990-09-25',
    zodiacSign: 'Libra',
    gender: 'Female',
    ageGroup: '25-34',
    bodyShape: 'Inverted Triangle',
    colorPreference: 'Jewel Tones, Metallics',
    stylePreference: 'Professional, Elegant',
    ootdCount: 19,
    rewardBalance: 320,
    avatar: 'https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODA3NDUwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    virtualTryOnCount: 34,
    wardrobeIndex: 85,
    avgCostPerWear: 9.95,
    platform: 'Android',
    osVersion: 'Android 13',
    deviceModel: 'Google Pixel 7',
  },
];

// Mock Mood History data
const mockMoodHistory: MoodHistory[] = [
  { id: '1', date: '2024-01-15', mood: 'Happy' },
  { id: '2', date: '2024-01-14', mood: 'Energetic' },
  { id: '3', date: '2024-01-13', mood: 'Calm' },
  { id: '4', date: '2024-01-12', mood: 'Confident' },
  { id: '5', date: '2024-01-11', mood: 'Playful' },
  { id: '6', date: '2024-01-10', mood: 'Relaxed' },
  { id: '7', date: '2024-01-09', mood: 'Motivated' },
  { id: '8', date: '2024-01-08', mood: 'Happy' },
  { id: '9', date: '2024-01-07', mood: 'Inspired' },
  { id: '10', date: '2024-01-06', mood: 'Content' },
  { id: '11', date: '2024-01-05', mood: 'Energetic' },
  { id: '12', date: '2024-01-04', mood: 'Calm' },
  { id: '13', date: '2024-01-03', mood: 'Happy' },
  { id: '14', date: '2024-01-02', mood: 'Relaxed' },
  { id: '15', date: '2024-01-01', mood: 'Joyful' },
];

// Mock Guest User data
const mockGuestUsers: GuestUser[] = [
  {
    sessionId: 'GST-2024-00456',
    country: 'United States',
    platform: 'iOS',
    deviceModel: 'iPhone 14 Pro Max',
    osVersion: 'iOS 17.2',
    firstActivity: '2024-01-08',
    lastActivity: '2024-01-09 14:23',
  },
  {
    sessionId: 'GST-2024-00457',
    country: 'United Kingdom',
    platform: 'Android',
    deviceModel: 'Samsung Galaxy S23 Ultra',
    osVersion: 'Android 14',
    firstActivity: '2024-01-09',
    lastActivity: '2024-01-09 16:45',
  },
  {
    sessionId: 'GST-2024-00458',
    country: 'Canada',
    platform: 'iOS',
    deviceModel: 'iPhone 13 Pro',
    osVersion: 'iOS 16.5',
    firstActivity: '2024-01-07',
    lastActivity: '2024-01-09 10:15',
  },
];

type ViewMode = 'grid' | 'list' | 'table';
type CurrentView = 'users' | 'sub-admins' | 'guest-users';

interface UserManagementProps {
  currentView: CurrentView;
}

export default function UserManagement({ currentView }: UserManagementProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<RegisteredUser | null>(null);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  
  // User detail states
  const [activeTab, setActiveTab] = useState<'profile' | 'wardrobes' | 'wishlist' | 'rewards'>('profile');
  const [moodHistoryPage, setMoodHistoryPage] = useState(1);
  const [moodHistoryPageSize, setMoodHistoryPageSize] = useState(10);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSignupMethod, setSelectedSignupMethod] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedGuestPlatform, setSelectedGuestPlatform] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Applied filters (only update on Apply button)
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'all',
    role: 'all',
    signupMethod: 'all',
    country: 'all',
    guestPlatform: 'all',
    platform: 'all',
  });

  // Sorting states
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // New Sub Admin form state
  const [newSubAdmin, setNewSubAdmin] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Reset when view changes
  useEffect(() => {
    setSearchQuery('');
    setFilters([]);
    setSelectedItems([]);
    setCurrentPage(1);
    setSelectedItem(null);
    setSelectedSubAdmin(null);
  }, [currentView]);

  // Close action menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get data based on current view
  const getCurrentData = () => {
    switch (currentView) {
      case 'sub-admins':
        return mockSubAdmins;
      case 'users':
        return mockRegisteredUsers;
      case 'guest-users':
        return mockGuestUsers;
      default:
        return [];
    }
  };

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    const data = getCurrentData();
    
    const matchesSearch = (item: any) => {
      if (!searchQuery) return true;
      
      const searchFields = currentView === 'sub-admins'
        ? [item.id, item.name, item.email]
        : currentView === 'users'
        ? [item.id, item.name, item.email]
        : [item.sessionId, item.country];
      
      return searchFields.some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };

    const matchesFilters = (item: any) => {
      // Apply status filter
      if (appliedFilters.status !== 'all' && item.status) {
        if (appliedFilters.status.toLowerCase() !== item.status.toLowerCase()) {
          return false;
        }
      }

      // Apply role filter (sub-admins)
      if (appliedFilters.role !== 'all' && item.role) {
        if (appliedFilters.role !== item.role) {
          return false;
        }
      }

      // Apply signup method filter (users)
      if (appliedFilters.signupMethod !== 'all' && item.signupMethod) {
        if (appliedFilters.signupMethod !== item.signupMethod) {
          return false;
        }
      }

      // Apply country filter
      if (appliedFilters.country !== 'all' && item.country) {
        if (appliedFilters.country !== item.country) {
          return false;
        }
      }

      // Apply platform filter (guest users)
      if (appliedFilters.guestPlatform !== 'all' && item.platform && currentView === 'guest-users') {
        if (appliedFilters.guestPlatform !== item.platform) {
          return false;
        }
      }

      // Apply platform filter (users)
      if (appliedFilters.platform !== 'all' && item.platform && currentView === 'users') {
        if (appliedFilters.platform !== item.platform) {
          return false;
        }
      }

      return true;
    };

    return data.filter(item => matchesSearch(item) && matchesFilters(item));
  }, [searchQuery, appliedFilters, currentView]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    const sorted = [...filteredData].sort((a: any, b: any) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date fields by converting to timestamps for proper sorting
      const dateFields = ['lastLogin', 'firstActivity', 'lastActivity', 'createdDate'];
      if (dateFields.includes(sortField)) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };



  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Get page config based on current view
  const getPageConfig = () => {
    switch (currentView) {
      case 'sub-admins':
        return {
          title: 'Admin Users',
          breadcrumbs: [
            { label: 'User Management', href: '#' },
            { label: 'Admin Users', current: true },
          ],
          searchPlaceholder: 'Search by ID, Name, Email...',
        };
      case 'users':
        return {
          title: 'Users',
          breadcrumbs: [
            { label: 'User Management', href: '#' },
            { label: 'Users', current: true },
          ],
          searchPlaceholder: 'Search by User ID, Name, Email...',
        };
      case 'guest-users':
        return {
          title: 'Guest Users',
          breadcrumbs: [
            { label: 'User Management', href: '#' },
            { label: 'Guest Users', current: true },
          ],
          searchPlaceholder: 'Search by Session ID...',
        };
      default:
        return {
          title: 'User Management',
          breadcrumbs: [{ label: 'User Management', current: true }],
          searchPlaceholder: 'Search...',
        };
    }
  };

  // Get summary widgets based on current view
  const getSummaryWidgets = () => {
    if (currentView === 'sub-admins') {
      const activeCount = mockSubAdmins.filter(sa => sa.status === 'active').length;
      return [
        { label: 'Total Admin Users', value: mockSubAdmins.length.toString(), icon: Shield },
        { label: 'Active', value: activeCount.toString(), icon: User },
        { label: 'Inactive', value: (mockSubAdmins.length - activeCount).toString(), icon: User },
      ];
    } else if (currentView === 'users') {
      const totalWardrobes = mockRegisteredUsers.reduce((sum, u) => sum + u.wardrobeCount, 0);
      const totalItems = mockRegisteredUsers.reduce((sum, u) => sum + u.itemsCount, 0);
      return [
        { label: 'Total Users', value: mockRegisteredUsers.length.toString(), icon: User },
        { label: 'Total Wardrobes', value: totalWardrobes.toString(), icon: ShoppingBag },
        { label: 'Total Items', value: totalItems.toString(), icon: ImageIcon },
        { label: 'Active Users', value: mockRegisteredUsers.filter(u => u.status === 'active').length.toString(), icon: User },
      ];
    } else {
      return [
        { label: 'Total Sessions', value: mockGuestUsers.length.toString(), icon: User },
        { label: 'iOS Users', value: mockGuestUsers.filter(g => g.platform === 'iOS').length.toString(), icon: Smartphone },
        { label: 'Android Users', value: mockGuestUsers.filter(g => g.platform === 'Android').length.toString(), icon: Monitor },
      ];
    }
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-500', label: 'Active' },
      inactive: { color: 'bg-error-500', label: 'Inactive' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
        <div className={`w-1.5 h-1.5 rounded-full ${config.color}`}></div>
        <span className="text-xs text-neutral-600 dark:text-neutral-400">{config.label}</span>
      </span>
    );
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle bulk action
  const handleBulkAction = (action: 'activate' | 'deactivate') => {
    console.log(`${action} items:`, selectedItems);
    setSelectedItems([]);
  };

  // Handle add new sub admin
  const handleAddSubAdmin = () => {
    console.log('Creating new sub admin:', newSubAdmin);
    setShowAddModal(false);
    setNewSubAdmin({ name: '', email: '', role: '', status: 'active' });
  };

  // Handle Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: selectedStatus,
      role: selectedRole,
      signupMethod: selectedSignupMethod,
      country: selectedCountry,
      guestPlatform: selectedGuestPlatform,
      platform: selectedPlatform,
    });

    setCurrentPage(1); // Reset to first page
    toast.success('Filters applied successfully');
  };

  // If viewing a user detail
  if (selectedItem) {
    return (
      <UserDetail
        user={selectedItem}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  // If viewing a sub admin detail
  if (selectedSubAdmin) {
    return (
      <SubAdminDetail
        subAdmin={selectedSubAdmin}
        onBack={() => setSelectedSubAdmin(null)}
        onUpdate={(subAdmin) => console.log('Update sub admin:', subAdmin)}
        onDelete={(subAdmin) => console.log('Delete sub admin:', subAdmin)}
      />
    );
  }

  const pageConfig = getPageConfig();

  // Get unique values for filter dropdowns
  const uniqueRoles = Array.from(new Set(mockSubAdmins.map(a => a.role))).sort();
  const uniqueSignupMethods = Array.from(new Set(mockRegisteredUsers.map(u => u.signupMethod))).sort();
  const uniqueCountries = currentView === 'users' 
    ? Array.from(new Set(mockRegisteredUsers.map(u => u.country))).sort()
    : currentView === 'guest-users'
    ? Array.from(new Set(mockGuestUsers.map(u => u.country))).sort()
    : [];
  const uniqueGuestPlatforms = Array.from(new Set(mockGuestUsers.map(u => u.platform))).sort();
  const uniquePlatforms = Array.from(new Set(mockRegisteredUsers.map(u => u.platform))).sort();

  // Filter options for AdvancedSearchPanel based on current view
  const filterOptions: Record<string, string[]> = {};
  
  if (currentView === 'users') {
    filterOptions['Status'] = ['Active', 'Inactive'];
    filterOptions['Signup Method'] = uniqueSignupMethods;
    filterOptions['Country'] = uniqueCountries;
  } else if (currentView === 'sub-admins') {
    filterOptions['Status'] = ['Active', 'Inactive'];
    filterOptions['Role'] = uniqueRoles;
  } else if (currentView === 'guest-users') {
    filterOptions['Country'] = uniqueCountries;
    filterOptions['Platform'] = uniqueGuestPlatforms;
  }

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* ========== PAGE HEADER ========== */}
        <PageHeader
          title={pageConfig.title}
          breadcrumbs={pageConfig.breadcrumbs}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${pageConfig.title.toLowerCase()}...`}
          />
          <SecondaryButton
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            Icon={Filter}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </SecondaryButton>
          {currentView !== 'guest-users' && selectedItems.length > 0 && (
            <>
              <SecondaryButton
                onClick={() => handleBulkAction('activate')}
                size="sm"
              >
                Mark Active
              </SecondaryButton>
              <SecondaryButton
                onClick={() => handleBulkAction('deactivate')}
                size="sm"
              >
                Mark Inactive
              </SecondaryButton>
            </>
          )}
          {currentView === 'sub-admins' && (
            <PrimaryButton
              onClick={() => setShowAddModal(true)}
              icon={Plus}
              size="sm"
            >
              Add Admin User
            </PrimaryButton>
          )}
          <IconButton
            icon={RefreshCw}
            onClick={() => {
              console.log('Refresh data');
            }}
            variant="ghost"
            size="sm"
            tooltip="Refresh"
          />
          <ViewModeSwitcher
            currentMode={viewMode}
            onChange={setViewMode}
          />
        </PageHeader>

        {/* ========== SUMMARY WIDGETS ========== */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* ========== FILTERS SECTION ========== */}
        {showFilters && (
          <div className="mb-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                Filters
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter - for users and sub-admins */}
                {currentView !== 'guest-users' && (
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
                )}

                {/* Role Filter - for sub-admins only */}
                {currentView === 'sub-admins' && (
                  <div>
                    <FormLabel htmlFor="role">Role</FormLabel>
                    <FormSelect
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      {uniqueRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </FormSelect>
                  </div>
                )}

                {/* Signup Method Filter - for users only */}
                {currentView === 'users' && (
                  <div>
                    <FormLabel htmlFor="signupMethod">Signup Method</FormLabel>
                    <FormSelect
                      id="signupMethod"
                      value={selectedSignupMethod}
                      onChange={(e) => setSelectedSignupMethod(e.target.value)}
                    >
                      <option value="all">All Methods</option>
                      {uniqueSignupMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </FormSelect>
                  </div>
                )}

                {/* Country Filter - for users and guest users */}
                {(currentView === 'users' || currentView === 'guest-users') && (
                  <div>
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <FormSelect
                      id="country"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="all">All Countries</option>
                      {uniqueCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </FormSelect>
                  </div>
                )}



                {/* Platform Filter - for guest users only */}
                {currentView === 'guest-users' && (
                  <div>
                    <FormLabel htmlFor="guestPlatform">Platform</FormLabel>
                    <FormSelect
                      id="guestPlatform"
                      value={selectedGuestPlatform}
                      onChange={(e) => setSelectedGuestPlatform(e.target.value)}
                    >
                      <option value="all">All Platforms</option>
                      {uniqueGuestPlatforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </FormSelect>
                  </div>
                )}

                {/* Platform Filter - for users only */}
                {currentView === 'users' && (
                  <div>
                    <FormLabel htmlFor="platform">Platform</FormLabel>
                    <FormSelect
                      id="platform"
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                      <option value="all">All Platforms</option>
                      {uniquePlatforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </FormSelect>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedRole('all');
                    setSelectedSignupMethod('all');
                    setSelectedCountry('all');
                    setSelectedGuestPlatform('all');
                    setSelectedPlatform('all');
                    setAppliedFilters({
                      status: 'all',
                      role: 'all',
                      signupMethod: 'all',
                      country: 'all',
                      guestPlatform: 'all',
                      platform: 'all',
                    });
                    toast.success('Filters reset');
                  }}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Reset Filter
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-md transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(appliedFilters.status !== 'all' || appliedFilters.role !== 'all' || appliedFilters.signupMethod !== 'all' || appliedFilters.country !== 'all' || appliedFilters.device !== 'all' || appliedFilters.platform !== 'all') && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Active Filters:</span>
            {appliedFilters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Status: {appliedFilters.status.charAt(0).toUpperCase() + appliedFilters.status.slice(1)}
              </span>
            )}
            {appliedFilters.role !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Role: {appliedFilters.role}
              </span>
            )}
            {appliedFilters.signupMethod !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Signup Method: {appliedFilters.signupMethod}
              </span>
            )}
            {appliedFilters.country !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Country: {appliedFilters.country}
              </span>
            )}
            {appliedFilters.guestPlatform !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                Platform: {appliedFilters.guestPlatform}
              </span>
            )}

          </div>
        )}

        {/* ========== SUMMARY WIDGETS ========== */}
        <SummaryWidgets widgets={getSummaryWidgets()} />

        {/* ========== SORTING UI ========== */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Sort by:</span>
          
          {/* Sub-Admins Sorting Options */}
          {currentView === 'sub-admins' && (
            <>
              <button
                onClick={() => handleSort('lastLogin')}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortField === 'lastLogin'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                Last Login {sortField === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </>
          )}

          {/* Users Sorting Options */}
          {currentView === 'users' && (
            <>
              <button
                onClick={() => handleSort('lastLogin')}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortField === 'lastLogin'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                Last Login {sortField === 'lastLogin' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('wardrobeCount')}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortField === 'wardrobeCount'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                Wardrobe Count {sortField === 'wardrobeCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('itemsCount')}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortField === 'itemsCount'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                Items Count {sortField === 'itemsCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </>
          )}

          {/* Guest Users Sorting Options */}
          {currentView === 'guest-users' && (
            <>
              <button
                onClick={() => handleSort('sessionCount')}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortField === 'sessionCount'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                Session Count {sortField === 'sessionCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('lastActive')}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  sortField === 'lastActive'
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                Last Active {sortField === 'lastActive' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </>
          )}
        </div>

        {/* ========== DATA VIEW ========== */}
        {viewMode === 'table' && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            {/* Listing Title */}
            <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                {currentView === 'sub-admins' ? 'Admin Users List' : currentView === 'users' ? 'Users List' : 'Guest Users List'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    {currentView !== 'guest-users' && (
                      <th className="w-12 px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(paginatedData.map((item: any) => currentView === 'sub-admins' ? item.id : item.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
                        />
                      </th>
                    )}
                    {currentView === 'sub-admins' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Sub Admin ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Login</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                      </>
                    )}
                    {currentView === 'users' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">User Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Wardrobe Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Items Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Login Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Platform</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Device Model</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">OS Version</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Signed Up By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                      </>
                    )}
                    {currentView === 'guest-users' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Session ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Country</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Platform</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Device Model</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">OS Version</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">First Activity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Activity</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedData.map((item: any) => (
                    <tr
                      key={currentView === 'guest-users' ? item.sessionId : item.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      {currentView !== 'guest-users' && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
                          />
                        </td>
                      )}
                      {currentView === 'sub-admins' && (
                        <>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedSubAdmin(item)}
                              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                            >
                              {item.id}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.role}</span>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(item.lastLogin)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative" ref={showActionMenu === item.id ? actionMenuRef : null}>
                              <button
                                onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              {showActionMenu === item.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                                  <button
                                    onClick={() => {
                                      console.log('Reset password:', item);
                                      toast.success('Reset password email sent successfully');
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                                  >
                                    <Key className="w-4 h-4" />
                                    Reset Password
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedSubAdmin(item);
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Toggle status:', item);
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-950 transition-colors flex items-center gap-2"
                                  >
                                    <UserX className="w-4 h-4" />
                                    Mark Inactive
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                      {currentView === 'users' && (
                        <>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                            >
                              {item.id}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.wardrobeCount}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.itemsCount}</span>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(item.lastLogin)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.platform}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.deviceModel}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.osVersion}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.signupMethod}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative" ref={showActionMenu === item.id ? actionMenuRef : null}>
                              <button
                                onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              {showActionMenu === item.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                                  <button
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log('Toggle status:', item);
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-950 transition-colors flex items-center gap-2"
                                  >
                                    <UserX className="w-4 h-4" />
                                    {item.status === 'active' ? 'Mark Inactive' : 'Activate'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                      {currentView === 'guest-users' && (
                        <>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white font-medium">{item.sessionId}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-neutral-500" />
                              <span className="text-sm text-neutral-900 dark:text-white">{item.country}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.platform}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.deviceModel}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-900 dark:text-white">{item.osVersion}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(item.firstActivity)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDateTime(item.lastActivity)}</span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== GRID VIEW ========== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((item: any) => (
              <div
                key={currentView === 'guest-users' ? item.sessionId : item.id}
                className="group border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => {
                  if (currentView === 'users') {
                    setSelectedItem(item);
                  } else if (currentView === 'sub-admins') {
                    setSelectedSubAdmin(item);
                  }
                }}
              >
                {currentView === 'sub-admins' && (
                  <>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">{item.id}</p>
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <div className="relative" ref={showActionMenu === item.id ? actionMenuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === item.id ? null : item.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          {showActionMenu === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubAdmin(item);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Reset password clicked - action menu');
                                  toast.success('Reset password email send successfully');
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                              >
                                <Shield className="w-4 h-4" />
                                Reset Password
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Toggle status:', item);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-950 transition-colors flex items-center gap-2"
                              >
                                <UserX className="w-4 h-4" />
                                {item.status === 'active' ? 'Mark Inactive' : 'Activate'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Delete:', item);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>{item.role}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last login: {formatDate(item.lastLogin)}</span>
                      </div>
                    </div>
                  </>
                )}
                {currentView === 'users' && (
                  <>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">{item.id}</p>
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <div className="relative" ref={showActionMenu === item.id ? actionMenuRef : null}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === item.id ? null : item.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </button>
                          {showActionMenu === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem(item);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Toggle status:', item);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-950 transition-colors flex items-center gap-2"
                              >
                                <UserX className="w-4 h-4" />
                                {item.status === 'active' ? 'Mark Inactive' : 'Activate'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{item.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{item.deviceModel} - {item.platform} ({item.osVersion})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Signed up via {item.signupMethod}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Wardrobes</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.wardrobeCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Items</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.itemsCount}</p>
                      </div>
                    </div>
                  </>
                )}
                {currentView === 'guest-users' && (
                  <>
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">{item.sessionId}</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{item.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{item.deviceModel} - {item.platform} ({item.osVersion})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last: {formatDateTime(item.lastActivity)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {paginatedData.map((item: any) => (
              <div
                key={currentView === 'guest-users' ? item.sessionId : item.id}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                {currentView === 'sub-admins' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{item.name}</h3>
                          <span className="text-xs text-primary-600 dark:text-primary-400">{item.id}</span>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            {item.role}
                          </span>
                          <span>Last login: {formatDate(item.lastLogin)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        console.log('Reset password clicked - grid view');
                        toast.success('Reset password email send successfully');
                      }}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Reset Password
                    </button>
                  </div>
                )}
                {currentView === 'users' && (
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{item.name}</h3>
                          <span className="text-xs text-primary-600 dark:text-primary-400">{item.id}</span>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {item.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {item.wardrobeCount} wardrobes, {item.itemsCount} items
                          </span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5" />
                            {item.deviceModel} - {item.platform} ({item.osVersion})
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {item.signupMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionMenu(showActionMenu === item.id ? null : item.id);
                        }}
                        className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                      {showActionMenu === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Toggle status:', item);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-950 transition-colors flex items-center gap-2"
                          >
                            <UserX className="w-4 h-4" />
                            {item.status === 'active' ? 'Mark Inactive' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {currentView === 'guest-users' && (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white">{item.sessionId}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />
                          {item.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          {item.deviceModel} - {item.platform} ({item.osVersion})
                        </span>
                        <span>Last activity: {formatDateTime(item.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========== PAGINATION ========== */}
        {sortedData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No results found</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* ========== USER DETAIL VIEW ========== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-950 overflow-y-auto">
          <UserDetail
            user={selectedItem}
            moodHistory={mockMoodHistory}
            onBack={() => setSelectedItem(null)}
            onEdit={(user) => {
              console.log('Edit user:', user);
              toast.info('Edit functionality will be implemented');
            }}
            onDelete={(user) => {
              console.log('Delete user:', user);
              toast.error('Delete functionality will be implemented');
            }}
          />
        </div>
      )}

      {/* ========== ADD USER/SUB ADMIN MODAL ========== */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewSubAdmin({ name: '', email: '', role: '', status: 'active' });
        }}
        title={currentView === 'sub-admins' ? 'Add Admin User' : 'Add User'}
        description={currentView === 'sub-admins' ? 'Create a new admin user account. A set password email will be sent.' : 'Create a new user account. An activation email will be sent.'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddSubAdmin(); }}>
          <FormSection>
            <FormField>
              <FormLabel htmlFor="name" required>
                Full Name
              </FormLabel>
              <FormInput
                id="name"
                type="text"
                placeholder="Enter full name"
                value={newSubAdmin.name}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, name: e.target.value })}
                required
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <FormInput
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newSubAdmin.email}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
                required
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="role" required>
                Role
              </FormLabel>
              <FormSelect
                id="role"
                value={newSubAdmin.role}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                <option value="Content Manager">Content Manager</option>
                <option value="User Support">User Support</option>
                <option value="Moderator">Moderator</option>
              </FormSelect>
            </FormField>

            <FormField>
              <FormLabel htmlFor="status" required>
                Status
              </FormLabel>
              <FormSelect
                id="status"
                value={newSubAdmin.status}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, status: e.target.value as 'active' | 'inactive' })}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </FormSelect>
            </FormField>
          </FormSection>

          <FormFooter>
            <SecondaryButton
              onClick={() => {
                setShowAddModal(false);
                setNewSubAdmin({ name: '', email: '', role: '', status: 'active' });
              }}
              type="button"
            >
              Discard
            </SecondaryButton>
            <PrimaryButton type="submit">
              Create New
            </PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>
    </div>
  );
}