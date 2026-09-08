import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import { toYoutubeEmbedUrl } from '../constants';
import { withParticle } from './saveError';

/**
 * 실시간 저장을 **미룰** 이유를 찾는다 (LC-3282).
 *
 * 서버 요청 DTO(`UpdateLiveMentoringDetailPageRequestDto`)는 `@NotBlank` 투성이라,
 * 반쯤 채운 카드가 하나라도 있으면 저장 **전체**가 400 이 된다. 「저장」 버튼을 누르던
 * 시절엔 그때 한 번 알리면 됐지만, 자동 저장은 타이핑 도중에 계속 나간다 —
 * 빈 칸이 있는 게 정상인 순간에 매번 실패 알림이 뜨면 화면을 쓸 수 없다.
 *
 * 그래서 보내기 전에 여기서 막고, 하단 바에 "무엇을 채우면 저장되는지"만 한 줄로 남긴다.
 *
 * **빈 항목을 걸러내서 보내지 않는다.** 서버가 받게 만들 수는 있지만, 방금 「+ 추가」로
 * 만들어 이제 쓰려는 카드를 저장이 지워 버리는 셈이 된다. 채우거나 지울 때까지 기다린다.
 */

/** 히어로 불릿의 서버 상한(`@Size(max = 500)`). */
const BULLET_MAX = 500;
/** 섹션 제목류의 서버 상한(`@Size(max = 255)`). */
const TITLE_MAX = 255;

const isBlank = (value: string | null | undefined) => !value?.trim();

/** 비어 있는 첫 칸의 이름. 모두 채워졌으면 null. */
const firstBlankLabel = (
  fields: readonly (readonly [label: string, value: string | null])[],
): string | null => fields.find(([, value]) => isBlank(value))?.[0] ?? null;

const fill = (where: string, what: string) =>
  `「${where}」의 ${withParticle(what, '을', '를')} 채우면 저장돼요`;

/** 서버 `@Size` 를 넘긴 첫 칸. 넘긴 게 없으면 null. */
const firstTooLong = (
  fields: readonly (readonly [label: string, value: string | null])[],
): string | null =>
  fields.find(([, value]) => (value?.trim().length ?? 0) > TITLE_MAX)?.[0] ??
  null;

const shorten = (where: string, what: string) =>
  `「${where}」의 ${withParticle(what, '을', '를')} ${TITLE_MAX}자 이내로 줄이면 저장돼요`;

export const describeAutosaveBlock = (
  template: LiveMentoringTemplate,
): string | null => {
  const { hero, mentoringTypes, strategy, video, results } = template;

  /*
   * 핵심 소개 — 빈 줄은 보낼 때 걸러내므로(`saveTemplate`) 여기서 막지 않는다.
   * 지우려고 비워 둔 줄과 이제 쓰려고 만든 줄을 구분할 방법이 없고, 줄 하나는
   * 카드와 달리 지워져도 다시 만들기 쉽다.
   */
  const longBullet = hero.bullets.findIndex(
    (bullet) => bullet.trim().length > BULLET_MAX,
  );
  if (longBullet >= 0)
    return `「핵심 소개」의 ${longBullet + 1}번 소개 문구를 ${BULLET_MAX}자 이내로 줄이면 저장돼요`;

  const typesSection = firstBlankLabel([
    ['섹션 제목', mentoringTypes.title],
    ['섹션 설명', mentoringTypes.subtitle],
  ]);
  if (typesSection) return fill('멘토링 유형', typesSection);

  for (const [index, item] of mentoringTypes.items.entries()) {
    const blank = firstBlankLabel([
      ['유형 이름', item.typeName],
      ['유형 제목', item.title],
      ['부가 설명', item.description],
    ]);
    if (blank) return fill('멘토링 유형', `${index + 1}번 ${blank}`);
  }

  /*
   * 아래 세 섹션은 **켜져 있을 때만** 검사한다.
   *
   * 서버 `@NotBlank` 는 `visible` 을 보지 않으므로 숨긴 섹션의 빈 칸도 400 을 만든다.
   * 그렇다고 여기서 막으면 덫이 된다 — 화면이 숨긴 섹션의 입력을
   * `<fieldset disabled>` 로 잠그기 때문에 멘토는 그 칸을 채울 수가 없고, 저장도
   * 공개도 안 되는 채로 빠져나올 방법이 없다.
   *
   * 그래서 숨긴 섹션은 통과시키고, 보낼 때 `fillHiddenSections` 가 기본 문구로 메운다.
   */
  if (strategy.visible) {
    const strategySection = firstBlankLabel([
      ['섹션 제목', strategy.title],
      ['섹션 설명', strategy.subtitle],
    ]);
    if (strategySection) return fill('취업 성공 전략', strategySection);

    /*
      길이도 본다. 서버 `StrategyRequest.title` 과 `StrategyPointRequest.title` 이
      `@Size(max = 255)` 인데 이 두 칸에는 `maxLength` 가 없어 넘겨 쓸 수 있다.
      보내 봐야 400 이므로 여기서 잡아 무엇을 줄이면 되는지 알린다.
     */
    const tooLong = firstTooLong([['섹션 제목', strategy.title]]);
    if (tooLong) return shorten('취업 성공 전략', tooLong);

    for (const [index, point] of strategy.points.entries()) {
      const blank = firstBlankLabel([
        ['Point 제목', point.title],
        ['Point 설명', point.description],
      ]);
      if (blank) return fill('취업 성공 전략', `${index + 1}번 ${blank}`);

      const longPoint = firstTooLong([['Point 제목', point.title]]);
      if (longPoint)
        return shorten('취업 성공 전략', `${index + 1}번 ${longPoint}`);
    }
  }

  if (video.visible) {
    const videoSection = firstBlankLabel([
      ['섹션 제목', video.title],
      ['섹션 설명', video.subtitle],
      ['영상 안내 문구', video.caption],
    ]);
    if (videoSection) return fill('소개 영상', videoSection);
  }

  /*
   * 영상 주소는 비워 둘 수 있지만(`@Size` 만 있고 `@NotBlank` 는 없다), 서버가 받는 건
   * `https://www.youtube.com/embed/{id}` 뿐이다. 붙여넣는 중인 주소가 아직 변환되지 않는
   * 것뿐일 수 있으므로 실패가 아니라 대기로 다룬다.
   */
  if (video.videoUrl?.trim() && !toYoutubeEmbedUrl(video.videoUrl))
    return '「소개 영상」의 영상 주소를 YouTube 주소로 고치면 저장돼요';

  if (results.visible) {
    const resultsSection = firstBlankLabel([
      ['섹션 제목', results.title],
      ['섹션 설명', results.subtitle],
    ]);
    if (resultsSection) return fill('결과 사례', resultsSection);

    for (const [index, item] of results.cases.entries()) {
      const blank = firstBlankLabel([
        ['멘토링 전 상황', item.beforeCaption],
        ['멘토링 후 변화', item.afterCaption],
      ]);
      if (blank) return fill('결과 사례', `${index + 1}번 ${blank}`);
    }
  }

  return null;
};
