'use client';

import { useState } from 'react';
import { MemberRole } from '@/lib/types';

interface AddMemberProps {
  onAdd: (name: string, avatar: string, role: MemberRole) => void;
  onCancel: () => void;
  defaultRole?: MemberRole;
}

const AVATAR_OPTIONS = [
  // People
  '👨', '👩', '👧', '👦', '🧒', '👶',
  // Fun characters
  '🦸‍♀️', '🦸‍♂️', '🧙‍♀️', '🧙‍♂️', '🧚', '🧜‍♀️',
  // Animals
  '🦄', '🐱', '🐶', '🦊', '🐸', '🐼', '🦋', '🦁', '🐰', '🐻',
  // Objects
  '⭐', '🌟', '🎀', '🎮', '⚽', '🎨'
];

export function AddMember({ onAdd, onCancel, defaultRole = 'child' }: AddMemberProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(defaultRole === 'parent' ? '👨' : '👧');
  const [role, setRole] = useState<MemberRole>(defaultRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), avatar, role);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Role selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-600 mb-3">
          Who are you adding?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setRole('parent');
              if (['👧', '👦', '🧒', '👶'].includes(avatar)) setAvatar('👨');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all tap-target ${
              role === 'parent'
                ? 'bg-violet-100 border-2 border-violet-400 text-violet-700'
                : 'bg-stone-50 border-2 border-transparent text-stone-600 hover:border-stone-200'
            }`}
          >
            👨‍👩 Parent
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('child');
              if (['👨', '👩'].includes(avatar)) setAvatar('👧');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all tap-target ${
              role === 'child'
                ? 'bg-amber-100 border-2 border-amber-400 text-amber-700'
                : 'bg-stone-50 border-2 border-transparent text-stone-600 hover:border-stone-200'
            }`}
          >
            👧 Child
          </button>
        </div>
      </div>

      {/* Avatar selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-600 mb-3">
          Pick an avatar
        </label>
        <div className="grid grid-cols-6 gap-2 max-h-[180px] overflow-y-auto p-1">
          {AVATAR_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={`text-3xl p-2 rounded-xl transition-all tap-target ${
                avatar === emoji
                  ? 'bg-amber-100 border-2 border-amber-400 scale-110'
                  : 'bg-stone-50 border-2 border-transparent hover:border-amber-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          What's their name?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name..."
          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none text-lg"
          autoFocus
        />
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-stone-50 rounded-xl">
        <span className="text-4xl">{avatar}</span>
        <div>
          <span className="text-xl font-semibold text-stone-700">
            {name || 'New member'}
          </span>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            role === 'parent' 
              ? 'bg-violet-100 text-violet-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {role}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add {role === 'parent' ? 'Parent' : 'Child'}
        </button>
      </div>
    </form>
  );
}
