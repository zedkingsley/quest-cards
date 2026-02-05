'use client';

interface NavigationProps {
  activeTab: 'home' | 'packs' | 'trophy' | 'settings';
  onTabChange: (tab: 'home' | 'packs' | 'trophy' | 'settings') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home' as const, icon: '🏠', label: 'Home' },
    { id: 'packs' as const, icon: '📦', label: 'Packs' },
    { id: 'trophy' as const, icon: '🏆', label: 'Rewards' },
    { id: 'settings' as const, icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all tap-target ${
              activeTab === tab.id
                ? 'text-amber-600'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className={`text-xs font-medium ${
              activeTab === tab.id ? 'text-amber-600' : ''
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
