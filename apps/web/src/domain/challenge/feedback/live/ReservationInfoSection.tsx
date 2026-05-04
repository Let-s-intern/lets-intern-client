import type { Mentor, Reservation } from './types';
import MentorCard from './ui/MentorCard';
import { formatReservationTime } from './utils';

interface Props {
  mentor: Mentor;
  reservation: Reservation;
}

type CtaState = 'pending' | 'active' | 'done';

function getCtaState(scheduledDate: string, scheduledTime: string): CtaState {
  const [hour, minute] = scheduledTime.split(':').map(Number);
  const start = new Date(scheduledDate);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const now = new Date();

  if (now >= end) return 'done';
  if ((start.getTime() - now.getTime()) / 60_000 <= 10) return 'active';
  return 'pending';
}

const ReservationInfoSection = ({ mentor, reservation }: Props) => {
  const { scheduledDate, scheduledTime, zepRoomNumber, zepRoomUrl } =
    reservation;

  const ctaState = getCtaState(scheduledDate, scheduledTime);
  const formattedTime = formatReservationTime(scheduledDate, scheduledTime);

  return (
    <section className="flex w-full gap-5">
      {/* 멘토 정보 */}
      <div className="flex w-full flex-col">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          담당 멘토
        </h2>
        <MentorCard mentor={mentor} showStars={true} />
      </div>

      {/* 예약 정보 */}
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          라이브 피드백
        </h2>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center">
              <img src="/icons/clock.svg" alt=" - " />
              <span className="text-xsmall14 text-neutral-40 pl-1 pr-3">
                예약 시간
              </span>
              <span className="text-xsmall14 text-neutral-0 font-semibold">
                {formattedTime}
              </span>
            </div>
            <div className="flex items-center">
              <img src="/icons/door-closed.svg" alt=" - " />
              <span className="text-xsmall14 text-neutral-40 pl-1 pr-3">
                젭 회의실
              </span>
              <span className="text-xsmall14 text-neutral-0 font-semibold">
                {zepRoomNumber !== null ? `${zepRoomNumber}번 방` : '미정'}
              </span>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="flex gap-4">
            {ctaState !== 'done' && (
              <button
                type="button"
                className="border-primary text-xsmall14 text-primary rounded-sm border bg-neutral-100 px-[30px] py-3 font-semibold"
              >
                멘토님께 질문하기
              </button>
            )}

            {ctaState === 'done' ? (
              <button
                type="button"
                className="bg-primary text-xsmall14 rounded-sm px-[30px] py-3 font-semibold text-white"
              >
                라이브 피드백 회고하기
              </button>
            ) : (
              <a
                href={zepRoomUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={ctaState === 'pending'}
                className={
                  ctaState === 'active'
                    ? 'text-xsmall14 rounded-sm bg-gradient-to-r from-[#4B53FF] to-[#763CFF] px-[30px] py-3 font-semibold text-white'
                    : 'bg-neutral-70 text-xsmall14 pointer-events-none rounded-sm px-[30px] py-3 font-semibold text-neutral-100'
                }
              >
                라이브 피드백 입장하기
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationInfoSection;
