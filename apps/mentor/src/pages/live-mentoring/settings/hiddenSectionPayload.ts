import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import { toYoutubeEmbedUrl } from '../constants';

const isBlank = (value: string | null | undefined) => !value?.trim();

/**
 * 끈 선택 섹션에서 서버가 거절할 값을 보내기 전에 뺀다 (LC-3311).
 *
 * 서버 요청 DTO 의 `StrategyPointRequest`·`ResultCaseRequest` 는 `@NotBlank` 이고, 영상 주소는
 * `LiveMentoringUrlPolicy` 가 형식을 본다. 둘 다 `visible` 을 보지 않아 끈 섹션에 빈 카드나
 * 잘못된 주소가 남으면 저장 전체가 400 이 되고, 오픈 직전 저장이 실패해 오픈도 막힌다.
 * 끈 섹션은 입력이 잠겨(`<fieldset disabled>`) 멘토가 그 값을 지우거나 고칠 수도 없다.
 *
 * 끈 섹션은 공개 페이지에 나가지 않으므로 이 값을 빼도 보이는 것은 달라지지 않는다.
 * 켠 섹션은 건드리지 않는다 — 빈 칸은 `describeAutosaveBlock` 이 막고 무엇을 채울지 알린다.
 */
export const dropUnsavableHiddenValues = (
  template: LiveMentoringTemplate,
): LiveMentoringTemplate => {
  const { strategy, video, results } = template;

  return {
    ...template,
    strategy: strategy.visible
      ? strategy
      : {
          ...strategy,
          points: strategy.points.filter(
            (point) => !isBlank(point.title) && !isBlank(point.description),
          ),
        },
    video:
      video.visible ||
      !video.videoUrl?.trim() ||
      toYoutubeEmbedUrl(video.videoUrl)
        ? video
        : { ...video, videoUrl: null },
    results: results.visible
      ? results
      : {
          ...results,
          cases: results.cases.filter(
            (item) =>
              !isBlank(item.beforeCaption) && !isBlank(item.afterCaption),
          ),
        },
  };
};
