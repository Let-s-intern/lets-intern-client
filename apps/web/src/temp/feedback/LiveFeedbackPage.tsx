'use client';

import BackHeader from '@/common/header/BackHeader';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveFeedbackDetail from '@/domain/challenge/feedback/LiveFeedbackDetail';
import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const LiveFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedMission = searchParams.get('mission');
  const isMissionSelected = selectedMission !== null;

  const handleMobileClick = useCallback(
    (index: number) => {
      router.replace(`${pathname}?mission=${index}`, { scroll: false });
    },
    [pathname, router],
  );

  const cardList = useMemo(
    () =>
      DUMMY_FEEDBACK_MISSIONS.map((config, index) => (
        <FeedbackMissionCard
          key={index}
          config={config}
          onMobileClick={() => handleMobileClick(index)}
        >
          <LiveFeedbackDetail
            period={{
              startDay: config.startDay ?? '',
              endDay: config.endDay ?? '',
            }}
          />
        </FeedbackMissionCard>
      )),
    [handleMobileClick],
  );

  const mobileMission =
    selectedMission !== null
      ? DUMMY_FEEDBACK_MISSIONS[Number(selectedMission)]
      : null;

  return (
    <>
      <div
        className={clsx(
          'grid grid-cols-2 gap-x-5 gap-y-10 pt-8 md:flex md:flex-col md:gap-y-5',
          isMissionSelected && 'hidden md:flex',
        )}
      >
        {cardList}
      </div>

      {mobileMission && (
        <div className="z-1 fixed inset-x-0 bottom-0 top-[44px] overflow-y-auto bg-white px-5 md:hidden">
          <BackHeader to={pathname}>라이브 예약 신청하기</BackHeader>
          <LiveFeedbackDetail
            period={{
              startDay: mobileMission.startDay ?? '',
              endDay: mobileMission.endDay ?? '',
            }}
          />
        </div>
      )}
    </>
  );
};

export default LiveFeedbackPage;
