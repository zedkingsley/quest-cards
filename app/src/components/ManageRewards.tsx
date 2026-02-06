'use client';

import { useState } from 'react';
import { FamilyMember, Reward } from '@/lib/types';

interface ManageRewardsProps {
  owner: FamilyMember;
  rewards: Reward[];
  familyMembers: FamilyMember[];
  onAddReward: (name: string, pointCost: number, icon: string, description?: string, availableTo?: string[]) => void;
  onUpdateReward: (rewardId: string, updates: Partial<Reward>) => void;
  onDeleteReward: (rewardId: string) => void;
  onClose: () => void;
}

const ICON_OPTIONS = ['🎁', '💵', '🎬', '📱', '🌙', '🥞', '🍦', '🎮', '🛍️', '🎠', '🚗', '🍕', '⏰', '📖', '🎵', '🏊'];

export function ManageRewards({
  owner,
  rewards,
  familyMembers,
  onAddReward,
  onUpdateReward,
  onDeleteReward,
  onClose,
}: ManageRewardsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Add form state
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState(20);
  const [newIcon, setNewIcon] = useState('🎁');
  const [newDescription, setNewDescription] = useState('');
  const [newAvailableTo, setNewAvailableTo] = useState<string[]>([]);

  // F20: Allow targeting any family member (not just children)
  const otherMembers = familyMembers.filter(m => m.id !== owner.id);

  const handleAdd = () => {
    if (newName.trim()) {
      onAddReward(
        newName.trim(),
        newCost,
        newIcon,
        newDescription.trim() || undefined,
        newAvailableTo.length > 0 ? newAvailableTo : undefined
      );
      resetForm();
      setShowAddForm(false);
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewCost(20);
    setNewIcon('🎁');
    setNewDescription('');
    setNewAvailableTo([]);
  };

  const toggleAvailability = (memberId: string) => {
    setNewAvailableTo(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Group rewards by availability
  const everyoneRewards = rewards.filter(r => r.availableTo.length === 0);
  const specificRewards = rewards.filter(r => r.availableTo.length > 0);
  const children = familyMembers.filter(m => m.role === 'child');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-800">
          {owner.avatar} My Reward Shop
        </h2>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
          ✕
        </button>
      </div>

      {/* For Everyone section */}
      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          For Everyone
        </h3>
        <div className="space-y-2">
          {everyoneRewards.map((reward) => (
            <RewardRow
              key={reward.id}
              reward={reward}
              isEditing={editingId === reward.id}
              onEdit={() => setEditingId(reward.id)}
              onSave={(updates) => {
                onUpdateReward(reward.id, updates);
                setEditingId(null);
              }}
              onToggle={() => onUpdateReward(reward.id, { active: !reward.active })}
              onDelete={() => onDeleteReward(reward.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </div>
      </section>

      {/* Per-member sections (F20: includes parents) */}
      {otherMembers.map((member) => {
        const memberRewards = specificRewards.filter(r => r.availableTo.includes(member.id));
        if (memberRewards.length === 0) return null;
        
        return (
          <section key={member.id}>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              For {member.avatar} {member.name}
            </h3>
            <div className="space-y-2">
              {memberRewards.map((reward) => (
                <RewardRow
                  key={reward.id}
                  reward={reward}
                  isEditing={editingId === reward.id}
                  onEdit={() => setEditingId(reward.id)}
                  onSave={(updates) => {
                    onUpdateReward(reward.id, updates);
                    setEditingId(null);
                  }}
                  onToggle={() => onUpdateReward(reward.id, { active: !reward.active })}
                  onDelete={() => onDeleteReward(reward.id)}
                  onCancel={() => setEditingId(null)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Add new reward */}
      {showAddForm ? (
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 space-y-4">
          <h4 className="font-semibold text-amber-800">Add New Reward</h4>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-14 h-14 rounded-xl bg-white border-2 border-stone-200 text-2xl text-center appearance-none cursor-pointer"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Reward name..."
              className="flex-1 px-4 py-2 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-stone-600">Cost:</label>
            <input
              type="number"
              value={newCost}
              onChange={(e) => setNewCost(parseInt(e.target.value) || 0)}
              min="1"
              max="500"
              className="w-20 px-3 py-2 rounded-lg border-2 border-stone-200 focus:border-amber-400 focus:outline-none text-center"
            />
            <span className="text-stone-500">points</span>
          </div>

          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)..."
            className="w-full px-4 py-2 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none"
          />

          <div>
            <label className="block text-sm text-stone-600 mb-2">Available to:</label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setNewAvailableTo([])}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  newAvailableTo.length === 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Everyone
              </button>
              {/* F20: Show all family members (not just children) */}
              {otherMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleAvailability(member.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    newAvailableTo.includes(member.id)
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {member.avatar} {member.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(false);
              }}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="btn btn-primary flex-1 disabled:opacity-50"
            >
              Add Reward
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-all font-semibold"
        >
          ➕ Add New Reward
        </button>
      )}
    </div>
  );
}

// Sub-component for individual reward rows
interface RewardRowProps {
  reward: Reward;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Reward>) => void;
  onToggle: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

function RewardRow({ reward, isEditing, onEdit, onSave, onToggle, onDelete, onCancel }: RewardRowProps) {
  const [editName, setEditName] = useState(reward.name);
  const [editCost, setEditCost] = useState(reward.pointCost);

  if (isEditing) {
    return (
      <div className="bg-amber-50 rounded-xl p-3 border-2 border-amber-200 space-y-3">
        <div className="flex gap-2">
          <span className="text-2xl">{reward.icon}</span>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-3 py-1 rounded-lg border border-stone-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editCost}
            onChange={(e) => setEditCost(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-1 rounded-lg border border-stone-200 text-center"
          />
          <span className="text-stone-500 text-sm">points</span>
          <div className="flex-1" />
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-stone-500 hover:text-stone-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ name: editName, pointCost: editCost })}
            className="px-3 py-1 text-sm bg-amber-500 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      reward.active ? 'bg-white border border-stone-100' : 'bg-stone-50 opacity-60'
    }`}>
      <span className="text-2xl">{reward.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${reward.active ? 'text-stone-800' : 'text-stone-500'}`}>
          {reward.name}
        </p>
        <p className="text-amber-600 text-sm font-semibold">{reward.pointCost} pts</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-10 h-6 rounded-full transition-all ${
          reward.active ? 'bg-emerald-500' : 'bg-stone-300'
        }`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-all ${
          reward.active ? 'translate-x-4' : 'translate-x-0.5'
        }`} />
      </button>
      <button
        onClick={onEdit}
        className="p-2 text-stone-400 hover:text-stone-600"
      >
        ✏️
      </button>
      {!reward.isDefault && (
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-600"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
