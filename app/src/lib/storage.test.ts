import { describe, it, expect, beforeEach } from 'vitest';
import {
  createFamily,
  getFamily,
  verifyPin,
  addMember,
  getMembers,
  getMember,
  getParents,
  getChildren,
  addPoints,
  deductPoints,
  startPackQuest,
  getActiveQuest,
  getQueuedQuests,
  submitQuest,
  approveQuest,
  rejectQuest,
  abandonQuest,
  unsubmitQuest,
  hasCompletedChallenge,
  addReward,
  getRewardsOwnedBy,
  getRewardsAvailableTo,
  redeemReward,
  resetAllData,
} from './storage';

describe('Storage Layer', () => {
  beforeEach(() => {
    resetAllData();
  });

  describe('Family Management', () => {
    it('creates a family with default settings', () => {
      const family = createFamily('Test Family', '1234');
      expect(family.name).toBe('Test Family');
      expect(family.pin).toBe('1234');
      expect(family.settings.requirePinForApproval).toBe(true);
    });

    it('verifies PIN correctly', () => {
      createFamily('Test Family', '5678');
      expect(verifyPin('5678')).toBe(true);
      expect(verifyPin('1234')).toBe(false);
      expect(verifyPin('')).toBe(false);
    });
  });

  describe('Member Management', () => {
    beforeEach(() => {
      createFamily('Test Family');
    });

    it('adds a parent member', () => {
      const parent = addMember('Mom', '👩', 'parent');
      expect(parent.name).toBe('Mom');
      expect(parent.role).toBe('parent');
      expect(parent.pointsBalance).toBe(0);
    });

    it('adds a child member', () => {
      const child = addMember('Kid', '👦', 'child');
      expect(child.name).toBe('Kid');
      expect(child.role).toBe('child');
    });

    it('separates parents and children', () => {
      addMember('Mom', '👩', 'parent');
      addMember('Dad', '👨', 'parent');
      addMember('Kid1', '👦', 'child');
      addMember('Kid2', '👧', 'child');

      expect(getParents()).toHaveLength(2);
      expect(getChildren()).toHaveLength(2);
      expect(getMembers()).toHaveLength(4);
    });
  });

  describe('Points System', () => {
    let memberId: string;

    beforeEach(() => {
      createFamily('Test Family');
      const member = addMember('Kid', '👦', 'child');
      memberId = member.id;
    });

    it('adds points to a member', () => {
      const newBalance = addPoints(memberId, 50);
      expect(newBalance).toBe(50);
      expect(getMember(memberId)?.pointsBalance).toBe(50);
    });

    it('deducts points when sufficient balance', () => {
      addPoints(memberId, 100);
      const success = deductPoints(memberId, 30);
      expect(success).toBe(true);
      expect(getMember(memberId)?.pointsBalance).toBe(70);
    });

    it('fails to deduct when insufficient balance', () => {
      addPoints(memberId, 20);
      const success = deductPoints(memberId, 50);
      expect(success).toBe(false);
      expect(getMember(memberId)?.pointsBalance).toBe(20);
    });
  });

  describe('Quest Flow', () => {
    let parentId: string;
    let childId: string;

    beforeEach(() => {
      createFamily('Test Family');
      parentId = addMember('Mom', '👩', 'parent').id;
      childId = addMember('Kid', '👦', 'child').id;
    });

    // Use actual pack/challenge slugs from packs.ts
    const PACK_SLUG = 'starter-pack';
    const CHALLENGE_SLUG = 'make-your-bed-7-days';
    const CHALLENGE_SLUG_2 = 'try-new-food';

    it('starts a quest for a child', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      expect(quest.status).toBe('active');
      expect(quest.recipientId).toBe(childId);
      expect(quest.issuerId).toBe(parentId);
    });

    it('queues quest when one is already active', () => {
      startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      const second = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG_2);
      
      expect(second.status).toBe('queued');
      expect(getQueuedQuests(childId)).toHaveLength(1);
    });

    it('submits quest for review', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      const submitted = submitQuest(quest.id);
      
      expect(submitted?.status).toBe('pending_review');
      expect(submitted?.submittedAt).toBeDefined();
    });

    it('approves quest and awards points', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      submitQuest(quest.id);
      const approved = approveQuest(quest.id);
      
      expect(approved?.status).toBe('completed');
      expect(getMember(childId)?.pointsBalance).toBeGreaterThan(0);
    });

    it('rejects quest back to active', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      submitQuest(quest.id);
      const rejected = rejectQuest(quest.id, 'Try again');
      
      expect(rejected?.status).toBe('active');
      expect(rejected?.submittedAt).toBeUndefined();
    });

    it('abandons quest', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      const abandoned = abandonQuest(quest.id);
      
      expect(abandoned?.status).toBe('abandoned');
    });

    // F14: Test unsubmit functionality
    it('unsubmits quest back to active (F14)', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      submitQuest(quest.id);
      const unsubmitted = unsubmitQuest(quest.id);
      
      expect(unsubmitted?.status).toBe('active');
      expect(unsubmitted?.submittedAt).toBeUndefined();
    });

    it('activates queued quest after approval', () => {
      const first = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      const second = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG_2);
      
      expect(second.status).toBe('queued');
      
      submitQuest(first.id);
      approveQuest(first.id);
      
      // Second quest should now be active
      const active = getActiveQuest(childId);
      expect(active?.id).toBe(second.id);
      expect(active?.status).toBe('active');
    });

    it('tracks completed challenges', () => {
      const quest = startPackQuest(childId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      submitQuest(quest.id);
      approveQuest(quest.id);
      
      expect(hasCompletedChallenge(childId, PACK_SLUG, CHALLENGE_SLUG)).toBe(true);
      expect(hasCompletedChallenge(childId, PACK_SLUG, CHALLENGE_SLUG_2)).toBe(false);
    });
  });

  describe('Rewards System', () => {
    let parentId: string;
    let childId: string;
    let otherParentId: string;
    // Note: Parents get 6 default rewards when created

    beforeEach(() => {
      createFamily('Test Family');
      parentId = addMember('Mom', '👩', 'parent').id;
      otherParentId = addMember('Dad', '👨', 'parent').id;
      childId = addMember('Kid', '👦', 'child').id;
    });

    it('adds a reward', () => {
      const reward = addReward(parentId, 'Ice Cream', 20, '🍦', 'A treat');
      expect(reward.name).toBe('Ice Cream');
      expect(reward.pointCost).toBe(20);
      expect(reward.ownerId).toBe(parentId);
    });

    it('gets rewards owned by a member', () => {
      // Parents get 6 default rewards each, so adding 2 more gives 8 total
      const initialCount = getRewardsOwnedBy(parentId).length;
      addReward(parentId, 'Ice Cream', 20, '🍦');
      addReward(parentId, 'Movie Night', 50, '🎬');
      
      const momRewards = getRewardsOwnedBy(parentId);
      expect(momRewards).toHaveLength(initialCount + 2);
    });

    it('gets rewards available to child', () => {
      // Child can see rewards from both parents
      const available = getRewardsAvailableTo(childId);
      expect(available.length).toBe(2); // two parents with default rewards
      
      // Add specific reward
      addReward(parentId, 'Special Treat', 30, '🎁', '', [childId]);
      const updated = getRewardsAvailableTo(childId);
      // Should still see rewards from both parents
      expect(updated.length).toBe(2);
    });

    // F20: Test parent can receive rewards
    it('gets rewards available to parent (F20)', () => {
      // Parent sees rewards from other parent (default + any added)
      const available = getRewardsAvailableTo(parentId);
      expect(available.length).toBeGreaterThan(0);
      expect(available[0].owner.id).toBe(otherParentId);
      
      // Add a specific parent-targeted reward
      addReward(otherParentId, 'Massage', 100, '💆', 'From spouse', [parentId]);
      const updated = getRewardsAvailableTo(parentId);
      const massageReward = updated[0].rewards.find(r => r.name === 'Massage');
      expect(massageReward).toBeDefined();
    });

    it('cannot see your own rewards in shop', () => {
      addReward(parentId, 'My Reward', 20, '🎁');
      
      const available = getRewardsAvailableTo(parentId);
      // Should not include your own rewards
      const selfRewards = available.find(g => g.owner.id === parentId);
      expect(selfRewards).toBeUndefined();
    });

    it('redeems a reward', () => {
      const reward = addReward(parentId, 'Ice Cream', 20, '🍦');
      addPoints(childId, 50);
      
      const redemption = redeemReward(reward.id, childId);
      expect(redemption?.status).toBe('pending');
      expect(getMember(childId)?.pointsBalance).toBe(30);
    });

    it('fails to redeem without enough points', () => {
      const reward = addReward(parentId, 'Ice Cream', 20, '🍦');
      addPoints(childId, 10);
      
      const redemption = redeemReward(reward.id, childId);
      expect(redemption).toBeNull();
      expect(getMember(childId)?.pointsBalance).toBe(10);
    });
  });

  describe('Parent Self-Assigned Quests (F19)', () => {
    let parentId: string;
    const PACK_SLUG = 'starter-pack';
    const CHALLENGE_SLUG = 'make-your-bed-7-days';

    beforeEach(() => {
      createFamily('Test Family');
      parentId = addMember('Dad', '👨', 'parent').id;
    });

    it('parent can start quest for themselves', () => {
      const quest = startPackQuest(parentId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      expect(quest.recipientId).toBe(parentId);
      expect(quest.issuerId).toBe(parentId);
      expect(quest.status).toBe('active');
    });

    it('parent completing own quest gets points', () => {
      const quest = startPackQuest(parentId, parentId, PACK_SLUG, CHALLENGE_SLUG);
      submitQuest(quest.id);
      approveQuest(quest.id);
      
      expect(getMember(parentId)?.pointsBalance).toBeGreaterThan(0);
    });
  });
});
