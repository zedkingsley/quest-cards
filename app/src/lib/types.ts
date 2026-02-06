// Quest Cards - Type Definitions
// Updated for Family Challenge Mode

// ============ Core Entities ============

export interface Family {
  id: string;
  name: string;
  pin: string;           // 4-digit PIN for parent actions
  createdAt: string;
  settings: FamilySettings;
}

export interface FamilySettings {
  pointsPerDollar: number;  // Exchange rate (default: 10)
  requirePinForApproval: boolean;
  requirePinForRedemption: boolean;
}

export type MemberRole = 'parent' | 'child';

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  avatar: string;           // emoji
  role: MemberRole;
  createdAt: string;
  pointsBalance: number;    // Current points balance
}

// ============ Challenges ============

export interface Pack {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'mixed' | 'creative' | 'life-skills' | 'learning' | 'adventure' | 'social' | 'custom';
  challenges: Challenge[];
  isBuiltIn: boolean;
}

export interface Challenge {
  slug: string;
  title: string;
  description: string;
  instructions?: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;           // Points (not dollars anymore)
  time_estimate: string;
  createdBy?: string;       // Member ID if custom
}

export type QuestStatus = 'active' | 'pending_review' | 'completed' | 'abandoned';

export interface Quest {
  id: string;
  recipientId: string;      // Who's doing this quest
  issuerId: string;         // Who issued it (for direct challenges) or 'system' for pack challenges
  
  // Challenge source (either from pack OR custom)
  packSlug?: string;        // If from a pack
  challengeSlug?: string;   // If from a pack
  customChallenge?: {       // If directly issued
    title: string;
    description: string;
    icon: string;
  };
  
  reward: number;           // Points to be earned
  customRewardText?: string; // Optional text like "I'll cook dinner"
  
  status: QuestStatus;
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  verifierNotes?: string;
}

// For display purposes
export interface QuestWithDetails extends Quest {
  challenge: Challenge | { title: string; description: string; icon: string };
  pack?: Pack;
  issuer: FamilyMember;
  recipient: FamilyMember;
}

// ============ Rewards ============

export interface Reward {
  id: string;
  ownerId: string;          // Who offers this reward
  name: string;
  description?: string;
  icon: string;
  pointCost: number;
  availableTo: string[];    // Member IDs who can redeem, empty = everyone
  isDefault: boolean;       // Pre-populated vs custom
  active: boolean;          // Can be disabled without deleting
  createdAt: string;
}

export type RedemptionStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface Redemption {
  id: string;
  rewardId: string;
  rewardOwnerId: string;    // Who owes this
  claimerId: string;        // Who redeemed
  pointsSpent: number;
  status: RedemptionStatus;
  createdAt: string;
  fulfilledAt?: string;
}

export interface RedemptionWithDetails extends Redemption {
  reward: Reward;
  owner: FamilyMember;
  claimer: FamilyMember;
}

// ============ Legacy (for migration) ============

export interface Kid {
  id: string;
  familyId: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface KidChallenge {
  id: string;
  kidId: string;
  challengeSlug: string;
  packSlug: string;
  status: 'active' | 'pending_review' | 'completed' | 'abandoned';
  customReward?: string;
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  parentNotes?: string;
}

// Legacy type alias
export type ChallengeStatus = QuestStatus;
export type ChallengeWithDetails = QuestWithDetails;
