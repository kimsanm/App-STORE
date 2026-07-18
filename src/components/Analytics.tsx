import React, { useState } from 'react';
import { 
  BarChart2, 
  MapPin, 
  Smartphone, 
  Globe, 
  Sparkles, 
  Activity, 
  User, 
  PlusCircle, 
  CheckCircle,
  HelpCircle,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Layers,
  DollarSign,
  Star,
  Laptop,
  Wallet,
  Utensils,
  Car,
  BookOpen,
  Keyboard,
  Gamepad2,
  Check,
  Download,
  FileText,
  AlertTriangle,
  Bell,
  Percent
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
import { motion, AnimatePresence } from 'motion/react';
import { AppItem, DownloadRecord, CountryStat, DailyDownload } from '../types';

interface AnalyticsProps {
  apps: AppItem[];
  downloads: DownloadRecord[];
  dailyDownloads: DailyDownload[];
  countryStats: CountryStat[];
  onLogDownload: (download: Omit<DownloadRecord, 'id' | 'timestamp'>) => void;
  isDark?: boolean;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  apps,
  downloads,
  dailyDownloads,
  countryStats,
  onLogDownload,
  isDark = false
}) => {
  // Filter states
  const [selectedAppId, setSelectedAppId] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Date range picker states
  const [dateRangePreset, setDateRangePreset] = useState<'all' | '7days' | '30days' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-07-04');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-07-18');

  // Simulator states
  const [simAppId, setSimAppId] = useState(apps[0]?.id || '');
  const [simPlatform, setSimPlatform] = useState<'iOS' | 'Android' | 'Web' | 'Desktop'>('Android');
  const [simCountry, setSimCountry] = useState('Cambodia');
  const [simAge, setSimAge] = useState('22');
  const [simGender, setSimGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [showSimSuccess, setShowSimSuccess] = useState(false);

  // Country details list for simulation dropdown
  const simulatorCountries = [
    { code: 'Cambodia', nameKh: 'កម្ពុជា', flag: '🇰🇭' },
    { code: 'Thailand', nameKh: 'ថៃ', flag: '🇹🇭' },
    { code: 'Vietnam', nameKh: 'វៀតណាម', flag: '🇻🇳' },
    { code: 'South Korea', nameKh: 'កូរ៉េខាងត្បូង', flag: '🇰🇷' },
    { code: 'United States', nameKh: 'សហរដ្ឋអាមេរិក', flag: '🇺🇸' },
    { code: 'Japan', nameKh: 'ជប៉ុន', flag: '🇯🇵' },
  ];

  // Helper to determine the start and end dates based on the active preset
  const getEffectiveRange = () => {
    const baseDate = new Date('2026-07-18'); // Reference date
    const start = new Date(baseDate);
    const end = new Date(baseDate);

    if (dateRangePreset === '7days') {
      start.setDate(baseDate.getDate() - 6); // Last 7 days
    } else if (dateRangePreset === '30days') {
      start.setDate(baseDate.getDate() - 29); // Last 30 days
    } else if (dateRangePreset === 'custom') {
      const s = new Date(customStartDate);
      const e = new Date(customEndDate);
      s.setHours(0, 0, 0, 0);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    } else {
      // 'all'
      return null;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const range = getEffectiveRange();

  // Comparison states
  const [compareAppId1, setCompareAppId1] = useState<string>(apps[0]?.id || '');
  const [compareAppId2, setCompareAppId2] = useState<string>(apps[1]?.id || apps[0]?.id || '');

  // Growth Trend & 7-Day Forecast States
  const [maWindow, setMaWindow] = useState<number>(5); // 3, 5, or 7
  const [growthScenario, setGrowthScenario] = useState<'conservative' | 'optimistic' | 'pessimistic'>('optimistic');

  // Anomaly Detector States
  const [anomalySensitivity, setAnomalySensitivity] = useState<number>(0.5); // deviation threshold (e.g., 0.3, 0.5, 0.7)
  const [showAnomalyHighlights, setShowAnomalyHighlights] = useState<boolean>(true);

  const renderAppIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'wallet':
        return <Wallet className={className} />;
      case 'utensils':
        return <Utensils className={className} />;
      case 'car':
        return <Car className={className} />;
      case 'book-open':
        return <BookOpen className={className} />;
      case 'keyboard':
        return <Keyboard className={className} />;
      case 'gamepad-2':
        return <Gamepad2 className={className} />;
      default:
        return <Smartphone className={className} />;
    }
  };

  const getAppColorGradient = (appId: string) => {
    switch (appId) {
      case 'app-1':
        return 'from-emerald-500 to-teal-600 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50';
      case 'app-2':
        return 'from-orange-500 to-rose-500 text-orange-500 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/50';
      case 'app-3':
        return 'from-amber-400 to-orange-500 text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50';
      case 'app-4':
        return 'from-blue-500 to-indigo-600 text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50';
      case 'app-5':
        return 'from-purple-500 to-pink-500 text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50';
      case 'app-6':
        return 'from-red-500 to-rose-600 text-red-500 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50';
      default:
        return 'from-slate-500 to-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900/50';
    }
  };

  const getAppStats = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return null;

    // Filtered downloads for this app (using date filter only)
    const appFilteredDownloads = downloads.filter(dl => {
      if (dl.appId !== appId) return false;
      if (!range) return true;
      const dlDate = new Date(dl.timestamp);
      return dlDate >= range.start && dlDate <= range.end;
    });
    const countFiltered = appFilteredDownloads.length;

    // Computed revenue for current period
    const revenueFiltered = countFiltered * app.price;

    // Total downloads in all time downloads list (unfiltered)
    const appAllDownloads = downloads.filter(dl => dl.appId === appId);
    
    // Platform share
    const platformsCount = appAllDownloads.reduce((acc, dl) => {
      acc[dl.platform] = (acc[dl.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let topPlatform = 'N/A';
    let topPlatformCount = 0;
    for (const p in platformsCount) {
      if (platformsCount[p] > topPlatformCount) {
        topPlatform = p;
        topPlatformCount = platformsCount[p];
      }
    }

    // Country share
    const countriesCount = appAllDownloads.reduce((acc, dl) => {
      acc[dl.countryKhmer] = (acc[dl.countryKhmer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let topCountry = 'N/A';
    let topCountryCount = 0;
    for (const c in countriesCount) {
      if (countriesCount[c] > topCountryCount) {
        topCountry = c;
        topCountryCount = countriesCount[c];
      }
    }

    return {
      app,
      countFiltered,
      revenueFiltered,
      topPlatform,
      topCountry
    };
  };

  const stats1 = getAppStats(compareAppId1);
  const stats2 = getAppStats(compareAppId2);

  // Dynamic charts comparing daily trends of compare apps
  const totalPortfolioDownloads = apps.reduce((sum, a) => sum + a.downloads, 0) || 1;
  const app1Share = (stats1?.app.downloads || 0) / totalPortfolioDownloads;
  const app2Share = (stats2?.app.downloads || 0) / totalPortfolioDownloads;

  const compareChartData = dailyDownloads.map(d => {
    return {
      date: d.date,
      app1Downloads: Math.round(d.downloads * app1Share) + 1,
      app2Downloads: Math.round(d.downloads * app2Share) + 1,
    };
  }).filter(d => {
    if (!range) return true;
    const dlDate = new Date(`2026-${d.date}`);
    dlDate.setHours(0, 0, 0, 0);
    return dlDate >= range.start && dlDate <= range.end;
  });

  // Apply filters to downloads
  const filteredDownloads = downloads.filter(dl => {
    const matchesApp = selectedAppId === 'All' || dl.appId === selectedAppId;
    const matchesPlatform = selectedPlatform === 'All' || dl.platform === selectedPlatform;
    const matchesCountry = selectedCountry === 'All' || dl.country === selectedCountry;

    let matchesDate = true;
    if (range) {
      const dlDate = new Date(dl.timestamp);
      matchesDate = dlDate >= range.start && dlDate <= range.end;
    }

    return matchesApp && matchesPlatform && matchesCountry && matchesDate;
  });

  // Dynamically scale and filter daily downloads trend chart
  const filteredDailyDownloads = dailyDownloads.map(d => {
    if (selectedAppId === 'All') return d;
    const matchedApp = apps.find(a => a.id === selectedAppId);
    if (!matchedApp) return d;
    
    // Scale based on the app's relative download share in the portfolio
    const totalPortfolioDownloads = apps.reduce((sum, a) => sum + a.downloads, 0) || 1;
    const appShare = matchedApp.downloads / totalPortfolioDownloads;
    
    return {
      ...d,
      downloads: Math.round(d.downloads * appShare) + 1,
      revenue: matchedApp.price > 0 ? Math.round(d.revenue * appShare) : 0
    };
  }).filter(d => {
    if (!range) return true;
    const dlDate = new Date(`2026-${d.date}`);
    dlDate.setHours(0, 0, 0, 0);
    return dlDate >= range.start && dlDate <= range.end;
  });

  // --- START OF GROWTH TREND & FORECAST CALCULATION ---
  const historicalTrend = [...filteredDailyDownloads];

  // Calculate historical moving averages
  const historicalWithMA = historicalTrend.map((item, idx) => {
    if (idx < maWindow - 1) {
      return { ...item, ma: null };
    }
    let sum = 0;
    for (let i = 0; i < maWindow; i++) {
      sum += historicalTrend[idx - i].downloads;
    }
    return { ...item, ma: Math.round(sum / maWindow) };
  });

  // --- ANOMALY DETECTION ENGINE ---
  const historicalWithAnomalies = historicalWithMA.map((item) => {
    if (item.ma === null || item.ma === 0) {
      return { ...item, isAnomaly: false, deviation: 0, anomalyType: null as 'spike' | 'drop' | null };
    }
    const deviation = (item.downloads - item.ma) / item.ma;
    const isAnomaly = Math.abs(deviation) > anomalySensitivity;
    return {
      ...item,
      isAnomaly,
      deviation,
      anomalyType: isAnomaly ? (deviation > 0 ? ('spike' as const) : ('drop' as const)) : null
    };
  });

  const detectedAnomalies = historicalWithAnomalies.filter(item => item.isAnomaly);

  // Calculate compound/average daily growth rate over sample (up to 7 days)
  let historicalGrowthRate = 0.02; // default fallback +2%
  if (historicalTrend.length >= 2) {
    const windowDays = Math.min(historicalTrend.length, 7);
    const sample = historicalTrend.slice(-windowDays);
    let totalRate = 0;
    let rateCount = 0;
    for (let i = 1; i < sample.length; i++) {
      const prev = sample[i - 1].downloads;
      if (prev > 0) {
        totalRate += (sample[i].downloads - prev) / prev;
        rateCount++;
      }
    }
    if (rateCount > 0) {
      historicalGrowthRate = totalRate / rateCount;
    }
  }
  // Cap at realistic range [-12%, +12%]
  historicalGrowthRate = Math.max(-0.12, Math.min(0.12, historicalGrowthRate));

  // Generate 7 days forecast starting after the last date
  const forecastList: { date: string; downloads: number; ma: number | null; isForecast: boolean }[] = [];
  const currentWindowValues = historicalTrend.slice(-maWindow).map(h => h.downloads);

  let multiplier = 1;
  if (growthScenario === 'optimistic') {
    multiplier = 1 + (historicalGrowthRate > 0 ? historicalGrowthRate : 0.03);
  } else if (growthScenario === 'pessimistic') {
    multiplier = 1 + (historicalGrowthRate < 0 ? historicalGrowthRate : -0.03);
  } else {
    multiplier = 1; // conservative pure MA autoregressive
  }

  if (historicalTrend.length > 0) {
    const lastEntry = historicalTrend[historicalTrend.length - 1];
    const [monthStr, dayStr] = lastEntry.date.split('-');
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const baseDate = new Date(2026, month - 1, day);

    for (let step = 1; step <= 7; step++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + step);
      const formattedMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
      const formattedDay = String(nextDate.getDate()).padStart(2, '0');
      const dateKey = `${formattedMonth}-${formattedDay}`;

      // Calculate base predicted value as moving average of sliding window
      const windowSum = currentWindowValues.reduce((s, v) => s + v, 0);
      const basePrediction = windowSum / (currentWindowValues.length || 1);

      // Apply compounding trend multiplier
      const finalPredictedVal = Math.max(10, Math.round(basePrediction * Math.pow(multiplier, step)));

      forecastList.push({
        date: dateKey,
        downloads: finalPredictedVal,
        ma: Math.round(basePrediction),
        isForecast: true
      });

      // Roll current window values
      if (currentWindowValues.length > 0) {
        currentWindowValues.shift();
      }
      currentWindowValues.push(finalPredictedVal);
    }
  }

  // Combine historical and forecasted data for rendering
  const growthTrendChartData = [
    ...historicalTrend.map(item => {
      const maItem = historicalWithAnomalies.find(m => m.date === item.date);
      return {
        dateName: item.date,
        actual: item.downloads,
        forecast: null as number | null,
        ma: maItem ? maItem.ma : null,
        isForecast: false,
        isAnomaly: maItem ? maItem.isAnomaly : false,
        anomalyType: maItem ? maItem.anomalyType : null,
        deviation: maItem ? maItem.deviation : 0
      };
    }),
    ...forecastList.map(item => {
      return {
        dateName: `${item.date} (🔮)`,
        actual: null as number | null,
        forecast: item.downloads,
        ma: item.ma,
        isForecast: true,
        isAnomaly: false,
        anomalyType: null,
        deviation: 0
      };
    })
  ];

  // Calculate summary metrics for the forecast
  const totalForecastedDownloads = forecastList.reduce((sum, item) => sum + item.downloads, 0);
  
  // Calculate historical 7-day sum for comparison
  const last7DaysHistorical = historicalTrend.slice(-7);
  const totalLast7DaysDownloads = last7DaysHistorical.reduce((sum, item) => sum + item.downloads, 0) || 1;
  const expectedGrowthRatePercentage = Math.round(((totalForecastedDownloads - totalLast7DaysDownloads) / totalLast7DaysDownloads) * 100);

  // Expected revenue from forecast
  const selectedApp = apps.find(a => a.id === selectedAppId);
  const averagePriceValue = selectedApp ? selectedApp.price : (apps.reduce((sum, a) => sum + a.price, 0) / (apps.length || 1));
  const expectedForecastedRevenue = Math.round(totalForecastedDownloads * averagePriceValue);
  // --- END OF GROWTH TREND & FORECAST CALCULATION ---

  // --- USER RETENTION & STICKINESS CALCULATION ---
  const appsWithRetention = apps.map(app => {
    const retentionRate = app.downloads > 0 ? (app.activeUsers / app.downloads) * 100 : 0;
    return {
      id: app.id,
      name: app.name,
      shortName: app.name.split(' ')[0],
      downloads: app.downloads,
      activeUsers: app.activeUsers,
      retentionRate: parseFloat(retentionRate.toFixed(1)),
      category: app.categoryKhmer
    };
  }).sort((a, b) => b.retentionRate - a.retentionRate);

  const highestRetentionApp = appsWithRetention[0] || { id: '', name: 'None', shortName: 'None', retentionRate: 0 };
  const lowestRetentionApp = appsWithRetention[appsWithRetention.length - 1] || { id: '', name: 'None', shortName: 'None', retentionRate: 0 };

  const currentSelectionStats = (() => {
    if (selectedAppId === 'All') {
      const activeSum = apps.reduce((sum, a) => sum + a.activeUsers, 0);
      const dlSum = apps.reduce((sum, a) => sum + a.downloads, 0);
      const rate = dlSum > 0 ? (activeSum / dlSum) * 100 : 0;
      return {
        name: 'គ្រប់កម្មវិធីទាំងអស់ (All Apps)',
        activeUsers: activeSum,
        downloads: dlSum,
        retentionRate: parseFloat(rate.toFixed(1))
      };
    } else {
      const app = apps.find(a => a.id === selectedAppId);
      const rate = app && app.downloads > 0 ? (app.activeUsers / app.downloads) * 100 : 0;
      return {
        name: app?.name || 'Unknown',
        activeUsers: app?.activeUsers || 0,
        downloads: app?.downloads || 0,
        retentionRate: parseFloat(rate.toFixed(1))
      };
    }
  })();
  // --- END OF USER RETENTION & STICKINESS CALCULATION ---

  // Hotfix age group key alignment
  const ageChartData = [
    { name: 'ក្រោម ១៨ ឆ្នាំ', value: filteredDownloads.filter(d => d.userAge < 18).length },
    { name: '១៨-២៤ ឆ្នាំ', value: filteredDownloads.filter(d => d.userAge >= 18 && d.userAge <= 24).length },
    { name: '២៥-៣៤ ឆ្នាំ', value: filteredDownloads.filter(d => d.userAge >= 25 && d.userAge <= 34).length },
    { name: '៣៥-៤៤ ឆ្នាំ', value: filteredDownloads.filter(d => d.userAge >= 35 && d.userAge <= 44).length },
    { name: '៤៥ ឆ្នាំឡើង', value: filteredDownloads.filter(d => d.userAge >= 45).length },
  ];

  // Calculate gender stats
  const genders = {
    Male: filteredDownloads.filter(d => d.userGender === 'Male').length,
    Female: filteredDownloads.filter(d => d.userGender === 'Female').length,
    Other: filteredDownloads.filter(d => d.userGender === 'Other').length,
  };

  const genderChartData = [
    { name: 'ប្រុស (Male)', value: genders.Male, color: '#3b82f6' },
    { name: 'ស្រី (Female)', value: genders.Female, color: '#ec4899' },
    { name: 'ផ្សេងៗ (Other)', value: genders.Other, color: '#8b5cf6' },
  ].filter(g => g.value > 0);

  // Calculate platform distribution
  const platforms = {
    iOS: filteredDownloads.filter(d => d.platform === 'iOS').length,
    Android: filteredDownloads.filter(d => d.platform === 'Android').length,
    Web: filteredDownloads.filter(d => d.platform === 'Web').length,
    Desktop: filteredDownloads.filter(d => d.platform === 'Desktop').length,
  };

  const platformChartData = [
    { name: 'iOS', value: platforms.iOS, color: '#0ea5e9' },
    { name: 'Android', value: platforms.Android, color: '#10b981' },
    { name: 'Web', value: platforms.Web, color: '#6366f1' },
    { name: 'Desktop', value: platforms.Desktop, color: '#a855f7' },
  ].filter(p => p.value > 0);

  // Export active filtered datasets as CSV
  const exportToCSV = (headers: string[], rows: string[][], filename: string) => {
    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.map(val => {
        const str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDailyTrends = () => {
    const headers = [
      'កាលបរិច្ឆេទ (Date)',
      'ការទាញយកជាក់ស្តែង (Actual Downloads)',
      'ការព្យាករណ៍ (Forecast)',
      `មធ្យមភាគចល័ត ${maWindow} ថ្ងៃ (Moving Average)`,
      'ប្រភេទ (Data Type)'
    ];

    const rows = growthTrendChartData.map(item => [
      item.dateName,
      item.actual !== null ? String(item.actual) : '',
      item.forecast !== null ? String(item.forecast) : '',
      item.ma !== null ? String(item.ma) : '',
      item.isForecast ? 'ការព្យាករណ៍ (Forecast)' : 'ទិន្នន័យពិត (Actual)'
    ]);

    const activeAppName = selectedAppId === 'All' ? 'All_Apps' : (apps.find(a => a.id === selectedAppId)?.name.replace(/\s+/g, '_') || 'App');
    const filename = `${activeAppName}_daily_trends_and_forecast_2026-07-18.csv`;
    exportToCSV(headers, rows, filename);
  };

  const handleExportRawDownloads = () => {
    const headers = [
      'លេខសម្គាល់ (Download ID)',
      'លេខសម្គាល់កម្មវិធី (App ID)',
      'ឈ្មោះកម្មវិធី (App Name)',
      'ប្រព័ន្ធប្រតិបត្តិការ (Platform)',
      'ប្រទេស (Country)',
      'អាយុ (User Age)',
      'ភេទ (User Gender)',
      'កាលបរិច្ឆេទ & ម៉ោង (Timestamp)'
    ];

    const rows = filteredDownloads.map(dl => [
      dl.id,
      dl.appId,
      dl.appName,
      dl.platform,
      dl.countryKhmer || dl.country,
      String(dl.userAge),
      dl.userGender === 'Male' ? 'ប្រុស (Male)' : dl.userGender === 'Female' ? 'ស្រី (Female)' : 'ផ្សេងទៀត (Other)',
      dl.timestamp
    ]);

    const activeAppName = selectedAppId === 'All' ? 'All_Apps' : (apps.find(a => a.id === selectedAppId)?.name.replace(/\s+/g, '_') || 'App');
    const filename = `${activeAppName}_raw_downloads_filtered_2026-07-18.csv`;
    exportToCSV(headers, rows, filename);
  };

  // Handle simulation log click
  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedApp = apps.find(a => a.id === simAppId);
    if (!matchedApp) return;

    const matchedCountryObj = simulatorCountries.find(c => c.code === simCountry);

    onLogDownload({
      appId: simAppId,
      appName: matchedApp.name,
      platform: simPlatform,
      country: simCountry,
      countryKhmer: matchedCountryObj?.nameKh || simCountry,
      userAge: parseInt(simAge) || 25,
      userGender: simGender
    });

    setShowSimSuccess(true);
    setTimeout(() => {
      setShowSimSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">ស្ទូឌីយោវិភាគទិន្នន័យ (Analytics Studio)</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">តាមដានស្ថិតិនៃការទាញយក វិភាគប្រជាសាស្ត្រ និងឧបករណ៍ដែលអ្នកប្រើប្រាស់ពេញចិត្ត</p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Filter Panels & Simulators */}
        <div className="space-y-6 lg:col-span-1">
          {/* Active Filtering Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              តម្រងស្វែងរកទិន្នន័យ (Filter Engine)
            </h3>
            
            <div className="space-y-3">
              {/* App Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">ជ្រើសរើសកម្មវិធី (App)</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">គ្រប់កម្មវិធីទាំងអស់ (All Apps)</option>
                  {apps.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">ប្រព័ន្ធប្រតិបត្តិការ (Platform)</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">គ្រប់ប្រព័ន្ធទាំងអស់ (All Platforms)</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="Web">Web</option>
                  <option value="Desktop">Desktop</option>
                </select>
              </div>

              {/* Country Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">ប្រទេស (Country)</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">គ្រប់ប្រទេសទាំងអស់ (All Countries)</option>
                  {simulatorCountries.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.nameKh} ({c.code})</option>
                  ))}
                </select>
              </div>

              {/* Date Range Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={11} className="text-emerald-500 animate-pulse" />
                  កាលបរិច្ឆេទ (Date Range)
                </label>
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 mb-2">
                  {[
                    { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All' },
                    { id: '7days', labelKh: '៧ ថ្ងៃ', labelEn: '7D' },
                    { id: '30days', labelKh: '៣០ ថ្ងៃ', labelEn: '30D' },
                    { id: 'custom', labelKh: 'ផ្ទាល់ខ្លួន', labelEn: 'Custom' }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setDateRangePreset(preset.id as any)}
                      className={`py-1 px-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        dateRangePreset === preset.id
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="block leading-none">{preset.labelKh}</span>
                      <span className="block text-[8px] font-medium opacity-70 leading-none mt-0.5">{preset.labelEn}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Date Inputs */}
                <AnimatePresence initial={false}>
                  {dateRangePreset === 'custom' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">ចាប់ពី (Start Date)</span>
                          <input
                            type="date"
                            min="2026-07-01"
                            max="2026-07-18"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full text-[11px] font-semibold px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">រហូតដល់ (End Date)</span>
                          <input
                            type="date"
                            min="2026-07-01"
                            max="2026-07-18"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full text-[11px] font-semibold px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>សរុបមានក្នុងតម្រង:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{filteredDownloads.length} records</span>
            </div>
          </div>

          {/* Data Export Center */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1 flex items-center gap-1.5">
              <Download size={16} className="text-violet-500" />
              នាំចេញទិន្នន័យ (Data Export Center)
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
              ទាញយកទិន្នន័យបច្ចុប្បន្នជាទម្រង់ឯកសារ CSV ដើម្បីយកទៅវិភាគលម្អិតបន្ថែមក្រៅបណ្តាញ។
            </p>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleExportDailyTrends}
                className="w-full text-xs px-4 py-2.5 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-950/40 border border-violet-100 dark:border-violet-800/30 rounded-xl font-bold text-violet-700 dark:text-violet-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <TrendingUp size={14} />
                នាំចេញនិន្នាការប្រចាំថ្ងៃ (Daily Trends CSV)
              </button>
              <button
                type="button"
                onClick={handleExportRawDownloads}
                className="w-full text-xs px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 rounded-xl font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText size={14} />
                នាំចេញទិន្នន័យលម្អិត (Raw Downloads CSV)
              </button>
            </div>
          </div>

          {/* Telemetry Download Simulator */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-5 shadow-lg text-white">
            <h3 className="font-bold text-sm mb-1.5 flex items-center gap-1.5 text-emerald-400">
              <Sparkles size={16} />
              ម៉ាស៊ីនបង្កើតការទាញយក (Telemetry Simulator)
            </h3>
            <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
              ជ្រើសរើសទម្រង់អ្នកប្រើប្រាស់ ដើម្បីបង្កើតទិន្នន័យទាញយកគំរូ សម្រាប់វិភាគសាកល្បងភ្លាមៗ។
            </p>

            <form onSubmit={handleSimulate} className="space-y-3">
              {/* App */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">ជ្រើសរើសកម្មវិធី</label>
                <select
                  value={simAppId}
                  onChange={(e) => setSimAppId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {apps.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              {/* Platform & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">ប្រព័ន្ធ (OS)</label>
                  <select
                    value={simPlatform}
                    onChange={(e) => setSimPlatform(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Web">Web</option>
                    <option value="Desktop">Desktop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">ប្រទេស (Country)</label>
                  <select
                    value={simCountry}
                    onChange={(e) => setSimCountry(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {simulatorCountries.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.nameKh}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">អាយុ (Age)</label>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={simAge}
                    onChange={(e) => setSimAge(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">ភេទ (Gender)</label>
                  <select
                    value={simGender}
                    onChange={(e) => setSimGender(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                  >
                    <option value="Male">ប្រុស (Male)</option>
                    <option value="Female">ស្រី (Female)</option>
                    <option value="Other">ផ្សេងៗ (Other)</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 mt-2"
              >
                <PlusCircle size={14} />
                <span>បញ្ជូនទិន្នន័យ (Transmit Telemetry)</span>
              </button>
            </form>

            {/* Simulated success popup */}
            <AnimatePresence>
              {showSimSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] p-2 rounded-xl flex items-center gap-2 mt-3"
                >
                  <CheckCircle size={14} className="shrink-0 text-emerald-400" />
                  <span>បានបញ្ជូនទិន្នន័យទាញយកគំរូដោយជោគជ័យ! តារាងវិភាគកំពុងធ្វើការអាប់ដេតស្វ័យប្រវត្ត។</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Charts & Analysis Reports */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart Panel: Daily Downloads and Revenue Trends */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={18} className="text-emerald-500" />
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">និន្នាការទាញយក និងចំណូលប្រចាំថ្ងៃ (Daily Trend Overview)</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {dateRangePreset === 'all' && 'បង្ហាញទិន្នន័យនិន្នាការទាំងអស់ (All-time dynamic trend visualizer)'}
                  {dateRangePreset === '7days' && 'បង្ហាញទិន្នន័យនិន្នាការ ៧ ថ្ងៃចុងក្រោយ (Last 7 days dynamic trend visualizer)'}
                  {dateRangePreset === '30days' && 'បង្ហាញទិន្នន័យនិន្នាការ ៣០ ថ្ងៃចុងក្រោយ (Last 30 days dynamic trend visualizer)'}
                  {dateRangePreset === 'custom' && `បង្ហាញទិន្នន័យចាប់ពី ${customStartDate} ដល់ ${customEndDate}`}
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              {filteredDailyDownloads.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={filteredDailyDownloads} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDownloadsAnalytics" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#colorDownloadsAnalytics)" 
                      dot={showAnomalyHighlights ? (props: any) => {
                        const { cx, cy, payload } = props;
                        const maItem = historicalWithAnomalies.find(m => m.date === payload.date);
                        if (maItem && maItem.isAnomaly) {
                          const color = maItem.anomalyType === 'spike' ? '#f43f5e' : '#3b82f6';
                          return (
                            <g key={payload.date}>
                              <circle cx={cx} cy={cy} r={6} fill={color} stroke="#ffffff" strokeWidth={2} />
                              <circle cx={cx} cy={cy} r={11} fill="none" stroke={color} strokeWidth={1.5} className="animate-pulse" />
                            </g>
                          );
                        }
                        return null;
                      } : false}
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
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 gap-2">
                  <Calendar size={24} className="opacity-40" />
                  <span>គ្មានទិន្នន័យសម្រាប់កំឡុងពេលដែលបានជ្រើសរើសទេ (No trend data available for this range)</span>
                </div>
              )}
            </div>
          </div>

          {/* Anomaly Detector Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={18} className="text-amber-500 animate-pulse" />
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">ប្រព័ន្ធស្វែងរកភាពមិនប្រក្រតី (Anomaly Detector)</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  ស្វែងរកដោយស្វ័យប្រវត្តិនូវថ្ងៃដែលមានការទាញយកកើនឡើង ឬធ្លាក់ចុះខុសធម្មតា (deviations &gt; {Math.round(anomalySensitivity * 100)}% ធៀបនឹងមធ្យមភាគចល័ត)
                </p>
              </div>

              {/* Anomaly Configuration */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                {/* Sensitivity Selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">ភាពប្រែប្រួលនៃការស្កេន (Sensitivity / Threshold)</span>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                    {[0.3, 0.5, 0.7].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setAnomalySensitivity(s)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          anomalySensitivity === s
                            ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {Math.round(s * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Highlight Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAnomalyHighlights(!showAnomalyHighlights)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    showAnomalyHighlights 
                      ? 'bg-amber-50/50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
                      : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Bell size={13} className={showAnomalyHighlights ? 'animate-bounce' : ''} />
                  {showAnomalyHighlights ? 'បង្ហាញការសម្គាល់លើគំនូសតាង' : 'លាក់ការសម្គាល់លើគំនូសតាង'}
                </button>
              </div>
            </div>

            {/* Anomalies List */}
            {detectedAnomalies.length > 0 ? (
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  ភាពមិនប្រក្រតីដែលបានរកឃើញចំនួន {detectedAnomalies.length} ( {detectedAnomalies.length} Detected Anomalies )
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detectedAnomalies.map((item) => {
                    const devPct = Math.round(item.deviation * 100);
                    const isSpike = item.anomalyType === 'spike';
                    return (
                      <div 
                        key={item.date} 
                        className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all hover:shadow-xs ${
                          isSpike 
                            ? 'bg-rose-50/30 dark:bg-rose-950/5 border-rose-100/50 dark:border-rose-900/20' 
                            : 'bg-blue-50/30 dark:bg-blue-950/5 border-blue-100/50 dark:border-blue-900/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">កាលបរិច្ឆេទ៖ {item.date}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                ជាក់ស្តែង៖ <strong className="font-mono text-slate-700 dark:text-slate-300">{item.downloads.toLocaleString()}</strong>
                              </span>
                              <span className="text-slate-300 dark:text-slate-700 text-[10px]">|</span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                មធ្យមភាគចល័ត៖ <strong className="font-mono text-slate-700 dark:text-slate-300">{item.ma?.toLocaleString()}</strong>
                              </span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shrink-0 ${
                            isSpike 
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                          }`}>
                            {isSpike ? 'Spike 📈' : 'Drop 📉'}
                            {isSpike ? '+' : ''}{devPct}%
                          </span>
                        </div>

                        <div className={`text-[11px] p-2 rounded-lg leading-relaxed ${
                          isSpike
                            ? 'bg-rose-50/50 dark:bg-rose-950/10 text-rose-600/90 dark:text-rose-400/90'
                            : 'bg-blue-50/50 dark:bg-blue-950/10 text-blue-600/90 dark:text-blue-400/90'
                        }`}>
                          {isSpike 
                            ? 'ការកើនឡើងខ្ពស់ខុសធម្មតា! នេះអាចបណ្តាលមកពីយុទ្ធនាការផ្សព្វផ្សាយជោគជ័យ ឬការអាប់ដេតមុខងារថ្មីដែលទាក់ទាញអ្នកប្រើប្រាស់។'
                            : 'ការធ្លាក់ចុះខុសធម្មតា! គប្បីត្រួតពិនិត្យលើប្រព័ន្ធម៉ាស៊ីនបម្រើ (server) ឬអាចបណ្តាលមកពីកត្តារដូវកាល ឬថ្ងៃឈប់សម្រាក។'
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ពុំមានការរកឃើញភាពមិនប្រក្រតីទេ (No Anomalies Detected)</span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    រាល់ការទាញយកប្រចាំថ្ងៃគឺស្ថិតនៅក្នុងកម្រិតធម្មតា ស្របតាមនិន្នាការមធ្យមភាគចល័ត {maWindow} ថ្ងៃ។
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Growth Trend & 7-Day Forecast Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={18} className="text-violet-500 animate-pulse" />
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">ការព្យាករណ៍ និងនិន្នាការលូតលាស់ (Growth Trend & 7-Day Forecast)</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  ម៉ូដែលវិភាគការទាញយករយៈពេល ៧ ថ្ងៃបន្ទាប់ ដោយប្រើប្រាស់មធ្យមភាគចល័ត (7-day predictive projection based on moving averages and historical trend vectors)
                </p>
              </div>

              {/* Model Configurations */}
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                {/* Moving Average Window Selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">មធ្យមភាគចល័ត (Moving Average Window)</span>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                    {[3, 5, 7].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setMaWindow(w)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                          maWindow === w
                            ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {w} ថ្ងៃ (Days)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scenario Selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">សេណារីយ៉ូកំណើន (Growth Scenario)</span>
                  <select
                    value={growthScenario}
                    onChange={(e) => setGrowthScenario(e.target.value as any)}
                    className="text-[10px] font-bold px-2 py-1.5 bg-slate-100 dark:bg-slate-800 dark:text-white border-none rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="conservative">Conservative ( Baseline MA )</option>
                    <option value="optimistic">Optimistic ( Growth Trend )</option>
                    <option value="pessimistic">Pessimistic ( Downturn Risk )</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Forecasted Downloads Card */}
              <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100/50 dark:border-violet-800/20">
                <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase block mb-1">ការទាញយករំពឹងទុក (Expected Downloads)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black font-mono text-violet-700 dark:text-violet-400">
                    {totalForecastedDownloads.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-violet-500 dark:text-violet-400 font-medium">ដង (Downloads)</span>
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">ក្នុងរយៈពេល ៧ ថ្ងៃបន្ទាប់ (Next 7 days total)</p>
              </div>

              {/* Projected Growth Card */}
              <div className={`p-4 rounded-xl border ${
                expectedGrowthRatePercentage >= 0 
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100/50 dark:border-emerald-800/20' 
                  : 'bg-rose-50/40 dark:bg-rose-950/10 border-rose-100/50 dark:border-rose-800/20'
              }`}>
                <span className={`text-[10px] font-bold uppercase block mb-1 ${
                  expectedGrowthRatePercentage >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                }`}>អត្រាកំណើនប៉ាន់ស្មាន (Projected Growth)</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black font-mono ${
                    expectedGrowthRatePercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {expectedGrowthRatePercentage >= 0 ? '+' : ''}{expectedGrowthRatePercentage}%
                  </span>
                  <span className={`text-[10px] font-medium ${
                    expectedGrowthRatePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>ធៀបនឹងសប្តាហ៍មុន</span>
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">ផ្អែកលើការប្រៀបធៀបសប្តាហ៍បន្តបន្ទាប់ (Week-over-Week trend)</p>
              </div>

              {/* Expected Revenue Card */}
              <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-800/20">
                <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase block mb-1">ចំណូលបន្ថែមរំពឹងទុក (Projected Added Revenue)</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                    ${expectedForecastedRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-500 dark:text-amber-400 font-medium">USD</span>
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">គណនាលើតម្លៃមធ្យមភាគកម្មវិធី ${averagePriceValue.toFixed(2)}</p>
              </div>
            </div>

            {/* Combined Chart Area */}
            <div className="h-64 w-full">
              {growthTrendChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthTrendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                    <XAxis 
                      dataKey="dateName" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                      itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                      labelStyle={{ fontWeight: 'bold', color: isDark ? '#a78bfa' : '#6d28d9', fontSize: '11px', marginBottom: '4px' }}
                      formatter={(value: any, name: string) => {
                        return [Number(value).toLocaleString(), name];
                      }}
                    />
                    <Legend verticalAlign="top" height={28} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px' }} />
                    
                    {/* Historical Area */}
                    <Area 
                      name="ការទាញយកជាក់ស្តែង (Actual Downloads)"
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorActual)" 
                      dot={showAnomalyHighlights ? (props: any) => {
                        const { cx, cy, payload } = props;
                        if (payload.isAnomaly) {
                          const color = payload.anomalyType === 'spike' ? '#f43f5e' : '#3b82f6';
                          return (
                            <g key={payload.dateName}>
                              <circle cx={cx} cy={cy} r={6} fill={color} stroke="#ffffff" strokeWidth={2} />
                              <circle cx={cx} cy={cy} r={11} fill="none" stroke={color} strokeWidth={1.5} className="animate-pulse" />
                            </g>
                          );
                        }
                        return null;
                      } : false}
                    />

                    {/* Forecast Area */}
                    <Area 
                      name="ការព្យាករណ៍ទាញយក (Forecasted)"
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1} 
                      fill="url(#colorForecast)" 
                    />

                    {/* Moving Average Line overlaying everything */}
                    <Line 
                      name={`មធ្យមភាគចល័ត ${maWindow} ថ្ងៃ (Moving Average)`}
                      type="monotone" 
                      dataKey="ma" 
                      stroke="#f59e0b" 
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  គ្មានទិន្នន័យដើម្បីព្យាករណ៍ទេ
                </div>
              )}
            </div>

            {/* Smart Automated Insight Bullet */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs">
              <Zap size={14} className="text-violet-500 shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">ការវាយតម្លៃឆ្លាតវៃ (Model Analysis Insight)</span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  ផ្អែកលើទិន្នន័យជាក់ស្តែង និងគំរូ <strong>{growthScenario === 'optimistic' ? 'អភិវឌ្ឍន៍ខ្ពស់ (Optimistic Growth)' : growthScenario === 'pessimistic' ? 'ហានិភ័យថយចុះ (Pessimistic Decline)' : 'រក្សាស្ថិរភាព (Conservative)'}</strong>, 
                  ការទាញយកត្រូវបានរំពឹងថានឹងមានការប្រែប្រួលជារួម {expectedGrowthRatePercentage >= 0 ? 'កើនឡើង' : 'ថយចុះ'} ប្រហែល <strong>{Math.abs(expectedGrowthRatePercentage)}%</strong> នៅក្នុងសប្តាហ៍បន្ទាប់។ 
                  {expectedGrowthRatePercentage >= 10 ? ' និន្នាការវិជ្ជមានខ្លាំងនេះបង្ហាញពីតម្រូវការទីផ្សារខ្ពស់ និងការទទួលយកកម្មវិធីយ៉ាងសកម្មពីសំណាក់អ្នកប្រើប្រាស់។' : 
                   expectedGrowthRatePercentage > 0 ? ' សញ្ញាលូតលាស់ស្រាលនេះបង្ហាញពីកំណើនប្រកបដោយចីរភាព។ ការបង្កើនយុទ្ធនាការទីផ្សារនឹងជួយជំរុញថែមទៀត។' : 
                   ' និន្នាការថមថយបង្ហាញពីការថយចុះចំណាប់អារម្មណ៍បណ្តោះអាសន្ន ឬឥទ្ធិពលចុងសប្តាហ៍។ គប្បីពិចារណាលើការធ្វើការអាប់ដេតថ្មីៗ ឬការផ្តល់ជូនប្រូម៉ូសិនពិសេស។'}
                </p>
              </div>
            </div>
          </div>

          {/* User Retention & Stickiness Analysis Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Percent size={18} className="text-indigo-500 animate-pulse" />
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">ការវិភាគការរក្សាទុកអ្នកប្រើប្រាស់ (User Retention & Stickiness Analysis)</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  វាស់ស្ទង់ភាពស្អិតរមួតរបស់កម្មវិធី ដោយផ្អែកលើសមាមាត្រអ្នកប្រើប្រាស់សកម្មប្រចាំថ្ងៃ ធៀបនឹងចំនួនទាញយកសរុប (Ratio of active users to total downloads)
                </p>
              </div>
            </div>

            {/* Retention Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Active App Retention Rate Card */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-800/20 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase block mb-1">អត្រារក្សាទុកបច្ចុប្បន្ន (Current Retention Rate)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-indigo-700 dark:text-indigo-400">
                      {currentSelectionStats.retentionRate}%
                    </span>
                    <span className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">នៃអ្នកទាញយក</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 font-semibold">
                  {selectedAppId === 'All' ? 'មធ្យមភាគគ្រប់កម្មវិធីទាំងអស់' : `សម្រាប់កម្មវិធី៖ ${currentSelectionStats.name}`}
                </p>
              </div>

              {/* Best Retention App */}
              <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-800/20 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase block mb-1">កម្មវិធីស្អិតរមួតបំផុត (Highest Stickiness)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px] block">
                      {highestRetentionApp.shortName}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">({highestRetentionApp.retentionRate}%)</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2">ទទួលបានការពេញចិត្តខ្ពស់បំផុតពីអ្នកប្រើប្រាស់</p>
              </div>

              {/* Lowest Retention App */}
              <div className="p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-800/20 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase block mb-1">ត្រូវការបង្កើនការរក្សាទុក (Lowest Stickiness)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 truncate max-w-[150px] block">
                      {lowestRetentionApp.shortName}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">({lowestRetentionApp.retentionRate}%)</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2">គួរពិចារណាបន្ថែមមុខងារលើកទឹកចិត្ត ឬ Push Notify</p>
              </div>
            </div>

            {/* Retention Comparison Chart */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                ការប្រៀបធៀបអត្រារក្សាទុកចន្លោះកម្មវិធីនីមួយៗ (Retention Rate Comparison Across Portfolio)
              </div>
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appsWithRetention} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                    <XAxis 
                      dataKey="shortName" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                      itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                      labelStyle={{ fontWeight: 'bold', color: isDark ? '#6366f1' : '#4f46e5', fontSize: '11px', marginBottom: '4px' }}
                      formatter={(value: any) => [`${value}%`, 'អត្រារក្សាទុក (Retention Rate)']}
                    />
                    <Bar 
                      dataKey="retentionRate" 
                      radius={[6, 6, 0, 0]}
                    >
                      {appsWithRetention.map((entry, index) => {
                        const isSelected = selectedAppId === entry.id;
                        let barColor = isDark ? '#4f46e5' : '#6366f1'; // default indigo
                        if (entry.id === highestRetentionApp.id) barColor = '#10b981'; // emerald for best
                        if (entry.id === lowestRetentionApp.id) barColor = '#f43f5e'; // rose for lowest
                        
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={barColor} 
                            fillOpacity={selectedAppId === 'All' || isSelected ? 1 : 0.35}
                            stroke={isSelected ? '#f59e0b' : 'none'}
                            strokeWidth={2}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart UX Retention Insights */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs">
              <Zap size={14} className="text-indigo-500 shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">ការណែនាំស្តីពីការកែលម្អ (Retention Optimization Insight)</span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  កម្មវិធី <strong>{highestRetentionApp.name}</strong> មានអត្រារក្សាទុកអ្នកប្រើប្រាស់ខ្ពស់ជាងគេបំផុតគឺ <strong>{highestRetentionApp.retentionRate}%</strong> ដោយសារមុខងារផ្តល់តម្លៃប្រចាំថ្ងៃខ្ពស់ និងការរៀបចំ UI/UX ងាយស្រួល។ 
                  ផ្ទុយទៅវិញ កម្មវិធី <strong>{lowestRetentionApp.name}</strong> មានអត្រាត្រឹមតែ <strong>{lowestRetentionApp.retentionRate}%</strong>។ គន្លឹះដើម្បីជំរុញឱ្យអ្នកប្រើប្រាស់ត្រឡប់មកវិញ (Stickiness): 
                  គួររៀបចំប្រព័ន្ធរង្វាន់ប្រចាំថ្ងៃ (Daily Check-in Bonus), ផ្ញើសារ Push Notification កម្រិតផ្ទាល់ខ្លួន, ឬបន្ថែមមុខងារអន្តរកម្មតូចៗ (Micro-interactions) ដើម្បីកាត់បន្ថយអត្រាលុបកម្មវិធី (Churn Rate)។
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side App Comparison Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Layers size={18} className="text-amber-500 animate-bounce" />
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">ប្រៀបធៀបកម្មវិធីចំហៀង (Side-by-Side App Comparison)</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  ជ្រើសរើសកម្មវិធីពីរ ដើម្បីធ្វើការប្រៀបធៀបទិន្នន័យលម្អិត និងនិន្នាការទាញយករបស់កម្មវិធីនីមួយៗ (Select two apps to perform exhaustive performance evaluation)
                </p>
              </div>
            </div>

            {/* Selector Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  កម្មវិធីទី ១ (App A)
                </label>
                <select
                  value={compareAppId1}
                  onChange={(e) => setCompareAppId1(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  {apps.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  កម្មវិធីទី ២ (App B)
                </label>
                <select
                  value={compareAppId2}
                  onChange={(e) => setCompareAppId2(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  {apps.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compare App Profiles */}
            {stats1 && stats2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile 1 */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 bg-gradient-to-br ${stats1.app.id === compareAppId1 ? 'from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/10 dark:to-transparent border-emerald-500/20' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAppColorGradient(stats1.app.id)} flex items-center justify-center shrink-0 shadow-xs`}>
                      {renderAppIcon(stats1.app.icon, "w-6 h-6 text-white")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">App A</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{stats1.app.developer}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm mt-1">{stats1.app.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Category: {stats1.app.categoryKhmer} ({stats1.app.category})</p>
                    </div>
                  </div>

                  {/* Profile 2 */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 bg-gradient-to-br ${stats2.app.id === compareAppId2 ? 'from-blue-50/50 to-indigo-50/30 dark:from-blue-950/10 dark:to-transparent border-blue-500/20' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAppColorGradient(stats2.app.id)} flex items-center justify-center shrink-0 shadow-xs`}>
                      {renderAppIcon(stats2.app.icon, "w-6 h-6 text-white")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">App B</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{stats2.app.developer}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm mt-1">{stats2.app.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Category: {stats2.app.categoryKhmer} ({stats2.app.category})</p>
                    </div>
                  </div>
                </div>

                {/* Comparison Matrix Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-4">លក្ខណៈប្រៀបធៀប (Metric Name)</th>
                        <th className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-bold">{stats1.app.name.split(' ')[0]} (A)</th>
                        <th className="py-2.5 px-4 text-slate-600 dark:text-slate-300 font-bold">{stats2.app.name.split(' ')[0]} (B)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {/* Price */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">តម្លៃទាញយក (Price)</td>
                        <td className="py-2.5 px-4 font-bold">{stats1.app.price === 0 ? 'ឥតគិតថ្លៃ (Free)' : `$${stats1.app.price}`}</td>
                        <td className="py-2.5 px-4 font-bold">{stats2.app.price === 0 ? 'ឥតគិតថ្លៃ (Free)' : `$${stats2.app.price}`}</td>
                      </tr>
                      {/* Version */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">ជំនាន់កម្មវិធី (Version)</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{stats1.app.version}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{stats2.app.version}</td>
                      </tr>
                      {/* Size */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">ទំហំឯកសារ (Size)</td>
                        <td className="py-2.5 px-4 text-slate-500">{stats1.app.size}</td>
                        <td className="py-2.5 px-4 text-slate-500">{stats2.app.size}</td>
                      </tr>
                      {/* Total Downloads */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">ទាញយកសរុប (Total Downloads)</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800 dark:text-white">
                            {stats1.app.downloads.toLocaleString()}
                            {stats1.app.downloads > stats2.app.downloads && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800 dark:text-white">
                            {stats2.app.downloads.toLocaleString()}
                            {stats2.app.downloads > stats1.app.downloads && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Active Users */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">អ្នកប្រើសកម្ម (Active Users)</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800 dark:text-white">
                            {stats1.app.activeUsers.toLocaleString()}
                            {stats1.app.activeUsers > stats2.app.activeUsers && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800 dark:text-white">
                            {stats2.app.activeUsers.toLocaleString()}
                            {stats2.app.activeUsers > stats1.app.activeUsers && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Retention Rate */}
                      <tr className="bg-indigo-50/5 dark:bg-indigo-950/5">
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">អត្រារក្សាទុកអ្នកប្រើប្រាស់ (Retention Rate)</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                            {(stats1.app.downloads > 0 ? (stats1.app.activeUsers / stats1.app.downloads) * 100 : 0).toFixed(1)}%
                            {(stats1.app.downloads > 0 ? stats1.app.activeUsers / stats1.app.downloads : 0) > (stats2.app.downloads > 0 ? stats2.app.activeUsers / stats2.app.downloads : 0) && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                            {(stats2.app.downloads > 0 ? (stats2.app.activeUsers / stats2.app.downloads) * 100 : 0).toFixed(1)}%
                            {(stats2.app.downloads > 0 ? stats2.app.activeUsers / stats2.app.downloads : 0) > (stats1.app.downloads > 0 ? stats1.app.activeUsers / stats1.app.downloads : 0) && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Rating */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">ការវាយតម្លៃ (Rating)</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                            <span className="flex items-center gap-0.5 text-amber-500"><Star size={11} fill="currentColor" /> {stats1.app.rating}</span>
                            {stats1.app.rating > stats2.app.rating && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                            <span className="flex items-center gap-0.5 text-amber-500"><Star size={11} fill="currentColor" /> {stats2.app.rating}</span>
                            {stats2.app.rating > stats1.app.rating && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Filtered Period Downloads */}
                      <tr className="bg-emerald-50/10 dark:bg-emerald-950/5">
                        <td className="py-2.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">ទាញយកក្នុងកំឡុងពេល (Period Downloads)</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {stats1.countFiltered.toLocaleString()}
                            {stats1.countFiltered > stats2.countFiltered && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {stats2.countFiltered.toLocaleString()}
                            {stats2.countFiltered > stats1.countFiltered && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Estimated Period Revenue */}
                      <tr className="bg-blue-50/10 dark:bg-blue-950/5">
                        <td className="py-2.5 px-4 font-semibold text-blue-600 dark:text-blue-400">ចំណូលក្នុងកំឡុងពេល (Period Revenue)</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-blue-600 dark:text-blue-400">
                            ${stats1.revenueFiltered.toLocaleString()}
                            {stats1.revenueFiltered > stats2.revenueFiltered && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono text-blue-600 dark:text-blue-400">
                            ${stats2.revenueFiltered.toLocaleString()}
                            {stats2.revenueFiltered > stats1.revenueFiltered && (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5"><Award size={10} /> ឈ្នះ</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Top Platform */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">ប្រព័ន្ធប្រតិបត្តិការពេញនិយម (Top Platform)</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {stats1.topPlatform}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {stats2.topPlatform}
                          </span>
                        </td>
                      </tr>
                      {/* Top Country */}
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 dark:text-slate-400">ប្រទេសពេញនិយម (Top Country)</td>
                        <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">{stats1.topCountry}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">{stats2.topCountry}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Compare Daily Download Trend Line Chart */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <h5 className="font-bold text-slate-700 dark:text-slate-300 text-xs mb-3 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-amber-500" />
                    និន្នាការប្រៀបធៀបការទាញយកប្រចាំថ្ងៃ (Comparative Daily Download Trends)
                  </h5>
                  <div className="h-48 w-full">
                    {compareChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={compareChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCompApp1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCompApp2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                          <XAxis 
                            dataKey="date" 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                          />
                          <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                            itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                          />
                          <Legend verticalAlign="top" height={28} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px' }} />
                          <Area 
                            name={`${stats1.app.name.split(' ')[0]} (A)`}
                            type="monotone" 
                            dataKey="app1Downloads" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorCompApp1)" 
                          />
                          <Area 
                            name={`${stats2.app.name.split(' ')[0]} (B)`}
                            type="monotone" 
                            dataKey="app2Downloads" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorCompApp2)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                        គ្មានទិន្នន័យដើម្បីប្រៀបធៀបទេ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual reports cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Demographic Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                  <User size={16} className="text-blue-500" />
                  ស្ថិតិអាយុរបស់អ្នកប្រើប្រាស់
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">User downloads by age group distribution</p>
              </div>

              <div className="h-48 w-full">
                {filteredDownloads.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageChartData} barSize={20} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                        itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                        labelStyle={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                    គ្មានទិន្នន័យសម្រាប់តម្រងនេះទេ
                  </div>
                )}
              </div>
            </div>

            {/* Gender Demographic Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                  <User size={16} className="text-pink-500" />
                  សនិទានភាពតាមភេទ
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">User downloads by gender share</p>
              </div>

              <div className="h-48 flex items-center justify-center relative">
                {genderChartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {genderChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                          itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                        {filteredDownloads.length}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase">សរុប</span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-500">គ្មានទិន្នន័យ</div>
                )}
              </div>

              {/* Gender Legends */}
              <div className="flex justify-center gap-4 text-xs mt-2">
                {genderChartData.map(g => (
                  <div key={g.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{g.name}:</span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono">{g.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Breakdown Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                  <Smartphone size={16} className="text-emerald-500" />
                  ប្រព័ន្ធប្រតិបត្តិការដែលនិយមប្រើ
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Downloads share by operating platform</p>
              </div>

              <div className="h-48 flex items-center justify-center relative">
                {platformChartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {platformChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9' }}
                          itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-500">គ្មានទិន្នន័យ</div>
                )}
              </div>

              {/* Platform Legends */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs mt-2">
                {platformChartData.map(p => (
                  <div key={p.name} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{p.name}</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300 font-mono mt-0.5">{p.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographical Distribution Stat */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs">
              <div className="mb-3">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                  <MapPin size={16} className="text-indigo-500" />
                  ទីតាំងភូមិសាស្ត្ររបស់អ្នកប្រើប្រាស់
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Top geographic download locations (historic)</p>
              </div>

              <div className="space-y-2.5">
                {countryStats.slice(0, 5).map((stat, idx) => {
                  const maxDownloads = countryStats[0].downloads;
                  const percentageWidth = `${(stat.downloads / maxDownloads) * 100}%`;

                  return (
                    <div key={stat.country} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>{stat.flag}</span>
                          <span>{stat.countryKhmer} ({stat.country})</span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono">{stat.downloads.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden border border-slate-100/30 dark:border-slate-800">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: percentageWidth }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
