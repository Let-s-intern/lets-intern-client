import MissionCalendar from '../mission-calendar/MissionCalendar';
import MissionTooltipQuestion from '../tooltip-question/MissionTooltipQuestion';

interface Props {
  missionList: any;
  todayTh: number;
}

const MissionSection = ({ missionList, todayTh }: Props) => {
  return (
    <section className="flex-1 rounded-xl border border-neutral-80 px-10 py-8">
      <div className="flex items-center gap-2">
        <h2 className="text-1-bold text-neutral-30">일정 및 미션 제출 현황</h2>
        <MissionTooltipQuestion />
      </div>
      <MissionCalendar
        className="mt-4"
        missionList={missionList}
        todayTh={todayTh}
      />
    </section>
  );
};

export default MissionSection;
