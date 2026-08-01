import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Send, Sparkles, CheckCircle2, MessageCircleHeart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReplySectionProps {
  vaultSlug?: string;
  recipientName?: string;
  creatorName?: string;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  vaultSlug = 'our-story',
  recipientName = 'Elena',
  creatorName = 'Alex',
}) => {
  const [senderName, setSenderName] = useState(recipientName);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please type your message before sending.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/vault/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: vaultSlug,
          senderName: senderName || recipientName,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSent(true);
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#38bdf8', '#ffd1dc', '#ffffff'],
        });
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-24 max-w-2xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card-dark p-8 sm:p-12 rounded-3xl border border-rose-500/30 shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
                <MessageCircleHeart className="w-3.5 h-3.5 text-rose-400" />
                Interactive Reply
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                Your Turn <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
              </h2>
              <p className="text-sm text-rose-200/80 font-light">
                Leave a note for <span className="text-rose-300 font-semibold">{creatorName}</span> in our private memory vault.
              </p>
            </div>

            {error && <p className="text-xs text-rose-300 bg-rose-500/20 py-2 px-3 rounded-xl border border-rose-500/30">{error}</p>}

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-rose-500/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                  placeholder="Elena"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">Your Secret Message / Feelings</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-rose-500/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none"
                  placeholder="Write whatever is in your heart right now..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-semibold shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending into vault...</span>
              ) : (
                <>
                  <span>Send My Love</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-8 space-y-4 relative z-10"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">Message Delivered to Vault! ❤️</h3>
            <p className="text-sm text-rose-200/90 font-light max-w-md mx-auto">
              Thank you, {senderName}! Your message has been safely saved inside our vault for {creatorName} to read.
            </p>

            <button
              onClick={() => setIsSent(false)}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-medium border border-rose-400/30 transition-colors cursor-pointer mt-4"
            >
              Send Another Note
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
