export type FeedbackTabKey = 'all' | 'written' | 'live' | 'live-mentoring';

/*
  탭 키는 `FeedbackRow['type']` 과 같은 값을 쓴다 — 필터가 `r.type === activeTab`
  하나로 끝난다. 1대1 라이브 멘토링 행은 예전부터 만들어지고 있었는데 여기에 키가
  없어서 "전체 내역" 에서만 보였다.
 */
const TABS: { key: FeedbackTabKey; label: string }[] = [
  { key: 'all', label: '전체 내역' },
  { key: 'written', label: '서면 피드백 내역' },
  { key: 'live', label: 'LIVE 피드백 내역' },
  { key: 'live-mentoring', label: '1대1 라이브 멘토링' },
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
              isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="bg-primary absolute bottom-0 left-0 h-[2px] w-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FeedbackTabs;
