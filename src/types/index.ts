// ── Auth Types ──────────────────────────────────────────
export type AccountType = 'personal' | 'family' | 'business';

export type AuthScreenState =
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'otp'
  | 'biometric'
  | 'authenticated';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  name: string;
  accountType: AccountType;
  biometricEnabled: boolean;
  avatar?: string;
  createdAt: number;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: number;
}

export interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge: string;
}

export interface UserPreferences {
  name: string;
  primaryGoal: string;
  currency: string;
  encouragementLevel: 'gentle' | 'balanced' | 'high';
  onboardingComplete: boolean;
}

export interface Goal {
  id: string;
  title: string;
  emoji: string;
  target: number;
  saved: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface DailyHabit {
  id: string;
  title: string;
  icon: string;
  done: boolean;
  streak: number;
}

export type CurrencyOption = {
  code: string;
  symbol: string;
  label: string;
};

export const CURRENCIES: CurrencyOption[] = [
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'GHS', symbol: '₵', label: 'Ghanaian Cedi' },
];

export const PRIMARY_GOALS = [
  { value: 'save', label: 'Save for a goal', emoji: '🎯' },
  { value: 'habit', label: 'Build better habits', emoji: '🌱' },
  { value: 'spend', label: 'Spend wisely', emoji: '🛒' },
  { value: 'learn', label: 'Learn about money', emoji: '📚' },
];

export const ENCOURAGEMENT_LEVELS = [
  { value: 'gentle', label: 'Gentle nudges', emoji: '🕊️', desc: 'Light reminders when needed' },
  { value: 'balanced', label: 'Balanced cheers', emoji: '🌟', desc: 'Daily encouragement & tips' },
  { value: 'high', label: 'Full hype mode', emoji: '🔥', desc: 'Pep talks & celebrations' },
];