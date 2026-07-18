import { AppItem, DownloadRecord, ReviewItem, DailyDownload, CountryStat } from './types';

export const initialApps: AppItem[] = [
  {
    id: 'app-1',
    name: 'SabaPay (សាបាប៉េ)',
    category: 'Finance',
    categoryKhmer: 'ហិរញ្ញវត្ថុ',
    icon: 'wallet',
    version: '2.4.1',
    developer: 'Saba Digital Co., Ltd.',
    price: 0,
    status: 'published',
    downloads: 125400,
    activeUsers: 84200,
    rating: 4.8,
    size: '42 MB',
    releaseDate: '2025-01-15',
    description: 'កម្មវិធីទូទាត់ប្រាក់រហ័ស និងសុវត្ថិភាពខ្ពស់នៅកម្ពុជា។ ងាយស្រួលផ្ទេរប្រាក់ បង់វិក្កយបត្រ និងស្កេនទូទាត់តាមរយៈ KHQR Code បានយ៉ាងរហ័សទាន់ចិត្ត។',
    platforms: ['iOS', 'Android']
  },
  {
    id: 'app-2',
    name: 'NhamNow (ញ៉ាំឥឡូវ)',
    category: 'Food & Drink',
    categoryKhmer: 'អាហារ និងភេសជ្ជៈ',
    icon: 'utensils',
    version: '1.8.9',
    developer: 'Cambodia Food Logistics',
    price: 0,
    status: 'published',
    downloads: 98500,
    activeUsers: 45100,
    rating: 4.5,
    size: '56 MB',
    releaseDate: '2025-03-10',
    description: 'សេវាកម្មដឹកជញ្ជូនអាហារ និងគ្រឿងទេសលំដាប់លំដងដំបូងគេនៅភ្នំពេញ និងតាមបណ្តាខេត្តនានា។ បញ្ជាទិញអាហារដែលអ្នកចូលចិត្តពីហាងល្បីៗរាប់ពាន់ក្នុងរយៈពេលខ្លីបំផុត។',
    platforms: ['iOS', 'Android', 'Web']
  },
  {
    id: 'app-3',
    name: 'TukTuk Go (ទុកទុក ហ្គោ)',
    category: 'Maps & Travel',
    categoryKhmer: 'ផែនទី និងការធ្វើដំណើរ',
    icon: 'car',
    version: '3.1.0',
    developer: 'Go Ride Tech',
    price: 0,
    status: 'published',
    downloads: 74200,
    activeUsers: 31800,
    rating: 4.2,
    size: '38 MB',
    releaseDate: '2025-02-05',
    description: 'កម្មវិធីហៅកង់បី និងតាក់ស៊ីលឿនរហ័សទាន់ចិត្ត ជាមួយនឹងតម្លៃសមរម្យ និងតម្លាភាពខ្ពស់។ ធ្វើដំណើរប្រកបដោយសុវត្ថិភាពគ្រប់ទីកន្លែងគ្រប់ពេលវេលា។',
    platforms: ['iOS', 'Android']
  },
  {
    id: 'app-4',
    name: 'Khmeread (ខ្មែររីត)',
    category: 'Education',
    categoryKhmer: 'ការអប់រំ',
    icon: 'book-open',
    version: '1.2.4',
    developer: 'Khmer Edu Foundation',
    price: 1.99,
    status: 'published',
    downloads: 12400,
    activeUsers: 8900,
    rating: 4.7,
    size: '120 MB',
    releaseDate: '2025-05-20',
    description: 'បណ្ណាល័យសៀវភៅអេឡិចត្រូនិច និងសៀវភៅសំឡេងដ៏សម្បូរបែបសម្រាប់យុវជនខ្មែរ។ រួមបញ្ចូលទាំងសៀវភៅអក្សរសិល្ប៍ខ្មែរ ប្រលោមលោក បំណិនជីវិត និងការអភិវឌ្ឍខ្លួន។',
    platforms: ['iOS', 'Android', 'Web', 'Desktop']
  },
  {
    id: 'app-5',
    name: 'Khmer Keyboard 360',
    category: 'Utilities',
    categoryKhmer: 'ឧបករណ៍ប្រើប្រាស់',
    icon: 'keyboard',
    version: '5.0.1',
    developer: 'Khmer SoftDev',
    price: 0,
    status: 'published',
    downloads: 215000,
    activeUsers: 142000,
    rating: 4.6,
    size: '18 MB',
    releaseDate: '2024-11-12',
    description: 'ក្តារចុចអក្សរខ្មែរឆ្លាតវៃ ងាយស្រួលវាយអក្សរលឿន រួមបញ្ចូលទាំងមុខងារទស្សន៍ទាយពាក្យស្វ័យប្រវត្ត និងសញ្ញាអារម្មណ៍ (Emoji) សម្បូរបែប។',
    platforms: ['iOS', 'Android']
  },
  {
    id: 'app-6',
    name: 'Angkor Match 3D',
    category: 'Games',
    categoryKhmer: 'ហ្គេម',
    icon: 'gamepad-2',
    version: '0.9.5',
    developer: 'Angkor Games Studio',
    price: 0,
    status: 'review',
    downloads: 0,
    activeUsers: 0,
    rating: 0,
    size: '235 MB',
    releaseDate: '2026-07-15',
    description: 'ហ្គេមផ្គូផ្គងវត្ថុបុរាណ 3D ដ៏ជក់ចិត្ត ដោយមានផ្ទៃខាងក្រោយជាប្រាសាទបុរាណខ្មែរ។ រីករាយជាមួយការកម្សាន្ត និងស្វែងយល់ពីកេរដំណែលវប្បធម៌ខ្មែរ។',
    platforms: ['iOS', 'Android']
  }
];

