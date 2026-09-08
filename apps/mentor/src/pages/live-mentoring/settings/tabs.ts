import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 상세 페이지 설정의 탭 정의.
 *
 * 오픈 설정이 첫 스텝으로 앞에 붙는다(LC-3264). 그쪽은 템플릿 섹션이 아니라
 * 별도 화면이라 여기 목록에는 넣지 않고 `SETTINGS_TABS` 에서 합친다.
 *
 * 탭 id 는 템플릿의 섹션 키와 같다 — 편집 폼의 `data-section`(미리보기 자동 스크롤)과
 * 같은 어휘를 써야 탭과 미리보기가 서로 다른 이름으로 갈라지지 않는다.
 */
export type DetailTabId =
  | 'hero'
  | 'intro'
  | 'mentoringTypes'
  | 'strategy'
  | 'video'
  | 'results';

export interface DetailTab {
  id: DetailTabId;
  label: string;
  /** `필수` / `선택` 칩의 근거. 선택 탭은 서버 `visible` 토글이 있는 섹션이다. */
  required: boolean;
}

/**
 * 탭 순서와 필수 여부(PRD §5).
 *
 * `취업 성공 전략` 은 시안에 없지만 이미 구현된 섹션이라 탭 하나로 옮겼다.
 * 라벨·칩 규칙은 다른 선택 탭과 같다.
 */
export const DETAIL_TABS: readonly DetailTab[] = [
  { id: 'hero', label: '핵심 소개', required: true },
  { id: 'intro', label: '멘토 정보', required: true },
  { id: 'mentoringTypes', label: '멘토링 유형', required: true },
  { id: 'strategy', label: '취업 성공 전략', required: false },
  { id: 'video', label: '소개 영상', required: false },
  { id: 'results', label: '결과 사례', required: false },
];

/** 오픈 설정 스텝. 템플릿 섹션이 아니라 상품 설정이라 id 도 섹션 키가 아니다. */
export const OPEN_TAB_ID = 'open';

export type SettingsTabId = typeof OPEN_TAB_ID | DetailTabId;

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
  required: boolean;
}

/**
 * 화면에 실제로 그려지는 스텝 목록. 오픈 설정이 가장 앞이다 — 상품(제목·타입·
 * 진행시간)이 있어야 상세 페이지도 의미가 있고, 마지막에 누르는 "오픈하기"가
 * 이 스텝에 있다.
 */
export const SETTINGS_TABS: readonly SettingsTab[] = [
  { id: OPEN_TAB_ID, label: '오픈 설정', required: true },
  ...DETAIL_TABS,
];

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

/**
 * 탭 라벨 옆 완료 표시의 판정.
 *
 * 필수 탭은 **필수 항목이 채워졌는지**, 선택 탭은 **내용이 있는지**를 본다.
 * 멘토 정보는 프로필 도메인이 채우는 읽기 전용 탭이라 닉네임 유무로만 판정한다 —
 * 이 화면에서 채울 수 있는 게 없으므로 그 밖의 조건을 걸면 영영 완료되지 않는다.
 */
export const isDetailTabComplete = (
  tab: DetailTabId,
  template: LiveMentoringTemplate,
): boolean => {
  switch (tab) {
    case 'hero':
      return template.hero.bullets.some(hasText);
    case 'intro':
      return hasText(template.intro.nickname);
    case 'mentoringTypes':
      return (
        hasText(template.mentoringTypes.title) &&
        template.mentoringTypes.items.some((item) => hasText(item.title))
      );
    case 'strategy':
      return template.strategy.points.some(
        (point) => hasText(point.title) || hasText(point.description),
      );
    case 'video':
      return hasText(template.video.videoUrl);
    case 'results':
      return template.results.cases.some(
        (item) => hasText(item.beforeCaption) || hasText(item.afterCaption),
      );
  }
};

/** 필수 스텝 수(오픈 설정 포함). 점진 노출이 여기까지만 한 칸씩 연다. */
const REQUIRED_STEP_COUNT = SETTINGS_TABS.filter((tab) => tab.required).length;

/**
 * 지금 들어갈 수 있는 스텝 목록.
 *
 * **탭은 늘 전부 보인다.** 여기 없는 스텝은 화면에서 사라지는 게 아니라 잠긴다 —
 * 앞으로 뭘 더 써야 하는지는 보여야 하고, 사라졌다 나타나면 그 자리를 찾던 사람이 헤맨다.
 *
 * **한 번이라도 개설한 멘토에게는 전부 연다.** 순서를 안내받을 이유가 없다.
 *
 * 첫 세팅(개설 이력 0건)만 필수 스텝을 하나씩 연다. 여는 기준을 **완료 여부만**으로
 * 두면 「멘토 정보」에서 막힌다 — 프로필 도메인이 채우는 읽기 전용 탭이라 이 화면에서
 * 완료시킬 수단이 없고, 닉네임이 없는 멘토는 영영 다음으로 못 간다. 그래서 멘토가
 * 「다음으로」로 도달한 지점(`reachedIndex`)을 함께 본다.
 *
 * 선택 스텝 셋은 필수가 모두 끝나면 한꺼번에 열린다. 하나씩 열면 건너뛰고 싶은 멘토가
 * 막히는데, 선택 항목에 그런 제약을 걸 이유가 없다.
 */
export const unlockedSettingsTabs = ({
  hasOpened,
  template,
  reachedIndex,
}: {
  /** 개설 이력이 한 건이라도 있는지. 있으면 점진 노출을 하지 않는다. */
  hasOpened: boolean;
  /** 상세 템플릿. 없으면 상품 자체가 없는 상태라 오픈 설정만 연다. */
  template: LiveMentoringTemplate | null;
  /** 「다음으로」로 도달한 가장 먼 스텝의 인덱스. */
  reachedIndex: number;
}): readonly SettingsTab[] => {
  if (hasOpened) return SETTINGS_TABS;
  if (!template) return SETTINGS_TABS.slice(0, 1);

  /* 앞에서부터 끊기지 않고 완료된 필수 스텝 수. 오픈 설정은 상품이 있으면 완료다. */
  let completed = 1;
  for (const tab of SETTINGS_TABS.slice(1, REQUIRED_STEP_COUNT)) {
    if (!isDetailTabComplete(tab.id as DetailTabId, template)) break;
    completed += 1;
  }

  if (completed >= REQUIRED_STEP_COUNT) return SETTINGS_TABS;

  return SETTINGS_TABS.slice(
    0,
    Math.min(Math.max(completed + 1, reachedIndex + 1), REQUIRED_STEP_COUNT),
  );
};
