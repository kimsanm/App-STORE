import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CornerDownRight, 
  Filter, 
  Sparkles, 
  ThumbsUp, 
  Smile, 
  Meh, 
  Frown,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppItem, ReviewItem } from '../types';

interface ReviewsProps {
  apps: AppItem[];
  reviews: ReviewItem[];
  onAddReply: (reviewId: string, replyContent: string) => void;
}

export const Reviews: React.FC<ReviewsProps> = ({
  apps,
  reviews,
  onAddReply
}) => {
  const [selectedAppId, setSelectedAppId] = useState('All');
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'positive' | 'neutral' | 'negative'>('All');
  
  // Reply box state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Apply filters
  const filteredReviews = reviews.filter(rev => {
    const matchesApp = selectedAppId === 'All' || rev.appId === selectedAppId;
    const matchesRating = ratingFilter === 'All' || rev.rating === ratingFilter;
    const matchesSentiment = sentimentFilter === 'All' || rev.sentiment === sentimentFilter;
    return matchesApp && matchesRating && matchesSentiment;
  });

  // Calculate stats
  const totalCount = filteredReviews.length;
  const positiveCount = filteredReviews.filter(r => r.sentiment === 'positive').length;
  const neutralCount = filteredReviews.filter(r => r.sentiment === 'neutral').length;
  const negativeCount = filteredReviews.filter(r => r.sentiment === 'negative').length;

  const posPercent = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;
  const neuPercent = totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0;
  const negPercent = totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0;

  // Star ratings count breakdown
  const starBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = filteredReviews.filter(r => r.rating === stars).length;
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
    return { stars, count, percentage };
  });

  // Submit reply
  const handleReplySubmit = (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onAddReply(reviewId, replyText);
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">ការវាយតម្លៃ និងមតិយោបល់ (User Feedback & Sentiment)</h2>
        <p className="text-xs text-slate-400">ត្រួតពិនិត្យមតិរបស់អតិថិជន ឆ្លើយតបនឹងការវាយតម្លៃ និងវិភាគស្មារតីទូទៅ</p>
      </div>

      {/* Sentiment & Ratings Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
              <Sparkles size={16} className="text-emerald-500" />
              វិភាគស្មារតីទូទៅ (Sentiment Analysis)
            </h3>
            <p className="text-[10px] text-slate-400 mb-5">AI-powered classification of review contents</p>
          </div>

          <div className="space-y-4">
            {/* Positive */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <Smile size={14} /> វិជ្ជមាន (Positive)
                </span>
                <span className="text-slate-700 font-mono">{posPercent}% ({positiveCount})</span>
              </div>
              <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100/30">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${posPercent}%` }} />
              </div>
            </div>

            {/* Neutral */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-500 flex items-center gap-1.5">
                  <Meh size={14} /> មធ្យម (Neutral)
                </span>
                <span className="text-slate-700 font-mono">{neuPercent}% ({neutralCount})</span>
              </div>
              <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100/30">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: `${neuPercent}%` }} />
              </div>
            </div>

            {/* Negative */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-500 flex items-center gap-1.5">
                  <Frown size={14} /> អវិជ្ជមាន (Negative)
                </span>
                <span className="text-slate-700 font-mono">{negPercent}% ({negativeCount})</span>
              </div>
              <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100/30">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${negPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-4 leading-relaxed">
            * គណនាដោយផ្អែកលើការត្រួតពិនិត្យមតិយោបល់ និងពិន្ទុផ្កាយដែលទទួលបានពីអ្នកប្រើប្រាស់។
          </div>
        </div>

        {/* Rating Breakdown Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs lg:col-span-2">
          <h3 className="font-bold text-slate-800 text-sm mb-4">កម្រិតវាយតម្លៃតាមផ្កាយ (Ratings Breakdown)</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Total Score display */}
            <div className="text-center md:border-r border-slate-100 md:pr-8 py-2 shrink-0">
              <p className="text-5xl font-bold text-slate-800 tracking-tight font-mono">4.5</p>
              <div className="flex justify-center gap-0.5 my-1.5 text-amber-400">
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
                <Star size={14} className="fill-current" />
              </div>
              <p className="text-xs text-slate-400">ពិន្ទុវាយតម្លៃមធ្យម</p>
              <p className="text-[10px] text-slate-400 mt-0.5">({reviews.length} ផ្កាយសរុប)</p>
            </div>

            {/* Progress rows */}
            <div className="flex-1 w-full space-y-2">
              {starBreakdown.map(row => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 w-3 font-mono">{row.stars}</span>
                  <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/30">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${row.percentage}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right font-mono">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Filters & Feed */}
      <div className="space-y-4">
        {/* Filter controls */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <h4 className="font-bold text-slate-800 text-sm">ស្វែងរកមតិយោបល់ (Review Feed Filters)</h4>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* App selection */}
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="All">គ្រប់កម្មវិធីទាំងអស់ (All Apps)</option>
              {apps.map(app => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>

            {/* Rating selection */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="All">គ្រប់ផ្កាយទាំងអស់ (All Ratings)</option>
              <option value="5">៥ ផ្កាយ (5 Stars)</option>
              <option value="4">៤ ផ្កាយ (4 Stars)</option>
              <option value="3">៣ ផ្កាយ (3 Stars)</option>
              <option value="2">២ ផ្កាយ (2 Stars)</option>
              <option value="1">១ ផ្កាយ (1 Star)</option>
            </select>

            {/* Sentiment selection */}
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as any)}
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="All">គ្រប់ស្មារតីទាំងអស់ (All Sentiments)</option>
              <option value="positive">វិជ្ជមាន (Positive Only)</option>
              <option value="neutral">មធ្យម (Neutral Only)</option>
              <option value="negative">អវិជ្ជមាន (Negative Only)</option>
            </select>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((rev) => (
              <motion.div
                layout
                key={rev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-slate-200 transition-all duration-200"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center">
                      {rev.user.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700">{rev.user}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">• {rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      {rev.appName}
                    </span>
                    {/* Stars */}
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          size={11} 
                          className={idx < rev.rating ? "fill-current" : "text-slate-200"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-600 leading-relaxed pl-1.5 border-l-2 border-slate-100 py-0.5 mb-4">
                  {rev.comment}
                </p>

                {/* Sentiment Label & developer replies */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    {/* Sentiment Tag */}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      rev.sentiment === 'positive' 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : rev.sentiment === 'neutral'
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-rose-700 bg-rose-50'
                    }`}>
                      {rev.sentiment === 'positive' && <Smile size={10} />}
                      {rev.sentiment === 'neutral' && <Meh size={10} />}
                      {rev.sentiment === 'negative' && <Frown size={10} />}
                      {rev.sentiment === 'positive' ? 'វិជ្ជមាន' : rev.sentiment === 'neutral' ? 'មធ្យម' : 'អវិជ្ជមាន'}
                    </span>

                    {/* Reply Toggle button */}
                    {!rev.reply && replyingToId !== rev.id && (
                      <button
                        onClick={() => {
                          setReplyingToId(rev.id);
                          setReplyText('');
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-3 py-1 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100/50 transition-all"
                      >
                        <CornerDownRight size={12} />
                        <span>ឆ្លើយតប (Reply)</span>
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingToId === rev.id && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={(e) => handleReplySubmit(e, rev.id)}
                      className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row gap-2.5"
                    >
                      <input
                        type="text"
                        required
                        placeholder="សរសេរការឆ្លើយតបទៅកាន់អ្នកប្រើប្រាស់..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
                      />
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setReplyingToId(null)}
                          className="px-3 py-1.5 text-xs bg-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-300"
                        >
                          បោះបង់
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1 shadow-md shadow-emerald-600/10"
                        >
                          <Send size={10} />
                          <span>ផ្ញើ</span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* Dev Reply Box */}
                  {rev.reply && (
                    <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 pl-4 ml-3 flex gap-2.5 items-start">
                      <CornerDownRight size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">
                            ឆ្លើយតបពីអ្នកអភិវឌ្ឍ (Developer Reply)
                          </span>
                          <span className="text-[9px] text-slate-400">អ្នកគ្រប់គ្រងប្រព័ន្ធ</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1.5 italic font-medium">
                          "{rev.reply}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReviews.length === 0 && (
            <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <HelpCircle size={40} className="text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">មិនទាន់មានមតិយោបល់ឡើយ</h4>
              <p className="text-xs text-slate-400 mt-1">គ្មានការវាយតម្លៃណាត្រូវគ្នានឹងតម្រងការស្វែងរករបស់អ្នកឡើយ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
