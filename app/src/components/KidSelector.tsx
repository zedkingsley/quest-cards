'use client';

import { Kid } from '@/lib/types';

interface KidSelectorProps {
  kids: Kid[];
  selectedKidId: string | null;
  onSelect: (kidId: string) => void;
  onAddKid?: () => void;
}

export function KidSelector({ kids, selectedKidId, onSelect, onAddKid }: KidSelectorProps) {
  if (kids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500 mb-4">No kids added yet!</p>
        {onAddKid && (
          <button
            onClick={onAddKid}
            className="btn btn-primary"
          >
            Add a Kid
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
      {kids.map((kid) => (
        <button
          key={kid.id}
          onClick={() => onSelect(kid.id)}
          className={`flex flex-col items-center p-4 rounded-2xl transition-all tap-target min-w-[100px] ${
            selectedKidId === kid.id
              ? 'bg-amber-100 border-2 border-amber-400 scale-105'
              : 'bg-white border-2 border-stone-100 hover:border-amber-200'
          }`}
        >
          <span className="text-4xl mb-2">{kid.avatar}</span>
          <span className={`font-semibold text-sm ${
            selectedKidId === kid.id ? 'text-amber-700' : 'text-stone-600'
          }`}>
            {kid.name}
          </span>
        </button>
      ))}
      {onAddKid && (
        <button
          onClick={onAddKid}
          className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-stone-200 hover:border-amber-300 transition-all tap-target min-w-[100px]"
        >
          <span className="text-3xl mb-2 text-stone-300">➕</span>
          <span className="font-semibold text-sm text-stone-400">Add</span>
        </button>
      )}
    </div>
  );
}
