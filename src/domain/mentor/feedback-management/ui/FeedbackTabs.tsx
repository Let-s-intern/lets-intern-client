'use client';

export type FeedbackTabKey = 'all' | 'written' | 'live';

const TABS: { key: FeedbackTabKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'written', label: '서면 피드백' },
  { key: 'live', label: '라이브 피드백' },
];

interface FeedbackTabsProps {
  activeTab: FeedbackTabKey;
  onChange: (tab: FeedbackTabKey) => void;
}

const FeedbackTabs = ({ activeTab, onChange }: FeedbackTabsProps) => {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative min-h-[40px] px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FeedbackTabs;
