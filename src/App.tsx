import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  BarChart2, 
  MessageSquare, 
  Bell, 
  Check, 
  Database,
  Smartphone,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-components
import { Overview } from './components/Overview';
import { AppList } from './components/AppList';
import { Analytics } from './components/Analytics';
import { Reviews } from './components/Reviews';

// Types and Mock Data
import { AppItem, DownloadRecord, ReviewItem, DailyDownload, CountryStat } from './types';
import { 
  initialApps, 
  initialReviews, 
  dailyDownloads as initialDailyDownloads, 
  countryStats as initialCountryStats, 
  recentDownloads as initialRecentDownloads 
} from './mockData';

export default function App() {
  // Global States
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('appstore_apps');
    return saved ? JSON.parse(saved) : initialApps;
  });

  const [downloads, setDownloads] = useState<DownloadRecord[]>(() => {
    const saved = localStorage.getItem('appstore_downloads');
    return saved ? JSON.parse(saved) : initialRecentDownloads;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('appstore_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [dailyDownloads, setDailyDownloads] = useState<DailyDownload[]>(() => {
    const saved = localStorage.getItem('appstore_daily_downloads');
    return saved ? JSON.parse(saved) : initialDailyDownloads;
  });

  const [countryStats, setCountryStats] = useState<CountryStat[]>(() => {
    const saved = localStorage.getItem('appstore_country_stats');
    return saved ? JSON.parse(saved) : initialCountryStats;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Theme and comfort settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('appstore_theme');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('appstore_theme');
    const t = (saved as 'light' | 'dark' | 'system') || 'system';
    if (t === 'system') {
      return typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    }
    return t === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const matches = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(matches ? 'dark' : 'light');
        setIsDark(matches);
      } else {
        root.classList.add(theme);
        setIsDark(theme === 'dark');
      }
    };

    applyTheme();
    localStorage.setItem('appstore_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  // Real-time animation feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('appstore_apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('appstore_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('appstore_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('appstore_daily_downloads', JSON.stringify(dailyDownloads));
  }, [dailyDownloads]);

  useEffect(() => {
    localStorage.setItem('appstore_country_stats', JSON.stringify(countryStats));
  }, [countryStats]);

  // Show Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Action: Add new app
  const handleAddApp = (newApp: AppItem) => {
    setApps([newApp, ...apps]);
    showToast(`បានបន្ថែមកម្មវិធី "${newApp.name}" ទៅក្នុងបញ្ជីរងចាំពិនិត្យដោយជោគជ័យ!`);
  };

  // Action: Update App Status
  const handleUpdateAppStatus = (appId: string, status: 'published' | 'review' | 'suspended') => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        let downloadsVal = app.downloads;
        let activeUsersVal = app.activeUsers;
        
        // If transitioning to published for the first time
        if (status === 'published' && app.downloads === 0) {
          downloadsVal = Math.floor(Math.random() * 500) + 100;
          activeUsersVal = Math.floor(downloadsVal * 0.7);
        }

        return { 
          ...app, 
          status,
          downloads: downloadsVal,
          activeUsers: activeUsersVal
        };
      }
      return app;
    }));
    
    const statusText = status === 'published' ? 'ផ្សព្វផ្សាយ' : status === 'review' ? 'កំពុងពិនិត្យ' : 'ផ្អាកបណ្តោះអាសន្ន';
    showToast(`បានកែប្រែស្ថានភាពកម្មវិធីទៅជា "${statusText}"!`);
  };

  // Action: Delete App
  const handleDeleteApp = (appId: string) => {
    const matchedApp = apps.find(a => a.id === appId);
    setApps(apps.filter(app => app.id !== appId));
    showToast(`បានលុបកម្មវិធី "${matchedApp?.name || 'Unknown'}" ជោគជ័យ។`);
  };

  // Action: Add review reply
  const handleAddReply = (reviewId: string, replyContent: string) => {
    setReviews(reviews.map(rev => {
      if (rev.id === reviewId) {
        return { ...rev, reply: replyContent };
      }
      return rev;
    }));
    showToast('បានផ្ញើការឆ្លើយតបទៅកាន់អ្នកប្រើប្រាស់រួចរាល់!');
  };

  // Action: Simulates a random download (Telemetry engine)
  const handleSimulateRandomDownload = () => {
    // Pick published apps only
    const publishedApps = apps.filter(app => app.status === 'published');
    if (publishedApps.length === 0) {
      showToast('សូមផ្សព្វផ្សាយ (Publish) កម្មវិធីយ៉ាងហោចណាស់មួយសិន ដើម្បីសាកល្បងការទាញយក!');
      return;
    }

    const randomApp = publishedApps[Math.floor(Math.random() * publishedApps.length)];
    
    // Pick random platform
    const platforms: ('iOS' | 'Android' | 'Web' | 'Desktop')[] = ['iOS', 'Android', 'Web', 'Desktop'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];

    // Pick random country
    const countries = [
      { code: 'Cambodia', nameKh: 'កម្ពុជា', flag: '🇰🇭' },
      { code: 'Thailand', nameKh: 'ថៃ', flag: '🇹🇭' },
      { code: 'Vietnam', nameKh: 'វៀតណាម', flag: '🇻🇳' },
      { code: 'South Korea', nameKh: 'កូរ៉េខាងត្បូង', flag: '🇰🇷' },
      { code: 'United States', nameKh: 'សហរដ្ឋអាមេរិក', flag: '🇺🇸' },
      { code: 'Japan', nameKh: 'ជប៉ុន', flag: '🇯🇵' },
    ];
    // Bias towards Cambodia for local feel
    const randomCountry = Math.random() < 0.7 
      ? countries[0] 
      : countries[Math.floor(Math.random() * countries.length)];

    const randomAge = Math.floor(Math.random() * 35) + 16; // 16 - 50
    const randomGender: 'Male' | 'Female' | 'Other' = Math.random() < 0.52 ? 'Female' : Math.random() < 0.92 ? 'Male' : 'Other';

    handleLogDownload({
      appId: randomApp.id,
      appName: randomApp.name,
      platform: randomPlatform,
      country: randomCountry.code,
      countryKhmer: randomCountry.nameKh,
      userAge: randomAge,
      userGender: randomGender
    });
  };

  // Action: Log explicit download
  const handleLogDownload = (newDl: Omit<DownloadRecord, 'id' | 'timestamp'>) => {
    const downloadId = `dl-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const record: DownloadRecord = {
      id: downloadId,
      ...newDl,
      timestamp
    };

    // Update states
    setDownloads(prev => [record, ...prev.slice(0, 49)]); // keep last 50 downloads in memory

    // Increment app downloads count and active users
    setApps(prevApps => prevApps.map(app => {
      if (app.id === newDl.appId) {
        return {
          ...app,
          downloads: app.downloads + 1,
          activeUsers: app.activeUsers + (Math.random() > 0.3 ? 1 : 0) // slightly increase active users
        };
      }
      return app;
    }));

    // Increment country stats count
    setCountryStats(prevStats => prevStats.map(stat => {
      if (stat.country === newDl.country) {
        return {
          ...stat,
          downloads: stat.downloads + 1
        };
      }
      return stat;
    }));

    // Update Daily download chart (today's downloads)
    setDailyDownloads(prevDaily => {
      const updated = [...prevDaily];
      const todayRecord = updated[updated.length - 1];
      if (todayRecord) {
        todayRecord.downloads += 1;
        // If app is paid, increase today's revenue
        const matchedApp = apps.find(a => a.id === newDl.appId);
        if (matchedApp && matchedApp.price > 0) {
          todayRecord.revenue += matchedApp.price;
        }
      }
      return updated;
    });

    showToast(`📥 បានកត់ត្រាការទាញយកថ្មី: ${newDl.appName} គាំទ្រដោយ ${newDl.platform} នៅ ${newDl.countryKhmer}!`);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col antialiased transition-colors duration-200">
      {/* Top Banner / Navigation header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-800 dark:text-white">APP STORE</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/40 dark:border-emerald-800/40 px-1.5 py-0.5 rounded-full">ADMIN</span>
              </div>
              <h1 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 -mt-0.5 tracking-tight">ប្រព័ន្ធគ្រប់គ្រង និងវិភាគទិន្នន័យ (Cambodian App Hub)</h1>
            </div>
          </div>

          {/* Center Quick stats indicators */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">សមកាលកម្មផ្សាយផ្ទាល់ (Live Sync Active)</span>
            </div>
          </div>

          {/* Right User account settings & Theme Selector */}
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/50">
              <button
                onClick={() => setTheme('light')}
                title="Light Mode (រចនាបថភ្លឺ)"
                className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title="Dark Mode (រចនាបថងងឹត)"
                className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <Moon size={14} />
              </button>
              <button
                onClick={() => setTheme('system')}
                title="System (តាមទូរស័ព្ទ/កុំព្យូទ័រ)"
                className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <Monitor size={14} />
              </button>
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">v4udevelop.app</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">v4udevelop.app@gmail.com</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs shrink-0">
              V4
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Rails Tab Buttons */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 py-1.5 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', title: 'ផ្ទាំងគ្រប់គ្រងទូទៅ', en: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'apps', title: 'បញ្ជីគ្រប់គ្រងកម្មវិធី', en: 'App Portfolio', icon: Layers },
              { id: 'analytics', title: 'ស្ទូឌីយោវិភាគទិន្នន័យ', en: 'Analytics Studio', icon: BarChart2 },
              { id: 'reviews', title: 'ការវាយតម្លៃ និងមតិយោបល់', en: 'User Feedback', icon: MessageSquare }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${isActive ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <tab.icon size={15} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
                  <div className="text-left">
                    <p className={`leading-none ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>{tab.title}</p>
                    <p className="text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-tight">{tab.en}</p>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <Overview 
                apps={apps}
                dailyDownloads={dailyDownloads}
                recentDownloads={downloads.slice(0, 5)}
                onNavigateToTab={setActiveTab}
                onSimulateDownload={handleSimulateRandomDownload}
                isDark={isDark}
              />
            )}

            {activeTab === 'apps' && (
              <AppList 
                apps={apps}
                onAddApp={handleAddApp}
                onUpdateAppStatus={handleUpdateAppStatus}
                onDeleteApp={handleDeleteApp}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics 
                apps={apps}
                downloads={downloads}
                dailyDownloads={dailyDownloads}
                countryStats={countryStats}
                onLogDownload={handleLogDownload}
                isDark={isDark}
              />
            )}

            {activeTab === 'reviews' && (
              <Reviews 
                apps={apps}
                reviews={reviews}
                onAddReply={handleAddReply}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 py-6 mt-12 text-xs text-slate-400 dark:text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 App Store Management System. រចនាឡើងយ៉ាងយកចិត្តទុកដាក់សម្រាប់ទីផ្សារកម្ពុជា។</p>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-lg">
            <Database size={12} />
            <span>LOCALPERSISTENCE ENGINE v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Popups */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4.5 py-3 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2.5 max-w-sm"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check size={12} />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
