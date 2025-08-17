import { Schedule } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import MissionTooltipQuestion from '../../ui/tooltip-question/MissionTooltipQuestion';
import MissionCalendar from '../mission-calendar/MissionCalendar';

const MissionStatusTitle = ({
  isDone,
  todayTh,
  schedules,
}: {
  isDone: boolean;
  todayTh: number;
  schedules: Schedule[];
}) => {
  const maxTh = Math.max(...schedules.map((item) => item.missionInfo.th ?? 0));
  const isAllMissionFinished = maxTh < todayTh;

  if (isDone) return '챌린지가 종료되었습니다.';
  if (isAllMissionFinished) return '🎉 모든 미션이 완료되었습니다 🎉';

  return (
    <>
      오늘은&nbsp;
      <b className="font-semibold text-primary">
        {todayTh === BONUS_MISSION_TH ? '보너스' : `${todayTh}회차`}
      </b>{' '}
      미션 날이에요
    </>
  );
};

interface Props {
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

const MissionCalendarSection = ({ schedules, todayTh, isDone }: Props) => {
  return (
    <section className="mt-4 rounded-xl border border-[#E4E4E7] px-10 pb-10 pt-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          <MissionStatusTitle
            isDone={isDone}
            todayTh={todayTh}
            schedules={schedules}
          />
        </h2>
        <MissionTooltipQuestion />
      </div>
      <MissionCalendar
        className="mt-4"
        schedules={schedules}
        todayTh={todayTh}
        isDone={isDone}
      />
    </section>
  );
};

export default MissionCalendarSection;
