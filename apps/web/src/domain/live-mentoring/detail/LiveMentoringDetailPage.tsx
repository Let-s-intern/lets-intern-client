'use client';

import { isAxiosError } from 'axios';

import { useLiveMentoringDetailQuery } from '@/api/live-mentoring/liveMentoring';
import { formatDetailPeriod } from '../constants';
import { DetailFaqSection, DetailProcessSection } from './DetailFixedSections';
import DetailHero from './DetailHero';
import DetailCTAButtons from './DetailCTAButtons';
import DetailImageSection from './DetailImageSection';
import DetailNavigation, {
  LM_DIFFERENT_ID,
  LM_FAQ_ID,
  LM_MENTOR_INFO_ID,
  LM_MENTORING_INTRO_ID,
  LM_REVIEW_ID,
} from './DetailNavigation';
import DetailSection from './DetailSection';

interface LiveMentoringDetailPageProps {
  /** 상품 식별자. 멘토 한 명이 여러 상품을 가질 수 있어 `mentorId` 가 아니다. */
  liveMentoringId: string;
}

/**
 * 공개 멘토 상세 페이지 (PRD §5 S2).
 *
 * 시안 0~10 순서로 렌더한다.
 * - 0~5 : 멘토가 상세 페이지 설정에서 편집한 template 콘텐츠
 * - 6·7·9·10 : 운영 확정 마케팅 콘텐츠 → 시안 이미지 그대로 (`DetailFixedSections`)
 * - 8 : 후기 (노출 여부·대상만 멘토가 고름)
 *
 * 결제/예약은 범위 밖 — 히어로의 플랜은 표시만 하고 선택되지 않는다.
 */
