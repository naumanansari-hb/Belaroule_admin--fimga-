import { useState } from 'react';
import {
  Users,
  UserMinus,
  Activity,
  UserCheck,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Percent,
  Cpu,
  RefreshCw,
  Clock,
  Clock3,
  AlertTriangle,
  Flag,
  FileText,
  UserX,
  MessageSquare,
  AlertCircle,
  Shirt,
  Calendar,
  Globe,
  Smartphone,
  CheckCircle2,
  XCircle,
  Award,
  Share2,
  Palette,
  Sparkles,
  HeartPulse,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PageHeader, IconButton } from './hb/listing';
import { StatCard } from './hb/common/StatCard';
import { Card } from './hb/common/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- MOCK DATA ---

// 1. Growth & Retention Mock Data
const retentionData = [
  { platform: 'Android', day1: '42.5%', day7: '25.3%', day30: '12.4%' },
  { platform: 'iOS', day1: '45.1%', day7: '28.6%', day30: '15.2%' },
];
const funnelData = [
  { name: 'Sign Up', value: 12500, fill: '#6366f1' },
  { name: 'Onboarding', value: 9800, fill: '#818cf8' },
  { name: 'Wardrobe Upload', value: 6400, fill: '#a5b4fc' },
  { name: 'First 3 OOTDs', value: 4200, fill: '#c7d2fe' },
];

