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
 * 탭에는 **라벨과 필수·선택 표시, 완료 체크**를 둔다.
 * 표시는 웹 신청 시트의 제목과 같은 `(필수)` 형태다 — 배지가 아니라 괄호 텍스트다. 무엇을 반드시 채워야 하는지는
 * 탭을 열기 전에 보여야 하는 정보라 섹션 카드 헤더에서 여기로 옮겼다. 칩이 붙어도
 * 탭 줄은 두 줄로 넘치지 않는다 — `overflow-x-auto` 라 폭이 모자라면 가로로 스크롤된다.
 *
 * 섹션 번호 배지는 그대로 카드 헤더에 남는다.
 *
 * 필수 여부는 탭 이름(`aria-label`)에도 있으므로 칩은 `aria-hidden` 이다 — 그러지 않으면
 * 같은 말을 두 번 읽는다.
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
          <span
            aria-hidden="true"
            className={
              tab.required
                ? 'text-primary text-sm font-medium'
                : 'text-sm font-medium text-gray-400'
            }
          >
            ({requiredLabel})
          </span>
          {isComplete ? <CheckIcon /> : null}
        </button>
      );
    })}
  </div>
);

export default DetailTabs;
