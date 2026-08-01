import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Wand2,
  Inbox,
  Settings,
  Image as ImageIcon,
  Video,
  Music,
  Heart,
  Save,
  X,
  Check,
  RefreshCw,
  Upload,
  Share2,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Users,
  Calendar,
  UserCheck,
  KeyRound,
  Mail,
  Gift,
} from 'lucide-react';
import { Memory, Reply, VaultSettings, CaptionTone, AnimationPreset, BackgroundGradient } from '../types/index.js';
import { UserAccount } from '../server/db.js';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshVault: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onRefreshVault }) => {
  const [activeTab, setActiveTab] = useState<'memories' | 'replies' | 'settings' | 'users'>('memories');

  // State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [settings, setSettings] = useState<Partial<VaultSettings>>({});
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [occasionTitle, setOccasionTitle] = useState<string>("National Girlfriend's Day");
  const [occasionDay, setOccasionDay] = useState<string>('2026-08-01');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit/Create Memory Form state
  const [editingMemory, setEditingMemory] = useState<Partial<Memory> | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTone, setAiTone] = useState<CaptionTone>('romantic');
  const [aiContext, setAiContext] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [memRes, repRes, setRes, userRes] = await Promise.all([
        fetch('/api/admin/memories').then((r) => r.json()),
        fetch('/api/admin/replies').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json()),
        fetch('/api/admin/users').then((r) => r.json()),
      ]);

      setMemories(memRes.memories || []);
      setReplies(repRes.replies || []);
      const loadedSettings = setRes.settings || {};
      setSettings(loadedSettings);
      setUsers(userRes.users || []);

      if (loadedSettings.occasionTitle) setOccasionTitle(loadedSettings.occasionTitle);
      if (loadedSettings.occasionDay) setOccasionDay(loadedSettings.occasionDay);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOccasion = async () => {
    try {
      const res = await fetch('/api/admin/occasion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasionDay, occasionTitle }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Occasion Day updated successfully! 🎉');
        if (data.settings) setSettings(data.settings);
        if (data.users) setUsers(data.users);
        onRefreshVault();
      }
    } catch (err) {
      showToast('Failed to save occasion day');
    }
  };

  const handleSaveUser = async (u: UserAccount) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${u.email} updated successfully!`);
        setEditingUser(null);
        fetchAllData();
        onRefreshVault();
      }
    } catch (err) {
      showToast('Failed to update user');
    }
  };

  // =========================================
  // MEMORY CMS HANDLERS
  // =========================================
  const handleSaveMemory = async () => {
    if (!editingMemory?.title || !editingMemory?.mediaUrl) {
      showToast('Title and Media URL are required!');
      return;
    }

    try {
      if (editingMemory.id) {
        // Update
        const res = await fetch(`/api/admin/memories/${editingMemory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingMemory),
        });
        const data = await res.json();
        if (data.memory) {
          showToast('Memory updated successfully!');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/memories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editingMemory,
            vaultSlug: 'our-story',
            isVisible: editingMemory.isVisible ?? true,
            sortOrder: memories.length + 1,
            tags: editingMemory.tags || ['Memory'],
            bgGradient: editingMemory.bgGradient || 'rose',
            animationPreset: editingMemory.animationPreset || 'fade-slide',
            confettiTrigger: editingMemory.confettiTrigger ?? false,
            date: editingMemory.date || new Date().toISOString().split('T')[0],
          }),
        });
        const data = await res.json();
        if (data.memory) {
          showToast('New memory created!');
        }
      }

      setEditingMemory(null);
      fetchAllData();
      onRefreshVault();
    } catch (err) {
      showToast('Failed to save memory.');
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await fetch(`/api/admin/memories/${id}`, { method: 'DELETE' });
      showToast('Memory deleted');
      fetchAllData();
      onRefreshVault();
    } catch (err) {
      showToast('Delete failed');
    }
  };

  const handleToggleVisibility = async (m: Memory) => {
    try {
      await fetch(`/api/admin/memories/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !m.isVisible }),
      });
      fetchAllData();
      onRefreshVault();
    } catch (err) {
      showToast('Toggle failed');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= memories.length) return;

    const newOrder = [...memories];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    const orderedIds = newOrder.map((m) => m.id);
    try {
      await fetch('/api/admin/memories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      fetchAllData();
      onRefreshVault();
    } catch (err) {
      showToast('Reorder failed');
    }
  };

  // =========================================
  // AI CAPTION STUDIO HANDLER
  // =========================================
  const handleGenerateAiCaption = async () => {
    if (!editingMemory?.title) {
      showToast('Please enter a Title first for AI Caption generation!');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/admin/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingMemory.title,
          tone: aiTone,
          details: aiContext,
          mediaType: editingMemory.mediaType || 'image',
        }),
      });

      const data = await res.json();
      if (data.caption) {
        setEditingMemory({ ...editingMemory, caption: data.caption });
        showToast(`Generated ${aiTone} caption with AI! ✨`);
      } else {
        showToast('AI Caption error');
      }
    } catch (err) {
      showToast('AI Generation failed');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // =========================================
  // DEVICE MEDIA FILE UPLOAD HANDLER
  // =========================================
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('File size is too large (max 25MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && editingMemory) {
        const isVideo = file.type.startsWith('video');
        setEditingMemory({
          ...editingMemory,
          mediaUrl: dataUrl,
          mediaType: isVideo ? 'video' : 'image',
        });
        showToast(`Loaded "${file.name}" from device!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // =========================================
  // SETTINGS HANDLER
  // =========================================
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.settings) {
        showToast('Vault settings saved!');
        onRefreshVault();
      }
    } catch (err) {
      showToast('Settings update failed');
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = window.location.origin;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => showToast('Shareable Vault link copied to clipboard! Send it to your babe ❤️'),
        () => showToast(`Link: ${shareUrl}`)
      );
    } else {
      showToast(`Shareable Link: ${shareUrl}`);
    }
  };

  // =========================================
  // REPLIES HANDLER
  // =========================================
  const handleMarkReplyRead = async (id: string) => {
    try {
      await fetch(`/api/admin/replies/${id}/read`, { method: 'PATCH' });
      fetchAllData();
    } catch (err) {
      showToast('Failed to mark read');
    }
  };

  const unreadRepliesCount = replies.filter((r) => !r.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl overflow-hidden">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl h-[92vh] glass-card-dark rounded-3xl border border-rose-500/30 shadow-2xl flex flex-col text-white overflow-hidden relative"
      >
        {/* Toast Popup */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-rose-300 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" /> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Navigation Bar */}
        <div className="p-4 sm:p-6 border-b border-rose-500/20 flex items-center justify-between gap-4 bg-rose-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Vault Admin Studio <span className="text-xs font-normal text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full">CMS</span>
              </h2>
              <p className="text-xs text-rose-300/70">Manage memories, AI captions, soundtrack, and replies inbox</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-rose-300/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Vault Link</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shareable Link Quick Bar */}
        <div className="bg-gradient-to-r from-rose-900/60 via-pink-900/40 to-rose-900/60 px-4 sm:px-6 py-2 border-b border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
            <span className="text-rose-200">
              Vault Link: <code className="bg-black/60 px-2 py-0.5 rounded text-rose-300 font-mono text-[11px] border border-rose-500/30">{typeof window !== 'undefined' ? window.location.origin : ''}</code>
            </span>
          </div>
          <button
            onClick={handleCopyShareLink}
            className="text-xs text-rose-300 hover:text-white flex items-center gap-1 font-semibold underline cursor-pointer"
          >
            <Copy className="w-3 h-3" /> Copy Link to Clipboard
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-rose-500/20 bg-black/40 px-4 sm:px-6 gap-2 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('memories')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'memories' ? 'border-rose-400 text-rose-300' : 'border-transparent text-rose-200/60 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Timeline Memories ({memories.length})
          </button>

          <button
            onClick={() => setActiveTab('replies')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer relative shrink-0 whitespace-nowrap ${
              activeTab === 'replies' ? 'border-rose-400 text-rose-300' : 'border-transparent text-rose-200/60 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" /> Girlfriend Replies Inbox
            {unreadRepliesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unreadRepliesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'settings' ? 'border-rose-400 text-rose-300' : 'border-transparent text-rose-200/60 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Vault Settings
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'users' ? 'border-rose-400 text-rose-300' : 'border-transparent text-rose-200/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-rose-400" /> Users & Occasion
          </button>
        </div>

        {/* Main Tab Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-rose-300/60 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-rose-400" />
              <p className="text-sm">Loading admin vault data...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: MEMORIES MANAGEMENT */}
              {activeTab === 'memories' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-rose-200 uppercase tracking-wider">Memory Timeline Manager</h3>
                    <button
                      onClick={() =>
                        setEditingMemory({
                          title: '',
                          caption: '',
                          mediaUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000',
                          mediaType: 'image',
                          bgGradient: 'rose',
                          animationPreset: 'fade-slide',
                          confettiTrigger: false,
                          isVisible: true,
                          date: new Date().toISOString().split('T')[0],
                          tags: ['Special Moment'],
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Memory
                    </button>
                  </div>

                  {/* Memories List */}
                  <div className="space-y-3">
                    {memories.map((m, idx) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          m.isVisible ? 'bg-white/5 border-rose-500/20 hover:border-rose-400/40' : 'bg-black/40 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={m.mediaUrl} alt={m.title} className="w-14 h-14 object-cover rounded-xl border border-rose-500/30 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{m.title}</p>
                              {!m.isVisible && <span className="text-[10px] bg-rose-950/80 text-rose-400 px-2 py-0.5 rounded-full">Hidden</span>}
                              {m.confettiTrigger && <Sparkles className="w-3.5 h-3.5 text-amber-400" title="Confetti Enabled" />}
                            </div>
                            <p className="text-xs text-rose-300/80 truncate max-w-sm">{m.caption}</p>
                            <p className="text-[10px] text-rose-400/60 mt-0.5">{m.date} • {m.location || 'No Location'}</p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === memories.length - 1}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(m)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
                            title={m.isVisible ? 'Hide from vault' : 'Show in vault'}
                          >
                            {m.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                          </button>
                          <button
                            onClick={() => setEditingMemory(m)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 cursor-pointer"
                            title="Edit Memory"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMemory(m.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 cursor-pointer"
                            title="Delete Memory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: GIRLFRIEND REPLIES INBOX */}
              {activeTab === 'replies' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-rose-200 uppercase tracking-wider">Incoming Secret Messages</h3>

                  {replies.length === 0 ? (
                    <div className="p-12 text-center text-rose-300/60 bg-white/5 rounded-2xl border border-white/10">
                      <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No reply messages received yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-5 rounded-2xl border transition-all space-y-2 ${
                            rep.isRead ? 'bg-white/5 border-rose-500/20' : 'bg-rose-950/60 border-rose-400/50 shadow-lg'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-rose-300 flex items-center gap-1.5">
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> From: {rep.senderName}
                            </span>
                            <span className="text-rose-400/60">{rep.date}</span>
                          </div>

                          <p className="text-sm text-rose-100 font-serif leading-relaxed whitespace-pre-line">{rep.message}</p>

                          {!rep.isRead && (
                            <button
                              onClick={() => handleMarkReplyRead(rep.id)}
                              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-2"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark as read
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VAULT SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <h3 className="text-sm font-semibold text-rose-200 uppercase tracking-wider">Vault & Love Letter Settings</h3>

                  <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-rose-500/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-rose-300 mb-1">Girlfriend Name (Recipient)</label>
                        <input
                          type="text"
                          value={settings.recipientName || ''}
                          onChange={(e) => setSettings({ ...settings, recipientName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-rose-300 mb-1">Your Name (Creator)</label>
                        <input
                          type="text"
                          value={settings.creatorName || ''}
                          onChange={(e) => setSettings({ ...settings, creatorName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-rose-300 mb-1">Relationship Start Date (YYYY-MM-DD)</label>
                        <input
                          type="date"
                          value={settings.relationshipStartDate || ''}
                          onChange={(e) => setSettings({ ...settings, relationshipStartDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-rose-300 mb-1">4-Digit Passcode PIN (Optional)</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={settings.passcode || ''}
                          onChange={(e) => setSettings({ ...settings, passcode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono"
                          placeholder="e.g. 0801"
                        />
                      </div>
                    </div>

                    {/* Love Letter Body */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-medium text-rose-300">Love Letter Title</label>
                      <input
                        type="text"
                        value={settings.loveLetterTitle || ''}
                        onChange={(e) => setSettings({ ...settings, loveLetterTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                      />

                      <label className="block text-xs font-medium text-rose-300 pt-2">Love Letter Message Body</label>
                      <textarea
                        rows={5}
                        value={settings.loveLetterBody || ''}
                        onChange={(e) => setSettings({ ...settings, loveLetterBody: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-serif resize-none"
                      />
                    </div>

                    {/* Soundtrack Settings */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h4 className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-rose-400" /> Romantic Soundtrack Config
                      </h4>

                      <div>
                        <label className="block text-[11px] text-rose-300/80 mb-1">MP3 Audio Stream URL</label>
                        <input
                          type="text"
                          value={settings.soundtrackUrl || ''}
                          onChange={(e) => setSettings({ ...settings, soundtrackUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-rose-300/80 mb-1">Track Title</label>
                          <input
                            type="text"
                            value={settings.soundtrackTitle || ''}
                            onChange={(e) => setSettings({ ...settings, soundtrackTitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-rose-300/80 mb-1">Artist / Composer</label>
                          <input
                            type="text"
                            value={settings.soundtrackArtist || ''}
                            onChange={(e) => setSettings({ ...settings, soundtrackArtist: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <Save className="w-4 h-4" /> Save Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: USERS & OCCASION MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* OCCASION DAY FEATURED CARD */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/70 via-black/80 to-rose-950/70 border border-rose-500/30 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            Vault Occasion Day Manager
                          </h3>
                          <p className="text-xs text-rose-300/80">
                            Configure the celebration occasion (e.g., National Girlfriend&apos;s Day, Anniversary, Birthday)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-rose-200 mb-2">Quick Preset Occasion Selector</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOccasionTitle("National Girlfriend's Day");
                            setOccasionDay("2026-08-01");
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                            occasionTitle.includes("Girlfriend")
                              ? 'bg-rose-500/30 border-rose-400 text-white shadow-md'
                              : 'bg-black/40 border-white/10 text-rose-200/70 hover:text-white'
                          }`}
                        >
                          <span className="block font-bold">💖 Girlfriend&apos;s Day</span>
                          <span className="text-[10px] opacity-70">August 1st</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOccasionTitle("Our Anniversary");
                            setOccasionDay(settings.relationshipStartDate || "2023-08-01");
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                            occasionTitle.includes("Anniversary")
                              ? 'bg-rose-500/30 border-rose-400 text-white shadow-md'
                              : 'bg-black/40 border-white/10 text-rose-200/70 hover:text-white'
                          }`}
                        >
                          <span className="block font-bold">💍 Relationship Anniversary</span>
                          <span className="text-[10px] opacity-70">Anniversary Date</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOccasionTitle("Valentine's Day");
                            setOccasionDay("2027-02-14");
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                            occasionTitle.includes("Valentine")
                              ? 'bg-rose-500/30 border-rose-400 text-white shadow-md'
                              : 'bg-black/40 border-white/10 text-rose-200/70 hover:text-white'
                          }`}
                        >
                          <span className="block font-bold">🌹 Valentine&apos;s Day</span>
                          <span className="text-[10px] opacity-70">February 14th</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOccasionTitle("Her Birthday");
                            setOccasionDay("2026-09-15");
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                            occasionTitle.includes("Birthday")
                              ? 'bg-rose-500/30 border-rose-400 text-white shadow-md'
                              : 'bg-black/40 border-white/10 text-rose-200/70 hover:text-white'
                          }`}
                        >
                          <span className="block font-bold">🎂 Her Birthday</span>
                          <span className="text-[10px] opacity-70">Birthday Date</span>
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-rose-300 mb-1">Occasion Title / Name</label>
                        <input
                          type="text"
                          value={occasionTitle}
                          onChange={(e) => setOccasionTitle(e.target.value)}
                          placeholder="e.g. National Girlfriend's Day"
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-xs focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-rose-300 mb-1">Occasion Date / Celebration Day</label>
                        <input
                          type="date"
                          value={occasionDay}
                          onChange={(e) => setOccasionDay(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-xs focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveOccasion}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-rose-300/30"
                    >
                      <Save className="w-4 h-4 text-amber-300" /> Save Occasion Day & Title
                    </button>
                  </div>

                  {/* REGISTERED USERS MANAGEMENT */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-rose-200 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-rose-400" /> Registered Vault User Accounts ({users.length})
                      </h3>
                    </div>

                    {users.length === 0 ? (
                      <div className="p-8 text-center text-rose-300/60 bg-white/5 rounded-2xl border border-white/10">
                        <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No registered user accounts found yet. Users who sign up will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {users.map((u) => (
                          <div
                            key={u.id}
                            className="p-5 rounded-2xl bg-white/5 border border-rose-500/20 hover:border-rose-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                {u.creatorName ? u.creatorName[0].toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-white">{u.email}</p>
                                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono">
                                    PIN: {u.passcode || '0801'}
                                  </span>
                                </div>
                                <p className="text-xs text-rose-300/80 mt-0.5">
                                  Couple: <span className="text-white font-medium">{u.creatorName || 'Alex'}</span> ❤️ <span className="text-white font-medium">{u.recipientName || 'Elena'}</span>
                                </p>
                                <p className="text-[11px] text-rose-400/70 mt-0.5 flex items-center gap-2">
                                  <span>Start Date: {u.relationshipStartDate}</span>
                                  {u.occasionDay && <span>• Occasion: {u.occasionDay}</span>}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => setEditingUser(u)}
                              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-rose-500/30 transition-all active:scale-95"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit Account & Occasion
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* EDIT / CREATE MEMORY MODAL WITH AI CAPTION STUDIO */}
      <AnimatePresence>
        {editingMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-xl max-h-[90vh] glass-card-dark p-6 rounded-3xl border border-rose-500/30 text-white overflow-y-auto space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">
                  {editingMemory.id ? 'Edit Memory' : 'Create New Memory'}
                </h3>
                <button
                  onClick={() => setEditingMemory(null)}
                  className="p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-rose-300 mb-1 font-medium">Memory Title *</label>
                  <input
                    type="text"
                    value={editingMemory.title || ''}
                    onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    placeholder="e.g. Our First Sunset Walk"
                  />
                </div>

                {/* AI CAPTION STUDIO MODULE */}
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-rose-200 font-bold flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-rose-400" /> Gemini AI Caption Studio
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAiCaption}
                      disabled={isAiGenerating}
                      className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold shadow flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      Generate Caption
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-rose-300/80 mb-1">Tone Selector</label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value as CaptionTone)}
                        className="w-full px-2 py-1.5 rounded-xl bg-black/60 border border-rose-500/30 text-white text-xs"
                      >
                        <option value="romantic">Romantic & Deep</option>
                        <option value="cute">Cute & Sweet</option>
                        <option value="funny">Funny & Playful</option>
                        <option value="poetic">Poetic & Lyrical</option>
                        <option value="nostalgic">Nostalgic Throwback</option>
                        <option value="playful">Playful Teasing</option>
                        <option value="elegant">Elegant & Timeless</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-rose-300/80 mb-1">Extra Details (Optional)</label>
                      <input
                        type="text"
                        value={aiContext}
                        onChange={(e) => setAiContext(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-xl bg-black/60 border border-rose-500/30 text-white text-xs"
                        placeholder="e.g. It was raining and we drank mocha"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-rose-300 mb-1 font-medium">Caption Body</label>
                  <textarea
                    rows={3}
                    value={editingMemory.caption || ''}
                    onChange={(e) => setEditingMemory({ ...editingMemory, caption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-light resize-none"
                    placeholder="Describe the moment..."
                  />
                </div>

                <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-rose-500/20">
                  <div className="flex items-center justify-between">
                    <label className="text-rose-300 font-medium">Media Asset *</label>
                    <label className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow transition-transform active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo/Video From Device</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={editingMemory.mediaUrl || ''}
                        onChange={(e) => setEditingMemory({ ...editingMemory, mediaUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                        placeholder="https://... or upload file from device above"
                      />
                    </div>

                    <div>
                      <select
                        value={editingMemory.mediaType || 'image'}
                        onChange={(e) => setEditingMemory({ ...editingMemory, mediaType: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs"
                      >
                        <option value="image">Photo Image</option>
                        <option value="video">MP4 Video</option>
                      </select>
                    </div>
                  </div>

                  {editingMemory.mediaUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3">
                      {editingMemory.mediaType === 'video' ? (
                        <video src={editingMemory.mediaUrl} className="w-14 h-12 object-cover rounded-lg bg-black" />
                      ) : (
                        <img src={editingMemory.mediaUrl} alt="Preview" className="w-14 h-12 object-cover rounded-lg bg-black" />
                      )}
                      <div className="text-[11px] text-rose-200/90 truncate flex-1">
                        <p className="font-semibold text-white">Media Loaded</p>
                        <p className="truncate text-rose-300/70">{editingMemory.mediaUrl.startsWith('data:') ? 'Uploaded from device' : editingMemory.mediaUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingMemory({ ...editingMemory, mediaUrl: '' })}
                        className="text-xs text-rose-300 hover:text-white px-2 py-1 rounded-lg bg-white/10 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={editingMemory.date || ''}
                      onChange={(e) => setEditingMemory({ ...editingMemory, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Location Pin (Optional)</label>
                    <input
                      type="text"
                      value={editingMemory.location || ''}
                      onChange={(e) => setEditingMemory({ ...editingMemory, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                      placeholder="e.g. Sunset Point Beach"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Animation Preset</label>
                    <select
                      value={editingMemory.animationPreset || 'fade-slide'}
                      onChange={(e) => setEditingMemory({ ...editingMemory, animationPreset: e.target.value as AnimationPreset })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    >
                      <option value="fade-slide">Fade & Slide</option>
                      <option value="parallax-depth">Parallax Depth</option>
                      <option value="scale-blur">Scale & Blur</option>
                      <option value="stagger-reveal">Stagger Reveal</option>
                      <option value="3d-flip">3D Flip Reveal</option>
                      <option value="float-glass">Float Glass</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Background Gradient Theme</label>
                    <select
                      value={editingMemory.bgGradient || 'rose'}
                      onChange={(e) => setEditingMemory({ ...editingMemory, bgGradient: e.target.value as BackgroundGradient })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    >
                      <option value="rose">Soft Rose</option>
                      <option value="twilight">Twilight Purple</option>
                      <option value="champagne">Warm Champagne</option>
                      <option value="sunset">Golden Sunset</option>
                      <option value="midnight">Midnight Dark</option>
                      <option value="emerald">Emerald Sparkle</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-rose-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingMemory.confettiTrigger ?? false}
                      onChange={(e) => setEditingMemory({ ...editingMemory, confettiTrigger: e.target.checked })}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                    <span>Trigger Confetti on Scroll Reveal</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => setEditingMemory(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMemory}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Memory
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT USER ACCOUNT MODAL */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md glass-card-dark p-6 rounded-3xl border border-rose-500/30 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-rose-400" /> Edit User Account
                </h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-rose-300 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={editingUser.email}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white/60 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Creator Name</label>
                    <input
                      type="text"
                      value={editingUser.creatorName || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, creatorName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Partner Name</label>
                    <input
                      type="text"
                      value={editingUser.recipientName || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, recipientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">Relationship Start Date</label>
                    <input
                      type="date"
                      value={editingUser.relationshipStartDate || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, relationshipStartDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-rose-300 mb-1 font-medium">4-Digit Passcode PIN</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={editingUser.passcode || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, passcode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-2">
                  <label className="block text-rose-200 font-bold">Occasion Day Celebration</label>
                  <input
                    type="date"
                    value={editingUser.occasionDay || occasionDay || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, occasionDay: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-rose-500/30 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveUser(editingUser)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save User Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
