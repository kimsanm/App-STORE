export interface AppItem {
  id: string;
  name: string;
  category: string;
  categoryKhmer: string;
  icon: string; // Tailwind color or icon key
  version: string;
  developer: string;
  price: number; // 0 for free
  status: 'published' | 'review' | 'suspended';
  downloads: number;
  activeUsers: number;
  rating: number;
  size: string;
  releaseDate: string;
  description: string;
  platforms: ('iOS' | 'Android' | 'Web' | 'Desktop')[];
}

export interface DownloadRecord {
  id: string;
  appId: string;
  appName: string;
  timestamp: string; // ISO date
  platform: 'iOS' | 'Android' | 'Web' | 'Desktop';
  country: string;
  countryKhmer: string;
  userAge: number;
  userGender: 'Male' | 'Female' | 'Other';
}

export interface ReviewItem {
  id: string;
  appId: string;
  appName: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  reply?: string;
}

export interface DailyDownload {
  date: string;
  downloads: number;
  revenue: number;
}

export interface CountryStat {
  country: string;
  countryKhmer: string;
  downloads: number;
  flag: string;
}
