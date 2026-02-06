'use client';

import { useState, useEffect, useCallback } from 'react';
import { FamilyMember, Pack, Challenge, QuestWithDetails, MemberRole, Quest } from '@/lib/types';
import { PACKS } from '@/lib/packs';
import {
  getFamily,
  verifyPin,
  getMembers,
  addMember,
  removeMember,
  getActiveQuest,
  getQueuedQuests,
  getCompletedQuests,
  getMemberStats,
  startPackQuest,
  issueChallenge,
  submitQuest,
  approveQuest,
  rejectQuest,
  abandonQuest,
  hasCompletedChallenge,
  getQuestWithDetails,
  getPendingApprovals,
  getRewardsOwnedBy,
  getRewardsAvailableTo,
  addReward,
  updateReward,
  deleteReward,
  redeemReward,
  getPendingRedemptions,
  fulfillRedemption,
  resetAllData,
  initializeDemoData,
} from '@/lib/storage';
import { Navigation, Tab } from '@/components/Navigation';
import { ChallengeCard } from '@/components/ChallengeCard';
import { PackCard } from '@/components/PackCard';
import { Modal } from '@/components/Modal';
import { ChallengeDetail } from '@/components/ChallengeDetail';
import { AddMember } from '@/components/AddMember';
import { ActiveQuest } from '@/components/ActiveQuest';
import { PinPad } from '@/components/PinPad';
import { IssueChallenge } from '@/components/IssueChallenge';
import { RewardShop } from '@/components/RewardShop';
import { ManageRewards } from '@/components/ManageRewards';
import { PendingApprovals } from '@/components/PendingApprovals';
import { MemberPickerModal } from '@/components/MemberPickerModal';
import { ChildPickerModal } from '@/components/ChildPickerModal';
import { ApprovalHandoff } from '@/components/ApprovalHandoff';

