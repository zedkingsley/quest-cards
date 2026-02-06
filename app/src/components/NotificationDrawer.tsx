'use client';

import { QuestWithDetails, RedemptionWithDetails } from '@/lib/types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pendingApprovals: QuestWithDetails[];
  pendingRedemptions: RedemptionWithDetails[];
  onApproveQuest: (questId: string) => void;
  onRejectQuest: (questId: string) => void;
  onFulfillReward: (redemptionId: string) => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  pendingApprovals,
  pendingRedemptions,
  onApproveQuest,
  onRejectQuest,
  onFulfillReward,
}: NotificationDrawerProps) {
  const totalCount = pendingApprovals.length + pendingRedemptions.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 animate-slide-in-right overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Family Tasks</h2>
            <p className="text-violet-200 text-sm">
              {totalCount === 0 ? 'All caught up!' : `${totalCount} item${totalCount !== 1 ? 's' : ''} need attention`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Empty State */}
          {totalCount === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-stone-700 mb-2">You're all caught up!</h3>
              <p className="text-stone-500">No quests to approve or rewards to fulfill.</p>
            </div>
          )}

          {/* Quest Approvals */}
          {pendingApprovals.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>🎯</span> Quests to Approve
              </h3>
              <div className="space-y-3">
                {pendingApprovals.map((quest) => (
                  <div
                    key={quest.id}
                    className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{quest.challenge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800">{quest.challenge.title}</p>
                        <p className="text-sm text-stone-500">
                          {quest.recipient.avatar} {quest.recipient.name} completed this
                        </p>
                        <p className="text-amber-600 font-semibold text-sm mt-1">
                          🎁 {quest.reward} pts
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveQuest(quest.id)}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => onRejectQuest(quest.id)}
                        className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold rounded-xl transition-colors"
                      >
                        ↩ Redo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reward Fulfillments */}
          {pendingRedemptions.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>🎁</span> Rewards to Fulfill
              </h3>
              <div className="space-y-3">
                {pendingRedemptions.map((redemption) => (
                  <div
                    key={redemption.id}
                    className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{redemption.reward.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800">{redemption.reward.name}</p>
                        <p className="text-sm text-stone-500">
                          {redemption.claimer.avatar} {redemption.claimer.name} redeemed this
                        </p>
                        <p className="text-violet-600 font-semibold text-sm mt-1">
                          Spent {redemption.pointsSpent} pts
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onFulfillReward(redemption.id)}
                      className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      ✓ Mark Fulfilled
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer hint */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-stone-400 text-sm">
            Swipe or tap outside to close
          </p>
        </div>
      </div>
    </>
  );
}
