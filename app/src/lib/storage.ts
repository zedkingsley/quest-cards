// Quest Cards - Local Storage Data Layer
// This can be swapped for Supabase later

import { Family, Kid, KidChallenge, ChallengeWithDetails } from './types';
import { getPack, getChallenge, PACKS } from './packs';

const STORAGE_KEYS = {
  FAMILY: 'questcards_family',
  KIDS: 'questcards_kids',
  KID_CHALLENGES: 'questcards_kid_challenges',
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

export function getFamily(): Family | null {
  return getItem<Family | null>(STORAGE_KEYS.FAMILY, null);
}

export function createFamily(name: string): Family {
  const family: Family = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
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

// ============ Kids ============

export function getKids(): Kid[] {
  return getItem<Kid[]>(STORAGE_KEYS.KIDS, []);
}

export function getKid(kidId: string): Kid | undefined {
  return getKids().find(k => k.id === kidId);
}

export function addKid(name: string, avatar: string): Kid {
  const family = getFamily();
  if (!family) throw new Error('No family exists');
  
  const kid: Kid = {
    id: generateId(),
    familyId: family.id,
    name,
    avatar,
    createdAt: new Date().toISOString(),
  };
  
  const kids = getKids();
  kids.push(kid);
  setItem(STORAGE_KEYS.KIDS, kids);
  return kid;
}

export function updateKid(kidId: string, updates: Partial<Kid>): Kid | undefined {
  const kids = getKids();
  const index = kids.findIndex(k => k.id === kidId);
  if (index === -1) return undefined;
  
  kids[index] = { ...kids[index], ...updates };
  setItem(STORAGE_KEYS.KIDS, kids);
  return kids[index];
}

export function removeKid(kidId: string): boolean {
  const kids = getKids();
  const filtered = kids.filter(k => k.id !== kidId);
  if (filtered.length === kids.length) return false;
  setItem(STORAGE_KEYS.KIDS, filtered);
  
  // Also remove kid's challenges
  const challenges = getKidChallenges().filter(c => c.kidId !== kidId);
  setItem(STORAGE_KEYS.KID_CHALLENGES, challenges);
  
  return true;
}

// ============ Kid Challenges ============

export function getKidChallenges(): KidChallenge[] {
  return getItem<KidChallenge[]>(STORAGE_KEYS.KID_CHALLENGES, []);
}

export function getKidChallengesForKid(kidId: string): KidChallenge[] {
  return getKidChallenges().filter(c => c.kidId === kidId);
}

export function getKidChallengeWithDetails(kidChallenge: KidChallenge): ChallengeWithDetails | null {
  const pack = getPack(kidChallenge.packSlug);
  const challenge = getChallenge(kidChallenge.packSlug, kidChallenge.challengeSlug);
  if (!pack || !challenge) return null;
  
  return {
    ...kidChallenge,
    challenge,
    pack,
  };
}

export function getActiveChallenge(kidId: string): ChallengeWithDetails | null {
  const challenges = getKidChallengesForKid(kidId);
  const active = challenges.find(c => c.status === 'active' || c.status === 'pending_review');
  if (!active) return null;
  return getKidChallengeWithDetails(active);
}

export function getCompletedChallenges(kidId: string): ChallengeWithDetails[] {
  const challenges = getKidChallengesForKid(kidId);
  return challenges
    .filter(c => c.status === 'completed')
    .map(c => getKidChallengeWithDetails(c))
    .filter((c): c is ChallengeWithDetails => c !== null)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
}

export function startChallenge(kidId: string, packSlug: string, challengeSlug: string, customReward?: string): KidChallenge {
  const kidChallenge: KidChallenge = {
    id: generateId(),
    kidId,
    challengeSlug,
    packSlug,
    status: 'active',
    customReward,
    startedAt: new Date().toISOString(),
  };
  
  const challenges = getKidChallenges();
  challenges.push(kidChallenge);
  setItem(STORAGE_KEYS.KID_CHALLENGES, challenges);
  return kidChallenge;
}

export function submitChallenge(challengeId: string): KidChallenge | undefined {
  const challenges = getKidChallenges();
  const index = challenges.findIndex(c => c.id === challengeId);
  if (index === -1) return undefined;
  
  challenges[index].status = 'pending_review';
  challenges[index].submittedAt = new Date().toISOString();
  setItem(STORAGE_KEYS.KID_CHALLENGES, challenges);
  return challenges[index];
}

export function approveChallenge(challengeId: string, parentNotes?: string): KidChallenge | undefined {
  const challenges = getKidChallenges();
  const index = challenges.findIndex(c => c.id === challengeId);
  if (index === -1) return undefined;
  
  challenges[index].status = 'completed';
  challenges[index].completedAt = new Date().toISOString();
  if (parentNotes) challenges[index].parentNotes = parentNotes;
  setItem(STORAGE_KEYS.KID_CHALLENGES, challenges);
  return challenges[index];
}

export function rejectChallenge(challengeId: string, parentNotes?: string): KidChallenge | undefined {
  const challenges = getKidChallenges();
  const index = challenges.findIndex(c => c.id === challengeId);
  if (index === -1) return undefined;
  
  challenges[index].status = 'active';
  challenges[index].submittedAt = undefined;
  if (parentNotes) challenges[index].parentNotes = parentNotes;
  setItem(STORAGE_KEYS.KID_CHALLENGES, challenges);
  return challenges[index];
}

export function abandonChallenge(challengeId: string): KidChallenge | undefined {
  const challenges = getKidChallenges();
  const index = challenges.findIndex(c => c.id === challengeId);
  if (index === -1) return undefined;
  
  challenges[index].status = 'abandoned';
  setItem(STORAGE_KEYS.KID_CHALLENGES, challenges);
  return challenges[index];
}

// ============ Stats ============

export function getKidStats(kidId: string) {
  const completed = getCompletedChallenges(kidId);
  
  // Calculate total earnings (parse money values)
  let totalEarned = 0;
  completed.forEach(c => {
    const reward = c.customReward || c.challenge.reward_value;
    const match = reward.match(/\$(\d+)/);
    if (match) {
      totalEarned += parseInt(match[1], 10);
    }
  });
  
  return {
    completedCount: completed.length,
    totalEarned,
    recentCompletions: completed.slice(0, 5),
  };
}

// ============ Check if challenge already done ============

export function hasCompletedChallenge(kidId: string, packSlug: string, challengeSlug: string): boolean {
  const challenges = getKidChallengesForKid(kidId);
  return challenges.some(
    c => c.packSlug === packSlug && 
         c.challengeSlug === challengeSlug && 
         c.status === 'completed'
  );
}

// ============ Reset (for testing) ============

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.FAMILY);
  localStorage.removeItem(STORAGE_KEYS.KIDS);
  localStorage.removeItem(STORAGE_KEYS.KID_CHALLENGES);
}

// ============ Initialize with demo data ============

export function initializeDemoData(): void {
  if (getFamily()) return; // Already initialized
  
  createFamily('Our Family');
  addKid('Demo Kid', '👧');
}
