// Quest Cards - Local Storage Data Layer
// Updated for Family Challenge Mode

import { 
  Family, 
  FamilySettings,
  FamilyMember, 
  MemberRole,
  Quest, 
  QuestWithDetails, 
  QuestStatus,
  Reward,
  Redemption,
  RedemptionWithDetails,
  RedemptionStatus,
  Challenge,
  Pack,
} from './types';
import { getPack, getChallenge, PACKS } from './packs';

const STORAGE_KEYS = {
  FAMILY: 'questcards_family_v2',
  MEMBERS: 'questcards_members_v2',
  QUESTS: 'questcards_quests_v2',
  REWARDS: 'questcards_rewards_v2',
  REDEMPTIONS: 'questcards_redemptions_v2',
  CUSTOM_CHALLENGES: 'questcards_custom_challenges_v2',
};

// ============ Helpers ============

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ============ Family ============

const DEFAULT_SETTINGS: FamilySettings = {
  pointsPerDollar: 10,
  requirePinForApproval: true,
  requirePinForRedemption: true,
};

export function getFamily(): Family | null {
  return getItem<Family | null>(STORAGE_KEYS.FAMILY, null);
}

export function createFamily(name: string, pin: string = '1234'): Family {
  const family: Family = {
    id: generateId(),
    name,
    pin,
    createdAt: new Date().toISOString(),
    settings: DEFAULT_SETTINGS,
  };
  setItem(STORAGE_KEYS.FAMILY, family);
  return family;
}

export function updateFamily(updates: Partial<Family>): Family | null {
  const family = getFamily();
  if (!family) return null;
  const updated = { ...family, ...updates };
  setItem(STORAGE_KEYS.FAMILY, updated);
  return updated;
}

export function updateFamilySettings(settings: Partial<FamilySettings>): Family | null {
  const family = getFamily();
  if (!family) return null;
  family.settings = { ...family.settings, ...settings };
  setItem(STORAGE_KEYS.FAMILY, family);
  return family;
}

export function verifyPin(pin: string): boolean {
  const family = getFamily();
  return family?.pin === pin;
}

export function changePin(oldPin: string, newPin: string): boolean {
  if (!verifyPin(oldPin)) return false;
  const family = getFamily();
  if (!family) return false;
  family.pin = newPin;
  setItem(STORAGE_KEYS.FAMILY, family);
  return true;
}

// ============ Family Members ============

export function getMembers(): FamilyMember[] {
  return getItem<FamilyMember[]>(STORAGE_KEYS.MEMBERS, []);
}

export function getMember(memberId: string): FamilyMember | undefined {
  return getMembers().find(m => m.id === memberId);
}

export function getParents(): FamilyMember[] {
  return getMembers().filter(m => m.role === 'parent');
}

export function getChildren(): FamilyMember[] {
  return getMembers().filter(m => m.role === 'child');
}

export function addMember(name: string, avatar: string, role: MemberRole): FamilyMember {
  const family = getFamily();
  if (!family) throw new Error('No family exists');
  
  const member: FamilyMember = {
    id: generateId(),
    familyId: family.id,
    name,
    avatar,
    role,
    createdAt: new Date().toISOString(),
    pointsBalance: 0,
  };
  
  const members = getMembers();
  members.push(member);
  setItem(STORAGE_KEYS.MEMBERS, members);
  
  // If this is a parent, initialize their default rewards
  if (role === 'parent') {
    initializeDefaultRewards(member.id);
  }
  
  return member;
}

export function updateMember(memberId: string, updates: Partial<FamilyMember>): FamilyMember | undefined {
  const members = getMembers();
  const index = members.findIndex(m => m.id === memberId);
  if (index === -1) return undefined;
  
  members[index] = { ...members[index], ...updates };
  setItem(STORAGE_KEYS.MEMBERS, members);
  return members[index];
}

export function removeMember(memberId: string): boolean {
  const members = getMembers();
  const filtered = members.filter(m => m.id !== memberId);
  if (filtered.length === members.length) return false;
  setItem(STORAGE_KEYS.MEMBERS, filtered);
  
  // Also remove member's quests and rewards
  const quests = getQuests().filter(q => q.recipientId !== memberId && q.issuerId !== memberId);
  setItem(STORAGE_KEYS.QUESTS, quests);
  
  const rewards = getRewards().filter(r => r.ownerId !== memberId);
  setItem(STORAGE_KEYS.REWARDS, rewards);
  
  return true;
}

// ============ Points ============

