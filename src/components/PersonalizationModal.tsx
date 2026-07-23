import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CURRENCIES, PRIMARY_GOALS, ENCOURAGEMENT_LEVELS } from '@/types';
import type { UserPreferences } from '@/types';

interface PersonalizationModalProps {
  onComplete: (prefs: UserPreferences) => void;
  onBack: () => void;
}

const STEPS = [
  { key: 'name', label: 'Your Name' },
  { key: 'goal', label: 'Primary Goal' },
  { key: 'currency', label: 'Currency' },
  { key: 'vibe', label: 'Encouragement' },
];

export default function PersonalizationModal({
  onComplete,
  onBack,
}: PersonalizationModalProps) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    name: '',
    primaryGoal: 'save',
    currency: 'NGN',
    encouragementLevel: 'balanced',
  });

  const update = (key: string, value: string) =>
    setPrefs((prev) => ({ ...prev, [key]: value }));

  const canProceed = () => {
    if (step === 0) return prefs.name!.trim().length >= 2;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete(prefs as UserPreferences);
    }
  };

  return (
    <div className="min-h-full flex flex-col px-6 py-8">
      {/* Back + Step indicator */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={step === 0 ? onBack : () => setStep((s) => s - 1)}
          className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                i <= step ? 'bg-amber-500' : 'bg-amber-200'
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-2xl mb-4">👋</span>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                What should I call you?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Let's make this personal!
              </p>
              <input
                type="text"
                value={prefs.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Your name..."
                className="w-full px-5 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                autoFocus
              />
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-2xl mb-4">🎯</span>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                What's your main focus?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                This helps me tailor your experience
              </p>
              <div className="space-y-3">
                {PRIMARY_GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => {
                      update('primaryGoal', g.value);
                      handleNext();
                    }}
                    className={cn(
                      'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left',
                      prefs.primaryGoal === g.value
                        ? 'border-amber-400 bg-amber-50 shadow-md'
                        : 'border-amber-100 hover:border-amber-200 bg-white'
                    )}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900">{g.label}</p>
                    </div>
                    {prefs.primaryGoal === g.value && (
                      <Check className="w-5 h-5 text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Currency */}
          {step === 2 && (
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-2xl mb-4">💱</span>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Your preferred currency
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                We'll use this for goals and budgets
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      update('currency', c.code);
                    }}
                    className={cn(
                      'flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border-2 transition-all',
                      prefs.currency === c.code
                        ? 'border-amber-400 bg-amber-50 shadow-md'
                        : 'border-amber-100 hover:border-amber-200 bg-white'
                    )}
                  >
                    <span className="text-2xl font-bold text-amber-600">
                      {c.symbol}
                    </span>
                    <span className="text-xs font-medium text-amber-900">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-gray-400 text-center leading-tight">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Encouragement */}
          {step === 3 && (
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-2xl mb-4">🔥</span>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                How much encouragement?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Pick your vibe — we'll match it
              </p>
              <div className="space-y-3">
                {ENCOURAGEMENT_LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => update('encouragementLevel', l.value)}
                    className={cn(
                      'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left',
                      prefs.encouragementLevel === l.value
                        ? 'border-amber-400 bg-amber-50 shadow-md'
                        : 'border-amber-100 hover:border-amber-200 bg-white'
                    )}
                  >
                    <span className="text-2xl">{l.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900">{l.label}</p>
                      <p className="text-xs text-gray-400">{l.desc}</p>
                    </div>
                    {prefs.encouragementLevel === l.value && (
                      <Check className="w-5 h-5 text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom action */}
          <div className="mt-6">
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all shadow-lg',
                canProceed()
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30 hover:shadow-amber-500/40'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              {step < STEPS.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}