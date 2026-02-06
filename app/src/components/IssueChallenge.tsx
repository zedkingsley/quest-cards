'use client';

import { useState } from 'react';
import { FamilyMember } from '@/lib/types';

interface IssueChallengeProps {
  issuer: FamilyMember;
  recipients: FamilyMember[];
  onIssue: (
    recipientId: string,
    title: string,
    description: string,
    icon: string,
    reward: number,
    customRewardText?: string
  ) => void;
  onCancel: () => void;
}

const ICON_OPTIONS = [
  '✨', '🌟', '⭐', '💪', '🎯', '🏆', 
  '🧹', '🍽️', '📚', '🎨', '🎮', '🏃',
  '🧘', '💝', '🤝', '📝', '🛏️', '👕',
  '🚿', '🦷', '🐕', '🌱', '🎵', '🔧'
];

export function IssueChallenge({ issuer, recipients, onIssue, onCancel }: IssueChallengeProps) {
  const [recipientId, setRecipientId] = useState<string>(recipients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [reward, setReward] = useState(20);
  const [customRewardText, setCustomRewardText] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const selectedRecipient = recipients.find(r => r.id === recipientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && recipientId) {
      onIssue(
        recipientId,
        title.trim(),
        description.trim(),
        icon,
        reward,
        customRewardText.trim() || undefined
      );
    }
  };

  const presetChallenges = [
    { title: 'Clean your room', icon: '✨', reward: 30 },
    { title: 'Take out trash', icon: '🗑️', reward: 10 },
    { title: 'Do homework', icon: '📚', reward: 20 },
    { title: 'Practice instrument', icon: '🎵', reward: 30 },
    { title: 'Help with dinner', icon: '🍽️', reward: 20 },
    { title: 'Walk the dog', icon: '🐕', reward: 20 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Recipient selector */}
      <div>
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          Challenge who?
        </label>
        <div className="flex gap-2 flex-wrap">
          {recipients.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => setRecipientId(member.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                recipientId === member.id
                  ? 'bg-amber-100 border-2 border-amber-400 text-amber-700'
                  : 'bg-stone-50 border-2 border-transparent text-stone-600 hover:border-stone-200'
              }`}
            >
              <span className="text-xl">{member.avatar}</span>
              <span className="font-semibold">{member.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          Quick picks
        </label>
        <div className="flex gap-2 flex-wrap">
          {presetChallenges.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => {
                setTitle(preset.title);
                setIcon(preset.icon);
                setReward(preset.reward);
              }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-sm transition-all"
            >
              {preset.icon} {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Icon and Title */}
      <div className="flex gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-16 h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-3xl transition-all"
          >
            {icon}
          </button>
          {showIconPicker && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-stone-200 grid grid-cols-6 gap-1 z-10">
              {ICON_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setIcon(emoji);
                    setShowIconPicker(false);
                  }}
                  className="w-10 h-10 rounded-lg hover:bg-amber-100 flex items-center justify-center text-xl transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the challenge?"
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none text-lg"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          Details (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any specific instructions?"
          rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none resize-none"
        />
      </div>

      {/* Points reward */}
      <div>
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          Points reward
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={reward}
            onChange={(e) => setReward(parseInt(e.target.value))}
            className="flex-1"
          />
          <div className="w-20 text-center">
            <span className="text-2xl font-bold text-amber-600">{reward}</span>
            <span className="text-sm text-stone-500"> pts</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-stone-400 mt-1">
          <span>5 pts</span>
          <span>100 pts</span>
        </div>
      </div>

      {/* Custom reward text */}
      <div>
        <label className="block text-sm font-semibold text-stone-600 mb-2">
          Bonus reward (optional)
        </label>
        <input
          type="text"
          value={customRewardText}
          onChange={(e) => setCustomRewardText(e.target.value)}
          placeholder="e.g., I'll make your favorite dinner"
          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Preview */}
      {selectedRecipient && title && (
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
          <p className="text-sm text-amber-600 mb-2 font-semibold">Preview:</p>
          <div className="flex items-start gap-3">
            <span className="text-3xl">{icon}</span>
            <div className="flex-1">
              <p className="font-bold text-stone-800">{title}</p>
              <p className="text-sm text-stone-600">
                {issuer.avatar} {issuer.name} → {selectedRecipient.avatar} {selectedRecipient.name}
              </p>
              <p className="text-amber-700 font-semibold mt-1">
                🎁 {reward} points
                {customRewardText && ` + "${customRewardText}"`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !recipientId}
          className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎯 Issue Challenge
        </button>
      </div>
    </form>
  );
}
