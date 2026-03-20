import { useState, useMemo } from 'react';
import {
  Mail,
  Globe,
  Calendar,
  ArrowLeft,
  Wallet,
  ShoppingBag,
  Image as ImageIcon,
  Heart,
  Award,
  Clock,
  User as UserIcon,
  MapPin,
  Cake,
  Star,
  UserCircle2,
  Hash,
  Palette,
  Sparkles,
  Smile,
  Eye,
  BarChart3,
  DollarSign,
  Smartphone,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Pagination } from './hb/listing';
import { formatDate, formatDateTime } from '@/utils/dateFormatter';

interface DeletedUser {
  deletedUserId: string;
  userId: string;
  name: string;
  email: string;
  country: string;
  deletedAt: string;
  deletionReason: string;
  deviceModel: string | null;
  osVersion: string | null;
  profile: {
    bio: string;
    profileImageUrl: string;
    dateOfBirth: string;
    zodiacSign: string;
    gender: string;
    ageGroup: string;
    location: string;
    bodyShape: string;
    colorPreference: string[];
    stylePreference: string[];
    signUpDate: string;
    lastLoginDate: string;
  };
  stats: {
    wardrobeCount: number;
    wardrobeItemCount: number;
    ootdCount: number;
    rewardWalletBalance: number;
  };
  status: string;
}

interface MoodHistory {
  date: string;
  mood: string;
}

interface WardrobeItem {
  wardrobeId: string;
  wardrobeName: string;
  wardrobeQuotient: number;
  wardrobeItemCount: number;
}

