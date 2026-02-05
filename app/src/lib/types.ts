// Quest Cards - Type Definitions

export interface Family {
  id: string;
  name: string;
  createdAt: string;
}

export interface Kid {
  id: string;
  familyId: string;
  name: string;
  avatar: string; // emoji
  createdAt: string;
}

export interface Pack {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'mixed' | 'creative' | 'life-skills' | 'learning' | 'adventure' | 'social';
  challenges: Challenge[];
}

export interface Challenge {
  slug: string;
  title: string;
  description: string;
  instructions?: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward_type: 'money' | 'experience' | 'choice';
  reward_value: string;
  time_estimate: string;
}

export type ChallengeStatus = 'active' | 'pending_review' | 'completed' | 'abandoned';

export interface KidChallenge {
  id: string;
  kidId: string;
  challengeSlug: string;
  packSlug: string;
  status: ChallengeStatus;
  customReward?: string;
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  parentNotes?: string;
}

// For display purposes
export interface ChallengeWithDetails extends KidChallenge {
  challenge: Challenge;
  pack: Pack;
}
