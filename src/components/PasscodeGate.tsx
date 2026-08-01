import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Heart, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

interface PasscodeGateProps {
  recipientName: string;
  onVerify: (passcode: string) => Promise<boolean>;
  isOpen: boolean;
  onCreateVault?: () => void;
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ recipientName, onVerify, onCreateVault }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleKeyPress = async (val: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + val;
    setPin(newPin);
    setError(null);

    if (newPin.length === 4) {
      setIsUnlocking(true);
      const success = await onVerify(newPin);
      if (success) {
        // Unlock animated transition handled by parent
      } else {
        setIsUnlocking(false);
        setError('Incorrect passcode. Try your anniversary date (MMDD)!');
        setPin('');
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/80 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm glass-card-dark p-8 rounded-3xl border border-rose-500/30 text-center shadow-2xl relative overflow-hidden"
      >
          {/* Glowing Ambient Background Spot */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Icon Header */}
          <div className="relative z-10 space-y-4">
            <motion.div
              animate={isUnlocking ? { scale: [1, 1.2, 0.9, 1.1], rotate: [0, 10, -10, 0] } : {}}
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white"
            >
              {isUnlocking ? <Heart className="w-8 h-8 fill-white animate-ping" /> : <Lock className="w-7 h-7" />}
            </motion.div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                Private Vault <Sparkles className="w-4 h-4 text-rose-300" />
              </h2>
              <p className="text-sm text-rose-200/80">
                Welcome, <span className="text-rose-300 font-semibold">{recipientName || 'My Love'}</span>. Enter the 4-digit passcode to unlock our journey.
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex justify-center gap-3 py-4">
              {[0, 1, 2, 3].map((i) => {
                const filled = pin.length > i;
                return (
                  <motion.div
                    key={i}
                    animate={{ scale: filled ? 1.25 : 1 }}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      filled ? 'bg-rose-400 border-rose-300 shadow-md shadow-rose-500/50' : 'border-rose-300/30 bg-white/5'
                    }`}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-300 bg-rose-500/20 py-2 px-3 rounded-xl border border-rose-500/30 flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </motion.p>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  disabled={isUnlocking}
                  className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-rose-500/40 text-white text-xl font-medium border border-white/10 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                >
                  {num}
                </button>
              ))}

              {/* Bottom Row */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="h-14 rounded-2xl bg-transparent text-rose-300/70 hover:text-white text-xs font-medium flex items-center justify-center cursor-pointer"
              >
                Hint
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                disabled={isUnlocking}
                className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-rose-500/40 text-white text-xl font-medium border border-white/10 transition-all flex items-center justify-center shadow-sm cursor-pointer"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                disabled={isUnlocking || pin.length === 0}
                className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 text-rose-200 text-sm font-medium flex items-center justify-center cursor-pointer disabled:opacity-30"
              >
                Delete
              </button>
            </div>

            {/* Secret Hint Card */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-3 text-xs text-rose-200/90 bg-rose-950/60 p-3 rounded-xl border border-rose-500/20 text-center"
              >
                <p className="flex items-center justify-center gap-1 text-rose-300 font-semibold mb-1">
                  <KeyRound className="w-3.5 h-3.5" /> Secret Hint
                </p>
                Default anniversary code is <span className="font-mono text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">0801</span> (August 1st)
              </motion.div>
            )}

            {/* Create Your Own Vault Section */}
            {onCreateVault && (
              <div className="pt-4 mt-2 border-t border-rose-500/20 space-y-2">
                <p className="text-[11px] text-rose-300/80 font-light">
                  Want to make a personalized memory vault for your own babe?
                </p>
                <button
                  type="button"
                  onClick={onCreateVault}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-rose-300/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Create Your Own Vault</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
  );
};
