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
          <div className="flex flex-col gap-4 px-0 py-4 md:px-4">
            {/* 예약 일시 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <img src="/icons/clock.svg" alt="" />
                <span className="text-xsmall14 text-neutral-40 pr-1">
                  예약 일시
                </span>
                <span
                  className={`text-xsmall14 font-semibold ${status === 'canceled' ? 'text-neutral-60 line-through' : 'text-neutral-0'}`}
                >
                  {status === 'canceled' ? previousTime : currentTime}
                </span>
                {status === 'canceled' && (
                  <span className="text-xxsmall12 text-neutral-40">취소됨</span>
                )}
                {status === 'changed' && (
                  <span className="text-xxsmall12 text-primary font-medium">
                    현재 예약
                  </span>
                )}
              </div>
              {status === 'changed' && previousTime && (
                <div className="flex items-center gap-2 pl-5">
                  <span className="text-xsmall14 text-neutral-60 line-through">
                    {previousTime}
                  </span>
                  <span className="text-xxsmall12 text-neutral-40">
                    이전 예약
                  </span>
                </div>
              )}
            </div>

            {/* 변경/취소 안내박스 */}
            {isModified && (
              <div className="bg-primary-10 text-primary flex items-start gap-2 rounded-sm px-4 py-3">
                <img
                  src="/icons/info.svg"
                  alt=""
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xsmall14 font-semibold">
                    {status === 'canceled'
                      ? '예약시간이 취소되었어요.'
                      : '예약시간이 변경되었어요.'}
                  </span>
                  <span className="text-xxsmall12">
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
                <span className="text-xsmall14 text-neutral-0 font-semibold">
                  빈 방에 들어가주세요
                </span>
              </div>
            )}

            {/* 하단 액션 */}
            {status === 'done' && <LiveFeedbackReview />}
            {(status === 'reserved' || status === 'changed') && (
              <button
                type="button"
                disabled={!entranceActive}
                className={`text-xsmall14 flex w-full items-center justify-center whitespace-nowrap rounded-sm py-3 font-semibold ${entranceActive ? 'bg-gradient-to-r from-[#4B53FF] to-[#763CFF] text-white' : 'bg-neutral-70 text-neutral-100'}`}
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
