import { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Toggle */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-amber-200/40">
        <button
          onClick={() => setFullscreen(false)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
            !fullscreen
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-600 hover:bg-amber-50'
          )}
        >
          <Smartphone className="w-4 h-4" />
          <span>Phone</span>
        </button>
        <button
          onClick={() => setFullscreen(true)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
            fullscreen
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-amber-600 hover:bg-amber-50'
          )}
        >
          <Monitor className="w-4 h-4" />
          <span>Full</span>
        </button>
      </div>

      {/* Device Frame */}
      {fullscreen ? (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {children}
        </div>
      ) : (
        <div className="relative w-[360px] max-w-full mx-auto">
          {/* Phone frame */}
          <div className="relative bg-white rounded-[3rem] shadow-2xl border-[3px] border-gray-200 overflow-hidden">
            {/* Notch / Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-[120px] h-[30px] bg-black rounded-b-2xl flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-800" />
              <div className="w-16 h-1.5 rounded-full bg-gray-800" />
            </div>
            {/* Status bar */}
            <div className="pt-10 pb-2 px-6 flex items-center justify-between text-xs font-medium text-gray-500">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2.5 border border-gray-400 rounded-sm relative">
                  <div className="absolute inset-0.5 bg-gray-400 rounded-sm w-3/4" />
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="min-h-[600px] max-h-[700px] overflow-y-auto scrollbar-hide">
              {children}
            </div>
            {/* Home indicator */}
            <div className="pb-2 flex justify-center">
              <div className="w-32 h-1 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}