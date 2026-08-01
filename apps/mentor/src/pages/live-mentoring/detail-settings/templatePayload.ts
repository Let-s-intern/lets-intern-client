import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * PUT /mentor/live-mentoring/template 저장 직전 처리.
 *
 * 목은 무엇이든 echo 했지만 실서버는 두 가지를 400 으로 막는다.
 *  - `@NotBlank` 대상에 빈 문자열이 하나라도 있으면 실패한다.
 *  - nullable 필드는 `""` 가 아니라 `null` 이어야 한다
 *    (`strategy.points[].image`, `results.cases[].beforeImage`·`afterImage`, `video.videoUrl`).
 *
 * 노출 토글(`visible`)을 꺼도 서버 검증은 그대로 도므로 섹션을 가려도 검사에서 빼지 않는다.
 */

/**
 * 서버 `LiveMentoringUrlPolicy.validateYoutubeEmbedUrl` 과 같은 조건.
 * query·fragment·포트·`http`·watch 경로는 모두 400 이다.
 */
const YOUTUBE_EMBED_URL =
  /^https:\/\/(www\.)?youtube\.com\/embed\/[A-Za-z0-9_-]+$/;

/** 폼 안내와 저장 차단 문구에 같이 쓴다 — 두 곳이 어긋나면 멘토가 원인을 못 찾는다. */
export const VIDEO_URL_FORMAT_HINT =
  'https://www.youtube.com/embed/{영상ID} 형식만 저장할 수 있습니다. 물음표 뒤 값이 붙어 있으면 지워주세요.';

const isBlank = (value: string) => value.trim().length === 0;

/** 비어 있거나 공백뿐이면 `null` — 서버가 `""` 를 거부한다. */
const toNullable = (value: string | null) =>
  value === null || isBlank(value) ? null : value.trim();

/** nullable 필드의 빈 문자열·공백을 `null` 로 바꾼 저장용 payload 를 만든다. */
export const toTemplatePayload = (
  template: LiveMentoringTemplate,
): LiveMentoringTemplate => ({
  ...template,
  strategy: {
    ...template.strategy,
    points: template.strategy.points.map((point) => ({
      ...point,
      image: toNullable(point.image),
    })),
  },
  video: {
    ...template.video,
    videoUrl: toNullable(template.video.videoUrl),
  },
  results: {
    ...template.results,
    cases: template.results.cases.map((resultCase) => ({
      ...resultCase,
      beforeImage: toNullable(resultCase.beforeImage),
      afterImage: toNullable(resultCase.afterImage),
    })),
  },
});

/**
 * 저장 가능한 영상 URL 인지.
 * 비워 둔 경우(`null`)는 허용된다 — 서버도 null 이면 검사하지 않는다.
 */
export const isValidVideoUrl = (videoUrl: string | null) =>
  videoUrl === null || YOUTUBE_EMBED_URL.test(videoUrl);

/**
 * 서버 `@NotBlank` 대상 중 비어 있는 항목의 이름 목록.
 *
 * 서버 400 메시지는 `strategy.points[0].title` 같은 필드 경로라 멘토가 읽을 수 없다.
 * 저장을 보내기 전에 화면 문구와 같은 이름으로 어디를 채워야 하는지 알린다.
 */
export const findBlankRequiredFields = (
  template: LiveMentoringTemplate,
): string[] => {
  const blanks: string[] = [];
  const check = (label: string, value: string) => {
    if (isBlank(value)) blanks.push(label);
  };

  const { hero, mentoringTypes, strategy, video, results } = template;

  hero.bullets.forEach((bullet, index) =>
    check(`히어로 · 소개 불릿 ${index + 1}번`, bullet),
  );

  check('멘토링 유형 · 섹션 제목', mentoringTypes.title);
  check('멘토링 유형 · 섹션 설명', mentoringTypes.subtitle);
  mentoringTypes.items.forEach((item, index) => {
    const prefix = `멘토링 유형 · 유형 카드 ${index + 1}번`;
    check(`${prefix} 유형명`, item.typeName);
    check(`${prefix} 카드 제목`, item.title);
    check(`${prefix} 설명`, item.description);
    item.tags.forEach((tag, tagIndex) =>
      check(`${prefix} 태그 ${tagIndex + 1}번`, tag),
    );
  });

  check('취업 성공 전략 · 섹션 제목', strategy.title);
  check('취업 성공 전략 · 섹션 설명', strategy.subtitle);
  strategy.points.forEach((point, index) => {
    const prefix = `취업 성공 전략 · Point ${index + 1}번`;
    check(`${prefix} 제목`, point.title);
    check(`${prefix} 설명`, point.description);
  });

  check('이렇게 도와드려요 · 섹션 제목', video.title);
  check('이렇게 도와드려요 · 섹션 설명', video.subtitle);
  check('이렇게 도와드려요 · 영상 하단 문구', video.caption);

  check('결과 사례 · 섹션 제목', results.title);
  check('결과 사례 · 섹션 설명', results.subtitle);
  results.cases.forEach((resultCase, index) => {
    const prefix = `결과 사례 · Before / After ${index + 1}번`;
    check(`${prefix} Before 설명`, resultCase.beforeCaption);
    check(`${prefix} After 설명`, resultCase.afterCaption);
  });

  return blanks;
};
