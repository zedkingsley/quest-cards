'use client';

import { Challenge, ChallengeWithDetails } from '@/lib/types';

interface ChallengeDetailProps {
  challenge: Challenge;
  packName: string;
  packIcon: string;
  isActive?: boolean;
  isPendingReview?: boolean;
  isCompleted?: boolean;
  customReward?: string;
  onStart?: () => void;
  onMarkDone?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onAbandon?: () => void;
}

export function ChallengeDetail({
  challenge,
  packName,
  packIcon,
  isActive,
  isPendingReview,
  isCompleted,
  customReward,
  onStart,
  onMarkDone,
  onApprove,
  onReject,
  onAbandon,
}: ChallengeDetailProps) {
  const difficultyClass = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  }[challenge.difficulty];

  const reward = customReward || challenge.reward_value;

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="emoji-icon-lg mb-4 animate-pop-in">{challenge.icon}</div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold text-stone-800 mb-2">{challenge.title}</h3>
      
      {/* Pack info */}
      <p className="text-stone-500 text-sm mb-4">
        {packIcon} {packName}
      </p>
      
      {/* Badges */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyClass}`}>
          {challenge.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-stone-100 text-stone-600">
          ⏱ {challenge.time_estimate}
        </span>
      </div>
      
      {/* Description */}
      <div className="text-left bg-stone-50 rounded-2xl p-4 mb-6">
        <p className="text-stone-700 leading-relaxed">{challenge.description}</p>
        
        {challenge.instructions && (
          <div className="mt-4 pt-4 border-t border-stone-200">
            <p className="font-semibold text-stone-600 mb-2">📋 How to do it:</p>
            <p className="text-stone-600 whitespace-pre-line text-sm">{challenge.instructions}</p>
          </div>
        )}
      </div>
      
      {/* Reward */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
        <p className="text-amber-600 font-semibold mb-1">🎁 Reward</p>
        <p className="text-2xl font-bold text-amber-700">{reward}</p>
      </div>
      
      {/* Status-specific UI */}
      {isCompleted && (
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border-2 border-emerald-200">
          <p className="text-emerald-600 font-bold text-lg">✅ Completed!</p>
          <p className="text-emerald-500 text-sm">Great job on this quest!</p>
        </div>
      )}
      
      {isPendingReview && (
        <div className="bg-amber-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
          <p className="text-amber-600 font-bold text-lg">⏳ Waiting for Review</p>
          <p className="text-amber-500 text-sm">A grown-up needs to check this!</p>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="space-y-3">
        {/* Not started yet */}
        {!isActive && !isPendingReview && !isCompleted && onStart && (
          <button onClick={onStart} className="btn btn-primary w-full text-lg">
            🚀 Start This Quest!
          </button>
        )}
        
        {/* Active - kid can mark done */}
        {isActive && !isPendingReview && onMarkDone && (
          <>
            <button onClick={onMarkDone} className="btn btn-success w-full text-lg">
              ✋ I Did It!
            </button>
            {onAbandon && (
              <button onClick={onAbandon} className="btn btn-outline w-full text-sm">
                Give up on this quest
              </button>
            )}
          </>
        )}
        
        {/* Pending review - parent actions */}
        {isPendingReview && (
          <div className="space-y-3">
            <p className="text-stone-500 text-sm font-semibold">Parent Review:</p>
            {onApprove && (
              <button onClick={onApprove} className="btn btn-success w-full text-lg">
                ✅ Approve - Quest Complete!
              </button>
            )}
            {onReject && (
              <button onClick={onReject} className="btn btn-outline w-full">
                ↩️ Not quite - try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
