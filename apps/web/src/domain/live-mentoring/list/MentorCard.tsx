import Link from 'next/link';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import {
  CATEGORY_LABELS,
  durationLabel,
  formatCareerPeriod,
  formatFeedbackPeriod,
  priceLabel,
  representativeCareerLabel,
} from '../constants';
import { imagePlaceholderTitle } from '../utils/profileDisplay';

interface MentorCardProps {
  opening: LiveMentoringOpening;
}

/**
 * 공개 리스트 멘토 카드 (PRD §5 S1).
 *
 * 백엔드 `LiveMentoringOpeningResponseDto` 를 그대로 렌더한다. 닉네임·소개·대표 경력·
 * 타이틀은 모두 nullable 이라 값이 없으면 해당 줄을 통째로 렌더하지 않는다.
 * (평점·후기 수는 목록 응답에 없어 표시하지 않는다.)
 */
const MentorCard = ({ opening }: MentorCardProps) => {
  const nickname = opening.mentorNickname ?? '멘토';
  const careerLabel = representativeCareerLabel(opening.representativeCareer);
  const careerPeriod = opening.representativeCareer
    ? formatCareerPeriod(
        opening.representativeCareer.startDate,
        opening.representativeCareer.endDate,
      )
    : '';

  return (
    <Link
      href={`/live-mentoring/${opening.mentorId}`}
      className="border-neutral-80 flex flex-col overflow-hidden rounded-md border bg-white transition hover:shadow-md"
    >
      {/* 프로필 이미지 영역 — 이미지가 없으면 문구로 대체 */}
      <div className="bg-neutral-90 relative flex aspect-[4/3] items-center justify-center overflow-hidden">
        {opening.mentorProfileImage ? (
          <img
            src={opening.mentorProfileImage}
            alt={nickname}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-neutral-40 text-xsmall14 px-4 text-center font-medium">
            {imagePlaceholderTitle(nickname)}
          </span>
        )}
        {opening.categories.length > 0 && (
          <span className="text-xxsmall12 absolute left-2 top-2 rounded-sm bg-black/70 px-2 py-0.5 font-medium text-white">
            {opening.categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
          </span>
        )}
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xsmall16 line-clamp-1 font-semibold">
            {nickname}
          </span>
          {opening.durations.length > 0 && (
            <span className="text-primary text-xxsmall12 border-primary shrink-0 rounded-sm border px-1.5 py-0.5 font-medium">
              {opening.durations.map(durationLabel).join('·')}
            </span>
          )}
        </div>

        {careerLabel && (
          <p className="text-neutral-40 text-xxsmall12 line-clamp-1">
            {careerLabel}
            {careerPeriod && ` · ${careerPeriod}`}
          </p>
        )}

        {opening.title && (
          <p className="text-neutral-0 text-xsmall14 line-clamp-2 font-medium">
            {opening.title}
          </p>
        )}

        {opening.mentorIntroduction && (
          <p className="text-neutral-30 text-xsmall14 line-clamp-2 flex-1">
            {opening.mentorIntroduction}
          </p>
        )}

        <div className="text-xxsmall12 text-neutral-40 mt-auto">
          {formatFeedbackPeriod(
            opening.feedbackStartDate,
            opening.feedbackEndDate,
          )}
        </div>

        <div className="text-neutral-0 text-xsmall16 text-right font-bold">
          {priceLabel(opening.durations, opening.minimumPrice)}
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;
