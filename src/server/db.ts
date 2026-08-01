import fs from 'fs';
import path from 'path';
import { Memory, Reply, VaultSettings } from '../types/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'vault_db.json');

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  creatorName: string;
  recipientName: string;
  creatorGender: string;
  partnerGender: string;
  relationshipStartDate: string;
  passcode: string;
  occasionDay?: string;
  occasionTitle?: string;
  createdAt: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

interface DatabaseSchema {
  settings: VaultSettings;
  memories: Memory[];
  replies: Reply[];
  users: UserAccount[];
  adminCredentials?: AdminCredentials;
}

const DEFAULT_ADMIN: AdminCredentials = {
  email: 'admin@storyvault.com',
  password: 'Admin@storyvault',
};

const DEFAULT_SETTINGS: VaultSettings = {
  vaultSlug: 'our-story',
  recipientName: 'Elena',
  creatorName: 'Alex',
  relationshipStartDate: '2023-08-01',
  passcode: '0801',
  vaultTitle: 'Our Story',
  subtitle: "A National Girlfriend's Day Memory Vault",
  loveLetterTitle: 'To My Forever & Always ❤️',
  loveLetterBody: `Elena, looking back at all the memories we've built together fills my heart with so much warmth. From quiet coffee mornings to starry late-night talks, every moment with you is a gift I cherish deeply.\n\nHappy National Girlfriend's Day, my love. Here's to endless more chapters of our story.`,
  soundtrackUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-114476.mp3',
  soundtrackTitle: 'A Thousand Silent Moments',
  soundtrackArtist: 'Romantic Piano Solo',
  themeColor: 'rose',
  occasionDay: '2026-08-01',
  occasionTitle: "National Girlfriend's Day",
};

const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    vaultSlug: 'our-story',
    title: 'The Night We First Met',
    caption: 'I remember the exact moment you smiled across the room. Time seemed to slow down, and I knew right then that everything was about to change.',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    aspectRatio: 'portrait',
    date: '2023-08-01',
    location: 'Starlit Rooftop Lounge',
    tags: ['First Date', 'Spark', 'Beginnings'],
    bgGradient: 'rose',
    animationPreset: 'fade-slide',
    confettiTrigger: true,
    isVisible: true,
    sortOrder: 1,
    createdAt: new Date('2023-08-01').toISOString(),
  },
  {
    id: 'mem-2',
    vaultSlug: 'our-story',
    title: 'Golden Hour by the Waves',
    caption: 'Walking barefoot on the warm sand as the sun melted into the horizon. Watching your eyes reflect the amber glow made me fall even deeper.',
    mediaUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    aspectRatio: 'landscape',
    date: '2023-09-15',
    location: 'Golden Coast Shoreline',
    tags: ['Sunset', 'Ocean', 'Romance'],
    bgGradient: 'sunset',
    animationPreset: 'parallax-depth',
    confettiTrigger: false,
    isVisible: true,
    sortOrder: 2,
    createdAt: new Date('2023-09-15').toISOString(),
  },
  {
    id: 'mem-3',
    vaultSlug: 'our-story',
    title: 'Cozy Rain & Warm Coffee',
    caption: 'Sharing a single warm blanket while the autumn rain tapped against the windowpane. Two cups of caramel mocha and endless laughter.',
    mediaUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    aspectRatio: 'square',
    date: '2023-11-04',
    location: 'The Velvet Bean Cafe',
    tags: ['Cozy', 'Rainy Days', 'Coffee'],
    bgGradient: 'champagne',
    animationPreset: 'scale-blur',
    confettiTrigger: false,
    isVisible: true,
    sortOrder: 3,
    createdAt: new Date('2023-11-04').toISOString(),
  },
  {
    id: 'mem-4',
    vaultSlug: 'our-story',
    title: 'Our Mountain Road Trip',
    caption: 'Windows rolled down, singing our favorite anthems off-key through the pine valley roads. That spontaneous weekend getaway remains unmatchable.',
    mediaUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    aspectRatio: 'landscape',
    date: '2024-02-14',
    location: 'Whispering Pines Pass',
    tags: ['Road Trip', 'Adventure', 'Valentine'],
    bgGradient: 'twilight',
    animationPreset: 'stagger-reveal',
    confettiTrigger: true,
    isVisible: true,
    sortOrder: 4,
    createdAt: new Date('2024-02-14').toISOString(),
  },
  {
    id: 'mem-5',
    vaultSlug: 'our-story',
    title: 'Under the Midnight Canopy',
    caption: 'Lying on a blanket beneath a million glittering stars, whispering our wildest dreams into the midnight air. You are my universe.',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    aspectRatio: 'portrait',
    date: '2024-07-20',
    location: 'Stargazer Observatory',
    tags: ['Stargazing', 'Late Night', 'Forever'],
    bgGradient: 'midnight',
    animationPreset: 'float-glass',
    confettiTrigger: true,
    isVisible: true,
    sortOrder: 5,
    createdAt: new Date('2024-07-20').toISOString(),
  },
];

