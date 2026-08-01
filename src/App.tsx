import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Lock, RefreshCw, AlertCircle } from 'lucide-react';

import { Memory, VaultSettings } from './types/index.js';
import { FloatingHearts } from './components/FloatingHearts.js';
import { SoundtrackPlayer } from './components/SoundtrackPlayer.js';
import { PasscodeGate } from './components/PasscodeGate.js';
import { VaultHeader } from './components/VaultHeader.js';
import { HeroSection } from './components/HeroSection.js';
import { TimelineCard } from './components/TimelineCard.js';
import { MediaLightbox } from './components/MediaLightbox.js';
import { LoveLetterEnvelope } from './components/LoveLetterEnvelope.js';
import { ReplySection } from './components/ReplySection.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { LandingPage } from './components/LandingPage.js';
import { SignUpModal, SignUpFormData } from './components/SignUpModal.js';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'vault'>('landing');

  const [settings, setSettings] = useState<Partial<VaultSettings>>({
    recipientName: 'Elena',
    creatorName: 'Alex',
    vaultTitle: 'Our Story',
    subtitle: "A National Girlfriend's Day Memory Vault",
    relationshipStartDate: '2023-08-01',
    loveLetterTitle: 'To My Forever & Always ❤️',
    loveLetterBody:
      "Elena, looking back at all the memories we've built together fills my heart with so much warmth. From quiet coffee mornings to starry late-night talks, every moment with you is a gift I cherish deeply.\n\nHappy National Girlfriend's Day, my love. Here's to endless more chapters of our story.",
  });

  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Security Lock & Audio Autoplay
  const [isLocked, setIsLocked] = useState(false);
  const [requiresPasscode, setRequiresPasscode] = useState(false);
  const [showPasscodeGate, setShowPasscodeGate] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  // Modals & Active Items
  const [activeLightboxMemory, setActiveLightboxMemory] = useState<Memory | null>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    fetchVaultData();
  }, []);

  const fetchVaultData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vault/our-story');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();

      if (data.settings) {
        setSettings(data.settings);
      }
      if (data.memories) {
        setMemories(data.memories);
      }

      // Track passcode requirement
      if (data.requiresPasscode) {
        setRequiresPasscode(true);
        setIsLocked(true);
      } else {
        setRequiresPasscode(false);
        setIsLocked(false);
        setShowPasscodeGate(false);
      }
    } catch (err: any) {
      console.error('Failed to load vault data:', err);
      setError('Failed to connect to vault. Please ensure server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStoryVault = () => {
    setCurrentView('vault');
    if (requiresPasscode && isLocked) {
      setShowPasscodeGate(true);
    } else {
      setAutoPlayAudio(true);
    }
  };

  const handleCreateVault = () => {
    setShowSignUpModal(true);
  };

  const handleSignUpSubmit = async (formData: SignUpFormData) => {
    try {
      const updatedSettings: Partial<VaultSettings> = {
        ...settings,
        creatorName: formData.creatorName,
        recipientName: formData.recipientName,
        creatorGender: formData.creatorGender,
        partnerGender: formData.partnerGender,
        relationshipStartDate: formData.relationshipStartDate,
        passcode: formData.passcode,
        vaultTitle: `${formData.recipientName} & ${formData.creatorName}'s Vault`,
        subtitle: `For my love, ${formData.recipientName}`,
        loveLetterTitle: `To My Forever & Always, ${formData.recipientName} ❤️`,
        loveLetterBody: `${formData.recipientName}, looking back at all the memories we've built together fills my heart with so much warmth. From quiet coffee mornings to starry late-night talks, every moment with you is a gift I cherish deeply.\n\nHappy National Girlfriend's Day, my love. Here's to endless more chapters of our story.`,
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to update settings on signup:', err);
    }

    setCurrentView('vault');
    setIsLocked(false);
    setShowPasscodeGate(false);
    setShowSignUpModal(false);
    setAutoPlayAudio(true);
  };

  const handleVerifyPasscode = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/vault/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'our-story', passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLocked(false);
        setShowPasscodeGate(false);
        setAutoPlayAudio(true);
        return true;
      }
    } catch (err) {
      console.error('Passcode verification error:', err);
    }
    return false;
  };

  const handleLockVault = () => {
    setIsLocked(true);
    setShowPasscodeGate(true);
  };

  // Lightbox Navigation helpers
  const activeIndex = activeLightboxMemory
    ? memories.findIndex((m) => m.id === activeLightboxMemory.id)
    : -1;
  const hasNext = activeIndex >= 0 && activeIndex < memories.length - 1;
  const hasPrev = activeIndex > 0;

  const handleNextLightbox = () => {
    if (hasNext) setActiveLightboxMemory(memories[activeIndex + 1]);
  };

  const handlePrevLightbox = () => {
    if (hasPrev) setActiveLightboxMemory(memories[activeIndex - 1]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Floating Hearts Particle Canvas */}
      <FloatingHearts />

      {currentView === 'landing' ? (
        <LandingPage
          onOpenVault={handleOpenStoryVault}
          onCreateVault={handleCreateVault}
          recipientName={settings.recipientName}
          creatorName={settings.creatorName}
        />
      ) : (
        <>
          {/* Header & Timeline Progress Bar */}
          <VaultHeader
            recipientName={settings.recipientName || 'Elena'}
            creatorName={settings.creatorName || 'Alex'}
            vaultTitle={settings.vaultTitle || 'Our Story'}
            onOpenAdmin={() => setShowAdminDashboard(true)}
            isLocked={isLocked}
            onLockVault={handleLockVault}
            onGoHome={() => setCurrentView('landing')}
            onCreateVault={handleCreateVault}
          />

          {/* Main Container */}
          <main className="relative z-10 min-h-screen pt-16">
            {isLoading ? (
              <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/30"
                >
                  <Heart className="w-8 h-8 fill-white" />
                </motion.div>
                <p className="text-sm font-medium text-rose-300 animate-pulse">
                  Opening Our Story Memory Vault...
                </p>
              </div>
            ) : error ? (
              <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-rose-500" />
                <p className="text-sm text-rose-200">{error}</p>
                <button
                  onClick={fetchVaultData}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
                </button>
              </div>
            ) : (
              <>
                {/* Hero Section */}
                <HeroSection
                  recipientName={settings.recipientName || 'Elena'}
                  creatorName={settings.creatorName || 'Alex'}
                  subtitle={settings.subtitle}
                  startDateStr={settings.relationshipStartDate || '2023-08-01'}
                />

                {/* Timeline Section */}
                <section id="timeline-start" className="max-w-4xl mx-auto px-4 py-12 relative">
                  <div className="text-center space-y-2 mb-12">
                    <span className="text-xs uppercase tracking-widest font-semibold text-rose-400 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Interactive Timeline
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                      Our Journey Together
                    </h2>
                    <p className="text-sm text-rose-200/80 font-light max-w-lg mx-auto">
                      Scroll down through each milestone memory. Tap any photo or video to view in full resolution.
                    </p>
                  </div>

                  {/* Timeline Cards List */}
                  <div className="relative">
                    {memories.length === 0 ? (
                      <div className="text-center py-12 p-8 glass-card-dark rounded-3xl border border-rose-500/20 text-rose-300/80">
                        <Heart className="w-10 h-10 mx-auto mb-3 text-rose-500 opacity-60" />
                        <p className="text-base font-semibold text-white">No memories in timeline yet.</p>
                        <p className="text-xs mt-1">Open Admin CMS at top right to add your first memory!</p>
                      </div>
                    ) : (
                      memories.map((memory, index) => (
                        <TimelineCard
                          key={memory.id}
                          memory={memory}
                          index={index}
                          onOpenLightbox={(m) => setActiveLightboxMemory(m)}
                        />
                      ))
                    )}
                  </div>
                </section>

                {/* Love Letter Section */}
                <LoveLetterEnvelope
                  title={settings.loveLetterTitle}
                  body={settings.loveLetterBody}
                  recipientName={settings.recipientName}
                  creatorName={settings.creatorName}
                />

                {/* Girlfriend Reply Section */}
                <ReplySection
                  vaultSlug="our-story"
                  recipientName={settings.recipientName}
                  creatorName={settings.creatorName}
                />

                {/* Footer */}
                <footer className="py-12 text-center text-xs text-rose-300/60 border-t border-rose-500/20 max-w-4xl mx-auto px-4 space-y-2">
                  <p className="flex items-center justify-center gap-1.5 text-rose-200 font-medium">
                    Crafted with endless love by <span className="text-rose-400 font-semibold">{settings.creatorName || 'Alex'}</span> for{' '}
                    <span className="text-rose-400 font-semibold">{settings.recipientName || 'Elena'}</span> ❤️
                  </p>
                  <p className="text-[11px] text-rose-400/50">
                    National Girlfriend&apos;s Day Private Digital Memory Vault • {new Date().getFullYear()}
                  </p>
                </footer>
              </>
            )}
          </main>

          {/* Floating Soundtrack Player */}
          <SoundtrackPlayer
            url={settings.soundtrackUrl}
            title={settings.soundtrackTitle}
            artist={settings.soundtrackArtist}
            autoPlay={autoPlayAudio}
          />
        </>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxMemory && (
          <MediaLightbox
            memory={activeLightboxMemory}
            onClose={() => setActiveLightboxMemory(null)}
            onNext={handleNextLightbox}
            onPrev={handlePrevLightbox}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        )}
      </AnimatePresence>

      {/* Security Passcode Gate */}
      <AnimatePresence>
        {showPasscodeGate && (
          <PasscodeGate
            isOpen={showPasscodeGate}
            recipientName={settings.recipientName || 'Elena'}
            onVerify={handleVerifyPasscode}
            onCreateVault={() => {
              setShowPasscodeGate(false);
              setShowSignUpModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Admin Dashboard CMS Modal */}
      <AnimatePresence>
        {showAdminDashboard && (
          <AdminDashboard
            onClose={() => setShowAdminDashboard(false)}
            onRefreshVault={fetchVaultData}
          />
        )}
      </AnimatePresence>

      {/* SignUp / Create Vault Modal */}
      <AnimatePresence>
        {showSignUpModal && (
          <SignUpModal
            isOpen={showSignUpModal}
            onClose={() => setShowSignUpModal(false)}
            onSignUp={handleSignUpSubmit}
            initialCreatorName={settings.creatorName}
            initialRecipientName={settings.recipientName}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

