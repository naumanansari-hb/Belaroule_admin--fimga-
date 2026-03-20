import { useState, useMemo } from 'react';
import {
  Flag,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Sparkles,
  RefreshCw,
  Users,
  Activity,
  AlertCircle,
  MessageSquare,
  FileText,
  UserX,
  Shirt,
  BarChart3,
  ChevronRight,
  TrendingDown,
  Heart,
  Smile,
  Frown,
  Angry,
  PartyPopper,
  Globe,
  Smartphone,
  Calendar,
  Percent,
} from 'lucide-react';
import { PageHeader, IconButton } from './hb/listing';
import { StatCard } from './hb/common/StatCard';
import { Card } from './hb/common/Card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('current-month');
  const [country, setCountry] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Mock data for KPIs
  const kpiData = {
    pendingFlags: {
      total: 47,
      oldest: '3.5 hours ago',
    },
    apiFailures: {
      count: 12,
      rate: 2.4,
    },
    revenueToday: 8945.50,
    revenueMTD: 124567.80,
    purchasesToday: 234,
    ootdToday: 1456,
    rerollsToday: 892,
    newUsersToday: 78,
    activeUsersToday: {
      total: 3421,
      ios: 2105,
      android: 1316,
    },
    commissionCharged: {
      total: 1245.75,
      android: 687.30,
      ios: 558.45,
    },
  };

  // Mock data for Needs Attention section
  const attentionItems = [
    { type: 'Flagged Users', count: 12, oldestPending: '2.5h', icon: UserX, color: 'error' },
    { type: 'Flagged Posts', count: 18, oldestPending: '1.2h', icon: FileText, color: 'warning' },
    { type: 'Flagged Comments', count: 9, oldestPending: '45m', icon: MessageSquare, color: 'warning' },
    { type: 'Flagged Messages', count: 5, oldestPending: '30m', icon: AlertCircle, color: 'warning' },
    { type: 'Flagged Wardrobe Items', count: 3, oldestPending: '1h', icon: Shirt, color: 'warning' },
    { type: 'AI / API Failures (24h)', count: 12, oldestPending: '10m', icon: AlertTriangle, color: 'error' },
    { type: 'Deactivated Users Today', count: 4, oldestPending: '3h', icon: Users, color: 'neutral' },
  ];

  // Mock data for top posts
  const topViralPosts = [
    { id: 'P001', user: 'Sarah J.', shares: 842, likes: 1524, comments: 234, date: '2025-01-10' },
    { id: 'P002', user: 'Mike C.', shares: 756, likes: 1389, comments: 198, date: '2025-01-09' },
    { id: 'P003', user: 'Emma R.', shares: 634, likes: 1201, comments: 176, date: '2025-01-11' },
    { id: 'P004', user: 'David P.', shares: 589, likes: 1087, comments: 145, date: '2025-01-08' },
    { id: 'P005', user: 'Lisa M.', shares: 512, likes: 956, comments: 132, date: '2025-01-12' },
  ];

  // Mock data for mood distribution
  const moodData = [
    { mood: 'Happy', count: 1245, percentage: 42, color: 'success', icon: Smile },
    { mood: 'Excited', count: 856, percentage: 29, color: 'primary', icon: PartyPopper },
    { mood: 'Sad', count: 523, percentage: 18, color: 'warning', icon: Frown },
    { mood: 'Angry', count: 321, percentage: 11, color: 'error', icon: Angry },
  ];

  // Mock data for mood distribution chart (for Pie/Donut chart)
  const moodChartData = [
    { name: 'Happy', value: 1245, fill: '#22c55e' },
    { name: 'Excited', value: 856, fill: '#6366f1' },
    { name: 'Sad', value: 523, fill: '#f59e0b' },
    { name: 'Angry', value: 321, fill: '#ef4444' },
  ];

  // Mock data for mood trend over time (for Stacked Area chart)
  const moodTrendData = [
    { date: '01/08', Happy: 142, Excited: 98, Sad: 45, Angry: 28 },
    { date: '01/09', Happy: 158, Excited: 112, Sad: 52, Angry: 32 },
    { date: '01/10', Happy: 165, Excited: 118, Sad: 48, Angry: 29 },
    { date: '01/11', Happy: 172, Excited: 125, Sad: 55, Angry: 35 },
    { date: '01/12', Happy: 168, Excited: 121, Sad: 51, Angry: 31 },
    { date: '01/13', Happy: 185, Excited: 135, Sad: 58, Angry: 38 },
    { date: '01/14', Happy: 192, Excited: 142, Sad: 62, Angry: 41 },
  ];

  // Calculate % Users Submitted Mood Today
  const totalMoodSubmissionsToday = moodData.reduce((sum, mood) => sum + mood.count, 0);
  const moodSubmissionRate = ((totalMoodSubmissionsToday / kpiData.activeUsersToday.total) * 100).toFixed(1);

  // Mock data for reward economy
  const rewardData = {
    coinsIssuedToday: 45678,
    coinsRedeemedToday: 32145,
    netCoinFlow: 13533,
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Monitor key metrics, trends, and system health"
      >
        <div className="flex items-center gap-2">
          {/* Platform Filter */}
          <div className="relative">
            <IconButton
              icon={Smartphone}
              onClick={() => {
                setShowPlatformDropdown(!showPlatformDropdown);
                setShowCountryDropdown(false);
                setShowDateDropdown(false);
              }}
              title="Platform Filter"
            />
            {showPlatformDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => { setPlatform('all'); setShowPlatformDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${platform === 'all' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  All Platforms
                </button>
                <button
                  onClick={() => { setPlatform('ios'); setShowPlatformDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${platform === 'ios' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  iOS
                </button>
                <button
                  onClick={() => { setPlatform('android'); setShowPlatformDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${platform === 'android' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Android
                </button>
              </div>
            )}
          </div>

          {/* Country Filter */}
          <div className="relative">
            <IconButton
              icon={Globe}
              onClick={() => {
                setShowCountryDropdown(!showCountryDropdown);
                setShowPlatformDropdown(false);
                setShowDateDropdown(false);
              }}
              title="Country Filter"
            />
            {showCountryDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => { setCountry('all'); setShowCountryDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${country === 'all' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  All Countries
                </button>
                <button
                  onClick={() => { setCountry('us'); setShowCountryDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${country === 'us' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  United States
                </button>
                <button
                  onClick={() => { setCountry('uk'); setShowCountryDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${country === 'uk' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  United Kingdom
                </button>
                <button
                  onClick={() => { setCountry('ca'); setShowCountryDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${country === 'ca' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Canada
                </button>
                <button
                  onClick={() => { setCountry('au'); setShowCountryDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${country === 'au' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Australia
                </button>
              </div>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <IconButton
              icon={Calendar}
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowPlatformDropdown(false);
                setShowCountryDropdown(false);
              }}
              title="Date Range Filter"
            />
            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => { setDateRange('today'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'today' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => { setDateRange('yesterday'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'yesterday' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => { setDateRange('current-week'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'current-week' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Current Week
                </button>
                <button
                  onClick={() => { setDateRange('current-month'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'current-month' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Current Month (MTD)
                </button>
                <button
                  onClick={() => { setDateRange('last-month'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'last-month' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Last Month
                </button>
                <button
                  onClick={() => { setDateRange('custom'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'custom' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Custom Range
                </button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <IconButton
            icon={RefreshCw}
            onClick={handleRefresh}
            className={isRefreshing ? 'animate-spin' : ''}
            title="Refresh"
          />
        </div>
      </PageHeader>

      {/* Section 1: KPI Cards */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 text-[24px]">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Pending Flags (Total)"
            value={kpiData.pendingFlags.total}
            icon={Flag}
            trend={{ value: `Oldest: ${kpiData.pendingFlags.oldest}`, positive: false }}
            className="cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          />
          
          <StatCard
            label="AI / API Failures (24h)"
            value={kpiData.apiFailures.count}
            icon={AlertTriangle}
            trend={{ value: `${kpiData.apiFailures.rate}% failure rate`, positive: false }}
            className="cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          />
          
          <StatCard
            label="Revenue Today"
            value={`$${kpiData.revenueToday.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: '+12.5% vs yesterday', positive: true }}
            className="cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          />
          
          <StatCard
            label="Revenue MTD"
            value={`$${kpiData.revenueMTD.toLocaleString()}`}
            icon={TrendingUp}
            trend={{ value: '+8.3% vs last month', positive: true }}
          />

          <StatCard
            label="Purchases Today"
            value={kpiData.purchasesToday}
            icon={ShoppingCart}
            trend={{ value: '+15.2% vs yesterday', positive: true }}
          />
          
          <StatCard
            label="OOTD Generated Today"
            value={kpiData.ootdToday}
            icon={Sparkles}
            trend={{ value: '+9.7% vs yesterday', positive: true }}
            className="cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          />
          
          <StatCard
            label="Rerolls Today"
            value={kpiData.rerollsToday}
            icon={RefreshCw}
            trend={{ value: '61.2% reroll rate', positive: true }}
          />
          
          <StatCard
            label="New Users Today"
            value={kpiData.newUsersToday}
            icon={Users}
            trend={{ value: '+5.4% vs yesterday', positive: true }}
          />

          <StatCard
            label="Active Users Today"
            value={kpiData.activeUsersToday.total}
            icon={Activity}
            trend={{ value: `iOS: ${kpiData.activeUsersToday.ios} | Android: ${kpiData.activeUsersToday.android}` }}
          />

          <StatCard
            label="Commission Charged"
            value={`$${kpiData.commissionCharged.total.toLocaleString()}`}
            icon={Percent}
            trend={{ value: `Android: $${kpiData.commissionCharged.android.toLocaleString()} | iOS: $${kpiData.commissionCharged.ios.toLocaleString()}` }}
          />
        </div>
      </div>

      {/* Section 2: Needs Attention */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Needs Attention
        </h2>
        <Card>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {attentionItems.map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.color === 'error' 
                      ? 'bg-error-50 dark:bg-error-900/30' 
                      : item.color === 'warning'
                      ? 'bg-warning-50 dark:bg-warning-900/30'
                      : 'bg-neutral-100 dark:bg-neutral-800'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.color === 'error'
                        ? 'text-error-600 dark:text-error-400'
                        : item.color === 'warning'
                        ? 'text-warning-600 dark:text-warning-400'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.type}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Oldest pending: {item.oldestPending}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.color === 'error'
                      ? 'bg-error-100 dark:bg-error-950 text-error-700 dark:text-error-300'
                      : item.color === 'warning'
                      ? 'bg-warning-100 dark:bg-warning-950 text-warning-700 dark:text-warning-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {item.count}
                  </span>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 3: Core Trend Charts (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              OOTD Activity Trend
            </h3>
            <div className="h-64 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Chart: OOTD Generated & Rerolls over time
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Revenue Trend
            </h3>
            <div className="h-64 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Chart: Daily Revenue over time
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Moderation Load Trend
            </h3>
            <div className="h-64 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Chart: Stacked Bar - Moderation by type
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Section 4: Mood Analytics */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 text-[24px]">
          Mood Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Mood Distribution - Donut Chart */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Mood Distribution
                </h3>
                <div className="text-right">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Total Submissions Today
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {totalMoodSubmissionsToday.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={moodChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {moodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Mood Submission Rate Metric */}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    % Users Submitted Mood Today
                  </span>
                  <span className="text-lg font-semibold text-success-600 dark:text-success-400">
                    {moodSubmissionRate}%
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {totalMoodSubmissionsToday.toLocaleString()} submissions / {kpiData.activeUsersToday.total.toLocaleString()} active users
                </p>
              </div>
            </div>
          </Card>

          {/* Mood Trend Over Time - Stacked Area Chart */}
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Mood Trend Over Time
              </h3>
              
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={moodTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#a3a3a3"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#a3a3a3"
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="Happy" 
                    stackId="1" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Excited" 
                    stackId="1" 
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Sad" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Angry" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Section 5: Community & Virality - Top Viral Posts */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Top Viral Posts (by Shares)
        </h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Post ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    User
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Shares
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Likes
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Comments
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {topViralPosts.map((post) => (
                  <tr 
                    key={post.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                        {post.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                      {post.user}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-neutral-900 dark:text-white font-medium">
                      {post.shares.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-neutral-600 dark:text-neutral-400">
                      {post.likes.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-neutral-600 dark:text-neutral-400">
                      {post.comments.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {post.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Section 6: Reward Economy */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
          Reward Economy Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Bella Coins Issued Today"
            value={rewardData.coinsIssuedToday.toLocaleString()}
            icon={TrendingUp}
            trend={{ value: '+8.2% vs yesterday', positive: true }}
          />
          
          <StatCard
            label="Bella Coins Redeemed Today"
            value={rewardData.coinsRedeemedToday.toLocaleString()}
            icon={TrendingDown}
            trend={{ value: '-3.5% vs yesterday', positive: true }}
          />
          
          <StatCard
            label="Net Coin Flow"
            value={`+${rewardData.netCoinFlow.toLocaleString()}`}
            icon={Activity}
            trend={{ value: 'Healthy economy', positive: true }}
            valueClassName="text-success-600 dark:text-success-400"
          />
        </div>
      </div>

      {/* Wardrobe Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Wardrobe Intelligence
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Average Wardrobe Quotient
                </span>
                <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                  74.5 / 100
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Total Wardrobes Created
                </span>
                <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                  8,234
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Avg Items per Wardrobe
                </span>
                <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                  28.6
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Wardrobe Quotient Trend
            </h3>
            <div className="h-48 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Chart: Daily average wardrobe quotient
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}