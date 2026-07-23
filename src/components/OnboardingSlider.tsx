import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, SkipForward } from 'lucide-react';
import { ONBOARDING_SLIDES } from '@/constants/data';
import { cn } from '@/lib/utils';

interface OnboardingSliderProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function OnboardingSlider({ onComplete, onSkip }: OnboardingSliderProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const isLast = page === ONBOARDING_SLIDES.length - 1;
  const isFirst = page === 0;
  const dragXRef = useRef(0);

  const paginate = useCallback(
    (newDirection: number) => {
      const next = page + newDirection;
      if (next < 0) return;
      if (next >= ONBOARDING_SLIDES.length) {
        onComplete();
        return;
      }
      setPage([next, newDirection]);
    },
    [page, onComplete]
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x < -threshold) paginate(1);
    if (info.offset.x > threshold) paginate(-1);
  };

  const slide = ONBOARDING_SLIDES[page];

  return (
    <div className="relative flex flex-col h-full min-h-[600px]">
      {/* Skip button */}
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={onSkip}
          className="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-600 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </button>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="w-full flex flex-col items-center"
          >
            {/* Illustration */}
            <div className="relative w-56 h-64 mb-6 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/15">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent" />
            </div>

            {/* Badge */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-4">
              {slide.badge}
            </span>

            {/* Text */}
            <h2 className="text-2xl font-bold text-amber-900 text-center mb-1">
              {slide.title}
            </h2>
            <p className="text-amber-600 font-medium text-sm mb-3">{slide.subtitle}</p>
            <p className="text-gray-500 text-sm text-center leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-8 flex flex-col items-center gap-5">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > page ? 1 : -1])}
              className={cn(
                'rounded-full transition-all duration-300',
                i === page
                  ? 'w-8 h-2.5 bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'w-2.5 h-2.5 bg-amber-200 hover:bg-amber-300'
              )}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          {!isFirst && (
            <button
              onClick={() => paginate(-1)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-amber-200 text-amber-600 font-medium hover:bg-amber-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={() => paginate(1)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-white transition-all shadow-lg',
              isLast
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30 hover:shadow-emerald-500/40'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30 hover:shadow-amber-500/40'
            )}
          >
            {isLast ? (
              <>
                Let's Go!
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}