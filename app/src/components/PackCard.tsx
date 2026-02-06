'use client';

import { Pack } from '@/lib/types';

interface PackCardProps {
  pack: Pack;
  completedCount: number;
  onClick: () => void;
}

export function PackCard({ pack, completedCount, onClick }: PackCardProps) {
  const progress = Math.round((completedCount / pack.challenges.length) * 100);
  const isComplete = completedCount === pack.challenges.length;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl transition-all tap-target ${
        isComplete
          ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200'
          : 'bg-white border-2 border-stone-100 hover:border-amber-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="emoji-icon-lg">{pack.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-800 truncate">{pack.name}</h3>
            {isComplete && <span className="text-emerald-600 text-lg">✓</span>}
          </div>
          <p className="text-stone-500 text-sm truncate">{pack.description}</p>
        </div>
        <div className="text-right">
          <div className="text-stone-400 text-sm">
            {completedCount}/{pack.challenges.length}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}
