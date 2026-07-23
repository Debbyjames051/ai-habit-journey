import type { OnboardingSlide, Goal, DailyHabit } from '@/types';

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Healthy Money Habits',
    subtitle: 'Track Without Stress',
    description:
      'Effortlessly track your income & daily spending in simple buckets. No complex charts, no judgment — just clarity.',
    imageUrl:
      'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c149585d-755c-4e96-893b-236f4f16aeb0/kovia-habits-illustration-9a2fac65-1784714372437.webp',
    badge: '💸 Smart Spending',
  },
  {
    id: 2,
    title: 'Personal Goal Achievement',
    subtitle: 'Reach What Matters',
    description:
      'Set meaningful life goals — a family home, a business, education, or an emergency fund — and watch your progress with visual milestones.',
    imageUrl:
      'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c149585d-755c-4e96-893b-236f4f16aeb0/kovia-goals-illustration-07cbc15f-1784714370253.webp',
    badge: '🎯 Goal Getter',
  },
  {
    id: 3,
    title: 'Simple AI Guidance',
    subtitle: 'Your Money Companion',
    description:
      'Meet KOVIA — a warm, conversational AI companion that provides daily smart tips and answers your money questions without judgment.',
    imageUrl:
      'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c149585d-755c-4e96-893b-236f4f16aeb0/kovia-ai-guidance-illustration-072204ad-1784714370699.webp',
    badge: '🤖 AI Coach',
  },
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Emergency Fund',
    emoji: '🛡️',
    target: 500000,
    saved: 125000,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'g2',
    title: 'Family Home',
    emoji: '🏠',
    target: 5000000,
    saved: 850000,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'g3',
    title: 'Business Startup',
    emoji: '🚀',
    target: 2000000,
    saved: 400000,
    color: 'from-rose-400 to-pink-500',
  },
];

export const SAMPLE_CHAT_MESSAGES: { role: 'user' | 'ai'; content: string }[] = [
  {
    role: 'ai',
    content:
      "Hey! 👋 I'm your KOVIA money companion. Ask me anything about your finances — I'm here to help, not judge!",
  },
  {
    role: 'user',
    content: 'Can I afford brunch this weekend? I have 15,000 left this week.',
  },
  {
    role: 'ai',
    content:
      "Let's look at your week! You've got 15,000 left with 3 days to go. Brunch for 2 is around 8,000-10,000. That leaves you 5,000-7,000 for the rest of the weekend. Sounds totally doable — go enjoy! ☀️",
  },
];

export const SAMPLE_QUERIES = [
  'How much can I spend on fun this month?',
  'Am I saving enough for my goal?',
  'Give me a money tip for today',
  'Should I cut my subscription costs?',
];

export const INITIAL_HABITS: DailyHabit[] = [
  { id: 'h1', title: 'Log Daily Expenses', icon: '📝', done: true, streak: 5 },
  { id: 'h2', title: 'Save 10% of Income', icon: '💰', done: true, streak: 5 },
  { id: 'h3', title: 'Review Weekly Budget', icon: '📊', done: false, streak: 3 },
  { id: 'h4', title: 'No Impulse Buy Day', icon: '🧘', done: false, streak: 2 },
];

export const SPLASH_HERO_IMAGE =
  'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c149585d-755c-4e96-893b-236f4f16aeb0/kovia-splash-hero-9552494d-1784714371068.webp';