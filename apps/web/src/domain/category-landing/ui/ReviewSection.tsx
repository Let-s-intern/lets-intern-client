'use client';

import { GetReview, useGetProgramReview } from '@/api/review/review';
import type { ChallengeType } from '@/schema';
import Link from 'next/link';

/** 시안처럼 4장. 더 보려면 후기 페이지로 간다 */
const REVIEW_COUNT = 4;

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
const pickQuote = (review: GetReview) => {
  const items = review.reviewItemList ?? [];
  const by = (type: string) =>
    items.find((i) => i.questionType === type && i.answer?.trim())?.answer;
  return (
    by('GOOD_POINT') ??
    by('GOAL_RESULT') ??
    items.find((i) => i.answer?.trim())?.answer ??
    ''
  ).trim();
};

const ReviewCard = ({ review }: { review: GetReview }) => {
  const { version, cohort, name } = parseProgramTitle(
    review.reviewInfo.programTitle,
  );
  const meta = [maskName(review.reviewInfo.name), version, cohort]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className="flex h-full flex-col gap-3 rounded-sm border border-primary-20 bg-white px-5 py-5">
      <span className="line-clamp-1 w-fit rounded-xxs bg-neutral-10 px-2 py-1 text-xxsmall12 font-semibold text-white">
        {name || '챌린지'}
      </span>
      <p className="line-clamp-4 flex-1 whitespace-pre-line text-xsmall14 text-neutral-10">
        &ldquo;{pickQuote(review)}&rdquo;
      </p>
      <p className="text-xxsmall12 text-neutral-40">{meta}</p>
    </div>
  );
};

interface ReviewSectionProps {
  anchorId: string;
  title: string;
  label: string;
  challengeTypes: ChallengeType[];
}

/** 카테고리 랜딩 수강생 후기. 기존 후기 API 를 챌린지 구분으로 거른다 */
const ReviewSection = ({
  anchorId,
  title,
  label,
  challengeTypes,
}: ReviewSectionProps) => {
  const { data } = useGetProgramReview({
    types: ['CHALLENGE_REVIEW'],
    challengeTypes,
    size: REVIEW_COUNT,
  });
  const reviews = (data?.reviewList ?? []).filter((r) => pickQuote(r));
  if (reviews.length === 0) return null;

  return (
    <section id={anchorId} className="scroll-mt-28 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-small20 font-bold text-neutral-0 md:text-medium24">
            {title}
          </h2>
          <p className="mt-1 text-xsmall14 text-neutral-30 md:text-xsmall16">
            {label} 관련 프로그램 수강생 후기{' '}
            {data?.pageInfo.totalElements.toLocaleString()}개
          </p>
        </div>
        <Link
          href="/review/program"
          className="category_landing_review_more shrink-0 text-xsmall14 text-neutral-40"
        >
          더보기
        </Link>
      </div>
      <ul className="-mx-5 mt-6 flex gap-4 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {reviews.map((review) => (
          <li
            key={review.reviewInfo.reviewId}
            className="w-[260px] shrink-0 md:w-auto"
          >
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReviewSection;