export const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    appId: 'app-1',
    appName: 'SabaPay (សាបាប៉េ)',
    user: 'សុខ ជា',
    rating: 5,
    comment: 'កម្មវិធីនេះល្អណាស់ ផ្ទេរលុយលឿន ហើយមិនសូវគាំងដូចមុនទេ។ ស្កេនទូទាត់ជាមួយ KHQR បានគ្រប់ហាង!',
    date: '2026-07-17',
    sentiment: 'positive'
  },
  {
    id: 'rev-2',
    appId: 'app-1',
    appName: 'SabaPay (សាបាប៉េ)',
    user: 'ចាន់ ស្រីនី',
    rating: 4,
    comment: 'ការរចនាស្អាត និងងាយស្រួលប្រើ ប៉ុន្តែពេលខ្លះយឺតបន្តិចពេលភ្ជាប់ទៅធនាគារផ្សេងទៀត។ សង្ឃឹមថានឹងមានការអាប់ដេតថ្មីឆាប់ៗ។',
    date: '2026-07-16',
    sentiment: 'neutral'
  },
  {
    id: 'rev-3',
    appId: 'app-2',
    appName: 'NhamNow (ញ៉ាំឥឡូវ)',
    user: 'គឹម ហួរ',
    rating: 5,
    comment: 'សេវាកម្មដឹកជញ្ជូនរហ័សទាន់ចិត្ត! ម្ហូបនៅតែក្តៅៗល្អ ហើយមានប្រូម៉ូសិនបញ្ចុះតម្លៃច្រើនទៀតផង។ ពេញចិត្តខ្លាំង!',
    date: '2026-07-15',
    sentiment: 'positive'
  },
  {
    id: 'rev-4',
    appId: 'app-2',
    appName: 'NhamNow (ញ៉ាំឥឡូវ)',
    user: 'លីដា ម៉ៅ',
    rating: 2,
    comment: 'សេវាកម្មអន់ណាស់ កម្ម៉ង់ម្ហូបជិត ២ម៉ោងទើបមកដល់។ អ្នកដឹកនិយាយសម្តីមិនសូវសមរម្យទៀត។ ត្រូវកែលម្អជាបន្ទាន់!',
    date: '2026-07-14',
    sentiment: 'negative'
  },
  {
    id: 'rev-5',
    appId: 'app-3',
    appName: 'TukTuk Go (ទុកទុក ហ្គោ)',
    user: 'វណ្ណដា សាន',
    rating: 4,
    comment: 'តម្លៃកង់បីធូរថ្លៃជាងការហៅផ្ទាល់។ បើកបរមានសុវត្ថិភាព ប៉ុន្តែពេលខ្លះ GPS បង្ហាញផ្លូវមិនសូវត្រូវទេ ពិបាករកគ្នា។',
    date: '2026-07-16',
    sentiment: 'neutral'
  },
  {
    id: 'rev-6',
    appId: 'app-4',
    appName: 'Khmeread (ខ្មែររីត)',
    user: 'រដ្ឋា ម៉ៅ',
    rating: 5,
    comment: 'សៀវភៅល្អៗច្រើនណាស់ ជាពិសេសសៀវភៅអភិវឌ្ឍខ្លួន។ សំឡេងអានច្បាស់ពីរោះ ងាយស្តាប់ពេលធ្វើដំណើរ។',
    date: '2026-07-13',
    sentiment: 'positive'
  },
  {
    id: 'rev-7',
    appId: 'app-5',
    appName: 'Khmer Keyboard 360',
    user: 'សុភ័ក្ត្រ ឡុង',
    rating: 5,
    comment: 'ក្តារចុចវាយលឿនបំផុត! មុខងារស្វែងរកពាក្យខ្មែរឆ្លាតវៃពិតជាជួយបានច្រើនណាស់ មិនបារម្ភរឿងសរសេរអក្ខរាវិរុទ្ធខុសឡើយ។',
    date: '2026-07-18',
    sentiment: 'positive'
  }
];

