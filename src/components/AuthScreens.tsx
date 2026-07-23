import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Lock,
  ArrowLeft,
  Check,
  LogIn,
  Building2,
  Users,
  User,
  Fingerprint,
  ScanFace,
  ShieldCheck,
  ArrowRight,
  Clock,
  ChevronRight,
  CircleCheckBig,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { AccountType, UserProfile, AuthSession } from '@/types';

// ── Helpers ─────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function saveSession(profile: UserProfile) {
  const session: AuthSession = {
    user: profile,
    token: `kovia_${generateId()}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem('kovia_session', JSON.stringify(session));
  localStorage.setItem('kovia_user', JSON.stringify(profile));
}

function simulateDelay(ms = 1200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Account Type Data ───────────────────────────────────

const ACCOUNT_TYPES: {
  value: AccountType;
  icon: React.ReactNode;
  title: string;
  tag: string;
  desc: string;
  emoji: string;
}[] = [
  {
    value: 'personal',
    icon: <User className="w-6 h-6" />,
    title: 'Just for Me',
    tag: 'Individual',
    desc: 'Personal budgeting, habit tracking & goals',
    emoji: '🙋',
  },
  {
    value: 'family',
    icon: <Users className="w-6 h-6" />,
    title: 'For My Family',
    tag: 'Shared',
    desc: 'Family allowances, shared savings & buckets',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    value: 'business',
    icon: <Building2 className="w-6 h-6" />,
    title: 'For My Business',
    tag: 'Business',
    desc: 'Sales tracking, expenses & cashflow insight',
    emoji: '🏢',
  },
];

// ── Login Screen ────────────────────────────────────────

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
  onBiometric: () => void;
}

function LoginScreen({ onLogin, onSwitchToSignup, onForgotPassword, onBiometric }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usePhone, setUsePhone] = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    await simulateDelay(800);
    // Simulate login — check localStorage for existing user
    const stored = localStorage.getItem('kovia_user');
    if (stored) {
      const user = JSON.parse(stored) as UserProfile;
      if (user.email === identifier || user.phone === identifier) {
        saveSession(user);
        onLogin(user);
        toast.success('Welcome back!');
      } else {
        toast.error('No account found with that email/phone');
      }
    } else {
      // Demo fallback: auto-create a session
      const demoUser: UserProfile = {
        id: generateId(),
        email: usePhone ? '' : identifier,
        phone: usePhone ? identifier : '',
        name: 'KOVIA User',
        accountType: 'personal',
        biometricEnabled: false,
        createdAt: Date.now(),
      };
      saveSession(demoUser);
      onLogin(demoUser);
      toast.success('Welcome to KOVIA!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome Back</h1>
        <p className="text-amber-600/70 text-sm">Sign in to your KOVIA account</p>
      </div>

      {/* Input Toggle */}
      <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-1 mb-6 self-start">
        <button
          onClick={() => setUsePhone(false)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            !usePhone ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-500 hover:text-amber-600'
          )}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={() => setUsePhone(true)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            usePhone ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-500 hover:text-amber-600'
          )}
        >
          <Smartphone className="w-4 h-4" />
          Phone
        </button>
      </div>

      {/* Identifier Input */}
      <div className="relative mb-4">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400">
          {usePhone ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
        </div>
        <input
          type={usePhone ? 'tel' : 'email'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={usePhone ? 'Phone number' : 'Email address'}
          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
          autoFocus
        />
      </div>

      {/* Password Input */}
      <div className="relative mb-2">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400">
          <Lock className="w-5 h-5" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Forgot Password */}
      <button onClick={onForgotPassword} className="self-end text-sm text-amber-500 hover:text-amber-600 font-medium mb-8 transition-colors">
        Forgot Password?
      </button>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Sign In
          </>
        )}
      </button>

      {/* Biometric shortcut */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={onBiometric}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-200 text-amber-600 font-medium hover:bg-amber-50 transition-all"
        >
          <Fingerprint className="w-5 h-5" />
          Quick Biometric Login
        </button>
        <p className="text-xs text-amber-500/60">Use Face ID or Fingerprint</p>
      </div>

      {/* Switch to Sign Up */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-amber-500 font-semibold hover:text-amber-600 transition-colors">
            Get Started
          </button>
        </p>
      </div>
    </div>
  );
}

// ── Sign Up Screen ──────────────────────────────────────

interface SignUpScreenProps {
  onSignup: (profile: UserProfile) => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

function SignUpScreen({ onSignup, onSwitchToLogin, onBack }: SignUpScreenProps) {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useEmail, setUseEmail] = useState(true);

  const handleSignup = async () => {
    if (!name || !password || password.length < 6) {
      toast.error('Name and password (min 6 chars) are required');
      return;
    }
    if (!email && !phone) {
      toast.error('Please enter email or phone');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to the terms');
      return;
    }
    setLoading(true);
    await simulateDelay(1000);
    const profile: UserProfile = {
      id: generateId(),
      email: useEmail ? email : '',
      phone: useEmail ? '' : phone,
      name,
      accountType: accountType || 'personal',
      biometricEnabled: false,
      createdAt: Date.now(),
    };
    saveSession(profile);
    onSignup(profile);
    toast.success(`Welcome to KOVIA, ${name}!`);
    setLoading(false);
  };

  const canProceedStep0 = accountType !== null;
  const canProceedStep1 = name.trim().length >= 2 && (useEmail ? email.includes('@') : phone.length >= 8);

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 min-h-full">
      {/* Back + Step indicator */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-1.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn('w-2 h-2 rounded-full transition-all duration-300', i <= step ? 'bg-amber-500' : 'bg-amber-200')}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {/* Step 0: Account Type */}
          {step === 0 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-amber-900 mb-2">Create Account</h1>
                <p className="text-amber-600/70 text-sm">Who is this account for?</p>
              </div>
              <div className="space-y-3 flex-1">
                {ACCOUNT_TYPES.map((at) => (
                  <motion.button
                    key={at.value}
                    onClick={() => setAccountType(at.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-4 px-5 py-5 rounded-2xl border-2 transition-all text-left',
                      accountType === at.value
                        ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-500/10'
                        : 'border-amber-100 hover:border-amber-200 bg-white'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all',
                        accountType === at.value ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-amber-50 text-amber-500'
                      )}
                    >
                      {at.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-amber-900">{at.title}</p>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-medium">{at.tag}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{at.desc}</p>
                    </div>
                    {accountType === at.value && <Check className="w-5 h-5 text-amber-500" />}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Profile Details */}
          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-amber-900 mb-2">Your Details</h1>
                <p className="text-amber-600/70 text-sm">Tell us about yourself</p>
              </div>

              {/* Full Name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-amber-700 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ada Okonkwo"
                  className="w-full px-5 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  autoFocus
                />
              </div>

              {/* Email/Phone Toggle */}
              <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-1 mb-4 self-start">
                <button
                  onClick={() => setUseEmail(true)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    useEmail ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-500 hover:text-amber-600'
                  )}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={() => setUseEmail(false)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    !useEmail ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-500 hover:text-amber-600'
                  )}
                >
                  <Smartphone className="w-4 h-4" />
                  Phone
                </button>
              </div>

              {useEmail ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-5 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all mb-4"
                />
              ) : (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-5 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all mb-4"
                />
              )}

              {/* Password */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password (min 6 chars)"
                  className="w-full px-5 pr-12 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                    agreed ? 'bg-amber-500 border-amber-500 text-white' : 'border-amber-200'
                  )}
                >
                  {agreed && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to KOVIA's{' '}
                  <button className="text-amber-500 underline">Terms of Service</button> and{' '}
                  <button className="text-amber-500 underline">Privacy Policy</button>
                </span>
              </label>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom action */}
      <div className="mt-6">
        <button
          onClick={step === 0 ? () => setStep(1) : handleSignup}
          disabled={step === 0 ? !canProceedStep0 : (!canProceedStep1 || loading)}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all shadow-lg',
            (step === 0 ? canProceedStep0 : canProceedStep1)
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : step === 0 ? (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>
      </div>

      {/* Switch to Login */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-amber-500 font-semibold hover:text-amber-600 transition-colors">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

// ── OTP Verification Screen ─────────────────────────────

interface OTPVerificationScreenProps {
  onVerified: () => void;
  onBack: () => void;
  identifier?: string;
}

function OTPVerificationScreen({ onVerified, onBack, identifier = 'user@example.com' }: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      toast.error('Please enter the full 4-digit code');
      return;
    }
    setLoading(true);
    await simulateDelay(1000);
    // Simulate OTP verification — always succeeds with "1234" or any 4 digits
    toast.success('Phone verified successfully!');
    onVerified();
    setLoading(false);
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    toast.success('New code sent!');
  };

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 min-h-full">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors mb-8 self-start">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-3xl">📱</span>
        </div>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Verify Code</h1>
        <p className="text-amber-600/70 text-sm mb-8">
          We sent a 4-digit code to <span className="font-semibold text-amber-700">{identifier}</span>
        </p>

        {/* OTP Input */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                'w-16 h-16 rounded-2xl text-center text-2xl font-bold text-amber-900 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50',
                digit ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-amber-200 bg-white'
              )}
            />
          ))}
        </div>

        {/* Timer / Resend */}
        <div className="text-center mb-8">
          {canResend ? (
            <button onClick={handleResend} className="text-amber-500 font-semibold hover:text-amber-600 transition-colors">
              Resend Code
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-amber-500/60 text-sm">
              <Clock className="w-4 h-4" />
              Resend in {timer}s
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 4}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all shadow-lg',
            otp.join('').length === 4
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Verify
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Forgot Password Screen ──────────────────────────────

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onOTPSent: (identifier: string) => void;
}

function ForgotPasswordScreen({ onBack, onOTPSent }: ForgotPasswordScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      toast.error('Please enter your email or phone');
      return;
    }
    setLoading(true);
    await simulateDelay(1200);
    onOTPSent(identifier);
    toast.success('Reset code sent!');
    setLoading(false);
  };

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 min-h-full">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors mb-8 self-start">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-3xl">🔐</span>
        </div>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Reset Password</h1>
        <p className="text-amber-600/70 text-sm mb-6">
          No worries! Enter your email or phone and we'll send you a reset code.
        </p>

        {/* Toggle */}
        <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-1 mb-6 self-start">
          <button
            onClick={() => setUsePhone(false)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              !usePhone ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-500 hover:text-amber-600'
            )}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setUsePhone(true)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              usePhone ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-500 hover:text-amber-600'
            )}
          >
            <Smartphone className="w-4 h-4" />
            Phone
          </button>
        </div>

        <input
          type={usePhone ? 'tel' : 'email'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={usePhone ? 'Phone number' : 'Email address'}
          className="w-full px-5 py-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-900 placeholder:text-amber-300 text-base font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all mb-6"
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              Send Reset Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Biometric Login Overlay ─────────────────────────────

interface BiometricOverlayProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function BiometricOverlay({ onSuccess, onCancel }: BiometricOverlayProps) {
  const [state, setState] = useState<'scanning' | 'success' | 'error'>('scanning');

  useEffect(() => {
    const t = setTimeout(() => {
      setState('success');
      const t2 = setTimeout(() => {
        onSuccess();
      }, 1200);
      return () => clearTimeout(t2);
    }, 2000);
    return () => clearTimeout(t);
  }, [onSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/95 via-white/95 to-emerald-50/95 backdrop-blur-md px-6"
    >
      <button onClick={onCancel} className="absolute top-12 right-6 text-amber-400 hover:text-amber-600 transition-colors">
        <span className="text-sm font-medium">Cancel</span>
      </button>

      <AnimatePresence mode="wait">
        {state === 'scanning' && (
          <motion.div key="scan" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center">
            {/* Face ID Ring */}
            <div className="relative w-28 h-28 mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-amber-300"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-amber-400"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              />
              <div className="absolute inset-4 flex items-center justify-center">
                <ScanFace className="w-12 h-12 text-amber-500" />
              </div>
              {/* Scanning line */}
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                animate={{ top: ['20%', '75%', '20%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-lg font-semibold text-amber-900">Scanning Face ID</p>
            <p className="text-sm text-amber-500/60 mt-1">Look at your device to unlock</p>
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CircleCheckBig className="w-12 h-12 text-white" />
            </motion.div>
            <p className="text-lg font-semibold text-emerald-700">Verified!</p>
            <p className="text-sm text-emerald-500/60 mt-1">Welcome back</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Exports ─────────────────────────────────────────────

export { LoginScreen, SignUpScreen, OTPVerificationScreen, ForgotPasswordScreen, BiometricOverlay };