'use client';

import { useState } from 'react';

import ZepEmbedModal from '@/common/modal/ZepEmbedModal';

import type { LiveFeedbackStatus, Mentor, Reservation } from '../types';
import MentorCard from '../ui/MentorCard';
import { formatReservationTime, isEntranceActive } from '../utils';
import LiveFeedbackReview from './LiveFeedbackReview';

interface Props {
  mentor: Mentor;
  reservation: Reservation | null;
  status: LiveFeedbackStatus;
}

const ReservationInfoSection = ({ mentor, reservation, status }: Props) => {
  const [isZepOpen, setIsZepOpen] = useState(false);

  const reservationTime = formatReservationTime(reservation?.startDate);
  const entranceActive = isEntranceActive(reservation?.startDate);

  return (
    <div className="flex w-full flex-col gap-5 p-0 md:flex-row md:p-4">
      <section className="flex w-full flex-col">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          담당 멘토
        </h2>
        <MentorCard
          mentor={mentor}
          className="min-w-[314px] px-0 py-4 md:px-4"
        />
      </section>

      {reservation && (
        <section className="flex w-full flex-col">
          <h2 className="text-xsmall16 text-neutral-0 font-semibold">
            LIVE 피드백 예약내역
          </h2>
          <div className="flex flex-col gap-10 px-0 py-4 md:gap-4 md:px-4">
            <div className="flex flex-col gap-3">
              {/* 예약 일시 */}
              <div className="flex items-start gap-1">
                <img src="/icons/clock.svg" alt="" className="mt-0.5" />
                <span className="text-xsmall14 text-neutral-40 shrink-0 pr-2">
                  예약 일시
                </span>
                <span className="text-xsmall14 text-neutral-20">
                  {reservationTime}
                </span>
              </div>

              {/* 젭 회의실 */}
              <div className="flex items-center gap-1">
                <img src="/icons/door-closed.svg" alt="" />
                <span className="text-xsmall14 text-neutral-40 pr-2">
                  젭 회의실
                </span>
                <span className="text-xsmall14 text-neutral-20">
                  {entranceActive ? '빈 회의실에 입장해주세요' : '미정'}
                </span>
              </div>
            </div>

            {/* 하단 액션 */}
            {status === 'done' && <LiveFeedbackReview />}
            {status === 'reserved' && (
              <button
                type="button"
                disabled={!entranceActive}
                onClick={entranceActive ? () => setIsZepOpen(true) : undefined}
                className={
                  entranceActive
                    ? 'text-xsmall14 flex flex-1 items-center justify-center whitespace-nowrap rounded-sm bg-gradient-to-r from-[#4B53FF] to-[#763CFF] py-3 font-semibold text-white'
                    : 'bg-neutral-70 text-xsmall14 pointer-events-none flex flex-1 items-center justify-center whitespace-nowrap rounded-sm py-3 font-semibold text-neutral-100'
                }
              >
                LIVE 피드백 입장하기
              </button>
            )}
          </div>
        </section>
      )}

      <ZepEmbedModal isOpen={isZepOpen} onClose={() => setIsZepOpen(false)} />
    </div>
  );
};

export default ReservationInfoSection;
