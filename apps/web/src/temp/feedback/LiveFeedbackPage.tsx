'use client';

import { DUMMY_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import LiveFeedbackDetail from '@/domain/challenge/feedback/live/LiveFeedbackDetail';
import type { LiveFeedbackStatus } from '@/domain/challenge/feedback/live/types';
import { toCardConfig } from '@/domain/challenge/feedback/live/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const BUTTON_LABELS: Record<
  LiveFeedbackStatus,
  { buttonLabel: string; openLabel: string }
> = {
  prev: { buttonLabel: '예약 신청 보기', openLabel: '예약 신청 닫기' },
  reserved: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
  done: { buttonLabel: '신청 내역 보기', openLabel: '신청 내역 닫기' },
};

const LiveFeedbackPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMobileClick = useCallback(
    (index: number) => {
      router.push(`${pathname}/${index}`);
    },
    [pathname, router],
  );

  const cardList = useMemo(
    () =>
      DUMMY_FEEDBACK_MISSIONS.map((mission, index) => {
        const { buttonLabel, openLabel } = BUTTON_LABELS[mission.status];
        const config = toCardConfig(mission);

        return (
          <FeedbackMissionCard
            key={mission.id}
            config={config}
            buttonLabel={buttonLabel}
            openLabel={openLabel}
            onClick={() => handleMobileClick(index)}
          >
            <LiveFeedbackDetail
              assignedMentor={mission.assignedMentor}
              period={{
                startDay: mission.startDay,
                endDay: mission.endDay,
              }}
              reservationInfo={mission.reservationInfo}
            />
          </FeedbackMissionCard>
        );
      }),
    [handleMobileClick],
  );

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 pt-8 md:flex md:flex-col md:gap-y-5">
      {cardList}
    </div>
  );
};

export default LiveFeedbackPage;
