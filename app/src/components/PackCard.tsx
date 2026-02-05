'use client';

import { Pack } from '@/lib/types';

interface PackCardProps {
  pack: Pack;
  completedCount?: number;
  onClick?: () => void;
}

export function PackCard({ pack, completedCount = 0, onClick }: PackCardProps) {
  const totalChallenges = pack.challenges.length;
  const progress = Math.round((completedCount / totalChallenges) * 100);

  return (
    <button
      onClick={onClick}
      className="quest-card w-full text-left bg-white rounded-3xl p-6 shadow-md border-2 border-stone-100 tap-target"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="emoji-icon-lg">{pack.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-xl text-stone-800">{pack.name}</h3>
          <p className="text-stone-500 text-sm">{totalChallenges} quests</p>
        </div>
      </div>
      
      <p className="text-stone-600 text-sm mb-4">{pack.description}</p>
      
      {/* Progress bar */}
      <div className="relative h-3 bg-stone-100 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-stone-400 text-xs mt-2 text-right">
        {completedCount}/{totalChallenges} completed
      </p>
    </button>
  );
}
