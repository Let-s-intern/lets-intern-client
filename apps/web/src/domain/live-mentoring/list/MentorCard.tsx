import Link from 'next/link';

import type { LiveMentorCard } from '@/api/live-mentoring/liveMentoringSchema';
import {
  CATEGORY_LABELS,
  durationLabel,
  formatFeedbackPeriod,
  priceLabel,
} from '../constants';
import {
  imagePlaceholderTitle,
  mosaicStyle,
  shouldShowImage,
} from '../utils/profileDisplay';

interface MentorCardProps {
  mentor: LiveMentorCard;
}

/**
 * 공개 리스트 멘토 카드 (PRD §5 S1).
 * 프로필 노출 상태(모자이크·비노출)·가격(진행시간 고정)·평점/후기·카테고리·진행시간을 표시.
 */
const MentorCard = ({ mentor }: MentorCardProps) => {
  const showImage = shouldShowImage(mentor);

  return (
    <Link
      href={`/live-mentoring/${mentor.mentorId}`}
      className="border-neutral-80 flex flex-col overflow-hidden rounded-md border bg-white transition hover:shadow-md"
    >
      {/* 프로필 이미지 영역 — 노출 off면 이미지 대신 문구 */}
      <div className="bg-neutral-90 relative flex aspect-[4/3] items-center justify-center overflow-hidden">
        {!showImage ? (
          <span className="text-neutral-40 text-xsmall14 px-4 text-center font-medium">
            {imagePlaceholderTitle(mentor.nickname)}
          </span>
        ) : mentor.profileImage ? (
          <img
            src={mentor.profileImage}
            alt={mentor.nickname}
            className="h-full w-full object-cover"
            style={mosaicStyle(mentor)}
          />
        ) : (
          <span className="text-neutral-40 text-xsmall14 px-4 text-center font-medium">
            {mentor.nickname}
          </span>
        )}
        <span className="text-xxsmall12 absolute left-2 top-2 rounded-sm bg-black/70 px-2 py-0.5 font-medium text-white">
          {mentor.categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
        </span>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xsmall16 line-clamp-1 font-semibold">
            {mentor.nickname}
          </span>
          <span className="text-primary text-xxsmall12 border-primary shrink-0 rounded-sm border px-1.5 py-0.5 font-medium">
            {mentor.durations.map(durationLabel).join('·')}
          </span>
        </div>

        <p className="text-neutral-40 text-xxsmall12 line-clamp-1">
          {mentor.headline}
        </p>
        <p className="text-neutral-30 text-xsmall14 line-clamp-2 flex-1">
          {mentor.mentoringPoints}
        </p>

        <div className="text-xxsmall12 text-neutral-40 flex items-center gap-1">
          <span className="text-primary font-semibold">
            ★ {mentor.rating.toFixed(1)}
          </span>
          <span>후기 {mentor.reviewCount}</span>
          <span className="ml-auto">
            {formatFeedbackPeriod(
              mentor.feedbackStartDate,
              mentor.feedbackEndDate,
            )}
          </span>
        </div>

        <div className="text-neutral-0 text-xsmall16 mt-1 text-right font-bold">
          {priceLabel(mentor.durations, mentor.price)}
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;
