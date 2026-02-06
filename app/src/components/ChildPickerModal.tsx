'use client';

import { FamilyMember } from '@/lib/types';
import { Modal } from './Modal';

interface ChildPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: FamilyMember[];
  title?: string;
  subtitle?: string;
  onSelect: (childId: string) => void;
}

export function ChildPickerModal({ 
  isOpen, 
  onClose, 
  children, 
  title = 'Assign Quest To',
  subtitle,
  onSelect 
}: ChildPickerModalProps) {
  const handleSelect = (childId: string) => {
    onSelect(childId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-3">
        {subtitle && (
          <p className="text-stone-500 text-center mb-4">{subtitle}</p>
        )}
        
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => handleSelect(child.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border-2 border-transparent hover:border-amber-400 hover:bg-amber-50 transition-all tap-target"
          >
            <span className="text-4xl">{child.avatar}</span>
            <div className="flex-1 text-left">
              <span className="font-bold text-lg text-stone-800">{child.name}</span>
              <div className="text-sm text-amber-600 font-semibold">
                ⭐ {child.pointsBalance} pts
              </div>
            </div>
            <span className="text-stone-300 text-2xl">→</span>
          </button>
        ))}

        {children.length === 0 && (
          <p className="text-center text-stone-500 py-8">
            No children in your family yet!
          </p>
        )}
      </div>
    </Modal>
  );
}
