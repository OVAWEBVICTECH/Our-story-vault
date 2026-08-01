import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  User,
  Users,
  Calendar,
  Lock,
  Sparkles,
  X,
  ArrowRight,
  Mail,
  KeyRound,
  LogIn,
  UserPlus,
  AlertCircle,
} from 'lucide-react';

export interface SignUpFormData {
  email: string;
  password: string;
  creatorName: string;
  recipientName: string;
  creatorGender: string;
  partnerGender: string;
  relationshipStartDate: string;
  passcode: string;
}

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (data: SignUpFormData) => Promise<void>;
  onSignIn?: (email: string, password: string) => Promise<boolean>;
  initialCreatorName?: string;
  initialRecipientName?: string;
  initialMode?: 'signup' | 'signin';
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  onSignIn,
  initialCreatorName = '',
  initialRecipientName = '',
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    creatorName: initialCreatorName || '',
    recipientName: initialRecipientName || '',
    creatorGender: 'Male',
    partnerGender: 'Female',
    relationshipStartDate: new Date().toISOString().split('T')[0],
    passcode: '0801',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.creatorName.trim()) {
        newErrors.creatorName = 'Please enter your name';
      }
      if (!formData.recipientName.trim()) {
        newErrors.recipientName = "Please enter your partner's name";
      }
      if (!formData.relationshipStartDate) {
        newErrors.relationshipStartDate = 'Please select your relationship start date';
      }
      if (!formData.passcode.trim() || formData.passcode.length < 4) {
        newErrors.passcode = 'Passcode must be at least 4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await onSignUp(formData);
        onClose();
      } else {
        if (onSignIn) {
          const success = await onSignIn(formData.email, formData.password);
          if (success) {
            onClose();
          } else {
            setGeneralError('Invalid email or password. Please try again or create an account.');
          }
        } else {
          // Default fallback sign-in
          await onSignUp(formData);
          onClose();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setGeneralError(err?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'signup' | 'signin') => {
    setMode(newMode);
    setErrors({});
    setGeneralError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg glass-card-dark p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-2xl relative my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 p-0.5 shadow-lg shadow-rose-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signup' ? 'Create Your Story Vault' : 'Welcome Back to Story Vault'}
          </h2>
          <p className="text-xs text-rose-200/80 font-light max-w-xs mx-auto">
            {mode === 'signup'
              ? 'Setup your personalized digital memory vault. Share a romantic story experience with your babe.'
              : 'Sign in with your email and password to access your story vault.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="inline-flex p-1 bg-black/40 rounded-full border border-rose-500/20 mt-3">
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email & Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-rose-400" /> Account Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-rose-400 ${
                  errors.email ? 'border-red-500' : 'border-rose-500/30'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-pink-400" /> Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-rose-400 ${
                  errors.password ? 'border-red-500' : 'border-rose-500/30'
                }`}
              />
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* SIGN UP EXTRA FIELDS */}
          {mode === 'signup' && (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Creator Name & Partner Name Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-rose-400" /> Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.creatorName}
                      onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                      placeholder="e.g. Alex"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-rose-400 ${
                        errors.creatorName ? 'border-red-500' : 'border-rose-500/30'
                      }`}
                    />
                    {errors.creatorName && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.creatorName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" /> Partner&apos;s Name *
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      placeholder="e.g. Elena"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-rose-400 ${
                        errors.recipientName ? 'border-red-500' : 'border-rose-500/30'
                      }`}
                    />
                    {errors.recipientName && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.recipientName}</p>
                    )}
                  </div>
                </div>

                {/* Gender Selectors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-rose-400" /> Your Gender
                    </label>
                    <select
                      value={formData.creatorGender}
                      onChange={(e) => setFormData({ ...formData, creatorGender: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 cursor-pointer"
                    >
                      <option value="Male" className="bg-slate-900 text-white">Male</option>
                      <option value="Female" className="bg-slate-900 text-white">Female</option>
                      <option value="Non-binary" className="bg-slate-900 text-white">Non-binary</option>
                      <option value="Other" className="bg-slate-900 text-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-pink-400" /> Partner&apos;s Gender
                    </label>
                    <select
                      value={formData.partnerGender}
                      onChange={(e) => setFormData({ ...formData, partnerGender: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 cursor-pointer"
                    >
                      <option value="Female" className="bg-slate-900 text-white">Female</option>
                      <option value="Male" className="bg-slate-900 text-white">Male</option>
                      <option value="Non-binary" className="bg-slate-900 text-white">Non-binary</option>
                      <option value="Other" className="bg-slate-900 text-white">Other</option>
                    </select>
                  </div>
                </div>

                {/* First Love Date / Anniversary */}
                <div>
                  <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> First Love / Relationship Date *
                  </label>
                  <input
                    type="date"
                    value={formData.relationshipStartDate}
                    onChange={(e) => setFormData({ ...formData, relationshipStartDate: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm focus:outline-none focus:border-rose-400 ${
                      errors.relationshipStartDate ? 'border-red-500' : 'border-rose-500/30'
                    }`}
                  />
                  {errors.relationshipStartDate && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.relationshipStartDate}</p>
                  )}
                  <p className="text-[11px] text-rose-300/60 mt-1">
                    Calculates your love duration counter (e.g., 365 Days Together).
                  </p>
                </div>

                {/* Security Vault Code / Passcode */}
                <div>
                  <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Security Vault Code (PIN) *
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={formData.passcode}
                    onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                    placeholder="e.g. 0801"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-white text-sm tracking-widest font-mono placeholder:text-rose-300/40 focus:outline-none focus:border-rose-400 ${
                      errors.passcode ? 'border-red-500' : 'border-rose-500/30'
                    }`}
                  />
                  {errors.passcode && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.passcode}</p>
                  )}
                  <p className="text-[11px] text-rose-300/60 mt-1">
                    Your partner will use this PIN passcode to unlock your story vault.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{mode === 'signup' ? 'Creating Vault...' : 'Signing In...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {mode === 'signup' ? 'Sign Up & Open Story Vault' : 'Sign In & Access Story Vault'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Mode Switch Toggle Below Button */}
          <div className="text-center pt-2 pb-1">
            {mode === 'signup' ? (
              <p className="text-xs text-rose-200/80">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-rose-300 font-bold hover:underline cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-rose-200/80">
                Don&apos;t have a story vault yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-rose-300 font-bold hover:underline cursor-pointer transition-colors"
                >
                  Create Vault / Sign Up
                </button>
              </p>
            )}
          </div>

          <p className="text-[11px] text-center text-rose-300/60 pt-1">
            Brought to you by <span className="text-rose-300 font-semibold">webvictech</span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
