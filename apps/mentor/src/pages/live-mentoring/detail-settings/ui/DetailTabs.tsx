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
 * 시안 기준 탭에는 **라벨과 완료 체크만** 둔다. 섹션 번호 배지와 필수·선택 칩은
 * 탭이 아니라 각 섹션 카드 헤더(`DetailSectionHeader`)에 붙는다 — 탭 줄에 다 넣으면
 * 6개가 두 줄로 넘치고, 지금 무엇을 편집 중인지가 오히려 안 보인다.
 *
 * 필수 여부는 화면 낭독에 필요하므로 탭 이름(`aria-label`)에는 남긴다.
 */
const DetailTabs = ({
  activeTab,
  completedTabs,
  onChange,
}: DetailTabsProps) => (
  <div
    role="tablist"
    aria-label="상세 페이지 섹션"
    className="flex items-stretch gap-1 overflow-x-auto border-b border-gray-200"
  >
    {DETAIL_TABS.map((tab) => {
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
          className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors ${
            isActive
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent font-medium text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {isComplete ? <CheckIcon /> : null}
        </button>
      );
    })}
  </div>
);

export default DetailTabs;
