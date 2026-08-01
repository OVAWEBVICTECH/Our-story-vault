import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  Calendar,
  KeyRound,
  Mail,
  Search,
  Check,
  Save,
  X,
  RefreshCw,
  Sparkles,
  Heart,
  UserPlus,
  Lock,
  Edit2,
  Gift,
  LogOut,
  Sliders,
  TrendingUp,
  Clock,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { UserAccount } from '../server/db.js';

interface MainAdminDashboardProps {
  onClose: () => void;
  onRefreshApp: () => void;
}

export const MainAdminDashboard: React.FC<MainAdminDashboardProps> = ({ onClose, onRefreshApp }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'occasion' | 'security'>('overview');

  // Users & Stats
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Active Occasion
  const [occasionTitle, setOccasionTitle] = useState<string>("National Girlfriend's Day");
  const [occasionDay, setOccasionDay] = useState<string>('2026-08-01');

  // Admin Account Credentials State
  const [adminEmail, setAdminEmail] = useState<string>('admin@storyvault.com');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('admin@storyvault.com');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // UI Toast & Error states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isSavingOccasion, setIsSavingOccasion] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [userRes, setRes, credRes] = await Promise.all([
        fetch('/api/admin/users').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json()),
        fetch('/api/admin/credentials').then((r) => r.json()),
      ]);

      if (userRes.users) {
        setUsers(userRes.users);
      }
      if (setRes.settings) {
        if (setRes.settings.occasionTitle) setOccasionTitle(setRes.settings.occasionTitle);
        if (setRes.settings.occasionDay) setOccasionDay(setRes.settings.occasionDay);
      }
      if (credRes.email) {
        setAdminEmail(credRes.email);
        setNewAdminEmail(credRes.email);
      }
    } catch (err) {
      console.error('Failed to load main admin dashboard data:', err);
      showToast('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Occasion Presets
  const occasionPresets = [
    { title: "National Girlfriend's Day", day: '2026-08-01' },
    { title: "Valentine's Day", day: '2026-02-14' },
    { title: 'Happy Birthday My Love 🎂', day: new Date().toISOString().split('T')[0] },
    { title: 'Our Special Anniversary ❤️', day: new Date().toISOString().split('T')[0] },
    { title: "National Couples' Day", day: '2026-08-18' },
    { title: "National Boyfriend's Day", day: '2026-10-03' },
  ];

  const handleSaveOccasion = async () => {
    setIsSavingOccasion(true);
    try {
      const res = await fetch('/api/admin/occasion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasionDay, occasionTitle }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Home page active celebration occasion updated successfully! 🎉');
        onRefreshApp();
      } else {
        showToast('Failed to update occasion');
      }
    } catch (err) {
      showToast('Connection error updating occasion');
    } finally {
      setIsSavingOccasion(false);
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
        showToast(`User ${u.email} account details updated!`);
        setEditingUser(null);
        fetchAdminData();
        onRefreshApp();
      }
    } catch (err) {
      showToast('Failed to save user account details');
    }
  };

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      setSecurityError('Please enter a valid admin email address');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setSecurityError('New admin password must be at least 6 characters');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError('New password and confirmation password do not match');
      return;
    }

    setIsSavingSecurity(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newAdminEmail,
          password: newPassword || undefined,
          currentPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminEmail(data.email);
        setNewAdminEmail(data.email);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Admin login credentials updated successfully! 🔐');
      } else {
        setSecurityError(data.error || 'Failed to update admin credentials');
      }
    } catch (err) {
      setSecurityError('Connection error updating credentials');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      u.email.toLowerCase().includes(q) ||
      u.creatorName.toLowerCase().includes(q) ||
      u.recipientName.toLowerCase().includes(q) ||
      (u.passcode && u.passcode.includes(q))
    );
  });

  // Calculate Stats
  const totalUsersCount = users.length;
  const nowMs = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const newUsersCount = users.filter((u) => {
    const createdMs = new Date(u.createdAt).getTime();
    return nowMs - createdMs <= sevenDaysMs;
  }).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto text-slate-100 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-2xl border border-rose-300/40 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card-dark border border-rose-500/30 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 p-0.5 shadow-lg shadow-rose-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Main System Admin Dashboard
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold tracking-wider uppercase">
                  System Admin
                </span>
              </div>
              <p className="text-xs text-rose-200/70 font-light mt-0.5">
                Logged in as <strong className="text-white">{adminEmail}</strong> • Story Vault System Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 transition-colors cursor-pointer border border-rose-400/20"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-rose-300/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-900/80 rounded-2xl border border-rose-500/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                : 'text-rose-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                : 'text-rose-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Accounts ({totalUsersCount})</span>
            {newUsersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                +{newUsersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('occasion')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'occasion'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                : 'text-rose-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Home Page Celebration Occasion</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                : 'text-rose-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Admin Login Details</span>
          </button>
        </div>

        {/* Tab 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-card-dark border border-rose-500/20 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-rose-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Registered Users</span>
                  <Users className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white">{totalUsersCount}</div>
                <p className="text-[11px] text-rose-200/60">Registered couple memory vaults</p>
              </div>

              <div className="p-5 rounded-2xl glass-card-dark border border-rose-500/20 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">New Users (7 Days)</span>
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-300">+{newUsersCount}</div>
                <p className="text-[11px] text-emerald-200/60">Recent sign ups this week</p>
              </div>

              <div className="p-5 rounded-2xl glass-card-dark border border-rose-500/20 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Home Occasion</span>
                  <Gift className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white truncate">{occasionTitle}</div>
                <p className="text-[11px] text-amber-200/70">{occasionDay}</p>
              </div>

              <div className="p-5 rounded-2xl glass-card-dark border border-rose-500/20 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-pink-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">System Status</span>
                  <ShieldCheck className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  100% Operational
                </div>
                <p className="text-[11px] text-rose-200/60">Secure JSON & API Engine</p>
              </div>
            </div>

            {/* Active Occasion Banner Card */}
            <div className="p-6 rounded-3xl glass-card-dark border border-rose-500/30 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 z-10">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Current Celebration Displayed on Home Page</span>
                </div>
                <h2 className="text-2xl font-black text-white">{occasionTitle}</h2>
                <p className="text-xs text-rose-200/80">Scheduled Date: {occasionDay}</p>
              </div>

              <button
                onClick={() => setActiveTab('occasion')}
                className="z-10 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-4 h-4" />
                <span>Change Celebration Occasion</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: ALL USERS & NEW USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl glass-card-dark border border-rose-500/20">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by email, name, or passcode..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-rose-500/30 text-white text-xs sm:text-sm placeholder:text-rose-300/40 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="text-xs text-rose-200/70 px-2 font-medium">
                Showing {filteredUsers.length} of {users.length} registered users
              </div>
            </div>

            {/* User List Table / Cards */}
            {isLoading ? (
              <div className="text-center py-12 text-rose-300 animate-pulse text-sm">
                Loading registered user accounts...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 p-8 glass-card-dark rounded-3xl border border-rose-500/20 text-rose-200/80 space-y-2">
                <Users className="w-10 h-10 mx-auto text-rose-400/60" />
                <p className="text-sm font-semibold text-white">No registered users found.</p>
                <p className="text-xs">
                  {searchQuery ? 'Try clearing your search query.' : 'New users will appear here when they register.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((u) => {
                  const isNewUser = nowMs - new Date(u.createdAt).getTime() <= sevenDaysMs;

                  return (
                    <div
                      key={u.id}
                      className="p-4 sm:p-5 rounded-2xl glass-card-dark border border-rose-500/20 hover:border-rose-500/40 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                          {u.creatorName ? u.creatorName.charAt(0).toUpperCase() : 'U'}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">{u.email}</span>
                            {isNewUser && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                                New User
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-rose-200/80 flex-wrap">
                            <span className="flex items-center gap-1 text-white font-medium">
                              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                              {u.creatorName || 'Alex'} & {u.recipientName || 'Elena'}
                            </span>
                            <span>•</span>
                            <span>Passcode: <code className="text-amber-300 font-mono font-bold">{u.passcode || '0801'}</code></span>
                            <span>•</span>
                            <span className="text-rose-300/60">
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-rose-400/30 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: HOME PAGE CELEBRATION OCCASION */}
        {activeTab === 'occasion' && (
          <div className="p-6 sm:p-8 rounded-3xl glass-card-dark border border-rose-500/30 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-300" /> Change Home Page Active Celebration Occasion
              </h2>
              <p className="text-xs text-rose-200/80 font-light mt-1">
                Select or type the active celebration occasion title and date. This immediately updates the banner displayed at the top of the Home Page for all users.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-rose-300">Quick Occasion Presets:</label>
              <div className="flex flex-wrap gap-2">
                {occasionPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setOccasionTitle(preset.title);
                      setOccasionDay(preset.day);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      occasionTitle === preset.title
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                        : 'bg-slate-900/80 text-rose-200/80 border-rose-500/20 hover:border-rose-400/40'
                    }`}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1">
                  Occasion Title / Name *
                </label>
                <input
                  type="text"
                  value={occasionTitle}
                  onChange={(e) => setOccasionTitle(e.target.value)}
                  placeholder="e.g. National Girlfriend's Day"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" /> Celebration Date / Day *
                </label>
                <input
                  type="date"
                  value={occasionDay}
                  onChange={(e) => setOccasionDay(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <button
              onClick={handleSaveOccasion}
              disabled={isSavingOccasion}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-rose-300/30 disabled:opacity-50"
            >
              {isSavingOccasion ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save & Update Home Page Occasion
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 4: ADMIN LOGIN DETAILS & SECURITY */}
        {activeTab === 'security' && (
          <div className="p-6 sm:p-8 rounded-3xl glass-card-dark border border-rose-500/30 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-400" /> Change System Admin Login Credentials
              </h2>
              <p className="text-xs text-rose-200/80 font-light mt-1">
                Update your System Admin username/email and password. Default email is <code className="text-amber-300 font-bold">admin@storyvault.com</code> and password is <code className="text-amber-300 font-bold">Admin@storyvault</code>.
              </p>
            </div>

            {securityError && (
              <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{securityError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAdminCredentials} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-rose-400" /> System Admin Username / Email *
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@storyvault.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-pink-400" /> New Admin Password (optional if keeping current)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              {newPassword ? (
                <div>
                  <label className="block text-xs font-semibold text-rose-200 mb-1">
                    Confirm New Admin Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                    required
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Current Admin Password (to confirm changes)
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current admin password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSecurity}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-rose-300/30 disabled:opacity-50"
              >
                {isSavingSecurity ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save New Admin Credentials
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md glass-card-dark p-6 rounded-3xl border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-rose-400" /> Edit User Account
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-full text-rose-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-rose-200">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-rose-200">Creator Name</label>
                <input
                  type="text"
                  value={editingUser.creatorName}
                  onChange={(e) => setEditingUser({ ...editingUser, creatorName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-rose-200">Recipient Partner Name</label>
                <input
                  type="text"
                  value={editingUser.recipientName}
                  onChange={(e) => setEditingUser({ ...editingUser, recipientName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-rose-200">Vault Passcode</label>
                <input
                  type="text"
                  value={editingUser.passcode}
                  onChange={(e) => setEditingUser({ ...editingUser, passcode: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-rose-500/30 text-white text-xs mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-rose-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveUser(editingUser)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
