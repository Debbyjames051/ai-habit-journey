import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, X } from 'lucide-react';
import { SAMPLE_CHAT_MESSAGES, SAMPLE_QUERIES } from '@/constants/data';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface AICompanionChatProps {
  userName: string;
  open: boolean;
  onClose: () => void;
}

const AI_RESPONSES: Record<string, string> = {
  fun: "Let's see! A good rule is the 50/30/20 rule — 50% needs, 30% wants, 20% savings. With your current budget, you've got about 25% for fun. You're doing great! 🎉",
  saving: "You're tracking nicely! A good target is saving at least 20% of your income. If you're hitting that, you're ahead of the game! Want to adjust your goal? 💪",
  tip: "Here's today's tip: Try the '24-hour rule' — wait 24 hours before any non-essential purchase over a certain amount. You'll be surprised how many 'must-haves' become 'meh'! ✨",
  subscription: "Great question! Quick audit: check for subscriptions you haven't used in 30+ days. Even one at $15/month adds up to $180/year! That's a nice little emergency fund boost. 📊",
};

const QUERY_KEYS = ['fun', 'saving', 'tip', 'subscription'] as const;

export default function AICompanionChat({ userName, open, onClose }: AICompanionChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    SAMPLE_CHAT_MESSAGES.map((m, i) => ({
      id: `init-${i}`,
      role: m.role as 'user' | 'ai',
      content: m.content,
      timestamp: Date.now() - (SAMPLE_CHAT_MESSAGES.length - i) * 60000,
    }))
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuery = (query: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const matchedKey = QUERY_KEYS.find((k) =>
      query.toLowerCase().includes(k === 'fun' ? 'fun' : k === 'saving' ? 'saving' : k === 'tip' ? 'tip' : 'subscription')
    );

    const aiContent = matchedKey
      ? AI_RESPONSES[matchedKey]
      : "That's a great question! Based on your current spending patterns, I'd suggest focusing on your top goal first. Remember, small consistent steps lead to big results! 🌟";

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: aiContent,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    handleQuery(input.trim());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900 text-sm">KOVIA AI</p>
                  <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-400 hover:bg-amber-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-amber-500 text-white rounded-br-md'
                        : 'bg-amber-50 text-amber-900 rounded-bl-md'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-amber-50 rounded-2xl rounded-bl-md px-5 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick queries */}
            <div className="px-5 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {SAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuery(q)}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200/50 whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="px-5 pb-5 pt-2 border-t border-amber-100"
            >
              <div className="flex items-center gap-2 bg-amber-50/50 rounded-2xl border border-amber-200/60 px-4 py-2 focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask KOVIA anything, ${userName}...`}
                  className="flex-1 bg-transparent text-amber-900 placeholder:text-amber-300 text-sm font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}