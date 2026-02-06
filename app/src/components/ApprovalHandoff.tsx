'use client';

import { useState } from 'react';
import { PinPad } from './PinPad';

interface ApprovalHandoffProps {
  childName: string;
  questTitle: string;
  questDescription?: string;
  questIcon?: string;
  questReward?: number;
  onApproveNow: (pin: string) => boolean; // returns true if PIN correct
  onLater: () => void;
}

export function ApprovalHandoff({ 
  childName, 
  questTitle,
  questDescription,
  questIcon,
  questReward,
  onApproveNow, 
  onLater 
}: ApprovalHandoffProps) {
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (pin: string) => {
    const success = onApproveNow(pin);
    if (success) {
      // Will close via parent
    } else {
      setPinError(true);
    }
  };

  if (showPinPad) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h3 className="text-xl font-bold text-stone-800 mb-2">Parent Approval</h3>
        <p className="text-stone-500 text-sm mb-6">
          Enter PIN to approve "{questTitle}"
        </p>
        <PinPad
          onSubmit={handlePinSubmit}
          onCancel={() => {
            setShowPinPad(false);
            setPinError(false);
          }}
          error={pinError}
        />
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-2xl font-bold text-stone-800 mb-2">
        Great job, {childName}!
      </h3>
      <p className="text-stone-600 mb-6">
        Hand the phone to a parent to approve your quest.
      </p>
      
      <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
        <div className="flex items-start gap-3">
          {questIcon && <span className="text-3xl">{questIcon}</span>}
          <div className="flex-1 text-left">
            <p className="text-amber-800 font-bold">{questTitle}</p>
            {questDescription && (
              <p className="text-amber-700 text-sm mt-1">{questDescription}</p>
            )}
            {questReward && (
              <p className="text-amber-600 text-sm mt-2 font-semibold">🎁 {questReward} points</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setShowPinPad(true)}
          className="btn btn-primary w-full text-lg py-4"
        >
          🔐 Parent: Approve Now
        </button>
        <button
          onClick={onLater}
          className="btn btn-outline w-full"
        >
          Skip
        </button>
      </div>
      
      <p className="text-stone-400 text-sm mt-4">
        Quest will stay in pending until approved
      </p>
    </div>
  );
}