interface WishlistItem {
  itemId: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface RewardTransaction {
  points: number;
  transactionType: 'credit' | 'debit';
  actionDone: string;
  transactionDate: string;
}

interface DeletedUserDetailProps {
  deletedUserId: string;
  onBack: () => void;
}

// Mock data generator
const generateMockDeletedUser = (deletedUserId: string): DeletedUser => {
  return {
    deletedUserId,
    userId: 'U10234',
    name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'United States',
    deletedAt: '2026-01-20T12:30:00Z',
    deletionReason: 'Privacy concerns',
    deviceModel: 'iPhone 14 Pro',
    osVersion: 'iOS 17.2',
    profile: {
      bio: 'Casual chic all day',
      profileImageUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjgxMDI5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      dateOfBirth: '1997-04-18',
      zodiacSign: 'Aries',
      gender: 'Male',
      ageGroup: '25-34',
      location: 'New York',
      bodyShape: 'Rectangle',
      colorPreference: ['Black', 'Pastel'],
      stylePreference: ['Minimal', 'Streetwear'],
      signUpDate: '2025-11-20',
      lastLoginDate: '2026-01-18',
    },
    stats: {
      wardrobeCount: 5,
      wardrobeItemCount: 87,
      ootdCount: 120,
      rewardWalletBalance: 340,
    },
    status: 'deleted',
  };
};

const mockMoodHistory: MoodHistory[] = [
  { date: '2026-01-18', mood: 'Happy' },
  { date: '2026-01-17', mood: 'Sad' },
  { date: '2026-01-16', mood: 'Excited' },
  { date: '2026-01-15', mood: 'Calm' },
  { date: '2026-01-14', mood: 'Anxious' },
  { date: '2026-01-13', mood: 'Happy' },
  { date: '2026-01-12', mood: 'Energetic' },
  { date: '2026-01-11', mood: 'Tired' },
  { date: '2026-01-10', mood: 'Calm' },
  { date: '2026-01-09', mood: 'Happy' },
];

const mockWardrobes: WardrobeItem[] = [
  { wardrobeId: 'W001', wardrobeName: 'Workwear', wardrobeQuotient: 78, wardrobeItemCount: 24 },
  { wardrobeId: 'W002', wardrobeName: 'Casual', wardrobeQuotient: 85, wardrobeItemCount: 32 },
  { wardrobeId: 'W003', wardrobeName: 'Formal', wardrobeQuotient: 92, wardrobeItemCount: 18 },
  { wardrobeId: 'W004', wardrobeName: 'Sports', wardrobeQuotient: 67, wardrobeItemCount: 15 },
];

const mockWishlist: WishlistItem[] = [
  {
    itemId: 'IT-9001',
    title: 'Black blazer',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
  },
  {
    itemId: 'IT-9002',
    title: 'White sneakers',
    category: 'Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
  },
  {
    itemId: 'IT-9003',
    title: 'Denim jacket',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
  },
];

const mockRewards: RewardTransaction[] = [
  {
    points: 40,
    transactionType: 'credit',
    actionDone: 'OOTD Generation',
    transactionDate: '2026-01-10T11:22:00Z',
  },
  {
    points: 20,
    transactionType: 'credit',
    actionDone: 'Daily Login',
    transactionDate: '2026-01-09T08:15:00Z',
  },
  {
    points: 50,
    transactionType: 'debit',
    actionDone: 'Reward Redemption',
    transactionDate: '2026-01-08T14:30:00Z',
  },
  {
    points: 30,
    transactionType: 'credit',
    actionDone: 'Profile Completion',
    transactionDate: '2026-01-07T10:45:00Z',
  },
];

// Mock Virtual Try On Data
const mockVirtualTryOnItems = [
  {
    id: 'VTO001',
    imageUrl: 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=500',
    dateTime: '2026-01-27 14:30:00',
    headwear: 'Baseball Cap',
    top: 'White T-Shirt',
    bottom: 'Blue Jeans',
    shoes: 'White Sneakers',
    accessories: 'Watch',
  },
  {
    id: 'VTO002',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
    dateTime: '2026-01-26 11:15:22',
    headwear: 'None',
    top: 'Leather Jacket',
    bottom: 'Black Pants',
    shoes: 'Ankle Boots',
    accessories: 'Silver Bracelet',
  },
  {
    id: 'VTO003',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500',
    dateTime: '2026-01-25 16:45:10',
    headwear: 'Beanie',
    top: 'Sweater',
    bottom: 'Skirt',
    shoes: 'Heels',
    accessories: 'Earrings',
  },
];

// Mock OOTD Data
const mockOotdItems = [
  {
    id: 'OOTD001',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
    dateTime: '2026-01-27 18:20:15',
    headwear: 'Wide Brim Hat',
    top: 'Blazer & White Tee',
    bottom: 'Tailored Pants',
    shoes: 'Loafers',
    accessories: 'Leather Bag',
  },
  {
    id: 'OOTD002',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
    dateTime: '2026-01-26 14:10:30',
    headwear: 'None',
    top: 'Floral Dress',
    bottom: 'N/A',
    shoes: 'Sandals',
    accessories: 'Sunglasses',
  },
  {
    id: 'OOTD003',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
    dateTime: '2026-01-25 09:30:45',
    headwear: 'None',
    top: 'Denim Jacket',
    bottom: 'Black Jeans',
    shoes: 'Combat Boots',
    accessories: 'Chain Necklace',
  },
];

// Mock Past Wardrobe Index Data
const mockPastWardrobeIndex = [
  {
    id: 'PWI001',
    wardrobe: 87,
    dateTime: '2026-01-15 10:30:00',
    suggestion: 'Emerald green top, Ikat print shirt, Cat-eye sunglasses',
    categoryWise: {
      tops: 12,
      bottoms: 8,
      shoes: 6,
      accessories: 10,
      headwear: 4,
    },
  },
  {
    id: 'PWI002',
    wardrobe: 92,
    dateTime: '2026-01-10 14:20:00',
    suggestion: 'Navy blazer, White button-up, Brown loafers',
    categoryWise: {
      tops: 15,
      bottoms: 10,
      shoes: 8,
      accessories: 12,
      headwear: 3,
    },
  },
  {
    id: 'PWI003',
    wardrobe: 78,
    dateTime: '2026-01-05 09:45:00',
    suggestion: 'Casual graphic tee, Distressed jeans, White sneakers',
    categoryWise: {
      tops: 10,
      bottoms: 7,
      shoes: 5,
      accessories: 8,
      headwear: 2,
    },
  },
];

export default function DeletedUserDetail({ deletedUserId, onBack }: DeletedUserDetailProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'wardrobe' | 'wishlist' | 'rewards' | 'virtualtryon' | 'ootd' | 'pastwardrobeindex'>('profile');
  const [moodHistoryPage, setMoodHistoryPage] = useState(1);
  const [moodHistoryPageSize, setMoodHistoryPageSize] = useState(10);
  const [wardrobePage, setWardrobePage] = useState(1);
  const [wardrobePageSize, setWardrobePageSize] = useState(10);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [wishlistPageSize, setWishlistPageSize] = useState(10);
  const [rewardsPage, setRewardsPage] = useState(1);
  const [rewardsPageSize, setRewardsPageSize] = useState(10);
  const [visibleTryonItems, setVisibleTryonItems] = useState(9);
  const [visibleOotdItems, setVisibleOotdItems] = useState(9);
  const [visiblePastWardrobeItems, setVisiblePastWardrobeItems] = useState(9);

  // Generate mock user data
  const user = generateMockDeletedUser(deletedUserId);

  // Paginate mood history
  const paginatedMoodHistory = useMemo(() => {
    const startIndex = (moodHistoryPage - 1) * moodHistoryPageSize;
    return mockMoodHistory.slice(startIndex, startIndex + moodHistoryPageSize);
  }, [moodHistoryPage, moodHistoryPageSize]);

  const moodHistoryTotalPages = Math.ceil(mockMoodHistory.length / moodHistoryPageSize);

  // Paginate wardrobes
  const paginatedWardrobes = useMemo(() => {
    const startIndex = (wardrobePage - 1) * wardrobePageSize;
    return mockWardrobes.slice(startIndex, startIndex + wardrobePageSize);
  }, [wardrobePage, wardrobePageSize]);

  const wardrobeTotalPages = Math.ceil(mockWardrobes.length / wardrobePageSize);

  // Paginate wishlist
  const paginatedWishlist = useMemo(() => {
    const startIndex = (wishlistPage - 1) * wishlistPageSize;
    return mockWishlist.slice(startIndex, startIndex + wishlistPageSize);
  }, [wishlistPage, wishlistPageSize]);

  const wishlistTotalPages = Math.ceil(mockWishlist.length / wishlistPageSize);

  // Paginate rewards
  const paginatedRewards = useMemo(() => {
    const startIndex = (rewardsPage - 1) * rewardsPageSize;
    return mockRewards.slice(startIndex, startIndex + rewardsPageSize);
  }, [rewardsPage, rewardsPageSize]);

  const rewardsTotalPages = Math.ceil(mockRewards.length / rewardsPageSize);

  return (
    <div className="flex-1 p-6 bg-neutral-50 dark:bg-neutral-950 overflow-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deleted Users
      </button>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Deleted User Details</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error-100 dark:bg-error-900 border border-error-200 dark:border-error-800 rounded-full">
            <Trash2 className="w-3.5 h-3.5 text-error-600 dark:text-error-400" />
            <span className="text-sm font-medium text-error-700 dark:text-error-300">Deleted</span>
          </span>
        </div>
        <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <button className="hover:text-neutral-900 dark:hover:text-white">User Management</button>
          <span>/</span>
          <button className="hover:text-neutral-900 dark:hover:text-white">Deleted Users</button>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">{user.name}</span>
        </nav>
      </div>

      {/* Deletion Info Alert */}
      <div className="mb-6 bg-warning-100 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-warning-900 dark:text-warning-100 mb-1">
              Account Deleted
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-warning-700 dark:text-warning-300">
              <div>
                <span className="font-medium">Deleted On:</span> {formatDateTime(user.deletedAt)}
              </div>
              <div>
                <span className="font-medium">Reason:</span> {user.deletionReason || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Device:</span> {user.deviceModel || 'N/A'}
              </div>
              <div>
                <span className="font-medium">OS:</span> {user.osVersion || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Summary Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.profile.profileImageUrl ? (
              <img
                src={user.profile.profileImageUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-neutral-500 dark:text-neutral-400" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{user.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Hash className="w-4 h-4" />
                <span>User ID: {user.userId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Globe className="w-4 h-4" />
                <span>{user.country}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4" />
                <span>{user.profile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Wardrobes</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{user.stats.wardrobeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <ImageIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Wardrobe Items</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{user.stats.wardrobeItemCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
              <Sparkles className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">OOTD Count</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{user.stats.ootdCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-error-100 dark:bg-error-900 rounded-lg">
              <Wallet className="w-5 h-5 text-error-600 dark:text-error-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Reward Balance</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{user.stats.rewardWalletBalance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <div className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'profile'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Basic Profile
            </button>
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'wardrobe'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Wardrobe Details
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'wishlist'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Wishlist Items
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'rewards'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Rewards
            </button>
            <button
              onClick={() => setActiveTab('virtualtryon')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'virtualtryon'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Virtual Try Ons
            </button>
            <button
              onClick={() => setActiveTab('ootd')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'ootd'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              OOTD
            </button>
            <button
              onClick={() => setActiveTab('pastwardrobeindex')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'pastwardrobeindex'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Past Wardrobe Index
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Basic User Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                  Bio
                </label>
                <p className="text-sm text-neutral-900 dark:text-neutral-100">{user.profile.bio || 'N/A'}</p>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Cake className="w-4 h-4 text-neutral-400" />
                      <span>{formatDate(user.profile.dateOfBirth)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Zodiac Sign
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Star className="w-4 h-4 text-neutral-400" />
                      <span>{user.profile.zodiacSign}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Gender
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <UserCircle2 className="w-4 h-4 text-neutral-400" />
                      <span>{user.profile.gender}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Age Group
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Hash className="w-4 h-4 text-neutral-400" />
                      <span>{user.profile.ageGroup}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Style Preferences */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Style Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Body Shape
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <UserIcon className="w-4 h-4 text-neutral-400" />
                      <span>{user.profile.bodyShape}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Color Preference
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Palette className="w-4 h-4 text-neutral-400" />
                      <span>{user.profile.colorPreference.join(', ')}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Style Preference
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Sparkles className="w-4 h-4 text-neutral-400" />
                      <span>{user.profile.stylePreference.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Sign Up Date
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span>{formatDate(user.profile.signUpDate)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1 block">
                      Last Login Date
                    </label>
                    <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <span>{formatDate(user.profile.lastLoginDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood History */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Mood History</h3>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Mood</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {paginatedMoodHistory.map((mood, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">{formatDate(mood.date)}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                              <Smile className="w-3 h-3" />
                              {mood.mood}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                    <Pagination
                      currentPage={moodHistoryPage}
                      totalPages={moodHistoryTotalPages}
                      pageSize={moodHistoryPageSize}
                      totalItems={mockMoodHistory.length}
                      onPageChange={setMoodHistoryPage}
                      onPageSizeChange={(newSize) => {
                        setMoodHistoryPageSize(newSize);
                        setMoodHistoryPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wardrobe Details Tab */}
          {activeTab === 'wardrobe' && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Wardrobe Collections</h3>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Wardrobe Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Quotient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Item Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedWardrobes.map((wardrobe) => (
                      <tr key={wardrobe.wardrobeId}>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">{wardrobe.wardrobeName}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full"
                                style={{ width: `${wardrobe.wardrobeQuotient}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-neutral-900 dark:text-neutral-100">{wardrobe.wardrobeQuotient}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">{wardrobe.wardrobeItemCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                  <Pagination
                    currentPage={wardrobePage}
                    totalPages={wardrobeTotalPages}
                    pageSize={wardrobePageSize}
                    totalItems={mockWardrobes.length}
                    onPageChange={setWardrobePage}
                    onPageSizeChange={(newSize) => {
                      setWardrobePageSize(newSize);
                      setWardrobePage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Items Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Wishlist Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {paginatedWishlist.map((item) => (
                  <div
                    key={item.itemId}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <Pagination
                  currentPage={wishlistPage}
                  totalPages={wishlistTotalPages}
                  pageSize={wishlistPageSize}
                  totalItems={mockWishlist.length}
                  onPageChange={setWishlistPage}
                  onPageSizeChange={(newSize) => {
                    setWishlistPageSize(newSize);
                    setWishlistPage(1);
                  }}
                />
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Reward Transactions</h3>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedRewards.map((reward, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">
                          {formatDateTime(reward.transactionDate)}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">{reward.actionDone}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              reward.transactionType === 'credit'
                                ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                                : 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300'
                            }`}
                          >
                            {reward.transactionType === 'credit' ? 'Credit' : 'Debit'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-medium ${
                              reward.transactionType === 'credit'
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-error-600 dark:text-error-400'
                            }`}
                          >
                            {reward.transactionType === 'credit' ? '+' : '-'}
                            {reward.points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
                  <Pagination
                    currentPage={rewardsPage}
                    totalPages={rewardsTotalPages}
                    pageSize={rewardsPageSize}
                    totalItems={mockRewards.length}
                    onPageChange={setRewardsPage}
                    onPageSizeChange={(newSize) => {
                      setRewardsPageSize(newSize);
                      setRewardsPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Virtual Try On Tab */}
          {activeTab === 'virtualtryon' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Virtual Try Ons ({mockVirtualTryOnItems.length} items)
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockVirtualTryOnItems.slice(0, visibleTryonItems).map((item) => (
                    <div key={item.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img 
                        src={item.imageUrl} 
                        alt={`Virtual Try On ${item.id}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.dateTime}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Headwear:</span>
                            <span className="text-neutral-900 dark:text-white">{item.headwear}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Top:</span>
                            <span className="text-neutral-900 dark:text-white">{item.top}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Bottom:</span>
                            <span className="text-neutral-900 dark:text-white">{item.bottom}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Shoes:</span>
                            <span className="text-neutral-900 dark:text-white">{item.shoes}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Accessories:</span>
                            <span className="text-neutral-900 dark:text-white">{item.accessories}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {mockVirtualTryOnItems.length > visibleTryonItems && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setVisibleTryonItems(prev => Math.min(prev + 9, mockVirtualTryOnItems.length))}
                      className="px-4 py-2 text-sm font-medium border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-950 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OOTD Tab */}
          {activeTab === 'ootd' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Outfit of the Day ({mockOotdItems.length} items)
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockOotdItems.slice(0, visibleOotdItems).map((item) => (
                    <div key={item.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img 
                        src={item.imageUrl} 
                        alt={`OOTD ${item.id}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.dateTime}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Headwear:</span>
                            <span className="text-neutral-900 dark:text-white">{item.headwear}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Top:</span>
                            <span className="text-neutral-900 dark:text-white">{item.top}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Bottom:</span>
                            <span className="text-neutral-900 dark:text-white">{item.bottom}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Shoes:</span>
                            <span className="text-neutral-900 dark:text-white">{item.shoes}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400 min-w-[80px]">Accessories:</span>
                            <span className="text-neutral-900 dark:text-white">{item.accessories}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {mockOotdItems.length > visibleOotdItems && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setVisibleOotdItems(prev => Math.min(prev + 9, mockOotdItems.length))}
                      className="px-4 py-2 text-sm font-medium border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-950 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Past Wardrobe Index Tab */}
          {activeTab === 'pastwardrobeindex' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Past Wardrobe Index ({mockPastWardrobeIndex.length} items)
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPastWardrobeIndex.slice(0, visiblePastWardrobeItems).map((item) => (
                    <div key={item.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Wardrobe Index: {item.wardrobe}</h3>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.dateTime}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Suggestion</h4>
                          <p className="text-sm text-neutral-900 dark:text-white italic">{item.suggestion}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Category Wise</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">Tops</span>
                              <span className="font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.categoryWise.tops}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">Bottoms</span>
                              <span className="font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.categoryWise.bottoms}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">Shoes</span>
                              <span className="font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.categoryWise.shoes}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">Accessories</span>
                              <span className="font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.categoryWise.accessories}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">Headwear</span>
                              <span className="font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.categoryWise.headwear}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {mockPastWardrobeIndex.length > visiblePastWardrobeItems && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setVisiblePastWardrobeItems(prev => Math.min(prev + 9, mockPastWardrobeIndex.length))}
                      className="px-4 py-2 text-sm font-medium border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-950 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Read-only Notice */}
      <div className="mt-6 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
        <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
          This is a read-only view of a deleted user account. No actions can be performed on this account.
        </p>
      </div>
    </div>
  );
}