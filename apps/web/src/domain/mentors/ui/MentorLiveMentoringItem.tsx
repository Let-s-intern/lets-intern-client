import Link from 'next/link';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import { twMerge } from '@/lib/twMerge';

// 표기는 1:1 멘토링 목록 카드(domain/live-mentoring/list/MentorCard)와 같다.
// 도메인 간 직접 import 가 금지라 필요한 문구만 여기에 둔다.
const CATEGORY_LABELS: Record<
  LiveMentoringOpening['categories'][number],
  string
> = {
  PERSONAL_STATEMENT: '자기소개서',
  RESUME: '이력서',
  PORTFOLIO: '포트폴리오',
  CAREER_COFFEE_CHAT: '커리어 커피챗',
  INTERVIEW: '면접 준비, 모의 면접',
  EXPERIENCE: '경험 정리',
};

const durationsLabel = (durations: LiveMentoringOpening['durations']) =>
  durations.map((duration) => `${duration}분`).join(' / ');

const priceLabel = (
  durations: LiveMentoringOpening['durations'],
  price: number,
) => `${price.toLocaleString('ko-KR')}원${durations.length > 1 ? '~' : ''}`;

const careerBadgeLabel = (
  career: LiveMentoringOpening['representativeCareer'],
) =>
  [career?.company, career?.job ?? career?.position]
    .filter((part): part is string => Boolean(part))
    .join(' · ');

interface MentorLiveMentoringItemProps {
  opening: LiveMentoringOpening;
  className?: string;
}

/**
 * 멘토 프로필 "모집 중인 프로그램" 첫 슬라이드의 1:1 멘토링 카드.
 *
 * 크기와 제목 글꼴은 옆 챌린지 카드(MentorProgramItem)에 맞추고, 담는 정보는 1:1 멘토링
 * 목록 카드와 같게 한다 — 직무 배지, 진행시간·가격 바, 타입 태그.
 */
const MentorLiveMentoringItem = ({
  opening,
  className,
}: MentorLiveMentoringItemProps) => {
  const nickname = opening.mentorNickname ?? '멘토';
  const title = opening.title ?? `${nickname}의 1:1 멘토링`;
  const badge = careerBadgeLabel(opening.representativeCareer);
  const url = `/live-mentoring/${opening.mentorId}`;

  return (
    <Link
      className={twMerge(
        'relative flex w-full flex-1 shrink-0 flex-col',
        className,
      )}
      href={url}
      data-url={url}
      data-text={title}
    >
      <div
        className={`border-neutral-75 relative aspect-[1.3/1] w-full shrink-0 overflow-hidden rounded-sm border-[0.7px] ${
          opening.mentorProfileImage ? 'bg-white' : 'bg-primary'
        }`}
      >
        {opening.mentorProfileImage ? (
          <img
            src={opening.mentorProfileImage}
            alt={nickname}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <p
            className={`text-xsmall14 md:text-small18 relative line-clamp-2 px-3 font-bold text-white md:px-4 ${
              badge ? 'pt-9 md:pt-11' : 'pt-3 md:pt-4'
            }`}
          >
            {opening.title ?? `${nickname} 멘토님의 멘토링`}
          </p>
        )}

        {badge && (
          <span className="rounded-xs bg-neutral-0/80 text-xxsmall10 text-static-100 md:text-xxsmall12 absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate px-2.5 py-1 font-semibold">
            {badge}
          </span>
        )}

        <div className="bg-neutral-0 text-xxsmall12 md:text-xsmall14 absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2.5 py-1.5 text-white md:px-3 md:py-2">
          <span className="truncate">{durationsLabel(opening.durations)}</span>
          <span className="shrink-0 font-bold">
            {priceLabel(opening.durations, opening.minimumPrice)}
          </span>
        </div>
      </div>

      <h3 className="text-xsmall16 text-neutral-0 md:text-small18 md:min-h-13 mt-2 line-clamp-2 min-h-12 flex-1 shrink-0 font-semibold md:mt-3">
        {title}
      </h3>

      {opening.categories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 md:mt-4">
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
    </Link>
  );
};

export default MentorLiveMentoringItem;