export function addPoints(memberId: string, points: number): number {
  const member = getMember(memberId);
  if (!member) return 0;
  
  member.pointsBalance += points;
  updateMember(memberId, { pointsBalance: member.pointsBalance });
  return member.pointsBalance;
}

export function deductPoints(memberId: string, points: number): boolean {
  const member = getMember(memberId);
  if (!member || member.pointsBalance < points) return false;
  
  member.pointsBalance -= points;
  updateMember(memberId, { pointsBalance: member.pointsBalance });
  return true;
}

// ============ Quests ============

export function getQuests(): Quest[] {
  return getItem<Quest[]>(STORAGE_KEYS.QUESTS, []);
}

export function getQuestsForMember(memberId: string): Quest[] {
  return getQuests().filter(q => q.recipientId === memberId);
}

export function getQuestsIssuedBy(memberId: string): Quest[] {
  return getQuests().filter(q => q.issuerId === memberId);
}

export function getActiveQuest(memberId: string): Quest | null {
  const quests = getQuestsForMember(memberId);
  return quests.find(q => q.status === 'active' || q.status === 'pending_review') || null;
}

export function getQueuedQuests(memberId: string): Quest[] {
  return getQuestsForMember(memberId)
    .filter(q => q.status === 'queued')
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
}

export function hasActiveOrPendingQuest(memberId: string): boolean {
  const quests = getQuestsForMember(memberId);
  return quests.some(q => q.status === 'active' || q.status === 'pending_review');
}

export function getPendingApprovals(issuerId: string): Quest[] {
  return getQuests().filter(q => q.issuerId === issuerId && q.status === 'pending_review');
}

export function getQuestWithDetails(quest: Quest): QuestWithDetails | null {
  const issuer = getMember(quest.issuerId);
  const recipient = getMember(quest.recipientId);
  if (!issuer || !recipient) return null;
  
  let challenge: Challenge | { title: string; description: string; icon: string };
  let pack: Pack | undefined;
  
  if (quest.packSlug && quest.challengeSlug) {
    pack = getPack(quest.packSlug);
    const packChallenge = getChallenge(quest.packSlug, quest.challengeSlug);
    if (!pack || !packChallenge) return null;
    challenge = packChallenge;
  } else if (quest.customChallenge) {
    challenge = quest.customChallenge;
  } else {
    return null;
  }
  
  return {
    ...quest,
    challenge,
    pack,
    issuer,
    recipient,
  };
}

export function getCompletedQuests(memberId: string): QuestWithDetails[] {
  const quests = getQuestsForMember(memberId);
  return quests
    .filter(q => q.status === 'completed')
    .map(q => getQuestWithDetails(q))
    .filter((q): q is QuestWithDetails => q !== null)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
}

// Start a quest from a pack (or queue it if already have active)
export function startPackQuest(
  recipientId: string, 
  issuerId: string,
  packSlug: string, 
  challengeSlug: string
): Quest {
  const challenge = getChallenge(packSlug, challengeSlug);
  if (!challenge) throw new Error('Challenge not found');
  
  // Check if already has active/pending quest - if so, queue it
  const shouldQueue = hasActiveOrPendingQuest(recipientId);
  
  const quest: Quest = {
    id: generateId(),
    recipientId,
    issuerId,
    packSlug,
    challengeSlug,
    reward: challenge.reward,
    status: shouldQueue ? 'queued' : 'active',
    startedAt: new Date().toISOString(),
  };
  
  const quests = getQuests();
  quests.push(quest);
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quest;
}

// Issue a custom challenge directly
export function issueChallenge(
  recipientId: string,
  issuerId: string,
  title: string,
  description: string,
  icon: string,
  reward: number,
  customRewardText?: string
): Quest {
  const quest: Quest = {
    id: generateId(),
    recipientId,
    issuerId,
    customChallenge: { title, description, icon },
    reward,
    customRewardText,
    status: 'active',
    startedAt: new Date().toISOString(),
  };
  
  const quests = getQuests();
  quests.push(quest);
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quest;
}

export function submitQuest(questId: string): Quest | undefined {
  const quests = getQuests();
  const index = quests.findIndex(q => q.id === questId);
  if (index === -1) return undefined;
  
  quests[index].status = 'pending_review';
  quests[index].submittedAt = new Date().toISOString();
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quests[index];
}

