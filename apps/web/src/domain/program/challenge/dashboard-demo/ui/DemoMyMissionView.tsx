import { DemoSchedule } from '../data/demoMock';
import DemoMissionCalendar from './DemoMissionCalendar';
import DemoZeroGuide from './DemoZeroGuide';
import DemoZeroSubmit from './DemoZeroSubmit';

interface Props {
  schedules: DemoSchedule[];
  onLocked: () => void;
}

/** 실제 나의 미션(me/page.tsx)에서 0회차를 고른 상태 */
const DemoMyMissionView = ({ schedules, onLocked }: Props) => {
  const zeroMission = schedules[0];

  return (
    <main className="px-5 py-8 md:py-0 md:pl-8 md:pr-0">
      <h2 className="text-medium22 font-semibold">나의 미션</h2>
      <section className="mt-6">
        <div className="flex items-center gap-2 rounded-xxs bg-primary-5 px-3 py-3">
          <img src="/icons/check-star-primary.svg" alt="" className="h-6 w-6" />
          <span className="flex-1 text-xsmall16 font-semibold text-primary">
            <span className="text-neutral-0">오늘은</span> {zeroMission.th}회차{' '}
            <span className="text-neutral-0">미션날입니다!</span>
          </span>
        </div>
        <DemoMissionCalendar
          schedules={schedules}
          // 이미 0회차를 보고 있으니 다시 눌러도 그대로 둔다.
          onOpenMission={() => {}}
          onLocked={onLocked}
        />
      </section>
      <div className="mt-10 flex flex-col gap-6">
        <DemoZeroGuide schedule={zeroMission} onLocked={onLocked} />
        <DemoZeroSubmit />
      </div>
    </main>
  );
};

export default DemoMyMissionView;
