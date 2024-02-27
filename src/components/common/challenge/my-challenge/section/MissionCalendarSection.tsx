import MissionCalendar from '../mission-calendar/MissionCalendar';
import MissionTooltipQuestion from '../tooltip-question/MissionTooltipQuestion';

interface Props {
  missionList: any;
  todayTh: number;
}

const MissionCalendarSection = ({ missionList, todayTh }: Props) => {
  return (
    <section className="mt-4 rounded-xl border border-[#E4E4E7] px-10 pb-10 pt-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          오늘은&nbsp;
          <strong className="font-semibold text-primary">
            {todayTh}일차
          </strong>{' '}
          미션 날이에요
        </h2>
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

export default MissionCalendarSection;
