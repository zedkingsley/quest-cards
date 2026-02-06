'use client';

import { FamilyMember, Reward } from '@/lib/types';

interface RewardGroup {
  owner: FamilyMember;
  rewards: Reward[];
}

interface RewardShopProps {
  viewer: FamilyMember;
  rewardGroups: RewardGroup[];
  onRedeem: (rewardId: string) => void;
}

export function RewardShop({ viewer, rewardGroups, onRedeem }: RewardShopProps) {
  return (
    <div className="space-y-6">
      {/* Points balance */}
      <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl p-6 text-center border-2 border-amber-200">
        <p className="text-amber-600 font-semibold mb-1">Your Points</p>
        <div className="text-4xl font-bold text-amber-700 flex items-center justify-center gap-2">
          <span>⭐</span>
          <span>{viewer.pointsBalance}</span>
        </div>
      </div>

      {/* Reward groups by owner */}
      {rewardGroups.length > 0 ? (
        rewardGroups.map((group) => (
          <div key={group.owner.id}>
            <h3 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
              <span className="text-xl">{group.owner.avatar}</span>
              {group.owner.name}'s Rewards
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {group.rewards.map((reward) => {
                const canAfford = viewer.pointsBalance >= reward.pointCost;
                return (
                  <div
                    key={reward.id}
                    className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                      canAfford
                        ? 'border-stone-100 hover:border-amber-300'
                        : 'border-stone-100 opacity-60'
                    }`}
                  >
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    <h4 className="font-semibold text-stone-800 text-sm mb-1">
                      {reward.name}
                    </h4>
                    {reward.description && (
                      <p className="text-xs text-stone-500 mb-2 line-clamp-2">
                        {reward.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-amber-600 font-bold text-sm">
                        {reward.pointCost} pts
                      </span>
                      {canAfford ? (
                        <button
                          onClick={() => onRedeem(reward.id)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-all active:scale-95"
                        >
                          Redeem
                        </button>
                      ) : (
                        <span className="text-xs text-stone-400">
                          Need {reward.pointCost - viewer.pointsBalance} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-stone-50 rounded-3xl">
          <div className="text-5xl mb-3">🎁</div>
          <h3 className="font-bold text-lg text-stone-700 mb-2">No rewards available</h3>
          <p className="text-stone-500">
            Ask a parent to set up rewards!
          </p>
        </div>
      )}
    </div>
  );
}
