'use client';

import { Challenge } from '@/lib/types';

interface ChallengeDetailProps {
  challenge: Challenge;
  packName: string;
  packIcon: string;
  isActive?: boolean;
  isPendingReview?: boolean;
  isCompleted?: boolean;
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
  isActive = false,
  isPendingReview = false,
  isCompleted = false,
  onStart,
  onMarkDone,
  onApprove,
  onReject,
  onAbandon,
}: ChallengeDetailProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="emoji-icon-xl mx-auto mb-4">{challenge.icon}</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">{challenge.title}</h2>
        <p className="text-stone-500">
          {packIcon} {packName}
        </p>
      </div>

      {/* Status badges */}
      <div className="flex justify-center gap-2 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
        {challenge.time_estimate && (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-stone-100 text-stone-600">
            ⏱️ {challenge.time_estimate}
          </span>
        )}
        {isCompleted && (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
            ✓ Completed
          </span>
        )}
        {isPendingReview && (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-700">
            ⏳ Pending Review
          </span>
        )}
        {isActive && (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
            🎯 In Progress
          </span>
        )}
      </div>

      {/* Description */}
      <div className="bg-stone-50 rounded-2xl p-4">
        <h3 className="font-semibold text-stone-700 mb-2">The Quest</h3>
        <p className="text-stone-600">{challenge.description}</p>
      </div>

      {/* Instructions if available */}
      {challenge.instructions && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">📝 How to Complete</h3>
          <div className="text-amber-700 whitespace-pre-line text-sm">
            {challenge.instructions}
          </div>
        </div>
      )}

      {/* Reward */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-4 text-center border-2 border-amber-200">
        <p className="text-amber-600 text-sm font-semibold mb-1">Reward</p>
        <p className="text-3xl font-bold text-amber-700">
          🎁 {challenge.reward} points
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {/* Not started yet - parent can assign */}
        {onStart && !isActive && !isPendingReview && !isCompleted && (
          <button
            onClick={onStart}
            className="btn btn-primary w-full text-lg py-4"
          >
            🚀 Start This Quest
          </button>
        )}

        {/* In progress - mark done */}
        {isActive && onMarkDone && (
          <>
            <button
              onClick={onMarkDone}
              className="btn btn-primary w-full text-lg py-4"
            >
              ✅ I Did It!
            </button>
            {onAbandon && (
              <button
                onClick={onAbandon}
                className="btn btn-outline w-full text-stone-500"
              >
                Give Up
              </button>
            )}
          </>
        )}

        {/* Pending review - approve/reject */}
        {isPendingReview && (onApprove || onReject) && (
          <div className="space-y-3">
            <div className="bg-violet-50 rounded-xl p-4 text-center border border-violet-200">
              <p className="text-violet-600">
                Waiting for parent approval...
              </p>
            </div>
            {onApprove && (
              <button
                onClick={onApprove}
                className="btn w-full text-lg py-4 bg-emerald-500 text-white hover:bg-emerald-600"
              >
                ✅ Approve
              </button>
            )}
            {onReject && (
              <button
                onClick={onReject}
                className="btn btn-outline w-full"
              >
                ↩️ Try Again
              </button>
            )}
          </div>
        )}

        {/* Completed */}
        {isCompleted && !isActive && !isPendingReview && (
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-200">
            <span className="text-3xl">🏆</span>
            <p className="text-emerald-700 font-semibold mt-2">
              Quest Completed!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
