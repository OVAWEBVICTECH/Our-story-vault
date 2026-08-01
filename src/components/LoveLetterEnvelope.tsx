import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoveLetterEnvelopeProps {
  title?: string;
  body?: string;
  recipientName?: string;
  creatorName?: string;
}

export const LoveLetterEnvelope: React.FC<LoveLetterEnvelopeProps> = ({
  title = 'To My Forever & Always ❤️',
  body = "Elena, looking back at all the memories we've built together fills my heart with so much warmth. From quiet coffee mornings to starry late-night talks, every moment with you is a gift I cherish deeply.\n\nHappy National Girlfriend's Day, my love. Here's to endless more chapters of our story.",
  recipientName = 'Elena',
  creatorName = 'Alex',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    if (!isOpen) {
      setIsOpen(true);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#ffffff'],
      });
    }
  };

  return (
    <div className="relative my-20 max-w-2xl mx-auto px-4 text-center">
      {/* Section Title */}
      <div className="space-y-2 mb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-rose-500 dark:text-rose-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Sealed With Love
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          A Love Letter For You
        </h2>
        <p className="text-sm text-slate-600 dark:text-rose-200/80 font-light">
          Tap the wax seal to unseal your personalized National Girlfriend&apos;s Day letter.
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative perspective-1000">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed Envelope View */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={handleOpenLetter}
              className="glass-card-dark p-8 sm:p-12 rounded-3xl border border-rose-500/30 shadow-2xl cursor-pointer group hover:border-rose-400 transition-all duration-300 relative overflow-hidden max-w-md mx-auto"
            >
              {/* Envelope Flap Accent */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-rose-900/60 to-transparent clip-path-polygon pointer-events-none" />

              <div className="relative z-10 space-y-6 py-4">
                <Mail className="w-12 h-12 mx-auto text-rose-300 group-hover:scale-110 transition-transform" />

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-rose-300 font-semibold">For My Dearest</p>
                  <p className="text-2xl font-bold text-white font-serif italic">{recipientName}</p>
                </div>

                {/* Wax Seal Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-pink-500 border-2 border-rose-300 shadow-xl flex items-center justify-center text-white cursor-pointer"
                >
                  <Heart className="w-8 h-8 fill-white animate-pulse" />
                </motion.div>

                <p className="text-xs text-rose-300/80 italic animate-pulse">Tap wax seal to open</p>
              </div>
            </motion.div>
          ) : (
            /* Opened Handwritten Letter View */
            <motion.div
              key="opened-letter"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 sm:p-12 rounded-3xl border border-rose-300 shadow-2xl text-left relative overflow-hidden bg-rose-50/95 dark:bg-rose-950/90 dark:border-rose-500/30 text-slate-800 dark:text-rose-100 font-serif leading-relaxed"
            >
              <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-800/60 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-300">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-rose-200/50 dark:hover:bg-rose-900/50 text-rose-500 transition-colors cursor-pointer text-xs flex items-center gap-1 font-sans"
                  title="Reseal Letter"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-seal
                </button>
              </div>

              <div className="space-y-4 text-base sm:text-lg font-serif whitespace-pre-line text-slate-800 dark:text-rose-100/90 leading-loose">
                {body}
              </div>

              <div className="mt-8 pt-6 border-t border-rose-200 dark:border-rose-800/60 text-right font-sans">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">Forever Yours,</p>
                <p className="text-xl font-bold font-serif italic text-slate-900 dark:text-white">{creatorName}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