export function approveQuest(questId: string, notes?: string): Quest | undefined {
  const quests = getQuests();
  const index = quests.findIndex(q => q.id === questId);
  if (index === -1) return undefined;
  
  const quest = quests[index];
  quest.status = 'completed';
  quest.completedAt = new Date().toISOString();
  if (notes) quest.verifierNotes = notes;
  
  // Award points to recipient
  addPoints(quest.recipientId, quest.reward);
  
  // Activate next queued quest if any
  const nextQueued = quests.find(q => 
    q.recipientId === quest.recipientId && 
    q.status === 'queued'
  );
  if (nextQueued) {
    nextQueued.status = 'active';
  }
  
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quest;
}

export function rejectQuest(questId: string, notes?: string): Quest | undefined {
  const quests = getQuests();
  const index = quests.findIndex(q => q.id === questId);
  if (index === -1) return undefined;
  
  quests[index].status = 'active';
  quests[index].submittedAt = undefined;
  if (notes) quests[index].verifierNotes = notes;
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quests[index];
}

export function abandonQuest(questId: string): Quest | undefined {
  const quests = getQuests();
  const index = quests.findIndex(q => q.id === questId);
  if (index === -1) return undefined;
  
  quests[index].status = 'abandoned';
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quests[index];
}

// Undo a submission (F14: kid can take back "I did it")
export function unsubmitQuest(questId: string): Quest | undefined {
  const quests = getQuests();
  const index = quests.findIndex(q => q.id === questId);
  if (index === -1) return undefined;
  
  quests[index].status = 'active';
  quests[index].submittedAt = undefined;
  setItem(STORAGE_KEYS.QUESTS, quests);
  return quests[index];
}

export function hasCompletedChallenge(memberId: string, packSlug: string, challengeSlug: string): boolean {
  const quests = getQuestsForMember(memberId);
  return quests.some(
    q => q.packSlug === packSlug && 
         q.challengeSlug === challengeSlug && 
         q.status === 'completed'
  );
}

// ============ Rewards ============

export function getRewards(): Reward[] {
  return getItem<Reward[]>(STORAGE_KEYS.REWARDS, []);
}

export function getRewardsOwnedBy(memberId: string): Reward[] {
  return getRewards().filter(r => r.ownerId === memberId && r.active);
}

export function getRewardsAvailableTo(memberId: string): { owner: FamilyMember; rewards: Reward[] }[] {
  const rewards = getRewards().filter(r => r.active);
  const allMembers = getMembers();
  const member = getMember(memberId);
  
  // Get all reward owners who have rewards available to this member
  // (excluding yourself - you can't redeem your own rewards)
  return allMembers
    .filter(m => m.id !== memberId) // Exclude self
    .map(owner => ({
      owner,
      rewards: rewards.filter(r => 
        r.ownerId === owner.id && 
        (r.availableTo.length === 0 || r.availableTo.includes(memberId))
      ),
    }))
    .filter(group => group.rewards.length > 0);
}

export function addReward(
  ownerId: string,
  name: string,
  pointCost: number,
  icon: string = '🎁',
  description?: string,
  availableTo: string[] = []
): Reward {
  const reward: Reward = {
    id: generateId(),
    ownerId,
    name,
    description,
    icon,
    pointCost,
    availableTo,
    isDefault: false,
    active: true,
    createdAt: new Date().toISOString(),
  };
  
  const rewards = getRewards();
  rewards.push(reward);
  setItem(STORAGE_KEYS.REWARDS, rewards);
  return reward;
}

export function updateReward(rewardId: string, updates: Partial<Reward>): Reward | undefined {
  const rewards = getRewards();
  const index = rewards.findIndex(r => r.id === rewardId);
  if (index === -1) return undefined;
  
  rewards[index] = { ...rewards[index], ...updates };
  setItem(STORAGE_KEYS.REWARDS, rewards);
  return rewards[index];
}

export function deleteReward(rewardId: string): boolean {
  const rewards = getRewards();
  const filtered = rewards.filter(r => r.id !== rewardId);
  if (filtered.length === rewards.length) return false;
  setItem(STORAGE_KEYS.REWARDS, filtered);
  return true;
}

function initializeDefaultRewards(ownerId: string): void {
  const defaults = [
    { name: '$1 allowance', icon: '💵', cost: 10, description: 'One dollar cash' },
    { name: '$5 allowance', icon: '💵', cost: 50, description: 'Five dollars cash' },
    { name: 'Pick a movie', icon: '🎬', cost: 30, description: 'Choose what we watch tonight' },
    { name: 'Screen time +30min', icon: '📱', cost: 20, description: 'Extra screen time' },
    { name: 'Stay up late +30min', icon: '🌙', cost: 40, description: 'Push bedtime back' },
    { name: 'Special breakfast', icon: '🥞', cost: 25, description: 'Request your favorite breakfast' },
  ];
  
  const rewards = getRewards();
  defaults.forEach(d => {
    rewards.push({
      id: generateId(),
      ownerId,
      name: d.name,
      description: d.description,
      icon: d.icon,
      pointCost: d.cost,
      availableTo: [], // Available to everyone
      isDefault: true,
      active: true,
      createdAt: new Date().toISOString(),
    });
  });
  setItem(STORAGE_KEYS.REWARDS, rewards);
}

