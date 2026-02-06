'use client';

import { Challenge } from '@/lib/types';

interface ChallengeCardProps {
  challenge: Challenge;
  packIcon?: string;
  completed?: boolean;
  isActive?: boolean;
  isQueued?: boolean;
  onClick: () => void;
}

export function ChallengeCard({ 
  challenge, 
  packIcon,
  completed = false,
  isActive = false,
  isQueued = false,
  onClick 
}: ChallengeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl transition-all tap-target ${
        completed
          ? 'bg-emerald-50 border-2 border-emerald-200'
          : isActive
          ? 'bg-amber-50 border-2 border-amber-300'
          : isQueued
          ? 'bg-blue-50 border-2 border-blue-200'
          : 'bg-white border-2 border-stone-100 hover:border-amber-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <span className="text-3xl">{challenge.icon}</span>
          {completed && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </span>
          )}
          {isActive && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
              ⏳
            </span>
          )}
          {isQueued && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              📋
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold mb-1 ${
            completed ? 'text-emerald-800' : isQueued ? 'text-blue-800' : 'text-stone-800'
          }`}>
            {challenge.title}
          </h4>
          <p className={`text-sm line-clamp-2 ${
            completed ? 'text-emerald-600' : isQueued ? 'text-blue-600' : 'text-stone-500'
          }`}>
            {challenge.description}
          </p>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="text-amber-600 text-sm font-semibold">
              🎁 {challenge.reward} pts
            </span>
            {isQueued && (
              <span className="text-blue-600 text-xs font-semibold">
                Queued
              </span>
            )}
            {challenge.time_estimate && (
              <span className="text-stone-400 text-xs">
                ⏱️ {challenge.time_estimate}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-stone-300">
          →
        </div>
      </div>
    </button>
  );
}
