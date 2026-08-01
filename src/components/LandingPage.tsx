import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  Lock,
  Wand2,
  Share2,
  Music,
  ShieldCheck,
  Globe,
  ArrowRight,
  MessageCircleHeart,
  PlusCircle,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onOpenVault: () => void;
  onCreateVault: () => void;
  recipientName?: string;
  creatorName?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenVault,
  onCreateVault,
  recipientName = 'Elena',
  creatorName = 'Alex',
}) => {
  return (
    <div className="min-h-screen text-slate-100 relative">
      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-rose-500/20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 p-0.5 shadow-lg shadow-rose-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Story Vault
                <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  National Girlfriend&apos;s Day
                </span>
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
            {/* Button 1: The Story Vault */}
            <button
              onClick={onOpenVault}
              className="px-3.5 sm:px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-rose-400/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>The Story Vault</span>
            </button>

            {/* Button 2: Create */}
            <button
              onClick={onCreateVault}
              className="px-3.5 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-rose-300/30"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase */}
      <section className="relative px-4 sm:px-6 pt-12 pb-20 max-w-5xl mx-auto text-center space-y-8">
        {/* Decorative Ambient Glows */}
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

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Immortalize Your Love Story <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 bg-clip-text text-transparent italic font-serif">
              In A Private Digital Memory Vault
            </span>
          </h2>
          <p className="text-base sm:text-lg text-rose-200/90 font-light max-w-2xl mx-auto leading-relaxed">
            Create a bespoke interactive memory timeline for your girlfriend with romantic soundtracks, AI-crafted captions, secret wax-sealed letters, and passcode protection.
          </p>
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
            <span>Open The Story Vault ({recipientName} & {creatorName})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onCreateVault}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-rose-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <Wand2 className="w-5 h-5 text-rose-300" />
            <span>Create Your Own Vault Studio</span>
          </button>
        </motion.div>

        {/* Brand Callout Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card-dark p-6 sm:p-8 rounded-3xl border border-rose-500/30 text-left max-w-3xl mx-auto shadow-2xl relative overflow-hidden mt-12"
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
                Dedicated to helping couples celebrate their special moments with cutting-edge digital experiences, AI storytellers, and secure cloud memory vaults.
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

      {/* Feature Showcase Grid */}
      <section className="px-4 sm:px-6 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> What Makes It Magical
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Features Crafted For Lovers
          </h2>
          <p className="text-sm text-rose-200/80 font-light max-w-md mx-auto">
            Everything you need to turn your phone photos into a priceless romantic keepsakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Gemini AI Caption Studio</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Auto-generate romantic, cute, poetic, or funny captions for your photos with one click using built-in Gemini AI intelligence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Passcode Security PIN</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Keep your memory vault private with an anniversary 4-digit PIN lock that unlocks the experience for your partner.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Custom Soundtrack Player</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Set your special song to play automatically in the background as your girlfriend scrolls through your timeline memories.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <Heart className="w-6 h-6 fill-rose-300" />
            </div>
            <h3 className="text-lg font-bold text-white">Sealed Wax Love Letter</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Include a personalized handwritten note inside an interactive wax-sealed envelope with confetti animations when unsealed.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Girlfriend Reply</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Your girlfriend can write back directly inside the vault, sending secret messages saved right into your private inbox.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card-dark p-6 rounded-3xl border border-rose-500/20 space-y-3 hover:border-rose-400/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Shareable Link</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Easily copy and send your custom memory vault link to your partner across WhatsApp, iMessage, or Instagram.
            </p>
          </div>
        </div>
      </section>

      {/* How To Use Guide */}
      <section className="px-4 sm:px-6 py-16 bg-black/40 border-y border-rose-500/20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-400">Step-By-Step</span>
            <h2 className="text-3xl font-extrabold text-white">How To Create Your Own Story Vault</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">1</div>
              <h4 className="text-sm font-bold text-white">Click &quot;Create&quot;</h4>
              <p className="text-xs text-rose-200/70 font-light">Open the Admin Story Vault Studio pre-populated with demo data.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">2</div>
              <h4 className="text-sm font-bold text-white">Customize Content</h4>
              <p className="text-xs text-rose-200/70 font-light">Upload photos from device, edit names, dates, letter, and song.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">3</div>
              <h4 className="text-sm font-bold text-white">Set Security PIN</h4>
              <p className="text-xs text-rose-200/70 font-light">Optionally choose a 4-digit passcode like your anniversary date.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">4</div>
              <h4 className="text-sm font-bold text-white">Share With Babe</h4>
              <p className="text-xs text-rose-200/70 font-light">Copy the link and send it to your partner to surprise them!</p>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onCreateVault}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold shadow-xl shadow-rose-500/30 inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Start Building Your Vault Now</span>
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
          The Story Vault • Digital Memories for Couples • <a href="https://webvictech.com" target="_blank" rel="noopener noreferrer" className="hover:underline">webvictech.com</a>
        </p>
      </footer>
    </div>
  );
};
