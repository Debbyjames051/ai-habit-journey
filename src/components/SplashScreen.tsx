import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SPLASH_HERO_IMAGE } from '@/constants/data';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExit(true);
    setTimeout(onComplete, 600);
  };

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="relative min-h-full flex flex-col items-center justify-center px-6 overflow-hidden"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Warm ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-white to-emerald-50/40 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber-300/20 rounded-full blur-3xl animate-pulse" />

          {/* Hero illustration */}
          <motion.div
            className="relative z-10 w-56 h-64 mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src={SPLASH_HERO_IMAGE}
              alt="KOVIA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
          </motion.div>

          {/* Logo + Tagline */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-amber-900">
                KOVIA
              </h1>
            </div>
            <p className="text-lg font-medium text-amber-700/80 mb-2">
              Spend Smart. Save More. Live Better.
            </p>
            <p className="text-sm text-amber-600/60 max-w-xs mx-auto">
              Your warm, friendly money companion
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="relative z-10 mt-10"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={handleEnter}
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <p className="mt-3 text-xs text-amber-500/60 text-center">
              Your data stays private on this device
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}