const formatNumber = (num: number, isCurrency = false): string => {
  if (num === 0) return isCurrency ? '$0' : '0';
  if (isCurrency) return `$${num.toFixed(1)}`;
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K`;
  }
  return num.toString();
};

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('current-month');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const [retentionDate, setRetentionDate] = useState({ month: currentMonth, year: currentYear });
  const [pickerYear, setPickerYear] = useState(currentYear);
  const [showRetentionDropdown, setShowRetentionDropdown] = useState(false);

  const [revenueDate, setRevenueDate] = useState({ month: currentMonth, year: currentYear });
  const [revenuePickerYear, setRevenuePickerYear] = useState(currentYear);
  const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);

  const [commissionFilter, setCommissionFilter] = useState('This Month');
  const [showCommissionFilter, setShowCommissionFilter] = useState(false);

  const [flagsFilter, setFlagsFilter] = useState('This Month');
  const [showFlagsFilter, setShowFlagsFilter] = useState(false);

  const [flagTrendDate, setFlagTrendDate] = useState({ month: currentMonth, year: currentYear });
  const [flagTrendPickerYear, setFlagTrendPickerYear] = useState(currentYear);
  const [showFlagTrendDropdown, setShowFlagTrendDropdown] = useState(false);

  const [wardrobeFilter, setWardrobeFilter] = useState('Overall');
  const [showWardrobeFilter, setShowWardrobeFilter] = useState(false);

  const [wqTrendDate, setWqTrendDate] = useState({ month: currentMonth, year: currentYear });
  const [wqTrendPickerYear, setWqTrendPickerYear] = useState(currentYear);
  const [showWqTrendDropdown, setShowWqTrendDropdown] = useState(false);

  const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Independent Filter state for AI Utilization
  const [aiFilter, setAiFilter] = useState('This Month');
  const [showAiFilter, setShowAiFilter] = useState(false);

  const aiData = {
    tokens: { gemini: 140000, openai: 240000 },
    cost: { gemini: 15.2, openai: 48.5 },
    calls: { gemini: 320, openai: 1200 }
  };

  const calculateRatio = (val1: number, val2: number) => {
    const total = val1 + val2;
    if (total === 0) return 0;
    return (val1 / total) * 100;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const dynamicFlagTrendData = Array.from({ length: getDaysInMonth(flagTrendDate.month, flagTrendDate.year) }).map((_, i) => {
    // Generate organic-looking curve data per day
    const baseRaised = 35 + Math.sin(i * 0.4) * 15;
    return {
      date: (i + 1).toString(),
      raised: Math.max(0, Math.floor(baseRaised + (Math.random() * 10)))
    };
  });

  const dynamicWqTrendData = Array.from({ length: getDaysInMonth(wqTrendDate.month, wqTrendDate.year) }).map((_, i) => {
    // Generate organic-looking curve data per day
    const wqScore = 63 + Math.sin(i * 0.4) * 4;
    return {
      date: (i + 1).toString(),
      score: Math.max(0, Math.min(100, Math.floor(wqScore + (Math.random() * 6 - 3))))
    };
  });

  const dynamicRevenueTrendData = Array.from({ length: getDaysInMonth(revenueDate.month, revenueDate.year) }).map((_, i) => {
    // Generate organic-looking curve data for revenue per day
    const baseRevenue = 450 + Math.sin(i * 0.5) * 150 + (i * 10);
    return {
      date: (i + 1).toString(),
      revenue: Math.max(0, Math.floor(baseRevenue + (Math.random() * 100 - 50)))
    };
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <PageHeader
        title="Admin Dashboard"
        subtitle="Consolidated analytics covering growth, monetization, AI performance, moderation, wardrobe intelligence, and community metrics."
      >
        <div className="flex items-center gap-2">
          {/* Global Date Filter */}
          <div className="relative">
            <IconButton
              icon={Calendar}
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              title="Global Date Filter"
            />
            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => { setDateRange('current-month'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'current-month' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Current Month (MTD)
                </button>
                <button
                  onClick={() => { setDateRange('custom'); setShowDateDropdown(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${dateRange === 'custom' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  Custom Range...
                </button>
              </div>
            )}
          </div>

          <IconButton
            icon={RefreshCw}
            onClick={handleRefresh}
            className={isRefreshing ? 'animate-spin' : ''}
            title="Refresh Dashboard"
          />
        </div>
      </PageHeader>

      {/* SECTION 1: Growth & Retention */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
          1. Growth & Retention
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="New Users Today" value={452} icon={Users} trend={{ value: 'Current Day Only', positive: true }} />
          <StatCard label="Active Users Today" value={"14,293"} icon={Activity} trend={{ value: 'Current Day Only', positive: true }} />
          <StatCard label="Churn Risk Users" value={2145} icon={UserMinus} trend={{ value: 'Past 30 Days', positive: false }} />
          <StatCard label="Reactivation Rate" value={"12.4%"} icon={UserCheck} trend={{ value: 'Past 30 Days', positive: true }} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Retention Cohorts</h3>
                <div className="relative">
                  <button 
                    onClick={() => { setShowRetentionDropdown(!showRetentionDropdown); setPickerYear(retentionDate.year); }}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {monthFull[retentionDate.month]} {retentionDate.year}
                  </button>
                  {showRetentionDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-3 z-50">
                      <div className="flex items-center justify-between mb-3 text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <button onClick={() => setPickerYear(y => y - 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <span>{pickerYear}</span>
                        <button disabled={pickerYear >= currentYear} onClick={() => setPickerYear(y => y + 1)} className={`p-1 rounded-md transition-colors ${pickerYear >= currentYear ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {monthShort.map((m, i) => {
                          const isFuture = pickerYear > currentYear || (pickerYear === currentYear && i > currentMonth);
                          const isSelected = retentionDate.year === pickerYear && retentionDate.month === i;
                          return (
                            <button
                              key={m}
                              onClick={() => { setRetentionDate({ month: i, year: pickerYear }); setShowRetentionDropdown(false); }}
                              disabled={isFuture}
                              className={`py-1.5 text-xs rounded-md text-center transition-colors 
                                ${isFuture ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-transparent' : 
                                  isSelected ? 'bg-primary-600 text-white font-medium' : 
                                  'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                }
                              `}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="px-4 py-2 text-left font-medium text-neutral-600 dark:text-neutral-400">Platform</th>
                      <th className="px-4 py-2 text-right font-medium text-neutral-600 dark:text-neutral-400">Day 1</th>
                      <th className="px-4 py-2 text-right font-medium text-neutral-600 dark:text-neutral-400">Day 7</th>
                      <th className="px-4 py-2 text-right font-medium text-neutral-600 dark:text-neutral-400">Day 30</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {retentionData.map((row) => (
                      <tr key={row.platform}>
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{row.platform}</td>
                        <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">{row.day1}</td>
                        <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">{row.day7}</td>
                        <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">{row.day30}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Activation Funnel (Past 7 Days)</h3>
              <div className="h-48 w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <FunnelChart margin={{ top: 20, right: 120, bottom: 20, left: 20 }}>
                     <RechartsTooltip cursor={{ fill: '#f5f5f5', opacity: 0.1 }} />
                     <Funnel
                       dataKey="value"
                       data={funnelData}
                       isAnimationActive={true}
                     >
                       <LabelList position="right" fill="currentColor" stroke="none" dataKey="name" className="fill-neutral-700 dark:fill-neutral-300 text-xs font-medium" />
                     </Funnel>
                   </FunnelChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 2: Monetization Intelligence */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2 mt-8">
          2. Monetization Intelligence
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <StatCard label="Revenue Today" value={"$1,240.00"} icon={DollarSign} trend={{ value: 'Current Day Only', positive: true }} />
          <StatCard label="Revenue MTD" value={"$28,450.00"} icon={TrendingUp} trend={{ value: 'Current Month Only', positive: true }} />
          <StatCard label="Purchases Today" value={234} icon={ShoppingCart} trend={{ value: 'Current Day Only', positive: true }} />
          
          <Card className="lg:col-span-2">
            <div className="p-4 flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-primary-500" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Platform Commission</h3>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowCommissionFilter(!showCommissionFilter)}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {commissionFilter}
                  </button>
                  {showCommissionFilter && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                      {['Last 24 Hours', 'This Week', 'This Month', 'Overall'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setCommissionFilter(opt); setShowCommissionFilter(false); }}
                          className={`w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${commissionFilter === opt ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">$4,520.00</h4>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">iOS (30% Fee)</p>
                </div>
                <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
                  <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">$3,840.00</h4>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Android (30% Fee)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Revenue Trend Chart</h3>
                <div className="relative">
                  <button 
                    onClick={() => { setShowRevenueDropdown(!showRevenueDropdown); setRevenuePickerYear(revenueDate.year); }}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {monthFull[revenueDate.month]} {revenueDate.year}
                  </button>
                  {showRevenueDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-3 z-50">
                      <div className="flex items-center justify-between mb-3 text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <button onClick={() => setRevenuePickerYear(y => y - 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <span>{revenuePickerYear}</span>
                        <button disabled={revenuePickerYear >= currentYear} onClick={() => setRevenuePickerYear(y => y + 1)} className={`p-1 rounded-md transition-colors ${revenuePickerYear >= currentYear ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {monthShort.map((m, i) => {
                          const isFuture = revenuePickerYear > currentYear || (revenuePickerYear === currentYear && i > currentMonth);
                          const isSelected = revenueDate.year === revenuePickerYear && revenueDate.month === i;
                          return (
                            <button
                              key={m}
                              onClick={() => { setRevenueDate({ month: i, year: revenuePickerYear }); setShowRevenueDropdown(false); }}
                              disabled={isFuture}
                              className={`py-1.5 text-xs rounded-md text-center transition-colors 
                                ${isFuture ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-transparent' : 
                                  isSelected ? 'bg-primary-600 text-white font-medium' : 
                                  'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                }
                              `}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicRevenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" interval={0} tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#a3a3a3' }} stroke="#a3a3a3" tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f5f5f5', opacity: 0.1 }} formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">AI Utilization / Burned Out</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowAiFilter(!showAiFilter)}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {aiFilter}
                  </button>
                  {showAiFilter && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                      {['Last 24 Hours', 'This Week', 'This Month', 'Overall'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setAiFilter(opt); setShowAiFilter(false); }}
                          className={`w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${aiFilter === opt ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Tokens Burnt */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Tokens Burnt</h4>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Total: {formatNumber(aiData.tokens.gemini + aiData.tokens.openai)}
                    </span>
                  </div>
                  <div className="relative pt-6 group cursor-pointer">
                    <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 absolute top-0 w-full">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Gemini</span>
                      <span className="flex items-center gap-1">OpenAI <span className="w-2 h-2 rounded-full bg-orange-500"></span></span>
                    </div>
                    {/* CUSTOM TOOLTIP */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none bg-neutral-900 border border-neutral-700 text-white text-xs rounded-lg shadow-xl py-2 px-3 z-50 whitespace-nowrap origin-bottom">
                      <div className="pointer-events-none text-left leading-relaxed">
                        - Gemini: {formatNumber(aiData.tokens.gemini)} ({calculateRatio(aiData.tokens.gemini, aiData.tokens.openai).toFixed(0)}%)<br/>
                        - OpenAI: {formatNumber(aiData.tokens.openai)} ({calculateRatio(aiData.tokens.openai, aiData.tokens.gemini).toFixed(0)}%)
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-neutral-900"></div>
                    </div>
                    <div className="flex h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden w-full">
                      {aiData.tokens.gemini > 0 && (
                        <div className="h-full bg-blue-500 transition-all duration-500 hover:opacity-90" style={{ width: `${calculateRatio(aiData.tokens.gemini, aiData.tokens.openai)}%` }}></div>
                      )}
                      {aiData.tokens.openai > 0 && (
                        <div className="h-full bg-orange-500 transition-all duration-500 hover:opacity-90" style={{ width: `${calculateRatio(aiData.tokens.openai, aiData.tokens.gemini)}%` }}></div>
                      )}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{formatNumber(aiData.tokens.gemini)} ({calculateRatio(aiData.tokens.gemini, aiData.tokens.openai).toFixed(0)}%)</span>
                      <span>{formatNumber(aiData.tokens.openai)} ({calculateRatio(aiData.tokens.openai, aiData.tokens.gemini).toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Total Cost ($) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Cost ($)</h4>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Total: {formatNumber(aiData.cost.gemini + aiData.cost.openai, true)}
                    </span>
                  </div>
                  <div className="relative pt-6 group cursor-pointer">
                    <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 absolute top-0 w-full">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Gemini</span>
                      <span className="flex items-center gap-1">OpenAI <span className="w-2 h-2 rounded-full bg-orange-500"></span></span>
                    </div>
                    {/* CUSTOM TOOLTIP */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none bg-neutral-900 border border-neutral-700 text-white text-xs rounded-lg shadow-xl py-2 px-3 z-50 whitespace-nowrap origin-bottom">
                      <div className="pointer-events-none text-left leading-relaxed">
                        - Gemini: {formatNumber(aiData.cost.gemini, true)} ({calculateRatio(aiData.cost.gemini, aiData.cost.openai).toFixed(0)}%)<br/>
                        - OpenAI: {formatNumber(aiData.cost.openai, true)} ({calculateRatio(aiData.cost.openai, aiData.cost.gemini).toFixed(0)}%)
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-neutral-900"></div>
                    </div>
                    <div className="flex h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden w-full">
                      {aiData.cost.gemini > 0 && (
                        <div className="h-full bg-blue-500 transition-all duration-500 hover:opacity-90" style={{ width: `${calculateRatio(aiData.cost.gemini, aiData.cost.openai)}%` }}></div>
                      )}
                      {aiData.cost.openai > 0 && (
                        <div className="h-full bg-orange-500 transition-all duration-500 hover:opacity-90" style={{ width: `${calculateRatio(aiData.cost.openai, aiData.cost.gemini)}%` }}></div>
                      )}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{formatNumber(aiData.cost.gemini, true)} ({calculateRatio(aiData.cost.gemini, aiData.cost.openai).toFixed(0)}%)</span>
                      <span>{formatNumber(aiData.cost.openai, true)} ({calculateRatio(aiData.cost.openai, aiData.cost.gemini).toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>

                {/* API Calls */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">API Calls</h4>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Total: {formatNumber(aiData.calls.gemini + aiData.calls.openai)}
                    </span>
                  </div>
                  <div className="relative pt-6 group cursor-pointer">
                    <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 absolute top-0 w-full">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Gemini</span>
                      <span className="flex items-center gap-1">OpenAI <span className="w-2 h-2 rounded-full bg-orange-500"></span></span>
                    </div>
                    {/* CUSTOM TOOLTIP */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none bg-neutral-900 border border-neutral-700 text-white text-xs rounded-lg shadow-xl py-2 px-3 z-50 whitespace-nowrap origin-bottom">
                      <div className="pointer-events-none text-left leading-relaxed">
                        - Gemini: {formatNumber(aiData.calls.gemini)} ({calculateRatio(aiData.calls.gemini, aiData.calls.openai).toFixed(0)}%)<br/>
                        - OpenAI: {formatNumber(aiData.calls.openai)} ({calculateRatio(aiData.calls.openai, aiData.calls.gemini).toFixed(0)}%)
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-neutral-900"></div>
                    </div>
                    <div className="flex h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden w-full">
                      {aiData.calls.gemini > 0 && (
                        <div className="h-full bg-blue-500 transition-all duration-500 hover:opacity-90" style={{ width: `${calculateRatio(aiData.calls.gemini, aiData.calls.openai)}%` }}></div>
                      )}
                      {aiData.calls.openai > 0 && (
                        <div className="h-full bg-orange-500 transition-all duration-500 hover:opacity-90" style={{ width: `${calculateRatio(aiData.calls.openai, aiData.calls.gemini)}%` }}></div>
                      )}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <span>{formatNumber(aiData.calls.gemini)} ({calculateRatio(aiData.calls.gemini, aiData.calls.openai).toFixed(0)}%)</span>
                      <span>{formatNumber(aiData.calls.openai)} ({calculateRatio(aiData.calls.openai, aiData.calls.gemini).toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 3: AI Performance & Cost Control */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2 mt-8">
          3. AI Performance & Cost Control
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="OOTD Generated Today" value={1456} icon={Sparkles} trend={{ value: 'Current Day Only', positive: true }} />
          <StatCard label="Rerolls Today" value={892} icon={RefreshCw} trend={{ value: 'Current Day Only', positive: false }} />
          <StatCard 
            label="AI Latency (Avg / P95)" 
            value={"1.2s / 3.45s"} 
            icon={Clock} 
            trend={{ value: 'OpenAI 12% higher', positive: false }} 
            valueClassName="text-neutral-900 dark:text-white"
          />
          <StatCard label="Total OOTD Cost" value={"$342.50"} icon={Cpu} trend={{ value: 'Current Month', positive: false }} />
          <StatCard label="Total Try-On Cost" value={"$124.80"} icon={Cpu} trend={{ value: 'Current Month', positive: false }} />
          <StatCard label="AI Retry Rate" value={"1.8%"} icon={Clock3} trend={{ value: 'API Calls retried automatically', positive: false }} />
        </div>

        {/* Combined API Error Rate & Success Rate block */}
        <Card className="bg-neutral-50 dark:bg-neutral-900/50">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-error-500" />
                 AI API Error Rate
               </p>
               <h4 className="text-2xl font-bold text-error-600 dark:text-error-400 mt-2">2.4%</h4>
               <p className="text-xs text-neutral-500 mt-1">Failed API calls ÷ Total API calls</p>
            </div>
            <div className="md:border-l border-neutral-200 dark:border-neutral-800 md:pl-4">
               <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-success-500" />
                 AI Success Rate
               </p>
               <h4 className="text-2xl font-bold text-success-600 dark:text-success-400 mt-2">97.6%</h4>
               <p className="text-xs text-neutral-500 mt-1">Successful API calls ÷ Total API calls</p>
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 4: Moderation Intelligence */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2 mt-8">
          4. Moderation Intelligence
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatCard label="Average Resolution Time" value={"2.4 hrs"} icon={Clock} trend={{ value: 'Over all data', positive: true }} />
          <StatCard label="SLA Breach Rate" value={"1.2%"} icon={AlertTriangle} trend={{ value: 'Current Month Only', positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Pending Flags</h3>
                <div className="relative">
                  <button 
                    onClick={() => setShowFlagsFilter(!showFlagsFilter)}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {flagsFilter}
                  </button>
                  {showFlagsFilter && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
                      {['Last 24 Hours', 'This Week', 'This Month', 'Overall'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setFlagsFilter(opt); setShowFlagsFilter(false); }}
                          className={`w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${flagsFilter === opt ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Users', value: 45, fill: '#ef4444' },
                        { name: 'Comments', value: 120, fill: '#f97316' },
                        { name: 'Posts', value: 85, fill: '#f59e0b' },
                        { name: 'Messages', value: 30, fill: '#eab308' },
                        { name: 'Wardrobe Items', value: 15, fill: '#84cc16' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[{ fill: '#ef4444' }, { fill: '#f97316' }, { fill: '#f59e0b' }, { fill: '#eab308' }, { fill: '#84cc16' }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Repeat Offenders Leaderboard</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500">
                      <th className="pb-2 font-medium w-12">#</th>
                      <th className="pb-2 font-medium">User Name</th>
                      <th className="pb-2 font-medium text-right">Flag Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'USR001', name: 'JohnDoe123', flags: 14 },
                      { id: 'USR002', name: 'JaneSmith4', flags: 11 },
                      { id: 'USR003', name: 'BadUser99', flags: 9 },
                      { id: 'USR004', name: 'TrollMaster', flags: 7 },
                      { id: 'USR005', name: 'SpamBot01', flags: 6 },
                    ].map((offender, index) => (
                      <tr key={index} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <td className="py-3 text-neutral-600 dark:text-neutral-400 font-mono text-xs">{index + 1}</td>
                        <td className="py-3 font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                          <a href={`/users/${offender.id}`} className="hover:underline">{offender.name}</a>
                        </td>
                        <td className="py-3 text-neutral-900 dark:text-white text-right font-medium">{offender.flags}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Flag Trend</h3>
                <div className="relative">
                  <button 
                    onClick={() => { setShowFlagTrendDropdown(!showFlagTrendDropdown); setFlagTrendPickerYear(flagTrendDate.year); }}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {monthFull[flagTrendDate.month]} {flagTrendDate.year}
                  </button>
                  {showFlagTrendDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-3 z-50">
                      <div className="flex items-center justify-between mb-3 text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <button onClick={() => setFlagTrendPickerYear(y => y - 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <span>{flagTrendPickerYear}</span>
                        <button disabled={flagTrendPickerYear >= currentYear} onClick={() => setFlagTrendPickerYear(y => y + 1)} className={`p-1 rounded-md transition-colors ${flagTrendPickerYear >= currentYear ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {monthShort.map((m, i) => {
                          const isFuture = flagTrendPickerYear > currentYear || (flagTrendPickerYear === currentYear && i > currentMonth);
                          const isSelected = flagTrendDate.year === flagTrendPickerYear && flagTrendDate.month === i;
                          return (
                            <button
                              key={m}
                              onClick={() => { setFlagTrendDate({ month: i, year: flagTrendPickerYear }); setShowFlagTrendDropdown(false); }}
                              disabled={isFuture}
                              className={`py-1.5 text-xs rounded-md text-center transition-colors 
                                ${isFuture ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-transparent' : 
                                  isSelected ? 'bg-primary-600 text-white font-medium' : 
                                  'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                }
                              `}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicFlagTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#525252" opacity={0.2} />
                    <XAxis dataKey="date" interval={0} tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                    <RechartsTooltip cursor={{ fill: '#f5f5f5', opacity: 0.1 }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="raised" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Raised Flags" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 5: Wardrobe Intelligence */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2 mt-8">
          5. Wardrobe Intelligence
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Size Distribution" value={"M (45K)"} icon={Shirt} trend={{ value: 'Top & Bottom Wear Only', positive: true }} />
          <StatCard 
            label="Color Dominance Index" 
            value={
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm" style={{ backgroundColor: '#1A1A2E' }} />
                <span>#1A1A2E</span>
              </div>
            }
            icon={Palette} 
            trend={{ value: '4,210 items', positive: true }} 
          />
          <StatCard label="Silhouette Preference" value={"TBD"} icon={Shirt} trend={{ value: 'Details Pending' }} />
          <StatCard label="Avg Items per User" value={"14.3"} icon={Users} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Avg Wardrobe Quotient" value={"63%"} icon={Award} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Avg Items per Wardrobe" value={"11.6"} icon={Shirt} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Cost Per Wear (CPW)" value={"$4.20"} icon={DollarSign} trend={{ value: 'Avg over priced items', positive: true }} />
          <StatCard label="Avg CPW (Platform)" value={"Android: $3.80 | iOS: $4.60"} icon={Smartphone} trend={{ value: 'Platform specific', positive: true }} />
          <StatCard 
            label="Color Trend Index (OOTD)" 
            value={
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm" style={{ backgroundColor: '#8B5E3C' }} />
                <span>#8B5E3C</span>
              </div>
            }
            icon={Palette} 
            trend={{ value: '6,840 OOTD inclusions', positive: true }} 
          />
          <StatCard label="Total Outfits with Prices" value={"4,210 (34.2%)"} icon={DollarSign} trend={{ value: 'User-entered only', positive: true }} />
          
          {/* Moved to end & spanning 2 columns to fix UI break and fill the 12th slot */}
          <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between md:col-span-2 lg:col-span-2 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Total Wardrobes Created
                </p>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">
                  {wardrobeFilter === 'Today (records after 12:00 AM on same day)' ? '1,240' : 
                   wardrobeFilter === 'Last 7 Days' ? '8,450' :
                   wardrobeFilter === 'Last 30 Days' ? '34,200' : '124,500'}
                </p>
                <p className="text-xs mt-1.5 text-success-600 dark:text-success-400">
                  Overall Platform
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                  <Shirt className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                </div>
                
                {/* Filter Dropdown safely nested on the right */}
                <div className="relative">
                  <button 
                    onClick={() => setShowWardrobeFilter(!showWardrobeFilter)}
                    className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>
                      {wardrobeFilter === 'Today (records after 12:00 AM on same day)' ? 'Today' : wardrobeFilter}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-90 opacity-60" />
                  </button>
                  {showWardrobeFilter && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl py-1 z-50 overflow-hidden text-left">
                      {['Today (records after 12:00 AM on same day)', 'Last 7 Days', 'Last 30 Days', 'Overall'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setWardrobeFilter(opt); setShowWardrobeFilter(false); }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs transition-colors break-words whitespace-normal border-b last:border-0 border-neutral-100 dark:border-neutral-800 ${wardrobeFilter === opt ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/10 dark:text-primary-400 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Wardrobe Quotient Trend</h3>
                <div className="relative">
                  <button 
                    onClick={() => { setShowWqTrendDropdown(!showWqTrendDropdown); setWqTrendPickerYear(wqTrendDate.year); }}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {monthFull[wqTrendDate.month]} {wqTrendDate.year}
                  </button>
                  {showWqTrendDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-3 z-50">
                      <div className="flex items-center justify-between mb-3 text-sm font-medium text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <button onClick={() => setWqTrendPickerYear(y => y - 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <span>{wqTrendPickerYear}</span>
                        <button disabled={wqTrendPickerYear >= currentYear} onClick={() => setWqTrendPickerYear(y => y + 1)} className={`p-1 rounded-md transition-colors ${wqTrendPickerYear >= currentYear ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}><ChevronRight size={16} /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {monthShort.map((m, i) => {
                          const isFuture = wqTrendPickerYear > currentYear || (wqTrendPickerYear === currentYear && i > currentMonth);
                          const isSelected = wqTrendDate.year === wqTrendPickerYear && wqTrendDate.month === i;
                          return (
                            <button
                              key={m}
                              onClick={() => { setWqTrendDate({ month: i, year: wqTrendPickerYear }); setShowWqTrendDropdown(false); }}
                              disabled={isFuture}
                              className={`py-1.5 text-xs rounded-md text-center transition-colors 
                                ${isFuture ? 'opacity-30 cursor-not-allowed text-neutral-500 bg-transparent' : 
                                  isSelected ? 'bg-primary-600 text-white font-medium' : 
                                  'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                }
                              `}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicWqTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" interval={0} tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} domain={[0, 100]} />
                    <RechartsTooltip cursor={{ fill: '#f5f5f5', opacity: 0.1 }} />
                    <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Avg Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Brand-Level CPW</h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800">
                        <th className="px-4 py-2 text-left font-medium text-neutral-600">Brand Name</th>
                        <th className="px-4 py-2 text-right font-medium text-neutral-600">CPW</th>
                        <th className="px-4 py-2 text-right font-medium text-neutral-600">Item Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {[
                        { brand: 'Zara', cpw: '$2.40', items: 15400 },
                        { brand: 'H&M', cpw: '$1.80', items: 12200 },
                        { brand: 'Nike', cpw: '$5.20', items: 8400 },
                        { brand: 'Gucci', cpw: '$45.00', items: 420 },
                        { brand: 'Levi\'s', cpw: '$3.50', items: 9800 },
                      ].map((row) => (
                        <tr key={row.brand} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white">
                          <td className="px-4 py-3 font-medium">{row.brand}</td>
                          <td className="px-4 py-3 text-right">{row.cpw}</td>
                          <td className="px-4 py-3 text-right">{row.items}</td>
                        </tr>
                      ))}
                      {/* Unbranded Row - Highlighted */}
                      <tr className="bg-primary-50 dark:bg-primary-900/20 text-neutral-900 dark:text-white font-semibold">
                          <td className="px-4 py-3">Unbranded</td>
                          <td className="px-4 py-3 text-right">$1.20</td>
                          <td className="px-4 py-3 text-right">45,200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 6: Community & Virality */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2 mt-8">
          6. Community & Virality
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Engagement Score Index" value={"TBD"} icon={HeartPulse} trend={{ value: 'Details Pending' }} />
          <StatCard label="Share Rate" value={"2.4"} icon={Share2} trend={{ value: 'Shares per post', positive: true }} />
          <StatCard label="Follower Growth Rate" value={"TBD"} icon={TrendingUp} trend={{ value: 'Details Pending' }} />
        </div>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Top Influencers (by Engagement Ratio)</h3>
             <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800">
                        <th className="px-4 py-2 text-left font-medium text-neutral-600">User Name</th>
                        <th className="px-4 py-2 text-right font-medium text-neutral-600">Followers</th>
                        <th className="px-4 py-2 text-right font-medium text-neutral-600">Total Engagement</th>
                        <th className="px-4 py-2 text-right font-medium text-neutral-600">Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {[
                        { name: 'FashionQueen99', followers: 15400, eng: 45200, ratio: '2.93' },
                        { name: 'OOTD_Daily', followers: 8200, eng: 21400, ratio: '2.60' },
                        { name: 'StyleGuru', followers: 4500, eng: 11200, ratio: '2.48' },
                        { name: 'TrendSetter', followers: 12000, eng: 28500, ratio: '2.37' },
                        { name: 'VintageVibes', followers: 6400, eng: 14200, ratio: '2.21' },
                      ].map((row) => (
                        <tr key={row.name} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer text-neutral-900 dark:text-white">
                          <td className="px-4 py-3 font-medium text-primary-600 hover:text-primary-700">{row.name}</td>
                          <td className="px-4 py-3 text-right">{row.followers.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{row.eng.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{row.ratio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          </div>
        </Card>
      </section>


    </div>
  );
}