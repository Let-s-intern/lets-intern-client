import { DETAIL_TABS, type DetailTabId } from '../tabs';

interface DetailTabsProps {
  activeTab: DetailTabId;
  onChange: (tab: DetailTabId) => void;
}

/**
 * 상세 페이지 설정 탭 네비게이션.
 *
 * **입력 잠금(`fieldset disabled`) 바깥에 둔다.** 오픈 중이라 편집할 수 없을 때도
 * 탭 이동은 계속 동작해야 한다 — 잠금이 이동까지 삼키면 멘토는 자기 페이지를
 * 읽지도 못한다.
 */
const DetailTabs = ({ activeTab, onChange }: DetailTabsProps) => (
  <div role="tablist" aria-label="상세 페이지 섹션" className="flex gap-2">
    {DETAIL_TABS.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'border border-gray-200 bg-white text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default DetailTabs;
