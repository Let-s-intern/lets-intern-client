'use client';

import {
  type LandingReview,
  useLandingReviewsQuery,
} from '@/api/program-category/programCategory';
import { useGetProgramReview } from '@/api/review/review';
import type { ChallengeType } from '@/schema';
import Link from 'next/link';

/** 평점 높은 후기 몇 장을 받아 끝없이 흘린다 */
const REVIEW_COUNT = 12;

interface ReviewCardData {
  key: number;
  programTitle?: string | null;
  name?: string | null;
  items: { questionType?: string | null; answer?: string | null }[];
}

const maskName = (name?: string | null) =>
  name
    ? `${name.slice(0, 1)}${'*'.repeat(Math.max(name.length - 1, 2))}`
    : '수강생';

/** "[대학생·무경력자 Ver] 이력서 1주 완성 챌린지 25기" → 버전 "대학생·무경력자 Ver", 기수 "25기" */
const parseProgramTitle = (title?: string | null) => {
  const version = title?.match(/^\s*\[([^\]]+)\]/)?.[1];
  const cohort = title?.match(/(\d+기)/)?.[1];
  const name = (title ?? '')
    .replace(/^(\s*\[[^\]]*\]\s*)+/, '')
    .replace(/\s*\d+기(\s.*)?$/, '')
    .trim();
  return { version, cohort, name };
};

/** 좋았던 점 → 목표 달성 → 아무 답변 순으로 한 줄 */
const pickQuote = (items: ReviewCardData['items']) => {
  const by = (type: string) =>
    items.find((i) => i.questionType === type && i.answer?.trim())?.answer;
  return (
    by('GOOD_POINT') ??
    by('GOAL_RESULT') ??
    items.find((i) => i.answer?.trim())?.answer ??
    ''
  ).trim();
};

const ReviewCard = ({ review }: { review: ReviewCardData }) => {
  const { version, cohort, name } = parseProgramTitle(review.programTitle);
  const meta = [maskName(review.name), version, cohort]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className="flex h-full w-[280px] flex-col gap-3 rounded-sm border border-primary-20 bg-white px-5 py-5">
      <span className="line-clamp-1 w-fit rounded-xxs bg-neutral-10 px-2 py-1 text-xxsmall12 font-semibold text-white">
        {name || '챌린지'}
      </span>
      <p className="line-clamp-4 flex-1 whitespace-pre-line text-xsmall14 text-neutral-10">
        &ldquo;{pickQuote(review.items)}&rdquo;
      </p>
      <p className="text-xxsmall12 text-neutral-40">{meta}</p>
    </div>
  );
};

const fromLanding = (r: LandingReview): ReviewCardData => ({
  key: r.reviewId,
  programTitle: r.programTitle,
  name: r.name,
  items: r.itemList,
});

interface ReviewSectionProps {
  anchorId: string;
  title: string;
  label: string;
  challengeTypes: ChallengeType[];
}

/**
 * 카테고리 랜딩 수강생 후기. 평점 높은 후기를 오른쪽에서 왼쪽으로 끝없이 흘린다.
 * 평점 순 API 가 없는 서버(이전 버전)에서는 공개 후기 목록(최신순)으로 대신한다
 */
const ReviewSection = ({
  anchorId,
  title,
  label,
  challengeTypes,
}: ReviewSectionProps) => {
  const top = useLandingReviewsQuery(challengeTypes, REVIEW_COUNT);
  const fallback = useGetProgramReview({
    types: ['CHALLENGE_REVIEW'],
    challengeTypes,
    size: REVIEW_COUNT,
  });
  const useTop = top.isSuccess && top.data.reviewList.length > 0;
  const reviews: ReviewCardData[] = (
    useTop
      ? top.data.reviewList.map(fromLanding)
      : (fallback.data?.reviewList ?? []).map((r) => ({
          key: r.reviewInfo.reviewId,
          programTitle: r.reviewInfo.programTitle,
          name: r.reviewInfo.name,
          items: r.reviewItemList ?? [],
        }))
  ).filter((r) => pickQuote(r.items));
  const total = useTop
    ? top.data.totalCount
    : fallback.data?.pageInfo.totalElements;
  if (reviews.length === 0) return null;
  // 후기가 적어도 화면을 채우도록 반쪽이 8장 이상이 될 때까지 되풀이한다
  const half = Array.from(
    { length: Math.ceil(8 / reviews.length) },
    () => reviews,
  ).flat();

  return (
    <section id={anchorId} className="scroll-mt-28 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-small20 font-bold text-neutral-0 md:text-medium24">
            {title}
          </h2>
          <p className="mt-1 text-xsmall14 text-neutral-30 md:text-xsmall16">
            {label} 관련 프로그램 수강생 후기 {total?.toLocaleString()}개
          </p>
        </div>
        <Link
          href="/review/program"
          className="category_landing_review_more shrink-0 text-xsmall14 text-neutral-40"
        >
          더보기
        </Link>
      </div>
      {/* 같은 줄을 두 번 이어 붙여 오른쪽에서 왼쪽으로 0 → -50% 로 흘린다. 올리면 멈춘다 */}
      <style>{`@keyframes landingReviewFlow{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="-mx-5 mt-6 overflow-hidden md:mx-0">
        <ul
          className="flex w-max gap-4 px-5 hover:[animation-play-state:paused] motion-reduce:!animate-none md:px-0"
          style={{
            animation: `landingReviewFlow ${half.length * 5}s linear infinite`,
          }}
        >
          {[...half, ...half].map((review, index) => (
            <li
              key={`${review.key}-${index}`}
              aria-hidden={index >= reviews.length}
            >
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ReviewSection;
