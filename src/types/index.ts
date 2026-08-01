export type MediaType = 'image' | 'video';

export type AnimationPreset = 
  | 'fade-slide' 
  | 'parallax-depth' 
  | 'scale-blur' 
  | 'stagger-reveal' 
  | '3d-flip' 
  | 'float-glass';

export type BackgroundGradient = 
  | 'rose' 
  | 'twilight' 
  | 'champagne' 
  | 'sunset' 
  | 'midnight' 
  | 'emerald';

export type CaptionTone = 
  | 'romantic' 
  | 'cute' 
  | 'funny' 
  | 'poetic' 
  | 'nostalgic' 
  | 'playful' 
  | 'elegant';

export interface Memory {
  id: string;
  vaultSlug: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType: MediaType;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  date: string; // YYYY-MM-DD or formatted
  location?: string;
  tags: string[];
  bgGradient: BackgroundGradient;
  animationPreset: AnimationPreset;
  confettiTrigger: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Reply {
  id: string;
  vaultSlug: string;
  senderName: string;
  message: string;
  favoriteMemoryId?: string;
  date: string;
  isRead: boolean;
  createdAt: string;
}

export interface VaultSettings {
  vaultSlug: string;
  recipientName: string;
  creatorName: string;
  creatorGender?: string;
  partnerGender?: string;
  relationshipStartDate: string; // e.g., '2023-08-01'
  passcode?: string; // Optional passcode for private access
  vaultTitle: string;
  subtitle: string;
  loveLetterTitle: string;
  loveLetterBody: string;
  soundtrackUrl?: string;
  soundtrackTitle?: string;
  soundtrackArtist?: string;
  themeColor: 'rose' | 'twilight' | 'champagne' | 'midnight';
}

export interface AICaptionRequest {
  title: string;
  tone: CaptionTone;
  details?: string;
  mediaType?: MediaType;
}

export interface AICaptionResponse {
  caption: string;
}
