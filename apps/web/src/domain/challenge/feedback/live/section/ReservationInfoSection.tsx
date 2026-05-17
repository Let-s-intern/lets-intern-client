import { useState } from 'react';

import ZepEmbedModal from '@/common/modal/ZepEmbedModal';

import { isEntranceActive } from '../utils';
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
  const { scheduledDate, scheduledTime, zepRoomNumber } = reservation;
  const [isZepOpen, setIsZepOpen] = useState(false);
  const currentTime = formatReservationTime(
    reservation?.scheduledDate,
    reservation?.scheduledTime,
  );
  const previousTime = formatReservationTime(
    reservation?.previousScheduledDate,
    reservation?.previousScheduledTime,
  );
  const entranceActive = isEntranceActive(
    reservation?.scheduledDate,
    reservation?.scheduledTime,
  );

  const isModified = status === 'canceled' || status === 'changed';

  return (
    <div className="flex w-full flex-col gap-5 p-0 md:flex-row md:p-4">
      <section className="flex w-full flex-col">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          담당 멘토
        </h2>
        <MentorCard
          mentor={mentor}
          showStars
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
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xsmall14 text-neutral-20 ${status === 'canceled' ? 'line-through' : ''}`}
                    >
                      {status === 'canceled' ? previousTime : currentTime}
                    </span>
                    {status === 'canceled' && (
                      <span className="text-xxsmall12 text-neutral-40">
                        취소됨
                      </span>
                    )}
                    {status === 'changed' && (
                      <span className="text-xxsmall12 text-primary font-medium">
                        현재 예약
                      </span>
                    )}
                  </div>
                  {status === 'changed' && previousTime && (
                    <div className="flex items-center gap-2">
                      <span className="text-xsmall14 text-neutral-60 line-through">
                        {previousTime}
                      </span>
                      <span className="text-xxsmall12 text-neutral-40">
                        이전 예약
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 변경/취소 안내박스 */}
              {isModified && (
                <div className="bg-primary-5 text-system-positive-blue rounded-xs flex items-start gap-2 px-4 py-2">
                  <img
                    src="/icons/info-filled.svg"
                    alt=""
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xxsmall12">
                      {status === 'canceled'
                        ? '예약시간이 취소되었어요.'
                        : '예약시간이 변경되었어요.'}
                    </span>
                    <span className="text-xxsmall12 text-neutral-20">
                      멘토님과 조율된 내용인지 확인해 주세요.
                    </span>
                  </div>
                </div>
              )}

              {/* 젭 회의실 */}
              {status !== 'canceled' && (
                <div className="flex items-center gap-1">
                  <img src="/icons/door-closed.svg" alt="" />
                  <span className="text-xsmall14 text-neutral-40 pr-2">
                    젭 회의실
                  </span>
                  <span className="text-xsmall14 text-neutral-20">미정</span>
                </div>
              )}
            </div>
            {/* 하단 액션 */}
            {status === 'done' && <LiveFeedbackReview />}
            {(status === 'reserved' || status === 'changed') && (
              <button
                type="button"
                className="border-primary text-xsmall14 text-primary flex-1 whitespace-nowrap rounded-sm border bg-neutral-100 py-3 font-semibold"
              >
                멘토님께 질문하기
              </button>
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
            </div>
          )}
        </div>
      </section>

      <ZepEmbedModal isOpen={isZepOpen} onClose={() => setIsZepOpen(false)} />
                disabled={!entranceActive}
                className={`text-xsmall16 flex w-full items-center justify-center whitespace-nowrap rounded-sm py-4 font-semibold ${entranceActive ? 'bg-gradient-to-r from-[#4B53FF] to-[#763CFF] text-white' : 'bg-neutral-70 text-neutral-100'}`}
              >
                LIVE 피드백 입장하기
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ReservationInfoSection;
