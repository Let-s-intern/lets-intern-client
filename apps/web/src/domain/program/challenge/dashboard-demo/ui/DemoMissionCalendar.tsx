import clsx from 'clsx';
import { DEMO_OPEN_MISSION_TH, DemoSchedule } from '../data/demoMock';

interface Props {
  schedules: DemoSchedule[];
  onOpenMission: () => void;
  onLocked: () => void;
}

const SLIDE_WIDTH_PX = 82;
const CARD_WIDTH_PX = 74.8;

/**
 * 실제 MissionCalendar 의 가벼운 복사본. 원본은 카드마다 미션 상세를 조회하고 라우터로 이동해서
 * 그대로 쓸 수 없다. 체험에서는 0회차만 열려 있고 나머지는 잠금 안내를 띄운다.
 */
const DemoMissionCalendar = ({ schedules, onOpenMission, onLocked }: Props) => {
  // 0회차가 진행 중이니 진행바는 첫 카드 가운데에 멈춘다.
  const progress =
    (CARD_WIDTH_PX / 2 / (schedules.length * SLIDE_WIDTH_PX)) * 100;

  return (
    <div className="mt-3 overflow-x-auto scrollbar-hide">
      <ul className="relative flex w-max pt-4">
        <li
          aria-hidden
          className="absolute left-0 top-0 hidden h-1 w-full rounded-full bg-neutral-70 md:block"
        >
          <div
            className="absolute h-1 rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{ left: `${progress}%` }}
          />
        </li>
        {schedules.map((schedule) => {
          const isOpen = schedule.th === DEMO_OPEN_MISSION_TH;

          return (
            <li key={schedule.th} className="mt-3 w-[82px]">
              <button
                type="button"
                onClick={isOpen ? onOpenMission : onLocked}
                className={clsx(
                  'h-[104px] w-[74.8px] rounded-xxs border px-2 py-2.5 text-left hover:bg-primary-5',
                  isOpen
                    ? 'border-[#A6AAFA] bg-primary-5'
                    : 'border-neutral-80',
                )}
              >
                <img
                  src={
                    isOpen
                      ? '/icons/submit_waiting.svg'
                      : '/icons/submit_absent.svg'
                  }
                  alt=""
                  className="h-3.5 w-3.5"
                />
                <span
                  className={clsx(
                    'mb-[6px] mt-1 block font-semibold leading-4',
                    isOpen
                      ? 'text-sm text-primary-90'
                      : 'text-[13px] text-neutral-30',
                  )}
                >
                  {schedule.th}회차
                  <br />
                  {isOpen ? '진행중' : '미션'}
                </span>
                <span
                  className={clsx(
                    'block w-full text-xxsmall10 leading-3',
                    isOpen && 'text-primary',
                  )}
                >
                  {schedule.startDate.format('MM.DD(ddd)')}
                  <br />~ {schedule.endDate.format('MM.DD(ddd)')}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DemoMissionCalendar;
