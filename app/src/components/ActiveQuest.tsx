'use client';

import { Challenge, Pack, QuestWithDetails } from '@/lib/types';

interface ActiveQuestProps {
  quest: QuestWithDetails & { challenge: Challenge; pack: Pack };
  onClick?: () => void;
}

export function ActiveQuest({ quest, onClick }: ActiveQuestProps) {
  const isPending = quest.status === 'pending_review';
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl transition-all tap-target ${
        isPending
          ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300'
          : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="text-4xl">{quest.challenge.icon}</span>
          <span className="absolute -bottom-1 -right-1 text-xl">
            {isPending ? '⏳' : '🎯'}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              isPending 
                ? 'bg-violet-200 text-violet-700'
                : 'bg-amber-200 text-amber-700'
            }`}>
              {isPending ? 'Waiting for approval' : 'In progress'}
            </span>
          </div>
          <h3 className={`font-bold text-lg ${
            isPending ? 'text-violet-800' : 'text-amber-800'
          }`}>
            {quest.challenge.title}
          </h3>
          <p className={`text-sm ${
            isPending ? 'text-violet-600' : 'text-amber-600'
          }`}>
            {quest.pack.icon} {quest.pack.name}
          </p>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            isPending ? 'text-violet-600' : 'text-amber-600'
          }`}>
            {quest.reward} ⭐
          </div>
          {quest.customRewardText && (
            <div className="text-xs text-stone-500 max-w-[100px] truncate">
              +{quest.customRewardText}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress indicator - pulse animation for active */}
      <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${
        isPending ? 'bg-violet-200' : 'bg-amber-200'
      }`}>
        <div 
          className={`h-full rounded-full ${
            isPending 
              ? 'bg-violet-500 w-full' 
              : 'bg-amber-500 w-1/2 animate-pulse'
          }`}
        />
      </div>
      
      <p className={`mt-2 text-sm text-center ${
        isPending ? 'text-violet-600' : 'text-amber-600'
      }`}>
        {isPending ? 'Great job! Wait for a parent to approve.' : 'Tap to mark done or see details'}
      </p>
    </button>
  );
}
