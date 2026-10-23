import {
  type AdminLiveMentoringDetailPage,
  type AdminLiveMentoringDetailPageUpdate,
  adminLiveMentoringDetailPageUpdateSchema,
} from '@/api/live-mentoring/liveMentoringDetailPageSchema';

/*
 * 멘토 앱 상세페이지 저장(`apps/mentor/src/pages/live-mentoring/settings/` 의 `saveTemplate`,
 * `hiddenSectionPayload.ts`, `autosaveGate.ts`)과 같은 결과를 내야 한다. 앱 간 공유가 금지라 옮겨 왔다.
 * 멘토 앱 규칙이 바뀌면 여기도 같이 고친다.
 */

const isBlank = (value: string | null | undefined) => !value?.trim();

/**
 * 조회 응답 → 편집 폼. 편집 영역만 떼어 낸다.
 * 자유 입력란이 아직 없으면(서버 배포 전, 저장한 적 없음) 꺼진 빈 입력란·기본 위치로 시작한다.
 */
export const toDetailPageForm = (
  data: AdminLiveMentoringDetailPage,
): AdminLiveMentoringDetailPageUpdate => ({
  ...adminLiveMentoringDetailPageUpdateSchema
    .omit({ freeContent: true })
    .parse(data),
  freeContent: {
    visible: data.freeContent?.visible ?? false,
    content: data.freeContent?.content ?? null,
    position: data.freeContent?.position ?? 'AFTER_MENTORING_TYPES',
  },
});

/**
 * YouTube 링크를 서버가 받는 `https://www.youtube.com/embed/{id}` 로 바꾼다.
 * 서버(`LiveMentoringUrlPolicy`)는 embed 형태만 받는다. 바꿀 수 없으면 null.
 */
export const toYoutubeEmbedUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  let videoId: string | null = null;

  if (host === 'youtu.be') {
    videoId = url.pathname.slice(1);
  } else if (
    host === 'www.youtube.com' ||
    host === 'youtube.com' ||
    host === 'm.youtube.com'
  ) {
    if (url.pathname === '/watch') videoId = url.searchParams.get('v');
    else if (url.pathname.startsWith('/embed/'))
      videoId = url.pathname.slice('/embed/'.length);
    else if (url.pathname.startsWith('/shorts/'))
      videoId = url.pathname.slice('/shorts/'.length);
  }

  if (!videoId || !/^[A-Za-z0-9_-]+$/.test(videoId)) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * 보내면 서버가 거절할 이유. 없으면 null.
 *
 * 서버는 켜 둔 섹션의 제목·설명이 비면 400 이다. 꺼 둔 섹션은 검사하지 않는다(LC-3289).
 */
export const findDetailPageBlock = (
  form: AdminLiveMentoringDetailPageUpdate,
): string | null => {
  const { mentoringTypes, strategy, video, results } = form;

  if (isBlank(mentoringTypes.title) || isBlank(mentoringTypes.subtitle))
    return '멘토링 유형의 섹션 제목과 설명을 채워 주세요.';

  if (
    strategy.visible &&
    (isBlank(strategy.title) || isBlank(strategy.subtitle))
  )
    return '취업 성공 전략의 섹션 제목과 설명을 채워 주세요.';

  if (
    video.visible &&
    (isBlank(video.title) || isBlank(video.subtitle) || isBlank(video.caption))
  )
    return '소개 영상의 섹션 제목·설명·영상 안내 문구를 채워 주세요.';

  if (
    video.visible &&
    video.videoUrl?.trim() &&
    !toYoutubeEmbedUrl(video.videoUrl)
  )
    return '소개 영상의 영상 주소는 YouTube 주소만 넣을 수 있습니다.';

  if (results.visible && isBlank(results.title))
    return '결과 사례의 섹션 제목을 채워 주세요.';

  return null;
};

/**
 * 편집 폼 → PUT 본문.
 *
 * - 빈 히어로 불릿, 반쯤 채운 유형 카드·Point·결과 사례는 뺀다(서버 `@NotBlank`)
 * - 영상 주소는 embed 로 바꾼다. 꺼 둔 섹션의 잘못된 주소는 비운다(고칠 수 없으므로)
 *
 * 꺼 둔 섹션의 빈 제목은 채우지 않는다. 멘토 앱이 기본 문구로 메우던 처리는 서버가 `visible` 을
 * 보게 되면서(LC-3289) 걷어냈다.
 */
export const toDetailPageUpdatePayload = (
  form: AdminLiveMentoringDetailPageUpdate,
): AdminLiveMentoringDetailPageUpdate => {
  const {
    hero,
    mentoringTypes,
    strategy,
    video,
    results,
    reviews,
    freeContent,
  } = form;

  const videoUrl = video.videoUrl?.trim()
    ? toYoutubeEmbedUrl(video.videoUrl)
    : null;

  return {
    hero: {
      bullets: hero.bullets.map((bullet) => bullet.trim()).filter(Boolean),
    },
    mentoringTypes: {
      ...mentoringTypes,
      items: mentoringTypes.items
        .map((item) => ({
          ...item,
          typeName: item.typeName.trim(),
          title: item.title.trim(),
          description: item.description.trim(),
          tags: item.tags.map((tag) => tag.trim()).filter(Boolean),
        }))
        .filter((item) => item.typeName && item.title && item.description),
    },
    strategy: {
      ...strategy,
      points: strategy.points
        .map((point) => ({
          ...point,
          title: point.title.trim(),
          description: point.description.trim(),
        }))
        .filter((point) => point.title && point.description),
    },
    video: { ...video, videoUrl },
    results: {
      ...results,
      cases: results.cases
        .map((item) => ({
          ...item,
          beforeCaption: item.beforeCaption.trim(),
          afterCaption: item.afterCaption.trim(),
        }))
        .filter((item) => item.beforeCaption && item.afterCaption),
    },
    reviews,
    freeContent,
  };
};