// ============ Redemptions ============

export function getRedemptions(): Redemption[] {
  return getItem<Redemption[]>(STORAGE_KEYS.REDEMPTIONS, []);
}

export function getPendingRedemptions(ownerId: string): RedemptionWithDetails[] {
  return getRedemptions()
    .filter(r => r.rewardOwnerId === ownerId && r.status === 'pending')
    .map(r => getRedemptionWithDetails(r))
    .filter((r): r is RedemptionWithDetails => r !== null);
}

export function getRedemptionWithDetails(redemption: Redemption): RedemptionWithDetails | null {
  const reward = getRewards().find(r => r.id === redemption.rewardId);
  const owner = getMember(redemption.rewardOwnerId);
  const claimer = getMember(redemption.claimerId);
  
  if (!reward || !owner || !claimer) return null;
  
  return { ...redemption, reward, owner, claimer };
}

export function redeemReward(rewardId: string, claimerId: string): Redemption | null {
  const reward = getRewards().find(r => r.id === rewardId);
  const claimer = getMember(claimerId);
  
  if (!reward || !claimer) return null;
  if (claimer.pointsBalance < reward.pointCost) return null;
  
  // Deduct points
  if (!deductPoints(claimerId, reward.pointCost)) return null;
  
  const redemption: Redemption = {
    id: generateId(),
    rewardId,
    rewardOwnerId: reward.ownerId,
    claimerId,
    pointsSpent: reward.pointCost,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  const redemptions = getRedemptions();
  redemptions.push(redemption);
  setItem(STORAGE_KEYS.REDEMPTIONS, redemptions);
  
  return redemption;
}

export function fulfillRedemption(redemptionId: string): Redemption | undefined {
  const redemptions = getRedemptions();
  const index = redemptions.findIndex(r => r.id === redemptionId);
  if (index === -1) return undefined;
  
  redemptions[index].status = 'fulfilled';
  redemptions[index].fulfilledAt = new Date().toISOString();
  setItem(STORAGE_KEYS.REDEMPTIONS, redemptions);
  return redemptions[index];
}

export function cancelRedemption(redemptionId: string): Redemption | undefined {
  const redemptions = getRedemptions();
  const index = redemptions.findIndex(r => r.id === redemptionId);
  if (index === -1) return undefined;
  
  const redemption = redemptions[index];
  
  // Refund points
  addPoints(redemption.claimerId, redemption.pointsSpent);
  
  redemption.status = 'cancelled';
  setItem(STORAGE_KEYS.REDEMPTIONS, redemptions);
  return redemption;
}

// ============ Stats ============

export function getMemberStats(memberId: string) {
  const completed = getCompletedQuests(memberId);
  const member = getMember(memberId);
  
  return {
    completedCount: completed.length,
    pointsBalance: member?.pointsBalance || 0,
    totalPointsEarned: completed.reduce((sum, q) => sum + q.reward, 0),
    recentCompletions: completed.slice(0, 5),
  };
}

// ============ Reset & Migration ============

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  // Also clear old v1 keys
  localStorage.removeItem('questcards_family');
  localStorage.removeItem('questcards_kids');
  localStorage.removeItem('questcards_kid_challenges');
}

export function initializeDemoData(): void {
  if (getFamily()) return; // Already initialized
  
  // Create family with default PIN
  createFamily('The Family', '1234');
  
  // Add Zed as parent (will auto-create default rewards)
  const zed = addMember('Zed', '👨', 'parent');
  
  // Add family members
  addMember('Alex', '👩', 'parent');
  addMember('Eleanor', '👧', 'child');
  addMember('Wyatt', '👦', 'child');
}

// Check if we need to migrate from v1
export function checkAndMigrate(): boolean {
  if (getFamily()) return false; // Already on v2
  
  const oldFamily = getItem<{ id: string; name: string } | null>('questcards_family', null);
  if (!oldFamily) return false;
  
  // TODO: Implement full migration if needed
  // For now, just initialize fresh
  return false;
}