const DEFAULT_REPLIES: Reply[] = [
  {
    id: 'reply-1',
    vaultSlug: 'our-story',
    senderName: 'Elena',
    message: 'Alex, this is the sweetest surprise ever!! I am crying happy tears right now. Looking back at our first date and our mountain road trip brought back every single butterfly. I love you so much! ❤️',
    favoriteMemoryId: 'mem-1',
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

class VaultDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.users) {
          parsed.users = [];
        }
        if (!parsed.adminCredentials) {
          parsed.adminCredentials = DEFAULT_ADMIN;
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error reading vault DB file, reinitializing:', err);
    }

    const initialData: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      memories: DEFAULT_MEMORIES,
      replies: DEFAULT_REPLIES,
      users: [],
      adminCredentials: DEFAULT_ADMIN,
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing vault DB file:', err);
    }
  }

  // Settings methods
  public getSettings(vaultSlug: string = 'our-story'): VaultSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<VaultSettings>): VaultSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData(this.data);
    return this.data.settings;
  }

  // Memories methods
  public getMemories(vaultSlug: string = 'our-story', publicOnly: boolean = false): Memory[] {
    let list = this.data.memories.filter((m) => m.vaultSlug === vaultSlug || !m.vaultSlug);
    if (publicOnly) {
      list = list.filter((m) => m.isVisible);
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getMemoryById(id: string): Memory | undefined {
    return this.data.memories.find((m) => m.id === id);
  }

  public createMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Memory {
    const newMemory: Memory = {
      ...memory,
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.memories.push(newMemory);
    this.saveData(this.data);
    return newMemory;
  }

  public updateMemory(id: string, updates: Partial<Memory>): Memory | undefined {
    const idx = this.data.memories.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;

    this.data.memories[idx] = { ...this.data.memories[idx], ...updates };
    this.saveData(this.data);
    return this.data.memories[idx];
  }

  public deleteMemory(id: string): boolean {
    const initialLen = this.data.memories.length;
    this.data.memories = this.data.memories.filter((m) => m.id !== id);
    if (this.data.memories.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public reorderMemories(orderedIds: string[]): Memory[] {
    orderedIds.forEach((id, index) => {
      const memory = this.data.memories.find((m) => m.id === id);
      if (memory) {
        memory.sortOrder = index + 1;
      }
    });
    this.saveData(this.data);
    return this.getMemories('our-story', false);
  }

  // Replies methods
  public getReplies(vaultSlug: string = 'our-story'): Reply[] {
    return this.data.replies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addReply(reply: Omit<Reply, 'id' | 'date' | 'isRead' | 'createdAt'>): Reply {
    const newReply: Reply = {
      ...reply,
      id: `reply-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.replies.unshift(newReply);
    this.saveData(this.data);
    return newReply;
  }

  public markReplyAsRead(id: string): Reply | undefined {
    const reply = this.data.replies.find((r) => r.id === id);
    if (reply) {
      reply.isRead = true;
      this.saveData(this.data);
    }
    return reply;
  }

  // Users methods
  public findUserByEmail(email: string): UserAccount | undefined {
    const normalized = email.toLowerCase().trim();
    return this.data.users.find((u) => u.email.toLowerCase().trim() === normalized);
  }

  public registerUser(user: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
    const normalizedEmail = user.email.toLowerCase().trim();
    const existingIndex = this.data.users.findIndex((u) => u.email.toLowerCase().trim() === normalizedEmail);

    const newUser: UserAccount = {
      ...user,
      email: normalizedEmail,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      this.data.users[existingIndex] = newUser;
    } else {
      this.data.users.push(newUser);
    }
    this.saveData(this.data);
    return newUser;
  }

  public getAllUsers(): UserAccount[] {
    return this.data.users || [];
  }

  public updateUser(id: string, updates: Partial<UserAccount>): UserAccount | undefined {
    const userIdx = this.data.users.findIndex((u) => u.id === id);
    if (userIdx !== -1) {
      this.data.users[userIdx] = { ...this.data.users[userIdx], ...updates };
      this.saveData(this.data);
      return this.data.users[userIdx];
    }
    return undefined;
  }

  // Admin Credentials methods
  public getAdminCredentials(): AdminCredentials {
    return this.data.adminCredentials || DEFAULT_ADMIN;
  }

  public updateAdminCredentials(credentials: Partial<AdminCredentials>): AdminCredentials {
    const current = this.getAdminCredentials();
    this.data.adminCredentials = {
      email: credentials.email ? credentials.email.toLowerCase().trim() : current.email,
      password: credentials.password ? credentials.password : current.password,
    };
    this.saveData(this.data);
    return this.data.adminCredentials;
  }

  public verifyAdminCredentials(email: string, password: string): boolean {
    const creds = this.getAdminCredentials();
    const normalizedEmail = email.toLowerCase().trim();
    return creds.email.toLowerCase().trim() === normalizedEmail && creds.password === password;
  }
}

export const db = new VaultDatabase();
