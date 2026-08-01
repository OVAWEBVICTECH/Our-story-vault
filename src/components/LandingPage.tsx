import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  Lock,
  Wand2,
  Share2,
  Music,
  Globe,
  ArrowRight,
  MessageCircleHeart,
  PlusCircle,
  BookOpen,
  Calendar,
  Gift,
  Users,
  Settings,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Sliders,
} from 'lucide-react';

interface LandingPageProps {
  onOpenVault: () => void;
  onCreateVault: () => void;
  recipientName?: string;
  creatorName?: string;
  occasionTitle?: string;
  occasionDay?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenVault,
  onCreateVault,
  recipientName = 'Elena',
  creatorName = 'Alex',
  occasionTitle = "National Girlfriend's Day",
  occasionDay = '2026-08-01',
}) => {
  return (
    <div className="min-h-screen text-slate-100 relative bg-slate-950">
      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-rose-500/20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 p-0.5 shadow-lg shadow-rose-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-white tracking-wider uppercase flex items-center gap-1.5">
                OUR <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse inline-block" /> STORY VAULT
              </h1>
              <p className="text-[11px] text-rose-300/80 font-light flex items-center gap-1">
                by{' '}
                <a
                  href="https://webvictech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-300 font-semibold hover:underline flex items-center gap-0.5"
                >
                  webvictech <Globe className="w-3 h-3 text-rose-400" />
                </a>
              </p>
            </div>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenVault}
              className="px-3.5 sm:px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-rose-400/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Story Vault</span>
            </button>

            <button
              onClick={onCreateVault}
              className="px-3.5 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-rose-300/30"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative px-4 sm:px-6 pt-12 pb-20 max-w-5xl mx-auto text-center space-y-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sponsor Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-medium shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>O.V.A Webvic Tech Int’l Services supports you and your partner</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Immortalize Your Special Moments In <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 bg-clip-text text-transparent italic font-serif">
              OUR ❤️ STORY VAULT
            </span>
          </h2>
          <p className="text-base sm:text-lg text-rose-200/90 font-light max-w-3xl mx-auto leading-relaxed">
            A bespoke interactive romantic memory experience designed for couples. Featuring dynamic occasion management, AI-crafted wax-sealed letters, Gemini photo captions, passcode security, custom soundtracks, and interactive partner replies.
          </p>
        </motion.div>

        {/* Occasion Pill Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-900/60 to-pink-900/60 border border-rose-400/40 text-rose-200 text-xs sm:text-sm font-semibold shadow-lg"
        >
          <Calendar className="w-4 h-4 text-rose-400" />
          <span>Active Celebration Occasion: <strong className="text-white">{occasionTitle}</strong> ({occasionDay})</span>
        </motion.div>

        {/* CTA Buttons Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onOpenVault}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-base font-bold shadow-xl shadow-rose-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 border border-rose-300/30"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Open Vault ({recipientName} & {creatorName})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onCreateVault}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-rose-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <Sliders className="w-5 h-5 text-rose-300" />
            <span>Launch Admin Studio CMS</span>
          </button>
        </motion.div>

        {/* Webvic Tech Brand Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card-dark p-6 sm:p-8 rounded-3xl border border-rose-500/30 text-left max-w-3xl mx-auto shadow-2xl relative overflow-hidden mt-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Powered By Webvic Tech
              </span>
              <h3 className="text-xl font-bold text-white">
                O.V.A Webvic Tech Int’l Services
              </h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Empowering couples worldwide with personalized digital memory vaults, AI storytelling, secure authentication, and romantic web software solutions.
              </p>
            </div>
            <a
              href="https://webvictech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-400/30 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Visit webvictech.com</span>
              <Globe className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* FULL PROJECT FEATURE SHOWCASE GRID (Exhaustive & Detailed) */}
      <section className="px-4 sm:px-6 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Full Project Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every Detail Crafted For Your Love Story
          </h2>
          <p className="text-sm text-rose-200/80 font-light max-w-lg mx-auto">
            Discover all the built-in features, AI engines, security PINs, and management studios inside OUR ❤️ STORY VAULT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Occasion Day Manager */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Occasion Day Manager</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Change celebration occasions anytime — National Girlfriend&apos;s Day, Relationship Anniversary, Valentine&apos;s Day, or Her Birthday — with quick presets and custom dates.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Preset Selectors
              </span>
            </div>
          </div>

          {/* Card 2: AI Wax Seal Love Letter */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">AI Wax Seal Love Letter</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Interactive wax-sealed envelope that auto-generates custom letters matching your occasion — blending sweet words, prayer blessings, and romantic pickup lines powered by Gemini AI.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-pink-400 font-medium flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5" /> Occasion Auto-Generation
              </span>
            </div>
          </div>

          {/* Card 3: Gemini AI Caption Studio */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Gemini AI Caption Studio</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Generate romantic, witty, poetic, or funny captions for your photos with one click using built-in Gemini AI model integration.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Tone & Emotion Selection
              </span>
            </div>
          </div>

          {/* Card 4: Passcode Security PIN */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Passcode Security PIN</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Protect your private couple memory vault with a 4-digit PIN lock gate (e.g. your anniversary date) featuring an interactive keypad and hint system.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-purple-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Private Keypad Gate
              </span>
            </div>
          </div>

          {/* Card 5: Custom Soundtrack Player */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Background Soundtrack</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Autoplay romantic tunes (e.g. &quot;A Thousand Silent Moments&quot;) in the background with floating playback controls as your partner scrolls through memory cards.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> Floating Audio Controls
              </span>
            </div>
          </div>

          {/* Card 6: Interactive Partner Reply */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                <MessageCircleHeart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Interactive Partner Reply</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Your partner can write back love notes and secret messages directly inside the vault, saved instantly into your private admin inbox.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Direct Couple Inbox
              </span>
            </div>
          </div>

          {/* Card 7: Registered Users & PIN Manager */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Users & Account Studio</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                View registered couple accounts, edit PIN passcodes, update partner names, and manage individual occasion celebration dates inside Admin Studio.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Account Management
              </span>
            </div>
          </div>

          {/* Card 8: Full Vault Admin Studio CMS */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Admin Studio CMS</h3>
              <p className="text-xs text-rose-200/80 font-light leading-relaxed">
                Complete management dashboard for timeline memories, photo/video uploads, theme customization (Rose, Twilight, Champagne, Midnight), and background songs.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-500/10">
              <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Full CMS Control
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How To Use Workflow Guide */}
      <section className="px-4 sm:px-6 py-16 bg-black/50 border-y border-rose-500/20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">Step-By-Step Workflow</span>
            <h2 className="text-3xl font-extrabold text-white">How To Set Up OUR ❤️ STORY VAULT</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-2.5">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black flex items-center justify-center text-sm shadow-lg">1</div>
              <h4 className="text-sm font-bold text-white">Open Admin Studio</h4>
              <p className="text-xs text-rose-200/70 font-light">Access the Admin Studio CMS pre-populated with your couple profile.</p>
            </div>

            <div className="space-y-2.5">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black flex items-center justify-center text-sm shadow-lg">2</div>
              <h4 className="text-sm font-bold text-white">Pick Occasion Day</h4>
              <p className="text-xs text-rose-200/70 font-light">Select Girlfriend&apos;s Day, Anniversary, or Birthday and auto-generate the love letter.</p>
            </div>

            <div className="space-y-2.5">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black flex items-center justify-center text-sm shadow-lg">3</div>
              <h4 className="text-sm font-bold text-white">Add Memories & AI</h4>
              <p className="text-xs text-rose-200/70 font-light">Upload photos, videos, and use Gemini AI to write captions for each milestone.</p>
            </div>

            <div className="space-y-2.5">
              <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black flex items-center justify-center text-sm shadow-lg">4</div>
              <h4 className="text-sm font-bold text-white">Set PIN & Share</h4>
              <p className="text-xs text-rose-200/70 font-light">Choose your 4-digit PIN lock and send the private link to your love!</p>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onCreateVault}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold shadow-xl shadow-rose-500/30 inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95 border border-rose-300/30"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Launch Vault Studio Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="py-12 px-4 text-center text-xs text-rose-300/60 max-w-4xl mx-auto space-y-3">
        <p className="flex items-center justify-center gap-1.5 text-rose-200 font-medium">
          Crafted with love by <a href="https://webvictech.com" target="_blank" rel="noopener noreferrer" className="text-rose-400 font-bold hover:underline">O.V.A Webvic Tech Int’l Services</a> ❤️
        </p>
        <p className="text-[11px] text-rose-400/50">
          OUR ❤️ STORY VAULT • Digital Memory Vault for Couples • <a href="https://webvictech.com" target="_blank" rel="noopener noreferrer" className="hover:underline">webvictech.com</a>
        </p>
      </footer>
    </div>
  );
};
