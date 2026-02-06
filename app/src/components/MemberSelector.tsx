'use client';

import { FamilyMember } from '@/lib/types';

interface MemberSelectorProps {
  members: FamilyMember[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddMember?: () => void;
  showPoints?: boolean;
  filterRole?: 'parent' | 'child';
}

export function MemberSelector({ 
  members, 
  selectedId, 
  onSelect, 
  onAddMember,
  showPoints = true,
  filterRole 
}: MemberSelectorProps) {
  const filteredMembers = filterRole 
    ? members.filter(m => m.role === filterRole)
    : members;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {filteredMembers.map((member) => (
        <button
          key={member.id}
          onClick={() => onSelect(member.id)}
          className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl transition-all tap-target min-w-[80px] ${
            selectedId === member.id
              ? 'bg-amber-100 border-2 border-amber-400 scale-105'
              : 'bg-white border-2 border-stone-100 hover:border-amber-200'
          }`}
        >
          <span className="text-3xl mb-1">{member.avatar}</span>
          <span className={`text-sm font-semibold truncate max-w-[70px] ${
            selectedId === member.id ? 'text-amber-700' : 'text-stone-700'
          }`}>
            {member.name}
          </span>
          {showPoints && (
            <span className="text-xs text-stone-400 mt-0.5">
              ⭐ {member.pointsBalance}
            </span>
          )}
        </button>
      ))}
      
      {onAddMember && (
        <button
          onClick={onAddMember}
          className="flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all tap-target min-w-[80px]"
        >
          <span className="text-2xl mb-1 text-stone-400">➕</span>
          <span className="text-sm font-semibold text-stone-400">Add</span>
        </button>
      )}
    </div>
  );
}
