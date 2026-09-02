import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 상세 페이지 설정의 탭 정의.
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
