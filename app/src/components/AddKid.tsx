'use client';

import { useState } from 'react';

interface AddKidProps {
  onAdd: (name: string, avatar: string) => void;
  onCancel: () => void;
}

const AVATAR_OPTIONS = ['👧', '👦', '🧒', '👶', '🦸‍♀️', '🦸‍♂️', '🧙‍♀️', '🧙‍♂️', '🦄', '🐱', '🐶', '🦊', '🐸', '🐼', '🦋', '🌟'];

export function AddKid({ onAdd, onCancel }: AddKidProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👧');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), avatar);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Avatar selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-600 mb-3">
          Pick an avatar
        </label>
        <div className="grid grid-cols-8 gap-2">
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
        <span className="text-xl font-semibold text-stone-700">
          {name || 'Your kid'}
        </span>
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
          Add Kid
        </button>
      </div>
    </form>
  );
}
