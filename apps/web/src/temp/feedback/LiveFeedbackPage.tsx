'use client';

import BackHeader from '@/common/header/BackHeader';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveReservationContent from '@/domain/challenge/feedback/LiveReservationContent';
import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const LiveFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedMission = searchParams.get('mission');
  const isMissionSelected = selectedMission !== null;

  return (
    <>
      {/* 카드 목록 - 모바일에서 예약 뷰가 열리면 숨김 */}
      <div
        className={clsx(
          'grid grid-cols-2 gap-x-5 gap-y-10 pt-8 md:flex md:flex-col md:gap-y-5',
          isMissionSelected && 'hidden md:flex',
        )}
      >
        {DUMMY_FEEDBACK_MISSIONS.map((config, index) => (
          <FeedbackMissionCard
            key={index}
            config={config}
            onMobileClick={() =>
              router.replace(`${pathname}?mission=${index}`, {
                scroll: false,
              })
            }
          >
            <LiveReservationContent />
          </FeedbackMissionCard>
        ))}
      </div>

      {/* 모바일 전체화면 예약 뷰 - fixed로 탭/헤더 위에 덮어씌움 */}
      {isMissionSelected && (
        <div className="z-1 fixed inset-x-0 bottom-0 top-[44px] overflow-y-auto bg-white px-5 md:hidden">
          <BackHeader to={pathname}>라이브 예약 신청하기</BackHeader>
          <LiveReservationContent />
        </div>
      )}
    </>
  );
};

export default LiveFeedbackPage;