export const dailyDownloads: DailyDownload[] = [
  { date: '07-04', downloads: 4100, revenue: 120 },
  { date: '07-05', downloads: 4500, revenue: 150 },
  { date: '07-06', downloads: 3800, revenue: 95 },
  { date: '07-07', downloads: 5200, revenue: 180 },
  { date: '07-08', downloads: 4900, revenue: 160 },
  { date: '07-09', downloads: 6100, revenue: 220 },
  { date: '07-10', downloads: 5800, revenue: 195 },
  { date: '07-11', downloads: 6400, revenue: 240 },
  { date: '07-12', downloads: 7200, revenue: 310 },
  { date: '07-13', downloads: 6900, revenue: 280 },
  { date: '07-14', downloads: 5500, revenue: 175 },
  { date: '07-15', downloads: 6200, revenue: 210 },
  { date: '07-16', downloads: 7800, revenue: 340 },
  { date: '07-17', downloads: 8500, revenue: 410 },
  { date: '07-18', downloads: 9200, revenue: 480 },
];

export const countryStats: CountryStat[] = [
  { country: 'Cambodia', countryKhmer: 'កម្ពុជា', downloads: 425000, flag: '🇰🇭' },
  { country: 'Thailand', countryKhmer: 'ថៃ', downloads: 38200, flag: '🇹🇭' },
  { country: 'Vietnam', countryKhmer: 'វៀតណាម', downloads: 29400, flag: '🇻🇳' },
  { country: 'South Korea', countryKhmer: 'កូរ៉េខាងត្បូង', downloads: 18500, flag: '🇰🇷' },
  { country: 'United States', countryKhmer: 'សហរដ្ឋអាមេរិក', downloads: 12100, flag: '🇺🇸' },
  { country: 'Japan', countryKhmer: 'ជប៉ុន', downloads: 8400, flag: '🇯🇵' },
];

export const recentDownloads: DownloadRecord[] = [
  {
    id: 'dl-1',
    appId: 'app-1',
    appName: 'SabaPay (សាបាប៉េ)',
    timestamp: '2026-07-18T09:35:12Z',
    platform: 'Android',
    country: 'Cambodia',
    countryKhmer: 'កម្ពុជា',
    userAge: 24,
    userGender: 'Male'
  },
  {
    id: 'dl-2',
    appId: 'app-5',
    appName: 'Khmer Keyboard 360',
    timestamp: '2026-07-18T09:30:45Z',
    platform: 'iOS',
    country: 'Cambodia',
    countryKhmer: 'កម្ពុជា',
    userAge: 19,
    userGender: 'Female'
  },
  {
    id: 'dl-3',
    appId: 'app-2',
    appName: 'NhamNow (ញ៉ាំឥឡូវ)',
    timestamp: '2026-07-18T09:22:10Z',
    platform: 'Android',
    country: 'Cambodia',
    countryKhmer: 'កម្ពុជា',
    userAge: 32,
    userGender: 'Female'
  },
  {
    id: 'dl-4',
    appId: 'app-4',
    appName: 'Khmeread (ខ្មែររីត)',
    timestamp: '2026-07-18T08:55:00Z',
    platform: 'iOS',
    country: 'South Korea',
    countryKhmer: 'កូរ៉េខាងត្បូង',
    userAge: 27,
    userGender: 'Male'
  },
  {
    id: 'dl-5',
    appId: 'app-3',
    appName: 'TukTuk Go (ទុកទុក ហ្គោ)',
    timestamp: '2026-07-18T08:42:15Z',
    platform: 'Android',
    country: 'Cambodia',
    countryKhmer: 'កម្ពុជា',
    userAge: 45,
    userGender: 'Male'
  }
];
