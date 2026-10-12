// 나의 패스 이용 > 멘토링 탭. 쿠폰 지급 안내 + 진행 중인 1:1 LIVE 멘토링 목록(클릭 시 상세 판매페이지).
'use client';

import { useLiveMentorListQuery } from '@/api/live-mentoring/liveMentoring';
import MentorCard from '@/domain/live-mentoring/list/MentorCard';
import Link from 'next/link';

const UsageMentoringTab = () => {
  const { data, isLoading, isError } = useLiveMentorListQuery({ page: 1 });
  const openings = data?.openingList ?? [];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="bg-primary-5 flex justify-between gap-3 rounded-sm px-3 py-2 md:px-4 md:py-3">
        <p className="md:text-xsmall16 text-neutral-10 text-[13px]">
          매월{' '}
          <Link
            href="/mypage/coupon"
            className="text-primary font-semibold underline underline-offset-2"
          >
            쿠폰함
          </Link>
          에 <b className="font-semibold">1:1 LIVE 멘토링 50% 할인 쿠폰</b>이
          지급됩니다. <br className="block md:hidden" />
          멘토링 신청 시 적용해주세요.
        </p>
      </div>

      {isLoading ? (
        <p className="text-xsmall14 text-neutral-40 py-20 text-center">
          불러오는 중…
        </p>
      ) : isError ? (
        <p className="text-xsmall14 text-neutral-40 py-20 text-center">
          멘토링 프로그램 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : openings.length === 0 ? (
        <div className="bg-neutral-95 flex h-52 w-full items-center justify-center rounded-sm md:h-60">
          <p className="text-xsmall14 text-neutral-40">
            현재 진행 중인 1:1 LIVE 멘토링이 없어요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-x-4 md:gap-y-5">
          {openings.map((opening) => (
            <MentorCard key={opening.openingId} opening={opening} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsageMentoringTab;
