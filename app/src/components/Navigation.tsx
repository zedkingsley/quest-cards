'use client';

export type Tab = 'home' | 'challenges' | 'shop' | 'settings';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  pendingCount?: number;
}

export function Navigation({ activeTab, onTabChange, pendingCount = 0 }: NavigationProps) {
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'challenges', icon: '🎯', label: 'Quests' },
    { id: 'shop', icon: '🎁', label: 'Shop' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 pb-safe z-20">
      <div className="max-w-lg mx-auto flex justify-around py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center py-2 px-4 rounded-xl transition-all tap-target ${
              activeTab === tab.id
                ? 'text-amber-600'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <span className="text-2xl mb-0.5">{tab.icon}</span>
            <span className={`text-xs font-medium ${
              activeTab === tab.id ? 'text-amber-600' : ''
            }`}>
              {tab.label}
            </span>
            {/* Pending badge for home tab */}
            {tab.id === 'home' && pendingCount > 0 && (
              <span className="absolute -top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
