import { SETTINGS_TABS, type SettingsTabId } from '../tabs';

interface SettingsTabsProps {
  /**
   * 들어갈 수 있는 스텝(`unlockedSettingsTabs`). 여기 없는 탭은 **보이되 잠긴다** —
   * 첫 세팅에서 아직 차례가 오지 않은 단계다. 안 넘기면 전부 열려 있는 것으로 본다.
   */
  unlockedTabs?: ReadonlySet<SettingsTabId>;
  activeTab: SettingsTabId;
  /** 완료 표시를 붙일 탭. 판정은 `tabs.ts` 의 `isDetailTabComplete` 가 한다. */
  completedTabs: ReadonlySet<SettingsTabId>;
  onChange: (tab: SettingsTabId) => void;
}

/**
 * 완료 체크 아이콘. 뜻은 탭 이름(`aria-label`)이 전하므로 그림은 숨긴다.
 *
 * 색을 탭 글자에서 물려받지 않고 파랑(primary)으로 고정한다(LC-3279). 예전에는
 * `currentColor` 라 열려 있는 탭에서는 파랑, 나머지는 회색이었다 — 회색 체크는
 * 미완료 탭의 회색 글자와 같은 색이라, 훑어봐서는 무엇을 다 채웠는지 알 수 없었다.
 * 완료는 선택 여부와 무관한 상태이므로 색도 탭 상태를 따라가면 안 된다.
 *
 * 초록(secondary)이 아니라 파랑이다. 이 화면의 강조색이 파랑 하나뿐이라, 완료 표시만
 * 다른 계열이면 "성공" 이 아니라 "다른 종류의 알림" 으로 읽힌다.
 */
const CheckIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="text-primary h-4 w-4"
    fill="currentColor"
  >
    <path d="M8.2 14.4 4.4 10.6l1.4-1.4 2.4 2.4 5.6-5.6 1.4 1.4z" />
  </svg>
);

/**
 * 1대1 라이브 멘토링 설정 스텝 네비게이션.
 *
 * 첫 스텝이 오픈 설정이고 나머지가 상세 페이지 섹션이다(LC-3264). 스텝을 옮기면
 * 본문이 통째로 바뀌므로, 저장하지 않은 값이 있는 스텝을 떠날 때의 경고는
 * 페이지가 맡는다.
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
const SettingsTabs = ({
  unlockedTabs,
  activeTab,
  completedTabs,
  onChange,
}: SettingsTabsProps) => (
  <div
    role="tablist"
    aria-label="1:1 LIVE 멘토링 설정 스텝"
    className="flex items-stretch gap-1 overflow-x-auto border-b border-gray-200"
  >
    {SETTINGS_TABS.map((tab) => {
      const isActive = tab.id === activeTab;
      const requiredLabel = tab.required ? '필수' : '선택';
      const isComplete = completedTabs.has(tab.id);
      /* 잠긴 스텝은 보이되 들어갈 수 없다. 안 넘겨주면 전부 열린 것으로 본다. */
      const isLocked = unlockedTabs ? !unlockedTabs.has(tab.id) : false;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          disabled={isLocked}
          aria-label={`${tab.label} ${requiredLabel}${isComplete ? ' 완료' : ''}${
            isLocked ? ' 잠김' : ''
          }`}
          onClick={() => onChange(tab.id)}
          className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isActive
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent font-medium text-gray-500 enabled:hover:text-gray-700'
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

export default SettingsTabs;