export default function Home() {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  
  // Modal state
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [pinAction, setPinAction] = useState<(() => void) | null>(null);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [showIssueChallenge, setShowIssueChallenge] = useState(false);
  const [showManageRewards, setShowManageRewards] = useState(false);
  const [showChildPicker, setShowChildPicker] = useState(false);
  const [showApprovalHandoff, setShowApprovalHandoff] = useState(false);
  const [pendingHandoffQuest, setPendingHandoffQuest] = useState<Quest | null>(null);
  const [pendingAssignment, setPendingAssignment] = useState<{ pack: Pack; challenge: Challenge } | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<{
    challenge: Challenge;
    pack: Pack;
    isActive?: boolean;
    isPending?: boolean;
    isCompleted?: boolean;
    isQueued?: boolean;
    questId?: string;
  } | null>(null);
  
  // Derived state
  const currentMember = members.find(m => m.id === currentMemberId);
  const isParent = currentMember?.role === 'parent';
  const children = members.filter(m => m.role === 'child');
  const parents = members.filter(m => m.role === 'parent');
  
  const activeQuest = currentMemberId ? getActiveQuest(currentMemberId) : null;
  const activeQuestDetails = activeQuest ? getQuestWithDetails(activeQuest) : null;
  const queuedQuests = currentMemberId ? getQueuedQuests(currentMemberId) : [];
  const queuedQuestsDetails = queuedQuests
    .map(q => getQuestWithDetails(q))
    .filter((q): q is QuestWithDetails => q !== null);
  const memberStats = currentMemberId ? getMemberStats(currentMemberId) : null;
  
  // Parent-specific data
  const pendingApprovals = isParent && currentMemberId
    ? getPendingApprovals(currentMemberId).map(q => getQuestWithDetails(q)).filter((q): q is QuestWithDetails => q !== null)
    : [];
  const pendingRedemptions = isParent && currentMemberId
    ? getPendingRedemptions(currentMemberId)
    : [];
  const myRewards = isParent && currentMemberId
    ? getRewardsOwnedBy(currentMemberId)
    : [];
  
  // Child-specific data
  const availableRewards = !isParent && currentMemberId
    ? getRewardsAvailableTo(currentMemberId)
    : [];

  // Initialize on mount
  useEffect(() => {
    const family = getFamily();
    if (!family) {
      initializeDemoData();
    }
    
    const loadedMembers = getMembers();
    setMembers(loadedMembers);
    
    if (loadedMembers.length > 0) {
      setCurrentMemberId(loadedMembers[0].id);
    }
    
    setIsLoading(false);
  }, []);

  // Refresh state helper
  const refreshState = useCallback(() => {
    setMembers(getMembers());
  }, []);

  // Switch member and go home (F7)
  const handleMemberSwitch = (memberId: string) => {
    setCurrentMemberId(memberId);
    setActiveTab('home');
  };

  // PIN verification wrapper
  const requirePin = (action: () => void) => {
    const family = getFamily();
    if (family?.settings.requirePinForApproval) {
      setPinAction(() => action);
      setShowPinPad(true);
      setPinError(false);
    } else {
      action();
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (verifyPin(pin)) {
      setShowPinPad(false);
      setPinError(false);
      if (pinAction) {
        pinAction();
        setPinAction(null);
      }
    } else {
      setPinError(true);
    }
  };

  // Handlers
  const handleAddMember = (name: string, avatar: string, role: MemberRole) => {
    const newMember = addMember(name, avatar, role);
    refreshState();
    if (!currentMemberId) {
      setCurrentMemberId(newMember.id);
    }
    setShowAddMember(false);
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Remove this family member? Their progress will be deleted.')) {
      removeMember(memberId);
      refreshState();
      if (currentMemberId === memberId) {
        const remaining = getMembers();
        setCurrentMemberId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  // Anyone starts/queues quest for themselves
  const handleStartForSelf = () => {
    if (!currentMemberId || !selectedChallenge) return;
    
    // For parents starting for themselves, they are the issuer
    // For kids, use the first parent as issuer
    const issuerId = isParent ? currentMemberId : parents[0]?.id;
    if (!issuerId) return;
    
    startPackQuest(
      currentMemberId,
      issuerId,
      selectedChallenge.pack.slug,
      selectedChallenge.challenge.slug
    );
    setSelectedChallenge(null);
    refreshState();
  };

  // Parent assigns quest to specific child
  const handleAssignToChild = (childId: string) => {
    if (!currentMemberId || !pendingAssignment || !isParent) return;
    
    startPackQuest(
      childId,
      currentMemberId,
      pendingAssignment.pack.slug,
      pendingAssignment.challenge.slug
    );
    setPendingAssignment(null);
    setSelectedChallenge(null);
    refreshState();
  };

  const handleIssueChallenge = (
    recipientId: string,
    title: string,
    description: string,
    icon: string,
    reward: number,
    customRewardText?: string
  ) => {
    if (!currentMemberId) return;
    issueChallenge(recipientId, currentMemberId, title, description, icon, reward, customRewardText);
    setShowIssueChallenge(false);
    refreshState();
  };

  // Kid marks quest done (F9: shows handoff modal)
  const handleMarkDone = () => {
    if (!activeQuest) return;
    submitQuest(activeQuest.id);
    refreshState();
    
    // Show handoff modal for kids
    if (!isParent) {
      setPendingHandoffQuest(activeQuest);
      setShowApprovalHandoff(true);
    }
    setSelectedChallenge(null);
  };

  // Immediate approval from handoff modal (F9)
  const handleHandoffApprove = (pin: string): boolean => {
    if (!verifyPin(pin) || !pendingHandoffQuest) return false;
    
    approveQuest(pendingHandoffQuest.id);
    setShowApprovalHandoff(false);
    setPendingHandoffQuest(null);
    refreshState();
    return true;
  };

  const handleApprove = (questId: string) => {
    requirePin(() => {
      approveQuest(questId);
      refreshState();
    });
  };

  const handleReject = (questId: string) => {
    rejectQuest(questId, 'Keep trying!');
    refreshState();
  };

  const handleAbandon = () => {
    if (!activeQuest) return;
    if (confirm('Give up on this quest?')) {
      abandonQuest(activeQuest.id);
      setSelectedChallenge(null);
      refreshState();
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    if (!currentMemberId) return;
    if (confirm('Redeem this reward?')) {
      redeemReward(rewardId, currentMemberId);
      refreshState();
    }
  };

  const handleFulfillRedemption = (redemptionId: string) => {
    requirePin(() => {
      fulfillRedemption(redemptionId);
      refreshState();
    });
  };

  const handleAddReward = (name: string, pointCost: number, icon: string, description?: string, availableTo?: string[]) => {
    if (!currentMemberId) return;
    addReward(currentMemberId, name, pointCost, icon, description, availableTo || []);
    refreshState();
  };

  const handleResetData = () => {
    if (confirm('Reset all data? This cannot be undone!')) {
      resetAllData();
      window.location.reload();
    }
  };

  const openChallengeDetail = (challenge: Challenge, pack: Pack) => {
    if (!currentMemberId) return;
    
    const isCompleted = hasCompletedChallenge(currentMemberId, pack.slug, challenge.slug);
    const isActive = activeQuest?.packSlug === pack.slug && activeQuest?.challengeSlug === challenge.slug;
    const isPending = isActive && activeQuest?.status === 'pending_review';
    const isQueued = queuedQuests.some(q => q.packSlug === pack.slug && q.challengeSlug === challenge.slug);
    
    setSelectedChallenge({
      challenge,
      pack,
      isActive: isActive && !isPending,
      isPending,
      isCompleted: isCompleted && !isActive,
      isQueued,
      questId: isActive ? activeQuest?.id : undefined,
    });
  };

  const getPackCompletedCount = (pack: Pack): number => {
    if (!currentMemberId) return 0;
    return pack.challenges.filter(c => 
      hasCompletedChallenge(currentMemberId, pack.slug, c.slug)
    ).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">⭐</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-amber-500 text-white px-4 py-4 shadow-lg z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* F6: Logo → Home */}
          <button 
            onClick={() => setActiveTab('home')}
            className="text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span>⭐</span> Quest Cards
          </button>
          {currentMember && (
            <button 
              onClick={() => setShowMemberPicker(true)}
              className="flex items-center gap-2 bg-white/20 rounded-full pl-1 pr-3 py-1 hover:bg-white/30 transition-all"
            >
              <span className="text-2xl">{currentMember.avatar}</span>
              <div className="text-left">
                <div className="font-semibold text-sm leading-tight">{currentMember.name}</div>
                {/* F10: Points → Shop */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('shop');
                  }}
                  className="text-amber-200 text-xs hover:text-white transition-colors"
                >
                  ⭐{currentMember.pointsBalance}
                </button>
              </div>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {currentMember && (
              <>
                {/* Pending Approvals (for parents) */}
                {isParent && pendingApprovals.length > 0 && (
                  <PendingApprovals
                    quests={pendingApprovals}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                )}

                {/* Pending Redemptions (for parents) */}
                {isParent && pendingRedemptions.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-stone-700 mb-3">
                      Rewards to Fulfill
                    </h2>
                    <div className="space-y-2">
                      {pendingRedemptions.map((r) => (
                        <div key={r.id} className="flex items-center gap-3 bg-violet-50 rounded-xl p-4 border border-violet-200">
                          <span className="text-2xl">{r.reward.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-700">{r.reward.name}</p>
                            <p className="text-sm text-stone-500">
                              {r.claimer.avatar} {r.claimer.name} redeemed {r.pointsSpent} pts
                            </p>
                          </div>
                          <button
                            onClick={() => handleFulfillRedemption(r.id)}
                            className="px-3 py-2 bg-violet-500 text-white text-sm font-semibold rounded-lg"
                          >
                            ✓ Done
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* F8: Current Quest - Expanded */}
                {activeQuestDetails ? (
                  <section>
                    <h2 className="text-lg font-bold text-stone-700 mb-3">
                      {activeQuestDetails.status === 'pending_review' ? '⏳ Awaiting Approval' : '🎯 Current Quest'}
                    </h2>
                    <div 
                      onClick={() => {
                        // Create a synthetic pack for custom challenges
                        const pack = activeQuestDetails.pack || {
                          slug: 'custom',
                          name: 'Custom Challenge',
                          icon: '⭐',
                          description: '',
                          category: 'custom' as const,
                          challenges: [],
                          isBuiltIn: false,
                        };
                        const challenge: Challenge = {
                          slug: activeQuestDetails.id,
                          title: activeQuestDetails.challenge.title,
                          description: activeQuestDetails.challenge.description,
                          icon: activeQuestDetails.challenge.icon,
                          difficulty: 'slug' in activeQuestDetails.challenge ? activeQuestDetails.challenge.difficulty : 'medium',
                          reward: activeQuestDetails.reward,
                          time_estimate: 'slug' in activeQuestDetails.challenge ? activeQuestDetails.challenge.time_estimate : '',
                        };
                        
                        const isPending = activeQuestDetails.status === 'pending_review';
                        setSelectedChallenge({
                          challenge,
                          pack,
                          isActive: !isPending,
                          isPending,
                          isCompleted: false,
                          isQueued: false,
                          questId: activeQuestDetails.id,
                        });
                      }}
                      className={`rounded-3xl p-5 cursor-pointer transition-all ${
                        activeQuestDetails.status === 'pending_review'
                          ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300'
                          : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-5xl">{activeQuestDetails.challenge.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-stone-800 mb-1">
                            {activeQuestDetails.challenge.title}
                          </h3>
                          <p className="text-stone-600 text-sm mb-2">
                            {activeQuestDetails.challenge.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              activeQuestDetails.status === 'pending_review'
                                ? 'bg-violet-200 text-violet-700'
                                : 'bg-amber-200 text-amber-700'
                            }`}>
                              {activeQuestDetails.status === 'pending_review' ? 'Waiting for approval' : 'In progress'}
                            </span>
                            <span className="text-amber-600 font-bold">
                              🎁 {activeQuestDetails.reward} pts
                            </span>
                          </div>
                        </div>
                      </div>
                      {activeQuestDetails.status === 'active' && (
                        <p className="text-center text-amber-600 text-sm mt-3">
                          Tap to mark done or see details →
                        </p>
                      )}
                    </div>
                  </section>
                ) : (
                  <section className="text-center py-8 bg-stone-50 rounded-3xl">
                    <div className="text-5xl mb-3">🗺️</div>
                    <h3 className="font-bold text-lg text-stone-700 mb-2">No active quest!</h3>
                    <p className="text-stone-500 mb-4">
                      {isParent ? 'Issue a challenge or browse packs to assign.' : 'Pick a quest from the Quests tab!'}
                    </p>
                    <button
                      onClick={() => setActiveTab('challenges')}
                      className="btn btn-primary"
                    >
                      Browse Quests
                    </button>
                  </section>
                )}

                {/* F8: Queued Quests (F14: clickable) */}
                {queuedQuestsDetails.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-stone-700 mb-3">
                      📋 Up Next ({queuedQuestsDetails.length})
                    </h2>
                    <div className="space-y-2">
                      {queuedQuestsDetails.map((quest) => (
                        <button
                          key={quest.id}
                          onClick={() => {
                            const pack = quest.pack || {
                              slug: 'custom',
                              name: 'Custom Challenge',
                              icon: '⭐',
                              description: '',
                              category: 'custom' as const,
                              challenges: [],
                              isBuiltIn: false,
                            };
                            const challenge: Challenge = {
                              slug: quest.id,
                              title: quest.challenge.title,
                              description: quest.challenge.description,
                              icon: quest.challenge.icon,
                              difficulty: 'slug' in quest.challenge ? quest.challenge.difficulty : 'medium',
                              reward: quest.reward,
                              time_estimate: 'slug' in quest.challenge ? quest.challenge.time_estimate : '',
                            };
                            setSelectedChallenge({
                              challenge,
                              pack,
                              isActive: false,
                              isPending: false,
                              isCompleted: false,
                              isQueued: true,
                              questId: quest.id,
                            });
                          }}
                          className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-stone-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-left"
                        >
                          <span className="text-2xl">{quest.challenge.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-700">{quest.challenge.title}</p>
                            <p className="text-xs text-stone-400">{quest.pack?.name || 'Custom'}</p>
                          </div>
                          <span className="text-amber-500 font-bold text-sm">{quest.reward} ⭐</span>
                          <span className="text-stone-300">→</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* Quick Stats */}
                {memberStats && (
                  <section className="grid grid-cols-2 gap-4">
                    {/* F10: Points → Shop */}
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="bg-amber-50 rounded-2xl p-4 text-center border-2 border-amber-100 hover:border-amber-300 transition-colors"
                    >
                      <div className="text-3xl font-bold text-amber-600">⭐ {memberStats.pointsBalance}</div>
                      <div className="text-sm text-amber-600">Points</div>
                    </button>
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center border-2 border-emerald-100">
                      <div className="text-3xl font-bold text-emerald-600">{memberStats.completedCount}</div>
                      <div className="text-sm text-emerald-600">Quests Done</div>
                    </div>
                  </section>
                )}

                {/* Recent Completions */}
                {memberStats && memberStats.recentCompletions.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-stone-700 mb-3">Recent Wins 🎉</h2>
                    <div className="space-y-2">
                      {memberStats.recentCompletions.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-stone-100">
                          <span className="text-2xl">{c.challenge.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-700">{c.challenge.title}</p>
                            <p className="text-xs text-stone-400">{c.pack?.name || 'Custom Challenge'}</p>
                          </div>
                          <span className="text-amber-500 font-bold">+{c.reward} ⭐</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* CHALLENGES TAB */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Issue Challenge button (parents only) */}
            {isParent && (
              <button
                onClick={() => setShowIssueChallenge(true)}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98"
              >
                🎯 Issue Custom Challenge
              </button>
            )}

            {selectedPack ? (
              <>
                <button
                  onClick={() => setSelectedPack(null)}
                  className="flex items-center gap-2 text-stone-500 hover:text-stone-700 tap-target"
                >
                  <span>←</span>
                  <span>Back to Packs</span>
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="emoji-icon-lg">{selectedPack.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-stone-800">{selectedPack.name}</h2>
                    <p className="text-stone-500">{selectedPack.challenges.length} quests</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPack.challenges.map((challenge) => {
                    const isQueued = queuedQuests.some(q => 
                      q.packSlug === selectedPack.slug && q.challengeSlug === challenge.slug
                    );
                    return (
                      <ChallengeCard
                        key={challenge.slug}
                        challenge={challenge}
                        packIcon={selectedPack.icon}
                        completed={currentMemberId ? hasCompletedChallenge(currentMemberId, selectedPack.slug, challenge.slug) : false}
                        isActive={activeQuest?.packSlug === selectedPack.slug && activeQuest?.challengeSlug === challenge.slug}
                        isQueued={isQueued}
                        onClick={() => openChallengeDetail(challenge, selectedPack)}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-stone-800">Quest Packs</h2>
                <p className="text-stone-500">
                  {isParent ? 'Browse packs to assign quests, or issue a custom challenge above.' : 'Pick a quest to start your adventure!'}
                </p>
                
                <div className="space-y-4">
                  {PACKS.map((pack) => (
                    <PackCard
                      key={pack.slug}
                      pack={pack}
                      completedCount={getPackCompletedCount(pack)}
                      onClick={() => setSelectedPack(pack)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && currentMember && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-800">Reward Shop</h2>
              {isParent && (
                <button
                  onClick={() => setShowManageRewards(true)}
                  className="px-4 py-2 bg-violet-100 text-violet-700 font-semibold rounded-xl hover:bg-violet-200 transition-all"
                >
                  ⚙️ Manage
                </button>
              )}
            </div>
            
            {isParent ? (
              <div className="space-y-4">
                <p className="text-stone-500">
                  Manage your reward shop. Switch to a child (tap your avatar) to see their shop view.
                </p>
                <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200">
                  <p className="font-semibold text-violet-700 mb-2">Your Rewards</p>
                  <p className="text-violet-600">{myRewards.filter(r => r.active).length} active rewards</p>
                  <button
                    onClick={() => setShowManageRewards(true)}
                    className="mt-3 btn btn-primary w-full"
                  >
                    Edit My Rewards
                  </button>
                </div>
              </div>
            ) : (
              <RewardShop
                viewer={currentMember}
                rewardGroups={availableRewards}
                onRedeem={handleRedeemReward}
              />
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-800">Settings</h2>
            
            <section className="bg-white rounded-2xl p-4 border border-stone-100">
              <h3 className="font-bold text-stone-700 mb-3">Family</h3>
              <p className="text-stone-600">{getFamily()?.name || 'My Family'}</p>
              <p className="text-sm text-stone-400 mt-1">
                PIN: {getFamily()?.pin || '1234'}
              </p>
            </section>

            <section className="bg-white rounded-2xl p-4 border border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-stone-700">Family Members</h3>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg"
                >
                  + Add
                </button>
              </div>
              
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-stone-50"
                  >
                    <span className="text-2xl">{member.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-700">{member.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          member.role === 'parent' 
                            ? 'bg-violet-100 text-violet-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      <span className="text-sm text-amber-600">⭐ {member.pointsBalance}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-4 border border-stone-100">
              <h3 className="font-bold text-stone-700 mb-3">Points</h3>
              <p className="text-stone-600">
                Exchange rate: {getFamily()?.settings.pointsPerDollar || 10} points = $1
              </p>
            </section>

            <section className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <h3 className="font-bold text-red-700 mb-3">Danger Zone</h3>
              <button
                onClick={handleResetData}
                className="btn w-full bg-red-500 text-white hover:bg-red-600"
              >
                🗑️ Reset All Data
              </button>
              <p className="text-red-400 text-xs mt-2 text-center">
                This will delete all family members and progress
              </p>
            </section>

            <section className="text-center text-stone-400 text-sm">
              <p>Quest Cards v0.3.0</p>
              <p>Family Challenge Mode</p>
              <p className="mt-1">Built with ❤️ for adventurous families</p>
            </section>
          </div>
        )}
      </main>

      {/* F13: Floating Action Button - Add Quest (shows on home when has active quest) */}
      {activeTab === 'home' && activeQuest && (
        <button
          onClick={() => setActiveTab('challenges')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center text-2xl z-20"
          aria-label="Add more quests"
        >
          +
        </button>
      )}

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        pendingCount={pendingApprovals.length + pendingRedemptions.length}
      />

      {/* Member Picker Modal (F7: switches and goes home) */}
      <MemberPickerModal
        isOpen={showMemberPicker}
        onClose={() => setShowMemberPicker(false)}
        members={members}
        currentMemberId={currentMemberId}
        onSelect={handleMemberSwitch}
      />

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Add Family Member"
      >
        <AddMember
          onAdd={handleAddMember}
          onCancel={() => setShowAddMember(false)}
        />
      </Modal>

      {/* PIN Pad Modal */}
      <Modal
        isOpen={showPinPad}
        onClose={() => {
          setShowPinPad(false);
          setPinAction(null);
        }}
      >
        <PinPad
          onSubmit={handlePinSubmit}
          onCancel={() => {
            setShowPinPad(false);
            setPinAction(null);
          }}
          error={pinError}
        />
      </Modal>

      {/* F9: Approval Handoff Modal */}
      <Modal
        isOpen={showApprovalHandoff}
        onClose={() => {
          setShowApprovalHandoff(false);
          setPendingHandoffQuest(null);
        }}
      >
        {pendingHandoffQuest && currentMember && (
          <ApprovalHandoff
            childName={currentMember.name}
            questTitle={
              activeQuestDetails?.challenge?.title || 
              pendingHandoffQuest.customChallenge?.title || 
              'Quest'
            }
            onApproveNow={handleHandoffApprove}
            onLater={() => {
              setShowApprovalHandoff(false);
              setPendingHandoffQuest(null);
            }}
          />
        )}
      </Modal>

      {/* Issue Challenge Modal */}
      <Modal
        isOpen={showIssueChallenge}
        onClose={() => setShowIssueChallenge(false)}
        title="Issue a Challenge"
      >
        {currentMember && (
          <IssueChallenge
            issuer={currentMember}
            recipients={members.filter(m => m.id !== currentMemberId)}
            onIssue={handleIssueChallenge}
            onCancel={() => setShowIssueChallenge(false)}
          />
        )}
      </Modal>

      {/* Child Picker Modal */}
      <ChildPickerModal
        isOpen={showChildPicker}
        onClose={() => {
          setShowChildPicker(false);
          setPendingAssignment(null);
        }}
        children={children}
        title="Assign Quest To"
        subtitle={pendingAssignment ? `"${pendingAssignment.challenge.title}" for ${pendingAssignment.challenge.reward} pts` : undefined}
        onSelect={handleAssignToChild}
      />

      {/* Manage Rewards Modal */}
      <Modal
        isOpen={showManageRewards}
        onClose={() => setShowManageRewards(false)}
      >
        {currentMember && isParent && (
          <ManageRewards
            owner={currentMember}
            rewards={myRewards}
            familyMembers={members}
            onAddReward={handleAddReward}
            onUpdateReward={(id, updates) => {
              updateReward(id, updates);
              refreshState();
            }}
            onDeleteReward={(id) => {
              deleteReward(id);
              refreshState();
            }}
            onClose={() => setShowManageRewards(false)}
          />
        )}
      </Modal>

      {/* Challenge Detail Modal */}
      <Modal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
      >
        {selectedChallenge && (
          <ChallengeDetail
            challenge={selectedChallenge.challenge}
            packName={selectedChallenge.pack.name}
            packIcon={selectedChallenge.pack.icon}
            isActive={selectedChallenge.isActive}
            isPendingReview={selectedChallenge.isPending}
            isCompleted={selectedChallenge.isCompleted}
            isQueued={selectedChallenge.isQueued}
            isParent={isParent}
            hasActiveQuest={!!activeQuest}
            hasChildren={children.length > 0}
            onStartForSelf={handleStartForSelf}
            onAssignTo={isParent ? () => {
              setPendingAssignment({ pack: selectedChallenge.pack, challenge: selectedChallenge.challenge });
              setShowChildPicker(true);
            } : undefined}
            onMarkDone={selectedChallenge.isActive ? handleMarkDone : undefined}
            onApprove={selectedChallenge.isPending && isParent ? () => handleApprove(selectedChallenge.questId!) : undefined}
            onReject={selectedChallenge.isPending && isParent ? () => handleReject(selectedChallenge.questId!) : undefined}
            onAbandon={selectedChallenge.isActive ? handleAbandon : undefined}
          />
        )}
      </Modal>
    </div>
  );
}
