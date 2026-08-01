import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ChevronDown, Calendar, Clock } from 'lucide-react';

interface HeroSectionProps {
  recipientName: string;
  creatorName: string;
  subtitle?: string;
  startDateStr: string; // YYYY-MM-DD
}

interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  recipientName = 'Elena',
  creatorName = 'Alex',
  subtitle = "A National Girlfriend's Day Memory Vault",
  startDateStr = '2023-08-01',
}) => {
  const [timeTogether, setTimeTogether] = useState<TimeTogether>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [startDateStr]);

  const scrollToTimeline = () => {
    const el = document.getElementById('timeline-start');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] bg-rose-400/20 dark:bg-rose-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-pink-300/20 dark:bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl mx-auto space-y-8"
      >
        {/* Girlfriend's Day Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-rose-300/40 text-rose-600 dark:text-rose-300 text-xs font-medium shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>National Girlfriend&apos;s Day Special Edition</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </motion.div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Happy Girlfriend&apos;s Day, <br />
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
              {recipientName || 'My Love'}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-rose-200/80 max-w-lg mx-auto font-light leading-relaxed">
            {subtitle || 'An interactive journey through our most cherished memories, laughs, and quiet moments together.'}
          </p>
        </div>

        {/* Relationship Live Ticker Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card dark:glass-card-dark p-6 rounded-3xl border border-rose-200/50 dark:border-rose-500/20 shadow-xl max-w-lg mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-500 dark:text-rose-300 uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" /> Everyday with you since {startDateStr}
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/30">
              <span className="block text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-200">
                {timeTogether.days}
              </span>
              <span className="text-[10px] sm:text-xs text-rose-400 dark:text-rose-300/70 font-medium">Days</span>
            </div>

            <div className="p-2 sm:p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/30">
              <span className="block text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-200">
                {timeTogether.hours}
              </span>
              <span className="text-[10px] sm:text-xs text-rose-400 dark:text-rose-300/70 font-medium">Hours</span>
            </div>

            <div className="p-2 sm:p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/30">
              <span className="block text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-200">
                {timeTogether.minutes}
              </span>
              <span className="text-[10px] sm:text-xs text-rose-400 dark:text-rose-300/70 font-medium">Mins</span>
            </div>

            <div className="p-2 sm:p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/30">
              <span className="block text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-200">
                {timeTogether.seconds}
              </span>
              <span className="text-[10px] sm:text-xs text-rose-400 dark:text-rose-300/70 font-medium">Secs</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Action CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-4">
          <button
            onClick={scrollToTimeline}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2 mx-auto cursor-pointer group active:scale-95"
          >
            <span>Begin Our Story Journey</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
