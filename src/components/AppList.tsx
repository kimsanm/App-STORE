import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Smartphone, 
  Laptop, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  X, 
  TrendingUp, 
  Star, 
  Clock, 
  FileText,
  DollarSign,
  Briefcase,
  HelpCircle,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppItem } from '../types';

interface AppListProps {
  apps: AppItem[];
  onAddApp: (newApp: AppItem) => void;
  onUpdateAppStatus: (appId: string, status: 'published' | 'review' | 'suspended') => void;
  onDeleteApp: (appId: string) => void;
}

export const AppList: React.FC<AppListProps> = ({ 
  apps, 
  onAddApp, 
  onUpdateAppStatus,
  onDeleteApp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  // Form states
  const [newAppName, setNewAppName] = useState('');
  const [newCategory, setNewCategory] = useState('Finance');
  const [newDeveloper, setNewDeveloper] = useState('');
  const [newPrice, setNewPrice] = useState('0');
  const [newSize, setNewSize] = useState('35 MB');
  const [newDescription, setNewDescription] = useState('');
  const [newPlatforms, setNewPlatforms] = useState<('iOS' | 'Android' | 'Web' | 'Desktop')[]>(['iOS', 'Android']);

  // Extract list of all categories for filter dropdown
  const categories: string[] = ['All', ...Array.from(new Set<string>(apps.map(app => app.category)))];

  // Filter apps
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.categoryKhmer.includes(searchQuery);
    const matchesCategory = categoryFilter === 'All' || app.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Category Khmer Mapping Helper
  const getKhmerCategory = (cat: string) => {
    switch (cat) {
      case 'Finance': return 'ហិរញ្ញវត្ថុ';
      case 'Food & Drink': return 'អាហារ និងភេសជ្ជៈ';
      case 'Maps & Travel': return 'ផែនទី និងការធ្វើដំណើរ';
      case 'Education': return 'ការអប់រំ';
      case 'Utilities': return 'ឧបករណ៍ប្រើប្រាស់';
      case 'Games': return 'ហ្គេម';
      default: return 'ផ្សេងៗ';
    }
  };

  // Toggle platform selection in form
  const handlePlatformToggle = (platform: 'iOS' | 'Android' | 'Web' | 'Desktop') => {
    if (newPlatforms.includes(platform)) {
      if (newPlatforms.length > 1) { // keep at least one
        setNewPlatforms(newPlatforms.filter(p => p !== platform));
      }
    } else {
      setNewPlatforms([...newPlatforms, platform]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newDeveloper || !newDescription) {
      alert('សូមបំពេញព័ត៌មានដែលចាំបាច់ទាំងអស់ (Please fill all required fields)');
      return;
    }

    const appToAdd: AppItem = {
      id: `app-${Date.now()}`,
      name: newAppName,
      category: newCategory,
      categoryKhmer: getKhmerCategory(newCategory),
      icon: getIconStringByCategory(newCategory),
      version: '1.0.0',
      developer: newDeveloper,
      price: parseFloat(newPrice) || 0,
      status: 'review', // default is review
      downloads: 0,
      activeUsers: 0,
      rating: 0,
      size: newSize,
      releaseDate: new Date().toISOString().split('T')[0],
      description: newDescription,
      platforms: newPlatforms
    };

    onAddApp(appToAdd);
    
    // Reset form
    setNewAppName('');
    setNewCategory('Finance');
    setNewDeveloper('');
    setNewPrice('0');
    setNewSize('35 MB');
    setNewDescription('');
    setNewPlatforms(['iOS', 'Android']);
    setIsAddModalOpen(false);
  };

  // Icon selector based on category
  const getIconStringByCategory = (cat: string) => {
    switch (cat) {
      case 'Finance': return 'wallet';
      case 'Food & Drink': return 'utensils';
      case 'Maps & Travel': return 'car';
      case 'Education': return 'book-open';
      case 'Utilities': return 'keyboard';
      case 'Games': return 'gamepad-2';
      default: return 'layers';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">បញ្ជីគ្រប់គ្រងកម្មវិធីទាំងអស់ (Portfolio Management)</h2>
          <p className="text-xs text-slate-400">គ្រប់គ្រងកម្មវិធី កែប្រែស្ថានភាពផ្សព្វផ្សាយ និងពិនិត្យព័ត៌មានលម្អិត</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all duration-150 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>បន្ថែមកម្មវិធីថ្មី (Add App)</span>
        </button>
      </div>

      {/* Filters & Search section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="ស្វែងរកឈ្មោះកម្មវិធី អ្នកអភិវឌ្ឍ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-500 w-full sm:w-auto">
            <Filter size={12} />
            <span className="font-medium">ផ្នែក:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'ទាំងអស់ (All)' : `${getKhmerCategory(cat)} (${cat})`}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-500 w-full sm:w-auto">
            <CheckCircle size={12} />
            <span className="font-medium">ស្ថានភាព:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">ទាំងអស់ (All Status)</option>
              <option value="published">ផ្សព្វផ្សាយ (Published)</option>
              <option value="review">កំពុងពិនិត្យ (In Review)</option>
              <option value="suspended">ផ្អាកបណ្តោះអាសន្ន (Suspended)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredApps.map((app) => (
            <motion.div
              layout
              key={app.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
            >
              <div>
                {/* Badge and Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {app.categoryKhmer}
                  </span>
                  
                  {/* Status Badges */}
                  {app.status === 'published' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ផ្សព្វផ្សាយ
                    </span>
                  )}
                  {app.status === 'review' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      កំពុងពិនិត្យ
                    </span>
                  )}
                  {app.status === 'suspended' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      បានផ្អាក
                    </span>
                  )}
                </div>

                {/* App Main Info */}
                <div className="flex gap-4 items-start mb-4">
                  {/* Avatar / Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xl">
                      {app.category === 'Finance' ? '💳' : app.category === 'Food & Drink' ? '🍔' : app.category === 'Maps & Travel' ? '🚗' : app.category === 'Education' ? '📚' : app.category === 'Utilities' ? '⌨️' : '🎮'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-emerald-600 transition-colors truncate">
                      {app.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{app.developer}</p>
                    <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">V{app.version} • {app.size}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {app.description}
                </p>

                {/* KPI numbers */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50 mb-4 bg-slate-50/50 rounded-xl px-2">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 font-medium uppercase">Downloads</p>
                    <p className="text-sm font-bold text-slate-700 font-mono">
                      {app.downloads >= 1000 ? `${(app.downloads / 1000).toFixed(1)}K` : app.downloads}
                    </p>
                  </div>
                  <div className="text-center border-x border-slate-200/60">
                    <p className="text-[9px] text-slate-400 font-medium uppercase">Rating</p>
                    <p className="text-sm font-bold text-slate-700 font-mono flex items-center justify-center gap-0.5">
                      {app.rating > 0 ? (
                        <>
                          <span>{app.rating}</span>
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                        </>
                      ) : (
                        <span className="text-xs font-normal text-slate-400">-</span>
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 font-medium uppercase">Pricing</p>
                    <p className="text-sm font-bold text-slate-700 font-mono">
                      {app.price === 0 ? 'Free' : `$${app.price}`}
                    </p>
                  </div>
                </div>

                {/* Platforms supported */}
                <div className="flex gap-1.5 items-center mb-4">
                  <span className="text-[10px] text-slate-400 font-medium">Platforms:</span>
                  <div className="flex gap-1">
                    {app.platforms.map(p => (
                      <span key={p} className="p-1 bg-slate-50 border border-slate-100 rounded text-slate-500" title={p}>
                        {p === 'iOS' || p === 'Android' ? <Smartphone size={10} /> : p === 'Web' ? <Globe size={10} /> : <Laptop size={10} />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="flex-1 py-1.5 border border-slate-100 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 text-xs font-semibold rounded-lg transition-all"
                >
                  មើលព័ត៌មាន (View Info)
                </button>
                
                {/* Dropdown status update */}
                <select
                  value={app.status}
                  onChange={(e) => onUpdateAppStatus(app.id, e.target.value as any)}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 font-medium focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="published">ផ្សព្វផ្សាយ</option>
                  <option value="review">ពិនិត្យ</option>
                  <option value="suspended">ផ្អាក</option>
                </select>

                <button
                  onClick={() => {
                    if (confirm(`តើអ្នកពិតជាចង់លុបកម្មវិធី "${app.name}" មែនទេ?`)) {
                      onDeleteApp(app.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="លុបកម្មវិធី"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredApps.length === 0 && (
          <div className="col-span-full bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <HelpCircle size={40} className="text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 text-sm">រកមិនឃើញកម្មវិធីឡើយ</h4>
            <p className="text-xs text-slate-400 mt-1">សាកល្បងវាយស្វែងរកពាក្យផ្សេង ឬផ្លាស់ប្តូរតម្រងការស្វែងរករបស់អ្នក</p>
          </div>
        )}
      </div>

      {/* Add App Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">ចុះឈ្មោះកម្មវិធីថ្មី (Add New Store Application)</h3>
                <p className="text-xs text-slate-400">បំពេញទិន្នន័យចាំបាច់ដើម្បីដាក់ជូនកម្មវិធីពិនិត្យ</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* App Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ឈ្មោះកម្មវិធី * (Application Name)</label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. ABA Mobile, Khmer Read..."
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">ផ្នែកកម្មវិធី (Category)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Finance">Finance (ហិរញ្ញវត្ថុ)</option>
                    <option value="Food & Drink">Food & Drink (អាហារ និងភេសជ្ជៈ)</option>
                    <option value="Maps & Travel">Maps & Travel (ផែនទី និងការធ្វើដំណើរ)</option>
                    <option value="Education">Education (ការអប់រំ)</option>
                    <option value="Utilities">Utilities (ឧបករណ៍ប្រើប្រាស់)</option>
                    <option value="Games">Games (ហ្គេម)</option>
                  </select>
                </div>

                {/* Developer */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">អ្នកអភិវឌ្ឍ * (Developer/Company)</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. ABA Bank, Private Dev..."
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pricing */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">តម្លៃ ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0 សម្រាប់មិនគិតថ្លៃ"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">ទំហំឯកសារ (File Size)</label>
                  <input
                    type="text"
                    placeholder="ឧ. 45 MB, 1.2 GB..."
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Supported Platforms (Multi-select style) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">គាំទ្រនៅលើប្រព័ន្ធ (Supported Platforms)</label>
                <div className="flex flex-wrap gap-2">
                  {(['iOS', 'Android', 'Web', 'Desktop'] as const).map(platform => {
                    const isSelected = newPlatforms.includes(platform);
                    return (
                      <button
                        type="button"
                        key={platform}
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {platform === 'iOS' || platform === 'Android' ? <Smartphone size={12} /> : platform === 'Web' ? <Globe size={12} /> : <Laptop size={12} />}
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ការពិពណ៌នាពីកម្មវិធី * (App Description)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="ពណ៌នាពីគោលបំណង និងលក្ខណៈពិសេសរបស់កម្មវិធី..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-emerald-600/10"
                >
                  ដាក់ស្នើ (Submit App)
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* App Details / Info Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl font-bold">
                  {selectedApp.category === 'Finance' ? '💳' : selectedApp.category === 'Food & Drink' ? '🍔' : selectedApp.category === 'Maps & Travel' ? '🚗' : selectedApp.category === 'Education' ? '📚' : selectedApp.category === 'Utilities' ? '⌨️' : '🎮'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{selectedApp.name}</h3>
                  <p className="text-xs text-slate-400">ព័ត៌មានលម្អិតរបស់កម្មវិធី (App Metadata)</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Details Content */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {selectedApp.description}
              </p>

              <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-xs border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-medium">អ្នកអភិវឌ្ឍ (Developer)</p>
                    <p className="font-bold text-slate-700">{selectedApp.developer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-medium">កាលបរិច្ឆេទផ្សាយ (Release Date)</p>
                    <p className="font-bold text-slate-700 font-mono">{selectedApp.releaseDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-medium">ទំហំ និងកំណែ (Size & Version)</p>
                    <p className="font-bold text-slate-700 font-mono">{selectedApp.size} (V{selectedApp.version})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-medium">តម្លៃទាញយក (Price USD)</p>
                    <p className="font-bold text-slate-700 font-mono">{selectedApp.price === 0 ? 'Free (ឥតគិតថ្លៃ)' : `$${selectedApp.price}`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-medium">ការទាញយក (Downloads)</p>
                    <p className="font-bold text-slate-700 font-mono">{selectedApp.downloads.toLocaleString()} downloads</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star size={14} className="text-slate-400" />
                  <div>
                    <p className="text-slate-400 font-medium">ពិន្ទុ (Rating Score)</p>
                    <p className="font-bold text-slate-700 font-mono flex items-center gap-1">
                      {selectedApp.rating} <Star size={10} className="fill-amber-400 text-amber-400" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-slate-500">កែប្រែស្ថានភាពផ្សព្វផ្សាយ:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => {
                    onUpdateAppStatus(selectedApp.id, e.target.value as any);
                    setSelectedApp({ ...selectedApp, status: e.target.value as any });
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="published">ផ្សព្វផ្សាយ (Published)</option>
                  <option value="review">កំពុងពិនិត្យ (In Review)</option>
                  <option value="suspended">ផ្អាកបណ្តោះអាសន្ន (Suspended)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  បិទវិញ (Close)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
