import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  PiggyBank,
  Target,
  Trophy,
  Flame,
  Plus,
  Check,
  ChevronRight,
  MessageCircle,
  Heart,
  TrendingUp,
  PartyPopper,
  Star,
  Bot,
} from 'lucide-react';
import { DEFAULT_GOALS, INITIAL_HABITS } from '@/constants/data';
import type { UserPreferences, Goal, DailyHabit } from '@/types';
import { cn } from '@/lib/utils';
import AICompanionChat from './AICompanionChat';

interface DashboardPreviewProps {
  prefs: UserPreferences;
}

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    KES: 'KSh',
    ZAR: 'R',
    GBP: '£',
    GHS: '₵',
  };
  const sym = symbols[currency] || currency;
  if (value >= 1000000) return `${sym}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${sym}${(value / 1000).toFixed(1)}K`;
  return `${sym}${value.toLocaleString()}`;
}

const VIBE_MESSAGES = [
  { emoji: '🌱', label: 'Growing Strong', min: 0 },
  { emoji: '🌿', label: 'Building Momentum', min: 25 },
  { emoji: '🌳', label: 'Solid Foundation', min: 50 },
  { emoji: '🏆', label: 'Money Master', min: 75 },
];

function getVibe(score: number) {
  return VIBE_MESSAGES.reduce((prev, curr) => (score >= curr.min ? curr : prev));
}

export default function DashboardPreview({ prefs }: DashboardPreviewProps) {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [habits, setHabits] = useState<DailyHabit[]>(INITIAL_HABITS);
  const [showChat, setShowChat] = useState(false);
  const [depositAmount, setDepositAmount] = useState<Record<string, string>>({});
  const [celebrated, setCelebrated] = useState<Record<string, boolean>>({});
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [showNewGoal, setShowNewGoal] = useState(false);

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const streak = habits.filter((h) => h.done).length;
  const vibe = getVibe(overallProgress);

  const handleDeposit = (goalId: string) => {
    const amount = parseInt(depositAmount[goalId] || '0');
    if (isNaN(amount) || amount <= 0) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newSaved = Math.min(g.saved + amount, g.target);
        if (newSaved >= g.target && !celebrated[goalId]) {
          setCelebrated((prev) => ({ ...prev, [goalId]: true }));
          setTimeout(() => {
            setCelebrated((prev) => ({ ...prev, [goalId]: false }));
          }, 3000);
        }
        return { ...g, saved: newSaved };
      })
    );
    setDepositAmount((prev) => ({ ...prev, [goalId]: '' }));
  };

  const toggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, done: !h.done } : h))
    );
  };

  const addGoal = () => {
    if (!newGoalName.trim() || !newGoalTarget.trim()) return;
    const target = parseInt(newGoalTarget);
    if (isNaN(target) || target <= 0) return;

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      title: newGoalName.trim(),
      emoji: '🎯',
      target,
      saved: 0,
      color: 'from-purple-400 to-violet-500',
    };
    setGoals((prev) => [...prev, newGoal]);
    setNewGoalName('');
    setNewGoalTarget('');
    setShowNewGoal(false);
  };

  return (
    <div className="min-h-full px-5 py-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">
            Hey, {prefs.name || 'Friend'} 👋
          </h1>
          <p className="text-sm text-amber-600 mt-0.5">
            Your money's looking good today!
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Vibe Check */}
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-amber-700">💰 Money Vibe Check</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-800">
            {vibe.emoji} {vibe.label}
          </span>
        </div>
        <div className="relative h-3 bg-amber-200/60 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <p className="text-xs text-amber-500 mt-2">
          {overallProgress}% toward your overall goals
        </p>
      </motion.div>

      {/* 3-Bucket Visualizer */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { label: 'Spendable', icon: Heart, amount: totalSaved * 0.3, color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50' },
          { label: 'Saved', icon: PiggyBank, amount: totalSaved * 0.5, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
          { label: 'Future', icon: TrendingUp, amount: totalSaved * 0.2, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
        ].map((bucket) => (
          <div
            key={bucket.label}
            className={`${bucket.bg} rounded-2xl p-4 flex flex-col items-center gap-1.5 border border-white/50`}
          >
            <bucket.icon className={`w-5 h-5 bg-gradient-to-r ${bucket.color} bg-clip-text text-transparent`} />
            <span className="text-[10px] font-medium text-gray-500">{bucket.label}</span>
            <span className="text-sm font-bold text-amber-900">
              {formatCurrency(bucket.amount, prefs.currency)}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Goals */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-amber-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-500" />
            Your Goals
          </h3>
          <button
            onClick={() => setShowNewGoal(true)}
            className="flex items-center gap-1 text-xs font-medium text-amber-500 hover:text-amber-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Goal
          </button>
        </div>

        <AnimatePresence>
          {showNewGoal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 rounded-2xl p-4 space-y-3 border border-amber-200/50"
            >
              <input
                type="text"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder="Goal name..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-sm text-amber-900 placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <input
                type="number"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                placeholder="Target amount..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-sm text-amber-900 placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={addGoal}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-md"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowNewGoal(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-200 text-amber-600 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {goals.map((goal) => {
          const progress = Math.round((goal.saved / goal.target) * 100);
          const isComplete = progress >= 100;

          return (
            <motion.div
              key={goal.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100/60 space-y-3 relative overflow-hidden"
              layout
            >
              {/* Celebration overlay */}
              <AnimatePresence>
                {celebrated[goal.id] && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 flex items-center justify-center z-10 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <PartyPopper className="w-10 h-10 text-emerald-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-emerald-700">Goal Complete! 🎉</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Goal header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{goal.emoji}</span>
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">{goal.title}</p>
                    <p className="text-[10px] text-gray-400">
                      {formatCurrency(goal.saved, prefs.currency)} / {formatCurrency(goal.target, prefs.currency)}
                    </p>
                  </div>
                </div>
                {isComplete && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${goal.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Deposit simulator */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={depositAmount[goal.id] || ''}
                  onChange={(e) =>
                    setDepositAmount((prev) => ({ ...prev, [goal.id]: e.target.value }))
                  }
                  placeholder="Add deposit..."
                  className="flex-1 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
                <button
                  onClick={() => handleDeposit(goal.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Daily Habits */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-amber-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            Daily Habits
          </h3>
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
            <Trophy className="w-3.5 h-3.5" />
            {streak} day streak
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left',
                habit.done
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-amber-100/60 hover:border-amber-200'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-all',
                  habit.done ? 'bg-emerald-200' : 'bg-amber-100'
                )}
              >
                {habit.done ? <Check className="w-4 h-4 text-emerald-600" /> : <span>{habit.icon}</span>}
              </div>
              <div className="flex-1">
                <p className={cn('text-sm font-medium', habit.done ? 'text-emerald-700 line-through' : 'text-amber-900')}>
                  {habit.title}
                </p>
              </div>
              {habit.streak > 0 && (
                <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                  🔥 {habit.streak}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* AI Coach CTA */}
      <motion.button
        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-500/30 hover:shadow-amber-500/40 transition-all"
        onClick={() => setShowChat(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-sm">Ask KOVIA AI</p>
          <p className="text-[10px] text-white/70">Get friendly money advice anytime</p>
        </div>
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* AI Chat */}
      <AICompanionChat
        userName={prefs.name || 'Friend'}
        open={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
}