const LiveMentoringDetailPage = ({
  liveMentoringId,
}: LiveMentoringDetailPageProps) => {
  const { data, isLoading, isError, error } =
    useLiveMentoringDetailQuery(liveMentoringId);

  if (isLoading) {
    return <p className="text-neutral-40 py-20 text-center">불러오는 중…</p>;
  }
  if (isError || !data) {
    // 404 는 없는 상품이라 재시도해도 소용없다 — 일시적 장애와 구분해 알린다.
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <p className="text-neutral-40 py-20 text-center">
        {notFound
          ? '해당 멘토링을 찾을 수 없습니다.'
          : '멘토 정보를 불러오지 못했습니다.'}
      </p>
    );
  }

  const { profile, template } = data;
  const { intro, mentoringTypes, strategy, video, results } = template;
  /*
   * 서버는 아직 `reviews: []`·`reviewCount: 0` 을 고정으로 준다. 그래서
   * 노출 토글·선택 id 와 무관하게 `shownReviews` 가 항상 비고, 시안 8(후기)
   * 섹션이 자동으로 빠진다. 의도된 동작이라 별도 분기를 두지 않는다 —
   * 후기 계약이 붙으면 이 코드가 그대로 동작한다.
   */
  const shownReviews = template.reviews.visible
    ? data.reviews.filter((r) =>
        template.reviews.selectedReviewIds.includes(r.reviewId),
      )
    : [];

  /*
   * 개설이 없는 상품(`openingId === null`)도 상세는 200 으로 내려온다 —
   * 상세만 저장하고 승인·개설을 아직 안 한 상태다. 이때 판매에서 파생되는 값
   * (기간·가격)이 전부 null 이라 기간·가격·신청 CTA 를 렌더에서 제외하고
   * 상세 콘텐츠만 보여준다. 시안 섹션 순서는 그대로다.
   */
  const opening =
    data.openingId !== null &&
    data.feedbackStartDate !== null &&
    data.feedbackEndDate !== null
      ? { beginning: data.feedbackStartDate, deadline: data.feedbackEndDate }
      : null;
  const period = opening
    ? formatDetailPeriod(opening.beginning, opening.deadline)
    : null;

  return (
    <div className="flex flex-col">
      <DetailHero detail={data} period={period} />

      <DetailNavigation isReady={!isLoading} />

      {/* 시안 0-1 · 특별 혜택 */}
      <DetailImageSection section="benefit" priority />
      {/* 시안 0-2 · 취업 준비, 혼자 하기 막막하셨나요? */}
      <DetailImageSection section="pain" />
      {/* 시안 0-3 · 멘토링 소개 */}
      <DetailImageSection section="mentoringIntro" id={LM_MENTORING_INTRO_ID} />

      {/* 시안 1 · 멘토 소개 */}
      <DetailSection
        id={LM_MENTOR_INFO_ID}
        label="멘토 소개"
        title={
          intro.passedCount !== null
            ? `확실한 전략으로 ${intro.passedCount.toLocaleString('ko-KR')}명을 합격시킨 ${profile.nickname} 멘토가 함께해요`
            : `${profile.nickname} 멘토가 함께해요`
        }
      >
        <div className="mx-auto grid w-full max-w-[900px] grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:items-stretch md:gap-10">
          {intro.profileImage && (
            <img
              src={intro.profileImage}
              alt={profile.nickname}
              className="aspect-[3/4] w-full rounded-md object-cover"
            />
          )}

          <div className="flex h-full flex-col gap-2 text-left">
            <p className="text-small20 md:text-medium24 font-bold">
              {profile.nickname}
            </p>
            {intro.affiliation && (
              <p className="text-xsmall14 md:text-xsmall16 font-semibold">
                {intro.affiliation}
              </p>
            )}
            {intro.careerLines.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {intro.careerLines.map((line, i) => (
                  <li key={i} className="text-neutral-30 text-xsmall14">
                    {line}
                  </li>
                ))}
              </ul>
            )}
            {intro.oneLiner && (
              <div className="bg-primary-5 mt-auto flex flex-col gap-2 rounded-md p-5">
                <p className="text-primary text-xsmall14 flex items-center gap-1.5 font-semibold">
                  <span aria-hidden="true">💬</span> 멘토님의 한마디
                </p>
                <p className="text-neutral-30 text-xsmall14 whitespace-pre-line leading-relaxed">
                  {intro.oneLiner}
                </p>
              </div>
            )}
          </div>
        </div>
      </DetailSection>

      {/* 시안 2 · 멘토링 유형 */}
      {mentoringTypes.items.length > 0 && (
        <DetailSection
          label="멘토링 유형"
          title={mentoringTypes.title}
          subtitle={mentoringTypes.subtitle}
        >
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {mentoringTypes.items.map((item, i) => (
              <li
                key={i}
                className="bg-neutral-95 flex flex-col gap-3 rounded-md p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-xxsmall12 rounded-sm px-2 py-1 font-semibold text-white">
                    멘토링 유형 {i + 1}
                  </span>
                  <span className="text-xsmall14 font-medium">
                    {item.typeName}
                  </span>
                </div>
                <p className="text-small18 whitespace-pre-line font-bold leading-snug">
                  {item.title}
                </p>
                <p className="text-neutral-40 text-xsmall14 whitespace-pre-line">
                  {item.description}
                </p>
                {item.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-neutral-90 text-neutral-40 text-xxsmall12 rounded-sm px-2 py-1"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 3 · 취업 성공 전략 — visible=false 면 섹션 자체를 렌더하지 않는다 */}
      {strategy.visible && strategy.points.length > 0 && (
        <DetailSection
          id={LM_DIFFERENT_ID}
          title={strategy.title}
          subtitle={strategy.subtitle}
        >
          <ul className="flex flex-col gap-4">
            {strategy.points.map((point, i) => (
              <li
                key={i}
                className="bg-primary-5 grid grid-cols-1 items-center gap-5 rounded-md p-5 md:grid-cols-[minmax(0,380px)_1fr] md:gap-8"
              >
                {/* 이미지가 카드 높이를 좌우한다 — 비율 고정 + 상한을 둬 섹션이 늘어나지 않게 한다 */}
                {point.image ? (
                  <img
                    src={point.image}
                    alt=""
                    className="aspect-[4/3] max-h-[220px] w-full rounded-sm object-cover"
                  />
                ) : (
                  <div className="bg-neutral-90 aspect-[4/3] max-h-[220px] w-full rounded-sm" />
                )}
                <div className="flex flex-col gap-2">
                  <span className="bg-primary text-xxsmall12 w-fit rounded-full px-3 py-1 font-semibold text-white">
                    Point {i + 1}
                  </span>
                  <p className="text-xsmall16 md:text-small18 font-bold">
                    {point.title}
                  </p>
                  <p className="text-neutral-40 text-xsmall14 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 4 · 이렇게 도와드려요(영상) — 다크 배경 */}
      {video.visible && video.videoUrl && (
        <DetailSection dark title={video.title} subtitle={video.subtitle}>
          {/* 폭을 안 잡으면 mw-1180 에서 16:9 높이가 660px 을 넘어 한 화면에 안 들어온다 */}
          <div className="mx-auto aspect-video w-full max-w-[820px] overflow-hidden rounded-md bg-black">
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {video.caption && (
            <p className="text-xsmall14 md:text-xsmall16 text-center text-white/80">
              {video.caption}
            </p>
          )}
        </DetailSection>
      )}

      {/* 시안 5 · 결과 사례(Before/After) — 다크 배경 */}
      {results.visible && results.cases.length > 0 && (
        <DetailSection dark label={results.subtitle} title={results.title}>
          {/* 카드 폭을 안 잡으면 mw-1180 절반(약 570px)까지 이미지가 커져 한눈에 안 들어온다 */}
          <ul className="mx-auto flex w-full max-w-[840px] flex-col gap-8">
            {results.cases.map((item, i) => (
              <li key={i} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <div className="overflow-hidden rounded-md">
                    <p className="text-neutral-30 text-xsmall14 bg-neutral-75 py-2.5 text-center font-semibold">
                      Before
                    </p>
                    <div className="bg-neutral-85 p-4">
                      {item.beforeImage && (
                        <img
                          src={item.beforeImage}
                          alt=""
                          className="aspect-[4/3] max-h-[220px] w-full rounded-sm bg-white object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-xsmall14 text-center text-white/70">
                    {item.beforeCaption}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="overflow-hidden rounded-md">
                    <p className="bg-primary text-xsmall14 py-2.5 text-center font-semibold text-white">
                      After
                    </p>
                    <div className="bg-primary-20 p-4">
                      {item.afterImage && (
                        <img
                          src={item.afterImage}
                          alt=""
                          className="aspect-[4/3] max-h-[220px] w-full rounded-sm bg-white object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-xsmall14 text-center font-medium text-white">
                    ✓ {item.afterCaption}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 6 · 플랜 */}
      <DetailImageSection section="plan" />

      {/* 시안 7 · 진행 프로세스 */}
      <DetailProcessSection period={period} />

      {/* 시안 8 · 후기 (노출 여부·대상만 멘토가 고름) */}
      {shownReviews.length > 0 && (
        <DetailSection
          id={LM_REVIEW_ID}
          label="후기"
          title={`${data.reviewCount}명이 만족한 렛츠커리어 수강생의 솔직한 멘토링 후기`}
          subtitle="이미 피드백을 경험한 수강생분들의 솔직한 후기를 확인해보세요!"
        >
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {shownReviews.map((r) => (
              <li
                key={r.reviewId}
                className="border-neutral-85 flex flex-col gap-3 rounded-md border p-5"
              >
                <div className="text-neutral-40 text-xxsmall12 flex items-center gap-2">
                  <span className="text-primary font-semibold">
                    ★ {r.score}
                  </span>
                  <span>{r.menteeName}</span>
                  <span className="ml-auto">{r.createdAt}</span>
                </div>
                <p className="text-neutral-20 text-xsmall14 leading-relaxed">
                  {r.content}
                </p>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {/* 시안 10 · 자주 묻는 질문 */}
      <DetailFaqSection id={LM_FAQ_ID} />

      {/* 하단 고정 신청 CTA — 챌린지·라이브 상페와 같은 공용 컴포넌트 */}
      {opening && (
        <DetailCTAButtons
          title={data.title}
          beginning={opening.beginning}
          deadline={opening.deadline}
        />
      )}
    </div>
  );
};

export default LiveMentoringDetailPage;
