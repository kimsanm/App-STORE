import React, { useState } from 'react';
import { 
  Download, 
  Users, 
  Star, 
  Layers, 
  TrendingUp, 
  Smartphone, 
  Laptop, 
  Globe, 
  Coins, 
  ChevronRight, 
  Zap, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { motion } from 'motion/react';
import { AppItem, DailyDownload, DownloadRecord } from '../types';

interface OverviewProps {
  apps: AppItem[];
  dailyDownloads: DailyDownload[];
  recentDownloads: DownloadRecord[];
  onNavigateToTab: (tab: string) => void;
  onSimulateDownload: () => void;
  isDark?: boolean;
}

export const Overview: React.FC<OverviewProps> = ({ 
  apps, 
  dailyDownloads, 
  recentDownloads,
  onNavigateToTab,
  onSimulateDownload,
  isDark = false
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '15'>('15');

  // Calculate stats
  const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0);
  const totalActiveUsers = apps.reduce((sum, app) => sum + app.activeUsers, 0);
  
  const ratedApps = apps.filter(app => app.rating > 0);
  const avgRating = ratedApps.length > 0 
    ? (ratedApps.reduce((sum, app) => sum + app.rating, 0) / ratedApps.length).toFixed(1)
    : '0.0';

  const publishedAppsCount = apps.filter(app => app.status === 'published').length;
  
  // Calculate estimated total revenue
  const totalRevenue = apps.reduce((sum, app) => sum + (app.downloads * app.price), 0);

  // Filter daily downloads
  const chartData = timeRange === '7' ? dailyDownloads.slice(-7) : dailyDownloads;

  // Prepare category data for pie chart
  const categoriesMap: { [key: string]: { name: string; nameKh: string; value: number } } = {};
  apps.forEach(app => {
    if (!categoriesMap[app.category]) {
      categoriesMap[app.category] = { 
        name: app.category, 
        nameKh: app.categoryKhmer, 
        value: 0 
      };
    }
    categoriesMap[app.category].value += app.downloads;
  });
  const categoryChartData = Object.values(categoriesMap).filter(cat => cat.value > 0);

  // Colors for Category Pie Chart
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

  // Prepare app comparison data
  const appComparisonData = apps
    .filter(app => app.downloads > 0)
    .map(app => ({
      name: app.name.split(' ')[0], // short name
      downloads: app.downloads,
      active: app.activeUsers
    }))
    .sort((a, b) => b.downloads - a.downloads);

  // Format numbers to K, M format
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 text-white rounded-xl">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm md:text-base">ម៉ាស៊ីនពិសោធន៍ទិន្នន័យ (Real-time Simulation Engine)</h3>
            <p className="text-xs text-slate-500">ចុចប៊ូតុងខាងស្តាំដើម្បីសាកល្បងត្រាប់តាមសកម្មភាពទាញយកកម្មវិធីថ្មីៗពីអ្នកប្រើប្រាស់</p>
          </div>
        </div>
        <button
          onClick={onSimulateDownload}
          className="w-full md:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          <Download size={16} />
          <span>បង្កើតការទាញយកគំរូ (Simulate Download)</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: 'ការទាញយកសរុប',
            subtitle: 'Total Downloads',
            value: formatNumber(totalDownloads),
            rawVal: totalDownloads.toLocaleString(),
            icon: Download,
            color: 'text-emerald-600 bg-emerald-50',
            borderColor: 'hover:border-emerald-200'
          },
          {
            title: 'អ្នកប្រើសកម្ម',
            subtitle: 'Active Users',
            value: formatNumber(totalActiveUsers),
            rawVal: totalActiveUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-600 bg-blue-50',
            borderColor: 'hover:border-blue-200'
          },
          {
            title: 'ការវាយតម្លៃមធ្យម',
            subtitle: 'Avg Rating',
            value: `${avgRating} / 5.0`,
            rawVal: `ពីកម្មវិធីសកម្មទាំងអស់`,
            icon: Star,
            color: 'text-amber-500 bg-amber-50',
            borderColor: 'hover:border-amber-200'
          },
          {
            title: 'កម្មវិធីបានដាក់ផ្សាយ',
            subtitle: 'Published Apps',
            value: publishedAppsCount.toString(),
            rawVal: `សរុបមាន ${apps.length} កម្មវិធី`,
            icon: Layers,
            color: 'text-purple-600 bg-purple-50',
            borderColor: 'hover:border-purple-200'
          },
          {
            title: 'ប្រាក់ចំណូលប៉ាន់ស្មាន',
            subtitle: 'Estimated Revenue',
            value: totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : 'Free',
            rawVal: 'គិតពីកម្មវិធីបង់ថ្លៃ',
            icon: Coins,
            color: 'text-rose-600 bg-rose-50',
            borderColor: 'hover:border-rose-200'
          }
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-white border border-slate-100 rounded-2xl p-4 shadow-xs transition-all duration-300 ${card.borderColor} col-span-1 ${idx === 4 ? 'col-span-2 lg:col-span-1' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[11px] text-slate-400 font-medium tracking-tight uppercase">{card.subtitle}</p>
                <h4 className="font-semibold text-slate-700 text-sm">{card.title}</h4>
              </div>
              <div className={`p-2 rounded-xl ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight font-mono">{card.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{card.rawVal}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Download & Revenue Trends Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">និន្នាការនៃការទាញយក និងចំណូលប្រចាំថ្ងៃ</h3>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Daily Download and Revenue Growth Performance Trends</p>
            </div>
            <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800 self-start">
              <button
                onClick={() => setTimeRange('7')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${timeRange === '7' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                ៧ ថ្ងៃចុងក្រោយ
              </button>
              <button
                onClick={() => setTimeRange('15')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${timeRange === '15' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                ១៥ ថ្ងៃចុងក្រោយ
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
                />
                <YAxis 
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                  labelStyle={{ fontWeight: 'bold', color: isDark ? '#f8fafc' : '#1e293b' }}
                  itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                  formatter={(value: any, name: string) => {
                    if (name.includes('ចំណូល') || name.includes('Revenue')) {
                      return [`$${value}`, name];
                    }
                    return [Number(value).toLocaleString(), name];
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }} />
                <Area 
                  yAxisId="left"
                  name="ទាញយក (Downloads)"
                  type="monotone" 
                  dataKey="downloads" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDownloads)" 
                />
                <Line 
                  yAxisId="right"
                  name="ចំណូល (Revenue $)"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share (Pie Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">ចំណែកទីផ្សារតាមផ្នែកកម្មវិធី</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Market Share by App Category</p>
          </div>

          <div className="h-60 relative flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => [
                      `${Number(value).toLocaleString()} downloads`, 
                      `${props.payload.nameKh} (${name})`
                    ]}
                    contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                    itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-400 dark:text-slate-500">គ្មានទិន្នន័យទាញយក</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">{formatNumber(totalDownloads)}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">ការទាញយកសរុប</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryChartData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{cat.nameKh}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{((cat.value / totalDownloads) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Comparison & Recent Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* App Comparison Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">ប្រៀបធៀបទិន្នន័យកម្មវិធីកំពូលៗ</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Downloads vs. Active Users comparison across portfolio</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appComparisonData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                  itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  labelStyle={{ color: isDark ? '#94a3b8' : '#64748b' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }} />
                <Bar name="ការទាញយក (Downloads)" dataKey="downloads" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="អ្នកប្រើប្រាស់សកម្ម (Active Users)" dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Ticker of Recent Downloads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  សកម្មភាពទាញយកថ្មីៗ
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Live feed of global app acquisitions</p>
              </div>
              <button 
                onClick={() => onNavigateToTab('analytics')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-semibold flex items-center gap-0.5"
              >
                <span>មើលលម្អិត</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {recentDownloads.map((dl, idx) => {
                // Find matching app
                const matchedApp = apps.find(a => a.id === dl.appId);
                const platformIcon = dl.platform === 'iOS' 
                  ? <Smartphone size={12} className="text-blue-500" />
                  : dl.platform === 'Android'
                  ? <Smartphone size={12} className="text-emerald-500" />
                  : dl.platform === 'Web'
                  ? <Globe size={12} className="text-indigo-500" />
                  : <Laptop size={12} className="text-purple-500" />;

                const timeStr = new Date(dl.timestamp).toLocaleTimeString('km-KH', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                });

                return (
                  <motion.div
                    key={dl.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 text-sm">
                        {dl.countryKhmer === 'កម្ពុជា' ? '🇰🇭' : dl.countryKhmer === 'កូរ៉េខាងត្បូង' ? '🇰្រ' : '🌐'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{dl.appName}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <span className="flex items-center gap-0.5">{platformIcon} {dl.platform}</span>
                          <span>•</span>
                          <span>{dl.countryKhmer} ({dl.userAge}ឆ្នាំ, {dl.userGender === 'Male' ? 'ប្រុស' : 'ស្រី'})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {timeStr}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
              <CheckCircle size={12} /> Live Sync Active
            </span>
            <span>យោងតាមម៉ោងតំបន់</span>
          </div>
        </div>
      </div>
    </div>
  );
};
