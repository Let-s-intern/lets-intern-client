import { DETAIL_TABS, type DetailTabId } from '../tabs';

interface DetailTabsProps {
  activeTab: DetailTabId;
  /** 완료 표시를 붙일 탭. 판정은 `tabs.ts` 의 `isDetailTabComplete` 가 한다. */
  completedTabs: ReadonlySet<DetailTabId>;
  onChange: (tab: DetailTabId) => void;
}

/** 완료 체크 아이콘. 뜻은 탭 이름(`aria-label`)이 전하므로 그림은 숨긴다. */
const CheckIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M8.2 14.4 4.4 10.6l1.4-1.4 2.4 2.4 5.6-5.6 1.4 1.4z" />
  </svg>
);

/**
 * 상세 페이지 설정 탭 네비게이션.
 *
 * **입력 잠금(`fieldset disabled`) 바깥에 둔다.** 오픈 중이라 편집할 수 없을 때도
 * 탭 이동은 계속 동작해야 한다 — 잠금이 이동까지 삼키면 멘토는 자기 페이지를
 * 읽지도 못한다.
 *
 * 번호 배지는 순서를 보여주는 장식이라 `aria-hidden` 이고, 필수 여부와 완료 여부는
 * 화면 낭독에도 필요해 탭 이름(`aria-label`)에 넣는다.
 */
const DetailTabs = ({
  activeTab,
  completedTabs,
  onChange,
}: DetailTabsProps) => (
  <div
    role="tablist"
    aria-label="상세 페이지 섹션"
    className="flex flex-wrap gap-2"
  >
    {DETAIL_TABS.map((tab, index) => {
      const isActive = tab.id === activeTab;
      const requiredLabel = tab.required ? '필수' : '선택';
      const isComplete = completedTabs.has(tab.id);
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={`${tab.label} ${requiredLabel}${isComplete ? ' 완료' : ''}`}
          onClick={() => onChange(tab.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full py-2 pl-2 pr-3 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'border border-gray-200 bg-white text-gray-600'
          }`}
        >
          <span
            aria-hidden="true"
            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
              isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {index + 1}
          </span>
          {tab.label}
          <span
            aria-hidden="true"
            className={`rounded px-1.5 py-0.5 text-[11px] ${
              isActive
                ? 'bg-white/20 text-white'
                : tab.required
                  ? 'bg-primary-10 text-primary'
                  : 'bg-gray-100 text-gray-500'
            }`}
          >
            {requiredLabel}
          </span>
          {isComplete ? <CheckIcon /> : null}
        </button>
      );
    })}
  </div>
);

export default DetailTabs;
