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
  CheckCircle2,
  XCircle,
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
} from 'lucide-react';
import { Pagination } from './hb/listing';

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
  virtualTryOnCount: number;
  wardrobeIndex: number;
  avgCostPerWear: number;
  wardrobeImprovementScore?: number;
  circularIntelligenceScore?: number;
  deviceModel?: string;
  osVersion?: string;
}

interface MoodHistory {
  id: string;
  date: string;
  mood: string;
}

interface UserDetailProps {
  user: RegisteredUser;
  moodHistory: MoodHistory[];
  onBack: () => void;
}

export default function UserDetail({ user, moodHistory, onBack }: UserDetailProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'wardrobe' | 'wishlist' | 'rewards' | 'virtualtryon' | 'ootd' | 'pastwardrobeindex'>('profile');
  const [moodHistoryPage, setMoodHistoryPage] = useState(1);
  const [moodHistoryPageSize, setMoodHistoryPageSize] = useState(10);
  const [rewardsPage, setRewardsPage] = useState(1);
  const [rewardsPageSize, setRewardsPageSize] = useState(10);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [wishlistPageSize, setWishlistPageSize] = useState(10);
  const [visibleTryonItems, setVisibleTryonItems] = useState(9);
  const [visibleOotdItems, setVisibleOotdItems] = useState(9);
  const [visiblePastWardrobeItems, setVisiblePastWardrobeItems] = useState(9);
  
  // New state for status update
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive'>(user.status);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Mock Wardrobe Data
  const mockWardrobeItems = [
    {
      id: 'WRD001',
      name: 'Summer Floral Dress',
      category: 'Top',
      color: 'Multicolor',
      brand: 'Zara',
      pattern: 'Floral',
      material: 'Cotton',
      addedDate: '2026-01-10',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      itemCost: 89.99,
      wardrobeName: 'Summer Collection',
      wardrobeId: 'W001',
      timesWorn: 10,
      daysSinceLastWorn: 2,
      description: 'A beautiful summer dress perfect for beach outings and sunny days.',
    },
    {
      id: 'WRD002',
      name: 'Classic Denim Jeans',
      category: 'Bottom',
      color: 'Blue',
      brand: "Levi's",
      pattern: 'Solid',
      material: 'Denim',
      addedDate: '2026-01-08',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      itemCost: 65.00,
      wardrobeName: 'Casual Essentials',
      wardrobeId: 'W002',
      timesWorn: 20,
      daysSinceLastWorn: 1,
      description: 'Classic and versatile denim jeans that go with any outfit.',
    },
    {
      id: 'WRD003',
      name: 'White Sneakers',
      category: 'Shoes',
      color: 'White',
      brand: 'Nike',
      pattern: 'Solid',
      material: 'Leather',
      addedDate: '2026-01-05',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      itemCost: 120.00,
      wardrobeName: 'Footwear Collection',
      wardrobeId: 'W003',
      timesWorn: 5,
      daysSinceLastWorn: 15,
      description: 'Comfortable and stylish white sneakers for daily wear.',
    },
    {
      id: 'WRD004',
      name: 'Leather Jacket',
      category: 'Top',
      color: 'Black',
      brand: 'AllSaints',
      pattern: 'Solid',
      material: 'Leather',
      addedDate: '2025-12-28',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      itemCost: 245.00,
      wardrobeName: 'Winter Outerwear',
      wardrobeId: 'W004',
      timesWorn: 1,
      daysSinceLastWorn: 45,
      description: 'Premium leather jacket offering a sleek and edgy look.',
    },
    {
      id: 'WRD005',
      name: 'Summer Hat',
      category: 'Headwear',
      color: 'Beige',
      brand: 'H&M',
      pattern: 'Solid',
      material: 'Straw',
      addedDate: '2025-12-20',
      imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400',
      itemCost: 35.50,
      wardrobeName: 'Summer Collection',
      wardrobeId: 'W001',
      timesWorn: 0,
      description: 'Wide-brim straw hat to protect from the sun in style.',
    },
    {
      id: 'WRD006',
      name: 'Gold Necklace',
      category: 'Accessories',
      color: 'Gold',
      brand: 'Tiffany & Co.',
      pattern: 'Plain',
      material: 'Gold',
      addedDate: '2025-12-15',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      itemCost: 159.99,
      wardrobeName: 'Jewelry Collection',
      wardrobeId: 'W005',
      timesWorn: 2,
      daysSinceLastWorn: 30,
      description: 'Elegant gold necklace to add a touch of luxury to your look.',
    },
  ];

  // Mock Wishlist Data
  const mockWishlistItems = [
    { id: 'WISH001', name: 'Designer Handbag', category: 'Accessories', wardrobeQuotient: 85, addedDate: '2026-01-18 14:30:00' },
    { id: 'WISH002', name: 'Silk Evening Gown', category: 'Top', wardrobeQuotient: 92, addedDate: '2026-01-12 09:15:00' },
    { id: 'WISH003', name: 'High Heel Boots', category: 'Footwear', wardrobeQuotient: 60, addedDate: '2026-01-06 18:45:00' },
    { id: 'WISH004', name: 'Wool Winter Coat', category: 'Top', wardrobeQuotient: 78, addedDate: '2025-12-30 11:20:00' },
    { id: 'WISH005', name: 'Vintage Sunglasses', category: 'Accessories', wardrobeQuotient: 45, addedDate: '2025-12-25 10:00:00' },
    { id: 'WISH006', name: 'Cashmere Scarf', category: 'Accessories', wardrobeQuotient: 65, addedDate: '2025-12-20 16:30:00' },
    { id: 'WISH007', name: 'Leather Belt', category: 'Accessories', wardrobeQuotient: 50, addedDate: '2025-12-15 13:45:00' },
    { id: 'WISH008', name: 'Platform Sandals', category: 'Footwear', wardrobeQuotient: 72, addedDate: '2025-12-10 09:20:00' },
    { id: 'WISH009', name: 'Denim Jacket', category: 'Outerwear', wardrobeQuotient: 88, addedDate: '2025-12-05 14:10:00' },
    { id: 'WISH010', name: 'Maxi Skirt', category: 'Bottom', wardrobeQuotient: 55, addedDate: '2025-11-30 11:55:00' },
    { id: 'WISH011', name: 'Silver Hoop Earrings', category: 'Jewelry', wardrobeQuotient: 95, addedDate: '2025-11-25 17:30:00' },
    { id: 'WISH012', name: 'Structured Tote', category: 'Accessories', wardrobeQuotient: 82, addedDate: '2025-11-20 12:15:00' },
  ];

  // Mock Virtual TryOn Data
  const mockVirtualTryOnItems = [
    {
      id: 'VTO001',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
      dateTime: '2026-01-27 14:30:45',
      headwear: 'Summer Hat',
      top: 'Floral Blouse',
      bottom: 'Denim Jeans',
      shoes: 'White Sneakers',
      accessories: 'Gold Necklace',
    },
    {
      id: 'VTO002',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
      dateTime: '2026-01-27 11:15:22',
      headwear: 'None',
      top: 'Leather Jacket',
      bottom: 'Black Pants',
      shoes: 'Ankle Boots',
      accessories: 'Silver Bracelet',
    },
    {
      id: 'VTO003',
      imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500',
      dateTime: '2026-01-26 16:45:10',
      headwear: 'Beanie',
      top: 'Sweater',
      bottom: 'Skirt',
      shoes: 'Heels',
      accessories: 'Earrings',
    },
    {
      id: 'VTO004',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
      dateTime: '2026-01-26 09:20:33',
      headwear: 'None',
      top: 'Blazer',
      bottom: 'Trousers',
      shoes: 'Oxford Shoes',
      accessories: 'Watch',
    },
    {
      id: 'VTO005',
      imageUrl: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=500',
      dateTime: '2026-01-25 13:55:18',
      headwear: 'Cap',
      top: 'T-Shirt',
      bottom: 'Shorts',
      shoes: 'Sandals',
      accessories: 'Sunglasses',
    },
    {
      id: 'VTO006',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500',
      dateTime: '2026-01-25 10:30:45',
      headwear: 'None',
      top: 'Cardigan',
      bottom: 'Jeans',
      shoes: 'Loafers',
      accessories: 'Scarf',
    },
    {
      id: 'VTO007',
      imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
      dateTime: '2026-01-24 15:10:22',
      headwear: 'Fedora',
      top: 'Dress Shirt',
      bottom: 'Chinos',
      shoes: 'Dress Shoes',
      accessories: 'Tie',
    },
    {
      id: 'VTO008',
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500',
      dateTime: '2026-01-24 08:45:55',
      headwear: 'None',
      top: 'Hoodie',
      bottom: 'Sweatpants',
      shoes: 'Sneakers',
      accessories: 'Backpack',
    },
    {
      id: 'VTO009',
      imageUrl: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?w=500',
      dateTime: '2026-01-23 17:25:10',
      headwear: 'Beret',
      top: 'Blouse',
      bottom: 'Skirt',
      shoes: 'Flats',
      accessories: 'Handbag',
    },
    {
      id: 'VTO010',
      imageUrl: 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=500',
      dateTime: '2026-01-23 12:40:33',
      headwear: 'None',
      top: 'Tank Top',
      bottom: 'Maxi Skirt',
      shoes: 'Wedges',
      accessories: 'Bracelet',
    },
    {
      id: 'VTO011',
      imageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=500',
      dateTime: '2026-01-22 14:15:47',
      headwear: 'Visor',
      top: 'Polo Shirt',
      bottom: 'Golf Pants',
      shoes: 'Golf Shoes',
      accessories: 'Belt',
    },
    {
      id: 'VTO012',
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
      dateTime: '2026-01-22 09:30:12',
      headwear: 'None',
      top: 'Kimono',
      bottom: 'Leggings',
      shoes: 'Slippers',
      accessories: 'Ring',
    },
    {
      id: 'VTO013',
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
      dateTime: '2026-01-21 16:50:25',
      headwear: 'Baseball Cap',
      top: 'Jersey',
      bottom: 'Athletic Shorts',
      shoes: 'Running Shoes',
      accessories: 'Fitness Tracker',
    },
    {
      id: 'VTO014',
      imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500',
      dateTime: '2026-01-21 11:20:10',
      headwear: 'None',
      top: 'Turtleneck',
      bottom: 'Pencil Skirt',
      shoes: 'Pumps',
      accessories: 'Clutch',
    },
    {
      id: 'VTO015',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
      dateTime: '2026-01-20 13:35:42',
      headwear: 'Headband',
      top: 'Crop Top',
      bottom: 'High Waist Pants',
      shoes: 'Platform Shoes',
      accessories: 'Choker',
    },
  ];

  // Mock OOTD Data
  const mockOotdItems = [
    {
      id: 'OOTD001',
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
      dateTime: '2026-01-27 18:20:15',
      era: 'Modern Classic',
      occasion: 'Business Casual',
      season: 'Spring',
      hairStyle: 'Low Bun',
      bodyShape: 'Hourglass',
      mood: 'Confident',
      styleComfort: 'Tailored',
      dressCode: 'Smart Casual',
      fabricChoice: 'Cotton Blend',
      headwear: 'Wide Brim Hat',
      top: 'Blazer & White Tee',
      bottom: 'Tailored Pants',
      shoes: 'Loafers',
      accessories: 'Statement Earrings',
    },
    {
      id: 'OOTD002',
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500',
      dateTime: '2026-01-27 10:45:30',
      era: 'Streetwear',
      occasion: 'Casual Hangout',
      season: 'Autumn',
      hairStyle: 'Messy Hair',
      bodyShape: 'Rectangle',
      mood: 'Relaxed',
      styleComfort: 'Oversized',
      dressCode: 'Casual',
      fabricChoice: 'Cotton',
      headwear: 'None',
      top: 'Casual Hoodie',
      bottom: 'Joggers',
      shoes: 'White Sneakers',
      accessories: 'Minimalist Watch',
    },
    {
      id: 'OOTD003',
      imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500',
      dateTime: '2026-01-26 14:30:22',
      era: 'Y2K Edge',
      occasion: 'Skatepark',
      season: 'Summer',
      hairStyle: 'Textured Waves',
      bodyShape: 'Inverted Triangle',
      mood: 'Energetic',
      styleComfort: 'Loose Fit',
      dressCode: 'Street Wear',
      fabricChoice: 'Denim',
      headwear: 'Baseball Cap',
      top: 'Graphic Tee',
      bottom: 'Ripped Jeans',
      shoes: 'High-top Sneakers',
      accessories: 'Chain Necklace',
    },
    {
      id: 'OOTD004',
      imageUrl: 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=500',
      dateTime: '2026-01-26 09:15:48',
      era: 'Bohemian',
      occasion: 'Brunch',
      season: 'Summer',
      hairStyle: 'Loose Waves',
      bodyShape: 'Apple',
      mood: 'Joyful',
      styleComfort: 'Flowy',
      dressCode: 'Smart Casual',
      fabricChoice: 'Linen',
      headwear: 'None',
      top: 'Summer Dress',
      bottom: 'N/A',
      shoes: 'Sandals',
      accessories: 'Bracelet & Ring',
    },
    {
      id: 'OOTD005',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
      dateTime: '2026-01-25 16:40:12',
      era: 'Elegant Chic',
      occasion: 'Dinner Date',
      season: 'Winter',
      hairStyle: 'Sleek Straight',
      bodyShape: 'Pear',
      mood: 'Romantic',
      styleComfort: 'Form-fitting',
      dressCode: 'Formal',
      fabricChoice: 'Silk',
      headwear: 'None',
      top: 'Silk Blouse',
      bottom: 'Midi Skirt',
      shoes: 'Pumps',
      accessories: 'Clutch & Pearl Necklace',
    },
    {
      id: 'OOTD006',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
      dateTime: '2026-01-25 11:20:35',
      era: 'Grunge Punk',
      occasion: 'Concert',
      season: 'Autumn',
      hairStyle: 'Textured Shag',
      bodyShape: 'Inverted Triangle',
      mood: 'Rebellious',
      styleComfort: 'Edgy',
      dressCode: 'Alternative',
      fabricChoice: 'Leather',
      headwear: 'None',
      top: 'Leather Jacket',
      bottom: 'Black Skinny Jeans',
      shoes: 'Combat Boots',
      accessories: 'Silver Rings',
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
      dateTime: '2026-01-10 14:20:15',
      suggestion: 'Cashmere sweater, Wool coat, Leather boots',
      categoryWise: {
        tops: 15,
        bottoms: 10,
        shoes: 8,
        accessories: 12,
        headwear: 6,
      },
    },
    {
      id: 'PWI003',
      wardrobe: 78,
      dateTime: '2026-01-05 09:45:30',
      suggestion: 'Denim jacket, White sneakers, Tote bag',
      categoryWise: {
        tops: 18,
        bottoms: 14,
        shoes: 10,
        accessories: 8,
        headwear: 3,
      },
    },
    {
      id: 'PWI004',
      wardrobe: 95,
      dateTime: '2025-12-28 16:10:45',
      suggestion: 'Tailored blazer, Oxford shoes, Silk tie',
      categoryWise: {
        tops: 10,
        bottoms: 8,
        shoes: 6,
        accessories: 15,
        headwear: 2,
      },
    },
    {
      id: 'PWI005',
      wardrobe: 65,
      dateTime: '2025-12-20 11:35:20',
      suggestion: 'Floral sundress, Straw hat, Espadrilles',
      categoryWise: {
        tops: 8,
        bottoms: 6,
        shoes: 5,
        accessories: 12,
        headwear: 5,
      },
    },
    {
      id: 'PWI006',
      wardrobe: 82,
      dateTime: '2025-12-15 08:20:10',
      suggestion: 'Sports bra, Running shoes, Fitness tracker',
      categoryWise: {
        tops: 14,
        bottoms: 12,
        shoes: 8,
        accessories: 6,
        headwear: 4,
      },
    },
    {
      id: 'PWI007',
      wardrobe: 88,
      dateTime: '2025-12-10 19:45:30',
      suggestion: 'Sequin dress, Strappy heels, Statement earrings',
      categoryWise: {
        tops: 6,
        bottoms: 4,
        shoes: 8,
        accessories: 20,
        headwear: 2,
      },
    },
    {
      id: 'PWI008',
      wardrobe: 91,
      dateTime: '2025-12-05 07:30:15',
      suggestion: 'Pencil skirt, Blouse, Pumps',
      categoryWise: {
        tops: 16,
        bottoms: 12,
        shoes: 10,
        accessories: 14,
        headwear: 1,
      },
    },
    {
      id: 'PWI009',
      wardrobe: 73,
      dateTime: '2025-11-28 15:20:45',
      suggestion: 'Oversized hoodie, High-top sneakers, Baseball cap',
      categoryWise: {
        tops: 20,
        bottoms: 15,
        shoes: 12,
        accessories: 10,
        headwear: 8,
      },
    },
    {
      id: 'PWI010',
      wardrobe: 69,
      dateTime: '2025-11-20 12:40:00',
      suggestion: 'Flowy maxi skirt, Fringe bag, Layered necklaces',
      categoryWise: {
        tops: 12,
        bottoms: 8,
        shoes: 6,
        accessories: 18,
        headwear: 6,
      },
    },
    {
      id: 'PWI011',
      wardrobe: 58,
      dateTime: '2025-11-15 10:15:30',
      suggestion: 'White t-shirt, Black jeans, Leather belt',
      categoryWise: {
        tops: 10,
        bottoms: 8,
        shoes: 6,
        accessories: 5,
        headwear: 2,
      },
    },
    {
      id: 'PWI012',
      wardrobe: 76,
      dateTime: '2025-11-10 14:50:20',
      suggestion: 'Polka dot dress, Cat-eye sunglasses, Red lipstick',
      categoryWise: {
        tops: 14,
        bottoms: 10,
        shoes: 8,
        accessories: 16,
        headwear: 5,
      },
    },
    {
      id: 'PWI013',
      wardrobe: 42,
      dateTime: '2025-11-05 18:30:15',
      suggestion: 'Oversized sweater, Fuzzy slippers, Sweatpants',
      categoryWise: {
        tops: 8,
        bottoms: 6,
        shoes: 4,
        accessories: 3,
        headwear: 1,
      },
    },
    {
      id: 'PWI014',
      wardrobe: 71,
      dateTime: '2025-10-28 13:20:45',
      suggestion: 'Crop top, Denim shorts, Ankle boots',
      categoryWise: {
        tops: 10,
        bottoms: 8,
        shoes: 6,
        accessories: 14,
        headwear: 7,
      },
    },
    {
      id: 'PWI015',
      wardrobe: 97,
      dateTime: '2025-10-20 20:15:00',
      suggestion: 'Evening gown, Clutch bag, Diamond earrings',
      categoryWise: {
        tops: 6,
        bottoms: 4,
        shoes: 8,
        accessories: 22,
        headwear: 1,
      },
    },
  ];

  // Mock Rewards Data
  const mockRewardsHistory = [
    { id: 'REW001', points: 20, transactionType: 'Credit', actionPerformed: 'User Registration', date: '2026-01-27 09:15:23' },
    { id: 'REW002', points: 5, transactionType: 'Credit', actionPerformed: 'Full Name Added', date: '2026-01-27 09:16:45' },
    { id: 'REW003', points: 5, transactionType: 'Credit', actionPerformed: 'Age Group Selected', date: '2026-01-27 09:17:12' },
    { id: 'REW004', points: 10, transactionType: 'Credit', actionPerformed: 'Body Shape Added', date: '2026-01-27 09:18:34' },
    { id: 'REW005', points: 10, transactionType: 'Credit', actionPerformed: 'Color Preference Added', date: '2026-01-27 09:19:02' },
    { id: 'REW006', points: 15, transactionType: 'Credit', actionPerformed: 'Valid User Image Uploaded', date: '2026-01-27 09:20:18' },
    { id: 'REW007', points: 10, transactionType: 'Credit', actionPerformed: 'Style Preference Added', date: '2026-01-27 09:21:47' },
    { id: 'REW008', points: 20, transactionType: 'Credit', actionPerformed: 'First Outfit Added', date: '2026-01-27 10:05:33' },
    { id: 'REW009', points: 15, transactionType: 'Credit', actionPerformed: 'First Social Post', date: '2026-01-26 14:30:11' },
    { id: 'REW010', points: 3, transactionType: 'Credit', actionPerformed: 'Daily Login – Day 1', date: '2026-01-22 08:30:12' },
    { id: 'REW011', points: 3, transactionType: 'Credit', actionPerformed: 'Daily Login – Day 2', date: '2026-01-23 09:15:45' },
    { id: 'REW012', points: 3, transactionType: 'Credit', actionPerformed: 'Daily Login – Day 3', date: '2026-01-24 07:45:22' },
    { id: 'REW013', points: 3, transactionType: 'Credit', actionPerformed: 'Daily Login – Day 4', date: '2026-01-25 10:20:11' },
    { id: 'REW014', points: 3, transactionType: 'Credit', actionPerformed: 'Daily Login – Day 5', date: '2026-01-26 08:55:37' },
    { id: 'REW015', points: 3, transactionType: 'Credit', actionPerformed: 'Daily Login – Day 6', date: '2026-01-27 09:10:05' },
    { id: 'REW016', points: 15, transactionType: 'Credit', actionPerformed: 'Weekly Streak Bonus', date: '2026-01-28 09:10:10' },
    { id: 'REW017', points: 20, transactionType: 'Credit', actionPerformed: 'Complete Outfit Set', date: '2026-01-20 14:22:18' },
    { id: 'REW018', points: 25, transactionType: 'Credit', actionPerformed: 'Monthly Wardrobe Update', date: '2026-01-15 11:20:33' },
    { id: 'REW019', points: 5, transactionType: 'Credit', actionPerformed: 'Add Brand Name', date: '2026-01-18 13:45:22' },
    { id: 'REW020', points: 10, transactionType: 'Credit', actionPerformed: 'Add Purchase Price', date: '2026-01-19 15:30:11' },
    { id: 'REW021', points: 2, transactionType: 'Credit', actionPerformed: 'Like Post', date: '2026-01-19 15:32:45' },
    { id: 'REW022', points: 3, transactionType: 'Credit', actionPerformed: 'Comment Post', date: '2026-01-19 15:35:18' },
    { id: 'REW023', points: 5, transactionType: 'Credit', actionPerformed: 'Follow User', date: '2026-01-19 15:40:18' },
    { id: 'REW024', points: 10, transactionType: 'Debit', actionPerformed: 'Single Wardrobe Slot', date: '2026-01-20 10:15:33' },
    { id: 'REW025', points: 100, transactionType: 'Debit', actionPerformed: 'Buy Wardrobe Space', date: '2026-01-21 11:25:47' },
    { id: 'REW026', points: 15, transactionType: 'Debit', actionPerformed: 'Roll the Dice (OOTD Regeneration)', date: '2026-01-23 14:40:22' },
    { id: 'REW027', points: 20, transactionType: 'Debit', actionPerformed: 'Restore Streak', date: '2026-01-24 09:55:10' },
    { id: 'REW028', points: 20, transactionType: 'Debit', actionPerformed: 'Virtual Try-On', date: '2026-01-25 16:20:35' },
    { id: 'REW029', points: 50, transactionType: 'Debit', actionPerformed: 'Virtual Try-On HD Mode', date: '2026-01-26 12:15:10' },
    { id: 'REW030', points: 20, transactionType: 'Debit', actionPerformed: 'Download Try-On (No Watermark)', date: '2026-01-26 14:20:45' },
    { id: 'REW031', points: 130, transactionType: 'Debit', actionPerformed: 'Analytics (Detailed)', date: '2026-01-27 10:05:00' },
    { id: 'REW032', points: 85, transactionType: 'Credit', actionPerformed: 'Circular Intelligence Score', date: '2026-01-31 23:59:59' },
    { id: 'REW033', points: 72, transactionType: 'Credit', actionPerformed: 'Wardrobe Quotient Score', date: '2026-01-31 23:59:59' },
    { id: 'REW034', points: 45, transactionType: 'Credit', actionPerformed: 'Wardrobe Improvement Score', date: '2026-01-31 23:59:59' },
  ];

  // Mood history pagination
  const paginatedMoodHistory = useMemo(() => {
    if (!moodHistory || !Array.isArray(moodHistory)) return [];
    const startIndex = (moodHistoryPage - 1) * moodHistoryPageSize;
    const endIndex = startIndex + moodHistoryPageSize;
    return moodHistory.slice(startIndex, endIndex);
  }, [moodHistory, moodHistoryPage, moodHistoryPageSize]);

  // Rewards history pagination
  const paginatedRewardsHistory = useMemo(() => {
    if (!mockRewardsHistory || !Array.isArray(mockRewardsHistory)) return [];
    const startIndex = (rewardsPage - 1) * rewardsPageSize;
    const endIndex = startIndex + rewardsPageSize;
    return mockRewardsHistory.slice(startIndex, endIndex);
  }, [mockRewardsHistory, rewardsPage, rewardsPageSize]);

  // Wishlist pagination
  const paginatedWishlistItems = useMemo(() => {
    if (!mockWishlistItems || !Array.isArray(mockWishlistItems)) return [];
    const startIndex = (wishlistPage - 1) * wishlistPageSize;
    const endIndex = startIndex + wishlistPageSize;
    return mockWishlistItems.slice(startIndex, endIndex);
  }, [mockWishlistItems, wishlistPage, wishlistPageSize]);

  // Status badge helper following BADGE_GUIDELINES.md Pattern 1
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Wardrobe Zone Calculation Logic
  const itemsWithCost = mockWardrobeItems.filter((i) => typeof i.itemCost === 'number');
  const cAvg = itemsWithCost.length > 0 
    ? itemsWithCost.reduce((sum, item) => sum + item.itemCost!, 0) / itemsWithCost.length 
    : 1;

  const getWardrobeZone = (item: any) => {
    const W = item.timesWorn || 0;
    const D = item.daysSinceLastWorn;
    
    // Usage Index (UI) calculation
    let UI = 0;
    if (W > 0 && D !== undefined) {
      UI = W / (W + D / 30);
    }

    // Zone Classification Rules:
    // Core Rotation takes highest priority
    if (UI >= 0.60) {
      return { 
        label: 'Core Rotation', 
        icon: '🟢',
        colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800' 
      };
    }

    // No cost provided defaults
    if (item.itemCost === undefined || item.itemCost === null) {
      return { 
        label: 'Dormant Asset', 
        icon: '🟡',
        colorClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' 
      };
    }

    const CI = item.itemCost / cAvg;

    if (CI >= 1.2 && UI < 0.30) {
      return { 
        label: 'Locked Capital', 
        icon: '🔴',
        colorClass: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800' 
      };
    }
    if (CI >= 0.7 && UI >= 0.30 && UI < 0.60) {
      return { 
        label: 'Event / Occasion', 
        icon: '🟠',
        colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800' 
      };
    }
    
    return { 
      label: 'Dormant Asset', 
      icon: '🟡',
      colorClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' 
    };
  };

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-neutral-950 px-[8px] py-[8px]">
      <div className="max-w-[100%] mx-auto">
        {/* PROFILE HEADER SECTION */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            {/* Left Side - User Info */}
            <div className="flex-1">
              {/* Name and User ID */}
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{ fontSize: '18px', fontWeight: '600' }} className="text-neutral-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-700"></div>
                <span style={{ fontWeight: '400' }} className="text-sm text-neutral-600 dark:text-neutral-400">
                  {user.id}
                </span>
              </div>

              {/* Contact Details Row */}
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <a href={`mailto:${user.email}`} className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </a>
                <span className="text-neutral-400 dark:text-neutral-600">•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{user.country}</span>
                </span>
                <span className="text-neutral-400 dark:text-neutral-600">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-xs bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded">
                    {user.signupMethod}
                  </span>
                </span>
              </div>

              {/* Status Tags Row */}
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(user.status)}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
                  <Calendar className="w-3 h-3 text-neutral-500" />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Last login: {formatDate(user.lastLogin)}</span>
                </span>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Status Update Dropdown & Buttons */}
              <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1.5">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as 'active' | 'inactive')}
                  className="bg-transparent text-sm font-medium text-neutral-900 dark:text-white border-0 focus:ring-0 cursor-pointer pl-2 pr-6"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                
                {selectedStatus !== user.status && (
                  <div className="flex items-center gap-1 border-l border-neutral-200 dark:border-neutral-800 pl-2">
                    <button
                      onClick={() => setShowStatusModal(true)}
                      className="px-3 py-1 text-xs font-medium bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setSelectedStatus(user.status)}
                      className="px-3 py-1 text-xs font-medium bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Status Update Modal */}
              {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-sm w-full p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Confirm Status Update</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                      Are you sure you want to update the user status to <span className="font-bold">{selectedStatus}</span>? 
                      {selectedStatus === 'inactive' && " They will be unable to access the app."}
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowStatusModal(false)}
                        className="px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Real API call
                          // toast.success("User status updated successfully.");
                          user.status = selectedStatus;
                          setShowStatusModal(false);
                        }}
                        className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                title="Back to list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* KEY STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Wardrobe Count</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.wardrobeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Wardrobe Items</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.itemsCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">OOTD Count</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.ootdCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Virtual Try-On Count</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.virtualTryOnCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Reward Wallet Balance</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.rewardBalance}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Wardrobe Index</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.wardrobeIndex}/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Avg Cost Per Wear</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">${user.avgCostPerWear.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Wardrobe Improvement</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.wardrobeImprovementScore ?? 85}/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">Circular Intelligence</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{user.circularIntelligenceScore ?? 72}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* HORIZONTAL TABS */}
        <div className="mb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'profile'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Basic Profile
            </button>
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'wardrobe'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Wardrobe Details
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'wishlist'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Wishlist Items
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'rewards'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Rewards
            </button>
            <button
              onClick={() => setActiveTab('ootd')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'ootd'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              OOTD
            </button>
            <button
              onClick={() => setActiveTab('virtualtryon')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'virtualtryon'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Virtual Try Ons
            </button>
            <button
              onClick={() => setActiveTab('pastwardrobeindex')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'pastwardrobeindex'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Past Wardrobe Index
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div>
          {/* BASIC PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Image and Basic Info - Full Width */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  Profile Information
                </h4>
                <div className="px-6 py-4">
                  <div className="flex gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-24 h-24 rounded-lg object-cover border border-neutral-200 dark:border-neutral-800"
                      />
                    </div>
                    {/* Basic Info Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">User ID</label>
                        <p className="text-sm text-neutral-900 dark:text-white">{user.id}</p>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Name</label>
                        <p className="text-sm text-neutral-900 dark:text-white">{user.name}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Email</label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-neutral-900 dark:text-white">{user.email}</p>
                          {user.emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-error-600 dark:text-error-400">
                              <XCircle className="w-3.5 h-3.5" />
                              Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Bio</label>
                        <p className="text-sm text-neutral-900 dark:text-white">{user.bio || 'No bio provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Rest */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Personal Details */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      Personal Details
                    </h4>
                    <div className="px-6 py-4 space-y-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Date of Birth</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Cake className="w-4 h-4 text-neutral-500" />
                          {formatDate(user.dateOfBirth)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Zodiac Sign</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Star className="w-4 h-4 text-neutral-500" />
                          {user.zodiacSign}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Gender</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <UserCircle2 className="w-4 h-4 text-neutral-500" />
                          {user.gender}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Age Group</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Hash className="w-4 h-4 text-neutral-500" />
                          {user.ageGroup}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Sign Up Details */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      Location & Account
                    </h4>
                    <div className="px-6 py-4 space-y-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Country</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Globe className="w-4 h-4 text-neutral-500" />
                          {user.country}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Location</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <MapPin className="w-4 h-4 text-neutral-500" />
                          {user.location}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Signed Up By</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <UserCircle2 className="w-4 h-4 text-neutral-500" />
                          {user.signupMethod}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Style Preferences */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      Style Preferences
                    </h4>
                    <div className="px-6 py-4 space-y-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Body Shape</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <UserIcon className="w-4 h-4 text-neutral-500" />
                          {user.bodyShape}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Color Preference</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Palette className="w-4 h-4 text-neutral-500" />
                          {user.colorPreference}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Style Preference</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Sparkles className="w-4 h-4 text-neutral-500" />
                          {user.stylePreference}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Activity */}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                    <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      Account Activity
                    </h4>
                    <div className="px-6 py-4 space-y-3">
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Last Login Date</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Clock className="w-4 h-4 text-neutral-500" />
                          {formatDate(user.lastLogin)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Sign Up Date</label>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-white">
                          <Calendar className="w-4 h-4 text-neutral-500" />
                          {formatDate(user.signupDate)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Account Status</label>
                        <div className="mt-1">{getStatusBadge(user.status)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">Device Model</label>
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {user.deviceModel || 'iPhone 14 Pro'}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1">OS Version</label>
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {user.osVersion || 'iOS 16.5'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Mood History Section - Full Width */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                <h4 style={{ fontSize: '14px', fontWeight: '500' }} className="text-neutral-900 dark:text-white px-6 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  Mood Change History
                </h4>
                
                {/* Mood History Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Mood</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:border-neutral-800">
                      {paginatedMoodHistory.map((entry) => (
                        <tr key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                          <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white">{formatDate(entry.date)}</td>
                          <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white">{entry.mood}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mood History Pagination */}
                {moodHistory && moodHistory.length > moodHistoryPageSize && (
                  <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
                    <Pagination
                      currentPage={moodHistoryPage}
                      totalPages={Math.ceil(moodHistory.length / moodHistoryPageSize)}
                      totalItems={moodHistory.length}
                      itemsPerPage={moodHistoryPageSize}
                      onPageChange={setMoodHistoryPage}
                      onItemsPerPageChange={(size) => {
                        setMoodHistoryPageSize(size);
                        setMoodHistoryPage(1);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WARDROBE DETAILS TAB */}
          {activeTab === 'wardrobe' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Wardrobe Collection ({mockWardrobeItems.length} items)
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockWardrobeItems.map((item) => (
                    <div key={item.id} className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">{item.name}</h3>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Category</span>
                            <span className="text-neutral-900 dark:text-white font-medium">{item.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Brand</span>
                            <span className="text-neutral-900 dark:text-white">{item.brand}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Pattern</span>
                            <span className="text-neutral-900 dark:text-white">{item.pattern}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Material</span>
                            <span className="text-neutral-900 dark:text-white">{item.material}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Added</span>
                            <span className="text-neutral-900 dark:text-white">{formatDate(item.addedDate)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Item Cost</span>
                            <span className="text-neutral-900 dark:text-white font-medium">${item.itemCost.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-500 dark:text-neutral-400">Wardrobe Name</span>
                            <span className="text-neutral-900 dark:text-white">{item.wardrobeName}</span>
                          </div>
                          {(item as any).description && (
                            <div className="flex flex-col text-xs mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                              <span className="text-neutral-500 dark:text-neutral-400 mb-1">Description</span>
                              <span className="text-neutral-900 dark:text-white leading-relaxed">{(item as any).description}</span>
                            </div>
                          )}
                          <div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                            {(() => {
                              const zone = getWardrobeZone(item);
                              return (
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${zone.colorClass}`}>
                                  <span>{zone.icon}</span>
                                  {zone.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Wishlist Items ({mockWishlistItems.length} items)
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Item Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Wardrobe Quotient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date and Time Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedWishlistItems.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-error-500 fill-error-500 flex-shrink-0" />
                            {item.name}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white">{item.category}</td>
                        <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white">{item.wardrobeQuotient}</td>
                        <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white">{item.addedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Wishlist Pagination */}
              {mockWishlistItems && mockWishlistItems.length > wishlistPageSize && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
                  <Pagination
                    currentPage={wishlistPage}
                    totalPages={Math.ceil(mockWishlistItems.length / wishlistPageSize)}
                    totalItems={mockWishlistItems.length}
                    itemsPerPage={wishlistPageSize}
                    onPageChange={setWishlistPage}
                    onItemsPerPageChange={(size) => {
                      setWishlistPageSize(size);
                      setWishlistPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* REWARDS TAB */}
          {activeTab === 'rewards' && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-white">
                  Reward Transaction History
                </h2>
              </div>
              
              {/* Rewards Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Reward Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Action Performed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedRewardsHistory.map((reward) => (
                      <tr key={reward.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <td className="px-6 py-3">
                          <span className={`text-sm font-semibold ${
                            reward.transactionType === 'Credit' 
                              ? 'text-success-600 dark:text-success-400' 
                              : 'text-error-600 dark:text-error-400'
                          }`}>
                            {reward.transactionType === 'Credit' ? '+' : '-'}{reward.points}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                            reward.transactionType === 'Credit'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800'
                              : 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 border border-error-200 dark:border-error-800'
                          }`}>
                            {reward.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-900 dark:text-white">
                          {reward.actionPerformed}
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {reward.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rewards History Pagination */}
              {mockRewardsHistory && mockRewardsHistory.length > rewardsPageSize && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
                  <Pagination
                    currentPage={rewardsPage}
                    totalPages={Math.ceil(mockRewardsHistory.length / rewardsPageSize)}
                    totalItems={mockRewardsHistory.length}
                    itemsPerPage={rewardsPageSize}
                    onPageChange={setRewardsPage}
                    onItemsPerPageChange={(size) => {
                      setRewardsPageSize(size);
                      setRewardsPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* VIRTUAL TRY ON TAB */}
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
                        <div className="space-y-1.5 mt-2">
                          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">ERA</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.era}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Occasion</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.occasion}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Hair Style</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.hairStyle}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Body Shape</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.bodyShape}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Mood</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.mood}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Style Comfort</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.styleComfort}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Dress Code</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.dressCode}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Fabric Choice</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.fabricChoice}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">Outfit Items</h4>
                            <div className="space-y-1">
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Headwear</span>
                                <span className="text-neutral-900 dark:text-white text-right break-words max-w-[120px]">{item.headwear}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Top</span>
                                <span className="text-neutral-900 dark:text-white text-right break-words max-w-[120px]">{item.top}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Bottom</span>
                                <span className="text-neutral-900 dark:text-white text-right break-words max-w-[120px]">{item.bottom}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Shoes</span>
                                <span className="text-neutral-900 dark:text-white text-right break-words max-w-[120px]">{item.shoes}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Accessories</span>
                                <span className="text-neutral-900 dark:text-white text-right break-words max-w-[120px]">{item.accessories}</span>
                              </div>
                            </div>
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

          {/* OOTD TAB */}
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
                        <div className="space-y-1.5 mt-2">
                          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">ERA</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.era}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Occasion</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.occasion}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Season</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{(item as any).season || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Hair Style</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.hairStyle}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Body Shape</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.bodyShape}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Mood</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.mood}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Style Comfort</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.styleComfort}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Dress Code</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.dressCode}</span>
                            </div>
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-500 dark:text-neutral-400">Fabric Choice</span>
                              <span className="text-neutral-900 dark:text-white font-medium">{item.fabricChoice}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">Outfit Items</h4>
                            <div className="space-y-1">
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Headwear</span>
                                <span className="text-neutral-900 dark:text-white text-right">{item.headwear}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Top</span>
                                <span className="text-neutral-900 dark:text-white text-right">{item.top}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Bottom</span>
                                <span className="text-neutral-900 dark:text-white text-right">{item.bottom}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Shoes</span>
                                <span className="text-neutral-900 dark:text-white text-right">{item.shoes}</span>
                              </div>
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-neutral-500 dark:text-neutral-400">Accessories</span>
                                <span className="text-neutral-900 dark:text-white text-right">{item.accessories}</span>
                              </div>
                            </div>
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

          {/* PAST WARDROBE INDEX TAB */}
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
    </div>
  );
}