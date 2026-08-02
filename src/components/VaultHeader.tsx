import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Settings, Lock, Unlock, Sparkles, Home, PlusCircle } from 'lucide-react';

interface VaultHeaderProps {
  recipientName: string;
  creatorName: string;
  vaultTitle: string;
  onOpenAdmin: () => void;
  isLocked: boolean;
  onLockVault: () => void;
  onGoHome?: () => void;
  onCreateVault?: () => void;
}

export const VaultHeader: React.FC<VaultHeaderProps> = ({
  recipientName,
  creatorName,
  vaultTitle,
  onOpenAdmin,
  isLocked,
  onLockVault,
  onGoHome,
  onCreateVault,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top Reading/Timeline Scroll Progress Bar */}
      <div className="h-1 bg-rose-950/20 w-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-300 shadow-sm shadow-rose-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="px-4 py-3 max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Pill */}
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="p-2 rounded-full glass-pill hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer border border-rose-200/40"
              title="Home & Project Info"
            >
              <Home className="w-4 h-4 text-rose-400" />
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-rose-200/50"
          >
            <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider uppercase flex items-center gap-1">
                OUR <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse inline-block" /> STORY VAULT
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Center Recipient Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-300 font-medium glass-pill px-3 py-1 rounded-full border border-rose-200/40">
          <span>{creatorName || 'Alex'}</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>{recipientName || 'Elena'}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Create New Vault Button */}
          {onCreateVault && (
            <button
              onClick={onCreateVault}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-rose-300/30"
              title="Create your own memory vault"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">Create</span>
            </button>
          )}

          {/* Lock Status */}
          <button
            onClick={onLockVault}
            className="p-2 rounded-full glass-pill hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer border border-rose-200/40"
            title={isLocked ? 'Vault Locked' : 'Lock Vault'}
          >
            {isLocked ? <Lock className="w-4 h-4 text-rose-500" /> : <Unlock className="w-4 h-4 text-emerald-500" />}
          </button>

          {/* Admin CMS Button */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-rose-400/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Admin CMS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
