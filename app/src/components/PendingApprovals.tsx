'use client';

import { QuestWithDetails } from '@/lib/types';

interface PendingApprovalsProps {
  quests: QuestWithDetails[];
  onApprove: (questId: string) => void;
  onReject: (questId: string) => void;
}

export function PendingApprovals({ quests, onApprove, onReject }: PendingApprovalsProps) {
  if (quests.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-amber-500 text-white rounded-full text-sm flex items-center justify-center">
          {quests.length}
        </span>
        Needs Your Approval
      </h2>
      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{quest.challenge.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-800">{quest.challenge.title}</p>
                <p className="text-sm text-stone-600">
                  {quest.recipient.avatar} {quest.recipient.name} completed this
                </p>
                <p className="text-amber-700 font-semibold text-sm mt-1">
                  🎁 {quest.reward} points
                  {quest.customRewardText && ` + "${quest.customRewardText}"`}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onReject(quest.id)}
                className="flex-1 py-2 px-4 bg-white border-2 border-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-50 transition-all"
              >
                ↩️ Try Again
              </button>
              <button
                onClick={() => onApprove(quest.id)}
                className="flex-1 py-2 px-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all"
              >
                ✅ Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
