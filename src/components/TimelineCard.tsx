import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { MapPin, Calendar, Sparkles, Tag, Maximize2, Play, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Memory, AnimationPreset, BackgroundGradient } from '../types/index.js';

interface TimelineCardProps {
  memory: Memory;
  index: number;
  onOpenLightbox: (memory: Memory) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ memory, index, onOpenLightbox }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.25 });
  const confettiFired = useRef(false);

  // Trigger confetti when scrolled into view if enabled for this memory
  useEffect(() => {
    if (isInView && memory.confettiTrigger && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#fecdd3', '#ffffff'],
      });
    }
  }, [isInView, memory.confettiTrigger]);

  // Gradient Mapping
  const gradientStyles: Record<BackgroundGradient, string> = {
    rose: 'bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-rose-500/20 border-rose-200/60 dark:border-rose-500/30',
    twilight: 'bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-slate-900/40 border-purple-300/40 dark:border-purple-500/30',
    champagne: 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/15 border-amber-200/60 dark:border-amber-500/30',
    sunset: 'bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-pink-500/20 border-orange-200/60 dark:border-orange-500/30',
    midnight: 'bg-gradient-to-br from-slate-900/80 via-zinc-900/60 to-rose-950/40 border-rose-500/20',
    emerald: 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/20 border-emerald-200/60 dark:border-emerald-500/30',
  };

  // Preset Framer Motion Variants
  const animationVariants: Record<AnimationPreset, any> = {
    'fade-slide': {
      hidden: { opacity: 0, y: 50, x: index % 2 === 0 ? -20 : 20 },
      visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    },
    'parallax-depth': {
      hidden: { opacity: 0, scale: 0.85, z: -100, y: 60 },
      visible: { opacity: 1, scale: 1, z: 0, y: 0, transition: { duration: 0.8, type: 'spring', damping: 20 } },
    },
    'scale-blur': {
      hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 40 },
      visible: { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.75 } },
    },
    'stagger-reveal': {
      hidden: { opacity: 0, y: 70, rotate: index % 2 === 0 ? -3 : 3 },
      visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    },
    '3d-flip': {
      hidden: { opacity: 0, rotateX: 30, y: 60, scale: 0.9 },
      visible: { opacity: 1, rotateX: 0, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    },
    'float-glass': {
      hidden: { opacity: 0, y: 40, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
    },
  };

  const isEven = index % 2 === 0;

  return (
    <div ref={cardRef} className="relative my-12 sm:my-20">
      {/* Central Timeline Vertical Node Indicator */}
      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-8 z-10 flex flex-col items-center">
        <motion.div
          animate={isInView ? { scale: [1, 1.3, 1] } : {}}
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-white"
        >
          <Heart className="w-4 h-4 fill-white" />
        </motion.div>
        <div className="w-0.5 h-full bg-rose-200 dark:bg-rose-900/60 -mb-16 mt-2" />
      </div>

      {/* Main Card Grid Alignment */}
      <div className={`pl-12 sm:pl-0 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 items-center ${isEven ? '' : 'sm:flex-row-reverse'}`}>
        {/* Left or Right Card Content */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={animationVariants[memory.animationPreset] || animationVariants['fade-slide']}
          className={`${isEven ? 'sm:col-start-1' : 'sm:col-start-2'} space-y-4`}
        >
          <div
            className={`glass-card dark:glass-card-dark p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-rose-300 ${
              gradientStyles[memory.bgGradient] || gradientStyles.rose
            }`}
          >
            {/* Header Date & Location */}
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-rose-600 dark:text-rose-300 mb-3">
              <span className="flex items-center gap-1.5 bg-rose-100/80 dark:bg-rose-950/80 px-3 py-1 rounded-full border border-rose-200/50">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                {memory.date}
              </span>

              {memory.location && (
                <span className="flex items-center gap-1 text-slate-500 dark:text-rose-200/70">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {memory.location}
                </span>
              )}
            </div>

            {/* Media Preview Container */}
            <div
              onClick={() => onOpenLightbox(memory)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md mb-4 aspect-[4/3] bg-slate-900/10 dark:bg-black/40"
            >
              {memory.mediaType === 'video' ? (
                <div className="relative w-full h-full">
                  <video src={memory.mediaUrl} className="w-full h-full object-cover" muted loop />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={memory.mediaUrl}
                    alt={memory.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" /> View Photo
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Title & Caption */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-between">
                <span>{memory.title}</span>
                {memory.confettiTrigger && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" title="Milestone Memory" />}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-rose-100/90 font-light leading-relaxed whitespace-pre-line">
                {memory.caption}
              </p>
            </div>

            {/* Tags */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4">
                {memory.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-200 font-medium border border-rose-200/50 dark:border-rose-500/30 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-rose-400" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
