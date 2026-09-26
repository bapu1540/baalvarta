import React, { useState } from 'react';
import { Star, MessageSquare, Heart, ShieldCheck, Send, CheckCircle2, User, Sparkles } from 'lucide-react';
import { Language, UserReview } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface UserReviewsSectionProps {
  reviews: UserReview[];
  onAddReview: (review: Omit<UserReview, 'id' | 'date'>) => void;
  language: Language;
  soundEnabled?: boolean;
}

export const UserReviewsSection: React.FC<UserReviewsSectionProps> = ({
  reviews,
  onAddReview,
  language,
  soundEnabled = true,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Parent' | 'Teacher' | 'Student' | 'Story Lover'>('Parent');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    if (soundEnabled) playSuccessSound();
    onAddReview({
      name: name.trim(),
      role,
      rating,
      comment: comment.trim(),
      likes: 0,
    });

    setIsSubmitted(true);
    setName('');
    setComment('');
    setTimeout(() => {
      setIsSubmitted(false);
      setIsFormOpen(false);
    }, 3000);
  };

  const getRoleLabel = (r: string) => {
    if (language === 'hi') {
      switch (r) {
        case 'Parent': return '👨‍👩‍👧 अभिभावक (Parent)';
        case 'Teacher': return '👩‍🏫 शिक्षक (Teacher)';
        case 'Student': return '🎒 बाल पाठक (Student)';
        default: return '❤️ कहानी प्रेमी (Story Lover)';
      }
    }
    return r;
  };

  return (
    <section className="space-y-4 rounded-3xl bg-amber-50/70 p-4 sm:p-6 border-2 border-amber-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900">
              {language === 'hi' ? '⭐ अभिभावक व पाठकों की समीक्षाएँ (Reviews)' : '⭐ Reader & Parent Reviews'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {language === 'hi'
                ? 'बालवार्ता के बारे में परिवारों और शिक्षकों की सच्ची राय'
                : 'Honest reviews from parents, teachers, and young learners'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) playPopSound();
            setIsFormOpen(!isFormOpen);
          }}
          className="px-4 py-2 rounded-xl bg-amber-950 hover:bg-black text-white font-extrabold text-xs transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>{language === 'hi' ? 'अपनी समीक्षा / रिव्यू लिखें' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Write Review Form Card */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-md animate-in fade-in duration-200 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <span>✍️</span>
              <span>{language === 'hi' ? 'बालवार्ता के लिए अपनी राय साझा करें' : 'Share Your Feedback & Review'}</span>
            </h3>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {language === 'hi' ? '✓ सत्यापित पाठक समीक्षा' : '100% Verified Review'}
            </span>
          </div>

          {isSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-black text-xs">
                {language === 'hi' ? 'धन्यवाद! आपकी समीक्षा सफलतापूर्वक सेव हो गई है।' : 'Thank you! Your review has been saved.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    {language === 'hi' ? 'आपका नाम (Your Name):' : 'Your Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. सुनीता वर्मा...' : 'e.g. Rahul Sharma...'}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    {language === 'hi' ? 'आप कौन हैं? (Role):' : 'Who are you? (Role):'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
                  >
                    <option value="Parent">{language === 'hi' ? '👨‍👩‍👧 अभिभावक (Parent)' : 'Parent'}</option>
                    <option value="Teacher">{language === 'hi' ? '👩‍🏫 शिक्षक (Teacher)' : 'Teacher'}</option>
                    <option value="Student">{language === 'hi' ? '🎒 बाल पाठक (Student)' : 'Student / Kid'}</option>
                    <option value="Story Lover">{language === 'hi' ? '❤️ कहानी प्रेमी (Story Lover)' : 'Story Lover'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1">
                  {language === 'hi' ? 'रेटिंग (Rating):' : 'Rating:'}
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-800 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-1">
                  {language === 'hi' ? 'आपकी समीक्षा / संदेश (Your Review):' : 'Your Review / Comments:'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'बालवार्ता की कहानियों, अक्षर ज्ञान या ऑडियो के बारे में अपनी राय लिखें...'
                      : 'Share your thoughts about our stories, learning modules, or audio...'
                  }
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-800 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'रिव्यू सबमिट करें' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {reviews.slice(0, 6).map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-3.5 border-2 border-amber-100 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {rev.date}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans line-clamp-3">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-black text-xs text-slate-900">
                  {rev.name}
                </h4>
                <p className="text-[10px] text-amber-800 font-semibold">
                  {getRoleLabel(rev.role)}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold">
                {rev.name.charAt(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
