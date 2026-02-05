'use client';

import { useState, useEffect } from 'react';
import { Kid, Pack, Challenge, ChallengeWithDetails } from '@/lib/types';
import { PACKS } from '@/lib/packs';
import {
  getFamily,
  createFamily,
  getKids,
  addKid,
  removeKid,
  getActiveChallenge,
  getCompletedChallenges,
  getKidStats,
  startChallenge,
  submitChallenge,
  approveChallenge,
  rejectChallenge,
  abandonChallenge,
  hasCompletedChallenge,
  resetAllData,
} from '@/lib/storage';
import { Navigation } from '@/components/Navigation';
import { KidSelector } from '@/components/KidSelector';
import { ChallengeCard } from '@/components/ChallengeCard';
import { PackCard } from '@/components/PackCard';
import { Modal } from '@/components/Modal';
import { ChallengeDetail } from '@/components/ChallengeDetail';
import { AddKid } from '@/components/AddKid';
import { ActiveQuest } from '@/components/ActiveQuest';

type Tab = 'home' | 'packs' | 'trophy' | 'settings';

export default function Home() {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);
  
  // Modal state
  const [showAddKid, setShowAddKid] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<{
    challenge: Challenge;
    pack: Pack;
    isActive?: boolean;
    isPending?: boolean;
    isCompleted?: boolean;
    kidChallengeId?: string;
    customReward?: string;
  } | null>(null);
  
  // Derived state
  const selectedKid = kids.find(k => k.id === selectedKidId);
  const activeQuest = selectedKidId ? getActiveChallenge(selectedKidId) : null;
  const completedChallenges = selectedKidId ? getCompletedChallenges(selectedKidId) : [];
  const kidStats = selectedKidId ? getKidStats(selectedKidId) : null;

  // Initialize on mount
  useEffect(() => {
    // Ensure family exists
    if (!getFamily()) {
      createFamily('Our Family');
    }
    
    // Load kids
    const loadedKids = getKids();
    setKids(loadedKids);
    
    // Select first kid if available
    if (loadedKids.length > 0) {
      setSelectedKidId(loadedKids[0].id);
    }
    
    setIsLoading(false);
  }, []);

  // Refresh state helper
  const refreshState = () => {
    setKids(getKids());
  };

  // Handlers
  const handleAddKid = (name: string, avatar: string) => {
    const newKid = addKid(name, avatar);
    refreshState();
    setSelectedKidId(newKid.id);
    setShowAddKid(false);
  };

  const handleRemoveKid = (kidId: string) => {
    if (confirm('Remove this kid? Their progress will be deleted.')) {
      removeKid(kidId);
      refreshState();
      if (selectedKidId === kidId) {
        const remaining = getKids();
        setSelectedKidId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const handleStartChallenge = () => {
    if (!selectedKidId || !selectedChallenge) return;
    startChallenge(
      selectedKidId,
      selectedChallenge.pack.slug,
      selectedChallenge.challenge.slug
    );
    setSelectedChallenge(null);
    refreshState();
  };

  const handleMarkDone = () => {
    if (!activeQuest) return;
    submitChallenge(activeQuest.id);
    setSelectedChallenge(null);
    refreshState();
  };

  const handleApprove = () => {
    if (!activeQuest) return;
    approveChallenge(activeQuest.id);
    setSelectedChallenge(null);
    refreshState();
  };

  const handleReject = () => {
    if (!activeQuest) return;
    rejectChallenge(activeQuest.id, 'Keep trying!');
    setSelectedChallenge(null);
    refreshState();
  };

  const handleAbandon = () => {
    if (!activeQuest) return;
    if (confirm('Give up on this quest?')) {
      abandonChallenge(activeQuest.id);
      setSelectedChallenge(null);
      refreshState();
    }
  };

  const handleResetData = () => {
    if (confirm('Reset all data? This cannot be undone!')) {
      resetAllData();
      window.location.reload();
    }
  };

  const openChallengeDetail = (challenge: Challenge, pack: Pack) => {
    const isCompleted = selectedKidId ? hasCompletedChallenge(selectedKidId, pack.slug, challenge.slug) : false;
    const isActive = activeQuest?.challengeSlug === challenge.slug && activeQuest?.packSlug === pack.slug;
    const isPending = isActive && activeQuest?.status === 'pending_review';
    
    setSelectedChallenge({
      challenge,
      pack,
      isActive: isActive && !isPending,
      isPending,
      isCompleted: isCompleted && !isActive,
      kidChallengeId: isActive ? activeQuest?.id : undefined,
      customReward: isActive ? activeQuest?.customReward : undefined,
    });
  };

  const getPackCompletedCount = (pack: Pack): number => {
    if (!selectedKidId) return 0;
    return pack.challenges.filter(c => 
      hasCompletedChallenge(selectedKidId, pack.slug, c.slug)
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>⭐</span> Quest Cards
          </h1>
          {selectedKid && (
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
              <span className="text-xl">{selectedKid.avatar}</span>
              <span className="font-semibold">{selectedKid.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Kid Selector */}
            <section>
              <h2 className="text-lg font-bold text-stone-700 mb-3">Who's playing?</h2>
              <KidSelector
                kids={kids}
                selectedKidId={selectedKidId}
                onSelect={setSelectedKidId}
                onAddKid={() => setShowAddKid(true)}
              />
            </section>

            {selectedKid && (
              <>
                {/* Active Quest */}
                {activeQuest ? (
                  <section>
                    <h2 className="text-lg font-bold text-stone-700 mb-3">Current Quest</h2>
                    <ActiveQuest
                      quest={activeQuest}
                      onClick={() => openChallengeDetail(activeQuest.challenge, activeQuest.pack)}
                    />
                  </section>
                ) : (
                  <section className="text-center py-8 bg-stone-50 rounded-3xl">
                    <div className="text-5xl mb-3">🗺️</div>
                    <h3 className="font-bold text-lg text-stone-700 mb-2">No active quest!</h3>
                    <p className="text-stone-500 mb-4">Pick a new adventure from the packs.</p>
                    <button
                      onClick={() => setActiveTab('packs')}
                      className="btn btn-primary"
                    >
                      Browse Quests
                    </button>
                  </section>
                )}

                {/* Quick Stats */}
                {kidStats && kidStats.completedCount > 0 && (
                  <section className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center border-2 border-emerald-100">
                      <div className="text-3xl font-bold text-emerald-600">{kidStats.completedCount}</div>
                      <div className="text-sm text-emerald-600">Quests Done</div>
                    </div>
                    <div className="bg-amber-50 rounded-2xl p-4 text-center border-2 border-amber-100">
                      <div className="text-3xl font-bold text-amber-600">${kidStats.totalEarned}</div>
                      <div className="text-sm text-amber-600">Earned</div>
                    </div>
                  </section>
                )}

                {/* Recent Completions */}
                {kidStats && kidStats.recentCompletions.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-stone-700 mb-3">Recent Wins 🎉</h2>
                    <div className="space-y-2">
                      {kidStats.recentCompletions.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-stone-100">
                          <span className="text-2xl">{c.challenge.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-700">{c.challenge.title}</p>
                            <p className="text-xs text-stone-400">{c.pack.name}</p>
                          </div>
                          <span className="text-emerald-500 font-bold">✓</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* PACKS TAB */}
        {activeTab === 'packs' && (
          <div className="space-y-6">
            {selectedPack ? (
              // Show challenges in selected pack
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
                  {selectedPack.challenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.slug}
                      challenge={challenge}
                      packIcon={selectedPack.icon}
                      completed={selectedKidId ? hasCompletedChallenge(selectedKidId, selectedPack.slug, challenge.slug) : false}
                      onClick={() => openChallengeDetail(challenge, selectedPack)}
                    />
                  ))}
                </div>
              </>
            ) : (
              // Show all packs
              <>
                <h2 className="text-2xl font-bold text-stone-800">Quest Packs</h2>
                <p className="text-stone-500">Choose a pack and pick your next adventure!</p>
                
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

        {/* TROPHY TAB */}
        {activeTab === 'trophy' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-800">Rewards & Wins</h2>
            
            {selectedKid ? (
              kidStats && kidStats.completedCount > 0 ? (
                <>
                  {/* Total earned */}
                  <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl p-6 text-center border-2 border-amber-200">
                    <div className="text-5xl mb-2">🏆</div>
                    <div className="text-4xl font-bold text-amber-700 mb-1">${kidStats.totalEarned}</div>
                    <div className="text-amber-600">Total Earned</div>
                    <div className="text-stone-500 text-sm mt-2">
                      from {kidStats.completedCount} completed quests
                    </div>
                  </div>

                  {/* All completions */}
                  <div>
                    <h3 className="font-bold text-lg text-stone-700 mb-3">Completed Quests</h3>
                    <div className="space-y-2">
                      {completedChallenges.map((c) => (
                        <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-stone-100">
                          <span className="text-3xl">{c.challenge.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-700">{c.challenge.title}</p>
                            <p className="text-xs text-stone-400">{c.pack.name}</p>
                          </div>
                          <span className="font-bold text-amber-600">
                            {c.customReward || c.challenge.reward_value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-stone-50 rounded-3xl">
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="font-bold text-lg text-stone-700 mb-2">No rewards yet!</h3>
                  <p className="text-stone-500 mb-4">Complete quests to earn rewards.</p>
                  <button
                    onClick={() => setActiveTab('packs')}
                    className="btn btn-primary"
                  >
                    Start a Quest
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-stone-50 rounded-3xl">
                <p className="text-stone-500">Select a kid to see their rewards!</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-800">Settings</h2>
            
            {/* Manage Kids */}
            <section className="bg-white rounded-2xl p-4 border border-stone-100">
              <h3 className="font-bold text-stone-700 mb-3">Manage Kids</h3>
              {kids.length > 0 ? (
                <div className="space-y-2">
                  {kids.map((kid) => (
                    <div key={kid.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <span className="text-2xl">{kid.avatar}</span>
                      <span className="flex-1 font-semibold">{kid.name}</span>
                      <button
                        onClick={() => handleRemoveKid(kid.id)}
                        className="text-red-400 hover:text-red-600 p-2 tap-target"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500">No kids added yet.</p>
              )}
              <button
                onClick={() => setShowAddKid(true)}
                className="btn btn-outline w-full mt-3"
              >
                ➕ Add Kid
              </button>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-50 rounded-2xl p-4 border border-red-100">
              <h3 className="font-bold text-red-700 mb-3">Danger Zone</h3>
              <button
                onClick={handleResetData}
                className="btn w-full bg-red-500 text-white hover:bg-red-600"
              >
                🗑️ Reset All Data
              </button>
              <p className="text-red-400 text-xs mt-2 text-center">
                This will delete all kids and progress
              </p>
            </section>

            {/* About */}
            <section className="text-center text-stone-400 text-sm">
              <p>Quest Cards v0.1.0</p>
              <p>Built with ❤️ for adventurous families</p>
            </section>
          </div>
        )}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Add Kid Modal */}
      <Modal
        isOpen={showAddKid}
        onClose={() => setShowAddKid(false)}
        title="Add a Kid"
      >
        <AddKid
          onAdd={handleAddKid}
          onCancel={() => setShowAddKid(false)}
        />
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
            customReward={selectedChallenge.customReward}
            onStart={!activeQuest && !selectedChallenge.isCompleted ? handleStartChallenge : undefined}
            onMarkDone={selectedChallenge.isActive ? handleMarkDone : undefined}
            onApprove={selectedChallenge.isPending ? handleApprove : undefined}
            onReject={selectedChallenge.isPending ? handleReject : undefined}
            onAbandon={selectedChallenge.isActive ? handleAbandon : undefined}
          />
        )}
      </Modal>
    </div>
  );
}
