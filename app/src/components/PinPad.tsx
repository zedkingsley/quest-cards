'use client';

import { useState } from 'react';

interface PinPadProps {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  title?: string;
  error?: boolean;
}

export function PinPad({ onSubmit, onCancel, title = 'Enter PIN', error = false }: PinPadProps) {
  const [pin, setPin] = useState('');
  
  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        onSubmit(newPin);
      }
    }
  };
  
  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };
  
  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm mb-6">Enter your 4-digit family PIN</p>
      
      {/* PIN display */}
      <div className={`flex justify-center gap-3 mb-6 ${error ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
              i < pin.length
                ? error
                  ? 'bg-red-100 border-red-400 text-red-600'
                  : 'bg-amber-100 border-amber-400 text-amber-700'
                : 'bg-stone-50 border-stone-200'
            }`}
          >
            {i < pin.length ? '•' : ''}
          </div>
        ))}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mb-4">Wrong PIN, try again</p>
      )}
      
      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-16 h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-2xl font-bold text-stone-700 transition-all tap-target"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="w-16 h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-sm font-semibold text-stone-500 transition-all tap-target"
        >
          Clear
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="w-16 h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-2xl font-bold text-stone-700 transition-all tap-target"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-16 h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-2xl font-bold text-stone-500 transition-all tap-target"
        >
          ←
        </button>
      </div>
      
      <button
        onClick={onCancel}
        className="btn btn-outline"
      >
        Cancel
      </button>
    </div>
  );
}
