import Link from 'next/link';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import {
  CATEGORY_LABELS,
  cardPriceLabel,
  careerBadgeLabel,
  durationsLabel,
  formatOpeningPeriod,
} from '../constants';
import { imagePlaceholderTitle } from '../utils/profileDisplay';

interface MentorCardProps {
  opening: LiveMentoringOpening;
}

/**
 * 공개 리스트 멘토 카드 (PRD §5 S1).
 *
 * 상단은 썸네일 블록(경력 배지 + 진행시간/가격 바), 하단은 카드 밖 정보 영역
 * (멘토링 제목 + 진행기간 + 타입 태그)이다.
 * 썸네일 텍스트는 **프로필 이미지가 없을 때의 대체 표시**라, 이미지가 있으면 렌더하지 않는다.
 *
 * 백엔드 `LiveMentoringOpeningResponseDto` 를 그대로 렌더한다. 닉네임·대표 경력·
 * 타이틀이 모두 nullable 이라 제목은 닉네임 기반 문구로, 배지는 미렌더로 폴백한다.
 * (참여자 수·평점은 목록 응답에 없어 표시하지 않는다.)
 */
const MentorCard = ({ opening }: MentorCardProps) => {
  const nickname = opening.mentorNickname ?? '멘토';
  const badge = careerBadgeLabel(opening.representativeCareer);

  return (
    <Link
      href={`/live-mentoring/${opening.mentorId}`}
      className="row-span-3 grid w-full grid-rows-subgrid gap-3 overflow-hidden"
    >
      {/* 썸네일 — 프로필 이미지가 있으면 흰 배경 위 이미지, 없으면 브랜드 컬러 배경 + 제목 텍스트 */}
      <div
        className={`md:rounded-xs relative aspect-[540/421] overflow-hidden rounded-sm ${
          opening.mentorProfileImage ? 'bg-white' : 'bg-primary'
        }`}
      >
        {opening.mentorProfileImage && (
          <img
            src={opening.mentorProfileImage}
            alt={nickname}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* 대표 직무 배지 — 프로그램 카드의 마감임박 배지와 같은 규격 */}
        {badge && (
          <span className="rounded-xs bg-neutral-0/80 text-xxsmall10 text-static-100 md:text-xxsmall12 absolute left-2 top-2 px-2.5 py-1 font-semibold">
            {badge}
          </span>
        )}

        {!opening.mentorProfileImage && (
          <p
            className={`text-small18 relative line-clamp-3 px-4 pb-4 font-bold text-white ${
              badge ? 'pt-11' : 'pt-4'
            }`}
          >
            {opening.title ?? imagePlaceholderTitle(nickname)}
          </p>
        )}

        {/*
          진행시간 / 가격 바.
          썸네일 아래가 아니라 **위에 겹쳐서** 둔다. 아래에 쌓으면 이 블록 높이가
          `aspect-[540/421] + 바 높이` 가 되어 프로그램 카드보다 카드가 길어진다.
        */}
        <div className="bg-neutral-0 text-xsmall14 absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-2.5 text-white">
          <span>{durationsLabel(opening.durations)}</span>
          <span className="font-bold">
            {cardPriceLabel(opening.durations, opening.minimumPrice)}
          </span>
        </div>
      </div>

      <h2 className="text-1-semibold text-xsmall14 md:text-xsmall16 line-clamp-2">
        {opening.title ?? `${nickname}의 1:1 멘토링`}
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1 tracking-[-0.4px] md:gap-1.5">
          <span className="text-xxsmall12 text-neutral-0 font-normal">
            진행기간
          </span>
          <span className="text-0.75-medium text-primary-dark">
            {formatOpeningPeriod(
              opening.feedbackStartDate,
              opening.feedbackEndDate,
            )}
          </span>
        </div>

        {opening.categories.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {opening.categories.map((category) => (
              <div
                key={category}
                className="text-xxsmall12 border-neutral-95 bg-neutral-95 text-neutral-40 flex items-center justify-center rounded-[3px] border px-2 py-1 text-center font-normal"
              >
                {CATEGORY_LABELS[category]}
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MentorCard;
