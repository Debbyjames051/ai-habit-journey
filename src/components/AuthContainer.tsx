import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import type { UserProfile, AuthScreenState } from '@/types';
import {
  LoginScreen,
  SignUpScreen,
  OTPVerificationScreen,
  ForgotPasswordScreen,
  BiometricOverlay,
} from './AuthScreens';

interface AuthContainerProps {
  onAuthenticated: (user: UserProfile) => void;
  initialScreen?: AuthScreenState;
}

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function AuthContainer({ onAuthenticated, initialScreen = 'login' }: AuthContainerProps) {
  const [screen, setScreen] = useState<AuthScreenState>(initialScreen);
  const [otpIdentifier, setOtpIdentifier] = useState('');

  const navigate = useCallback((to: AuthScreenState) => {
    setScreen(to);
  }, []);

  const handleLogin = useCallback(
    (user: UserProfile) => {
      onAuthenticated(user);
    },
    [onAuthenticated]
  );

  const handleSignup = useCallback(
    (user: UserProfile) => {
      onAuthenticated(user);
    },
    [onAuthenticated]
  );

  const handleOTPVerified = useCallback(() => {
    navigate('login');
    toast.success('Verification complete! You can now sign in.');
  }, [navigate]);

  const handleOTPSent = useCallback(
    (identifier: string) => {
      setOtpIdentifier(identifier);
      navigate('otp');
    },
    [navigate]
  );

  const handleBiometricSuccess = useCallback(() => {
    // Simulate biometric login with stored user
    const stored = localStorage.getItem('kovia_user');
    if (stored) {
      const user = JSON.parse(stored) as UserProfile;
      handleLogin(user);
    } else {
      // Demo fallback: create a guest user
      const guestUser: UserProfile = {
        id: 'bio_' + Math.random().toString(36).substring(2, 10),
        email: 'guest@kovia.app',
        phone: '',
        name: 'KOVIA User',
        accountType: 'personal',
        biometricEnabled: true,
        createdAt: Date.now(),
      };
      localStorage.setItem('kovia_user', JSON.stringify(guestUser));
      localStorage.setItem(
        'kovia_session',
        JSON.stringify({
          user: guestUser,
          token: 'bio_' + Math.random().toString(36).substring(2, 15),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        })
      );
      handleLogin(guestUser);
    }
  }, [handleLogin]);

  return (
    <div className="relative min-h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-full"
        >
          {screen === 'login' && (
            <LoginScreen
              onLogin={handleLogin}
              onSwitchToSignup={() => navigate('signup')}
              onForgotPassword={() => navigate('forgot_password')}
              onBiometric={() => navigate('biometric')}
            />
          )}

          {screen === 'signup' && (
            <SignUpScreen
              onSignup={handleSignup}
              onSwitchToLogin={() => navigate('login')}
              onBack={() => navigate('login')}
            />
          )}

          {screen === 'forgot_password' && (
            <ForgotPasswordScreen
              onBack={() => navigate('login')}
              onOTPSent={handleOTPSent}
            />
          )}

          {screen === 'otp' && (
            <OTPVerificationScreen
              onVerified={handleOTPVerified}
              onBack={() => navigate('forgot_password')}
              identifier={otpIdentifier}
            />
          )}

          {screen === 'biometric' && (
            <BiometricOverlay
              onSuccess={handleBiometricSuccess}
              onCancel={() => navigate('login')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}