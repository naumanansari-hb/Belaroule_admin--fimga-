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
  HeartPulse
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
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Retention Cohorts</h3>
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
                   <FunnelChart>
                     <RechartsTooltip />
                     <Funnel
                       dataKey="value"
                       data={funnelData}
                       isAnimationActive
                     >
                       <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Revenue Today" value={"$1,240.00"} icon={DollarSign} trend={{ value: 'Current Day Only', positive: true }} />
          <StatCard label="Revenue MTD" value={"$28,450.00"} icon={TrendingUp} trend={{ value: 'Current Month Only', positive: true }} />
          <StatCard label="Purchases Today" value={234} icon={ShoppingCart} trend={{ value: 'Current Day Only', positive: true }} />
          <StatCard label="Commission — iOS" value={"$4,520.00"} icon={Percent} trend={{ value: 'Platform Fee (30%)', positive: false }} />
          <StatCard label="Commission — Android" value={"$3,840.00"} icon={Percent} trend={{ value: 'Platform Fee (30%)', positive: false }} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Revenue Trend Chart (Current Month)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '1', revenue: 1200 }, { date: '5', revenue: 2100 }, { date: '10', revenue: 1800 }, 
                    { date: '15', revenue: 2400 }, { date: '20', revenue: 3200 }, { date: '25', revenue: 2800 }, { date: '30', revenue: 3800 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#a3a3a3" />
                    <YAxis tick={{fontSize: 12}} stroke="#a3a3a3" tickFormatter={(v) => `$${v}`} />
                    <RechartsTooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{r: 4, fill: '#22c55e'}} activeDot={{r: 6}} />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Average Resolution Time" value={"4h 32m"} icon={Clock3} trend={{ value: 'Overall Avg', positive: true }} />
          <StatCard label="SLA Breach Rate" value={"8.3%"} icon={AlertTriangle} trend={{ value: 'Past 30 Days (Threshold: 24h)', positive: false }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Pending Flags</h3>
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
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Flag Trend Growth (Current Month)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '1', flags: 12 }, { date: '5', flags: 18 }, { date: '10', flags: 25 }, 
                    { date: '15', flags: 42 }, { date: '20', flags: 30 }, { date: '25', flags: 28 }, { date: '30', flags: 45 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#a3a3a3" />
                    <YAxis tick={{fontSize: 12}} stroke="#a3a3a3" />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="flags" stroke="#ef4444" strokeWidth={2} dot={{r: 4, fill: '#ef4444'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Repeat Offenders (Top 5)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-2 text-left font-medium text-neutral-600">#</th>
                    <th className="px-4 py-2 text-left font-medium text-neutral-600">User Name</th>
                    <th className="px-4 py-2 text-right font-medium text-neutral-600">Flag Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {[
                    { rank: 1, name: 'JohnDoe123', flags: 14 },
                    { rank: 2, name: 'JaneSmith4', flags: 11 },
                    { rank: 3, name: 'BadUser99', flags: 9 },
                    { rank: 4, name: 'TrollMaster', flags: 7 },
                    { rank: 5, name: 'SpamBot01', flags: 6 },
                  ].map((row) => (
                    <tr key={row.rank} className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer text-neutral-900 dark:text-white">
                      <td className="px-4 py-3">{row.rank}</td>
                      <td className="px-4 py-3 font-medium text-primary-600 hover:text-primary-700">{row.name}</td>
                      <td className="px-4 py-3 text-right">{row.flags}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
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
            value={"#1A1A2E"} 
            icon={Palette} 
            trend={{ value: '4,210 items', positive: true }} 
          />
          <StatCard label="Silhouette Preference" value={"TBD"} icon={Shirt} trend={{ value: 'Details Pending' }} />
          <StatCard label="Avg Items per User" value={"14.3"} icon={Users} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Avg Wardrobe Quotient" value={"63%"} icon={Award} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Total Wardrobes Created" value={"124,500"} icon={Shirt} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Avg Items per Wardrobe" value={"11.6"} icon={Shirt} trend={{ value: 'Overall Platform', positive: true }} />
          <StatCard label="Cost Per Wear (CPW)" value={"$4.20"} icon={DollarSign} trend={{ value: 'Avg over priced items', positive: true }} />
          <StatCard label="Avg CPW (Platform)" value={"Android: $3.80 | iOS: $4.60"} icon={Smartphone} trend={{ value: 'Platform specific', positive: true }} />
          <StatCard label="Color Trend Index (OOTD)" value={"#8B5E3C"} icon={Palette} trend={{ value: '6,840 OOTD inclusions', positive: true }} />
          <StatCard label="Total Outfits with Prices" value={"4,210 (34.2%)"} icon={DollarSign} trend={{ value: 'User-entered only', positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Wardrobe Quotient Trend</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '1', score: 60 }, { date: '5', score: 62 }, { date: '10', score: 61 }, 
                    { date: '15', score: 64 }, { date: '20', score: 63 }, { date: '25', score: 65 }, { date: '30', score: 66 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#a3a3a3" />
                    <YAxis tick={{fontSize: 12}} stroke="#a3a3a3" domain={[0, 100]} />
                    <RechartsTooltip formatter={(val) => [`${val}%`, 'WQ Score']} />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{r: 4, fill: '#8b5cf6'}} />
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