'use client';

import { Challenge } from '@/lib/types';

interface ChallengeCardProps {
  challenge: Challenge;
  packIcon: string;
  completed?: boolean;
  onClick?: () => void;
}

export function ChallengeCard({ challenge, packIcon, completed, onClick }: ChallengeCardProps) {
  const difficultyClass = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }[challenge.difficulty];

  return (
    <button
      onClick={onClick}
      disabled={completed}
      className={`quest-card w-full text-left bg-white rounded-3xl p-5 shadow-md border-2 border-stone-100 tap-target ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="emoji-icon flex-shrink-0">{challenge.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-stone-800 truncate">
              {challenge.title}
            </h3>
            {completed && (
              <span className="text-emerald-500 text-xl">✓</span>
            )}
          </div>
          <p className="text-stone-600 text-sm mb-3 line-clamp-2">
            {challenge.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyClass}`}>
              {challenge.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
              {challenge.reward_value}
            </span>
            <span className="text-stone-400 text-xs">
              ⏱ {challenge.time_estimate}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
