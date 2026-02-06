'use client';

import { useState } from 'react';
import { PinPad } from './PinPad';

interface ApprovalHandoffProps {
  childName: string;
  questTitle: string;
  onApproveNow: (pin: string) => boolean; // returns true if PIN correct
  onLater: () => void;
}

export function ApprovalHandoff({ 
  childName, 
  questTitle, 
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
        <p className="text-amber-800 font-semibold">{questTitle}</p>
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
          I'll approve later
        </button>
      </div>
      
      <p className="text-stone-400 text-sm mt-4">
        Quest will stay in pending until approved
      </p>
    </div>
  );
}
