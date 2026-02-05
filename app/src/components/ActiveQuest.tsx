'use client';

import { ChallengeWithDetails } from '@/lib/types';

interface ActiveQuestProps {
  quest: ChallengeWithDetails;
  onClick: () => void;
}

export function ActiveQuest({ quest, onClick }: ActiveQuestProps) {
  const isPending = quest.status === 'pending_review';
  
  return (
    <button
      onClick={onClick}
      className={`quest-card w-full text-left rounded-3xl p-6 shadow-lg tap-target ${
        isPending 
          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300'
          : 'bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-300'
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="emoji-icon-lg">{quest.challenge.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              isPending ? 'status-pending' : 'status-active'
            }`}>
              {isPending ? '⏳ WAITING FOR REVIEW' : '🎯 ACTIVE QUEST'}
            </span>
          </div>
          <h3 className="font-bold text-xl text-stone-800">{quest.challenge.title}</h3>
          <p className="text-stone-500 text-sm">{quest.pack.icon} {quest.pack.name}</p>
        </div>
      </div>
      
      <p className="text-stone-600 text-sm mb-4">{quest.challenge.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
            🎁 {quest.customReward || quest.challenge.reward_value}
          </span>
        </div>
        <span className={`font-semibold ${isPending ? 'text-amber-600' : 'text-violet-600'}`}>
          {isPending ? 'Tap to review →' : 'Tap to update →'}
        </span>
      </div>
    </button>
  );
}
