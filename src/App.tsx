import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import OnboardingSlider from '@/components/OnboardingSlider';
import AuthContainer from '@/components/AuthContainer';
import PersonalizationModal from '@/components/PersonalizationModal';
import DashboardPreview from '@/components/DashboardPreview';
import type { UserProfile, UserPreferences } from '@/types';

type AppStage = 'splash' | 'onboarding' | 'auth' | 'personalization' | 'dashboard';

function App() {
  const [stage, setStage] = useState<AppStage>('splash');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('kovia_session');
    const storedPrefs = localStorage.getItem('kovia_prefs');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (session.user && session.expiresAt > Date.now()) {
          setUser(session.user);
          if (storedPrefs) {
            setPrefs(JSON.parse(storedPrefs));
          }
          setStage('dashboard');
          return;
        }
      } catch {
        // Invalid stored data, continue to onboarding
      }
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setStage('onboarding');
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setStage('auth');
  }, []);

  const handleOnboardingSkip = useCallback(() => {
    setStage('auth');
  }, []);

  const handleAuthenticated = useCallback((profile: UserProfile) => {
    setUser(profile);
    // Check if user has preferences set
    const storedPrefs = localStorage.getItem('kovia_prefs');
    if (storedPrefs) {
      setPrefs(JSON.parse(storedPrefs));
      setStage('dashboard');
    } else {
      setStage('personalization');
    }
  }, []);

  const handlePersonalizationComplete = useCallback((newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    localStorage.setItem('kovia_prefs', JSON.stringify(newPrefs));
    // Update user name in stored profile
    if (user) {
      const updatedUser = { ...user, name: newPrefs.name || user.name };
      setUser(updatedUser);
      localStorage.setItem('kovia_user', JSON.stringify(updatedUser));
      const session = localStorage.getItem('kovia_session');
      if (session) {
        const s = JSON.parse(session);
        s.user = updatedUser;
        localStorage.setItem('kovia_session', JSON.stringify(s));
      }
    }
    setStage('dashboard');
  }, [user]);

  const handlePersonalizationBack = useCallback(() => {
    setStage('auth');
  }, []);

  const stageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          variants={stageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {stage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

          {stage === 'onboarding' && (
            <OnboardingSlider
              onComplete={handleOnboardingComplete}
              onSkip={handleOnboardingSkip}
            />
          )}

          {stage === 'auth' && (
            <AuthContainer onAuthenticated={handleAuthenticated} />
          )}

          {stage === 'personalization' && (
            <PersonalizationModal
              onComplete={handlePersonalizationComplete}
              onBack={handlePersonalizationBack}
            />
          )}

          {stage === 'dashboard' && prefs && (
            <DashboardPreview prefs={prefs} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;