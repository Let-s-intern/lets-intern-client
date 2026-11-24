'use client';

import { useLiveMentorListQuery } from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
import {
  cardPriceLabel,
  careerBadgeLabel,
  durationsLabel,
} from '@/domain/live-mentoring/constants';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

/** 홈에 보이는 멘토링 수. 데스크톱 한 줄 */
const HOME_MENTORING_COUNT = 4;

/** 썸네일이 없을 때 쓰는 배경. 멘토 목록 카드와 같은 색을 멘토 번호로 고른다 */
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #FF6A1A 0%, #FF9A4D 100%)',
  'linear-gradient(135deg, #4D55F5 0%, #7B82FF 100%)',
  'linear-gradient(135deg, #1DB36B 0%, #4FD39A 100%)',
  'linear-gradient(135deg, #13A6E0 0%, #52CBF6 100%)',
  'linear-gradient(135deg, #2B2F8F 0%, #4D55F5 100%)',
];

const MentoringCard = ({ opening }: { opening: LiveMentoringOpening }) => {
  const nickname = opening.mentorNickname ?? '멘토';
  const badge = careerBadgeLabel(opening.representativeCareer);
  const image = opening.thumbnail ?? opening.mentorProfileImage;
  const title = opening.title ?? `${nickname}의 1:1 멘토링`;

  return (
    <Link
      href={`/live-mentoring/${opening.mentorId}`}
      className="home_mentoring_card flex flex-col gap-3"
      data-id={opening.liveMentoringId}
    >
      <div
        className={`relative aspect-[540/421] overflow-hidden rounded-xs ${
          image ? 'bg-white' : ''
        }`}
        style={
          image
            ? undefined
            : {
                background:
                  FALLBACK_GRADIENTS[
                    opening.mentorId % FALLBACK_GRADIENTS.length
                  ],
              }
        }
      >
        {image ? (
          // 썸네일 출처가 여러 버킷이라 next/image 도메인 설정에 묶지 않는다
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={nickname}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <img
              src="/logo/logo-simple.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-4 w-[58%] opacity-[0.14] brightness-0 invert"
            />
            <div
              className={`relative flex h-full flex-col justify-center overflow-hidden px-4 pb-12 md:px-5 md:pb-14 ${
                badge ? 'pt-11' : 'pt-4'
              }`}
            >
              <p className="line-clamp-3 break-keep text-small18 font-bold leading-snug text-white">
                {title}
              </p>
            </div>
          </>
        )}
        {badge && (
          <span className="absolute left-2 top-2 max-w-[90%] truncate rounded-xs bg-neutral-0/80 px-2.5 py-1 text-xxsmall10 font-semibold text-static-100 md:text-xxsmall12">
            {badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-x-2 whitespace-nowrap bg-neutral-0 px-2.5 py-2 text-xxsmall12 text-white md:px-4 md:py-2.5 md:text-xsmall14">
          <span>{durationsLabel(opening.durations)}</span>
          <span className="ml-auto font-bold">
            {cardPriceLabel(opening.durations, opening.minimumPrice)}
          </span>
        </div>
      </div>
      <p className="line-clamp-2 text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
        {title}
      </p>
    </Link>
  );
};

/** 홈 1:1 LIVE 멘토링. 열린 멘토링 최신순 4개와 전체 목록 링크. 열린 것이 없으면 숨긴다 */
const HomeMentoringSection = () => {
  const { data } = useLiveMentorListQuery({ sort: 'LATEST' });
  const openings = data?.openingList.slice(0, HOME_MENTORING_COUNT) ?? [];

  if (openings.length === 0) return null;

  return (
    <section className="mt-20 flex w-full max-w-[1120px] flex-col px-5 md:mt-32 xl:px-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xsmall14 font-semibold text-primary md:text-xsmall16">
            1:1 LIVE 멘토링
          </p>
          <h2 className="mt-1 text-small20 font-bold text-neutral-0 md:text-medium24">
            현직자에게 직접 물어보세요
          </h2>
        </div>
        <Link
          href="/live-mentoring"
          className="home_mentoring_more flex shrink-0 items-center text-xsmall14 text-neutral-30 md:text-xsmall16"
        >
          전체 보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 md:mt-8 md:grid-cols-4 md:gap-x-5">
        {openings.map((opening) => (
          <MentoringCard key={opening.openingId} opening={opening} />
        ))}
      </div>
    </section>
  );
};

export default HomeMentoringSection;
