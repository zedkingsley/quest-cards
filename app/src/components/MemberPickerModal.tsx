'use client';

import { FamilyMember } from '@/lib/types';
import { Modal } from './Modal';

interface MemberPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  currentMemberId: string | null;
  onSelect: (memberId: string) => void;
}

export function MemberPickerModal({ 
  isOpen, 
  onClose, 
  members, 
  currentMemberId, 
  onSelect 
}: MemberPickerModalProps) {
  const parents = members.filter(m => m.role === 'parent');
  const children = members.filter(m => m.role === 'child');

  const handleSelect = (memberId: string) => {
    onSelect(memberId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Who's Playing?">
      <div className="space-y-6">
        {/* Parents */}
        {parents.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Parents
            </h3>
            <div className="space-y-2">
              {parents.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isSelected={currentMemberId === member.id}
                  onSelect={() => handleSelect(member.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Children */}
        {children.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Children
            </h3>
            <div className="space-y-2">
              {children.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isSelected={currentMemberId === member.id}
                  onSelect={() => handleSelect(member.id)}
                />
              ))}
            </div>
          </section>
        )}

        {members.length === 0 && (
          <p className="text-center text-stone-500 py-8">
            No family members yet. Add someone in Settings!
          </p>
        )}
      </div>
    </Modal>
  );
}

function MemberRow({ 
  member, 
  isSelected, 
  onSelect 
}: { 
  member: FamilyMember; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all tap-target ${
        isSelected
          ? 'bg-amber-100 border-2 border-amber-400'
          : 'bg-stone-50 border-2 border-transparent hover:border-stone-200'
      }`}
    >
      <span className="text-4xl">{member.avatar}</span>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-stone-800">{member.name}</span>
          {isSelected && <span className="text-amber-600">✓</span>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-amber-600 font-semibold">⭐ {member.pointsBalance} pts</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            member.role === 'parent' 
              ? 'bg-violet-100 text-violet-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            {member.role}
          </span>
        </div>
      </div>
    </button>
  );
}
