import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 숨긴 섹션의 빈 필수 칸을 채울 기본 문구 (LC-3282).
 *
 * 서버 요청 DTO 의 `@NotBlank` 는 `visible` 을 보지 않는다. 즉 **숨긴 섹션이라도
 * 제목·설명이 비어 있으면 저장 전체가 400 이다.** 그런데 화면은 숨긴 섹션의 입력을
 * `<fieldset disabled>` 로 잠그므로, 멘토는 그 칸을 채울 수가 없다. 노출을 껐다는
 * 이유로 저장도 공개도 막히고 빠져나올 방법이 없는 덫이 된다.
 *
 * 그래서 숨긴 섹션은 검사하지 않고(`describeAutosaveBlock`), 보낼 때 여기 문구로
 * 메운다. 값은 서버가 새 상세 페이지를 만들 때 쓰는 것과 같다
 * (`LiveMentoringDetailDefaultProvider`). 멘토가 나중에 그 섹션을 다시 켜면 신규
 * 멘토와 같은 상태에서 시작한다.
 *
 * 서버가 `visible` 을 보고 검증을 건너뛰도록 고치는 것이 근본 해결이다. 그때 이
 * 파일은 지워도 된다.
 */
const DEFAULTS = {
  strategy: {
    title: '취업 성공 전략',
    subtitle: '멘토링을 통해 자세히 알려드려요.',
  },
  video: {
    title: '멘토는 이렇게 도와드려요',
    subtitle: '1:1 LIVE 멘토링을 영상으로 미리 확인해 보세요.',
    caption: '라이브로 주고받는 맞춤형 피드백을 확인해 보세요.',
  },
  results: {
    title: '멘토와 함께 완성한 결과를 확인해 보세요',
    subtitle: '결과 사례',
  },
} as const;

/** 비어 있으면 기본값으로, 아니면 쓰던 값 그대로. */
const filled = (value: string, fallback: string) =>
  value.trim() ? value : fallback;

/**
 * 숨긴 섹션의 빈 필수 칸만 메운다. 켜져 있는 섹션은 손대지 않는다 —
 * 그쪽은 게이트가 막아 애초에 여기까지 오지 않는다.
 *
 * 반복 항목(Point·결과 사례)은 메우지 않고 **비운다.** 지어낸 문구로 채우면 멘토가
 * 쓰지 않은 카드가 상세 페이지에 실린다. 섹션이 숨겨져 있으니 내용도 필요 없다.
 */
export const fillHiddenSections = <T extends LiveMentoringTemplate>(
  template: T,
): T => ({
  ...template,
  strategy: template.strategy.visible
    ? template.strategy
    : {
        ...template.strategy,
        title: filled(template.strategy.title, DEFAULTS.strategy.title),
        subtitle: filled(
          template.strategy.subtitle,
          DEFAULTS.strategy.subtitle,
        ),
        points: template.strategy.points.filter(
          (point) => point.title.trim() && point.description.trim(),
        ),
      },
  video: template.video.visible
    ? template.video
    : {
        ...template.video,
        title: filled(template.video.title, DEFAULTS.video.title),
        subtitle: filled(template.video.subtitle, DEFAULTS.video.subtitle),
        caption: filled(template.video.caption, DEFAULTS.video.caption),
      },
  results: template.results.visible
    ? template.results
    : {
        ...template.results,
        title: filled(template.results.title, DEFAULTS.results.title),
        subtitle: filled(template.results.subtitle, DEFAULTS.results.subtitle),
        cases: template.results.cases.filter(
          (item) => item.beforeCaption.trim() && item.afterCaption.trim(),
        ),
      },
});
