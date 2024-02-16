import MissionCalendar from '../mission-calendar/MissionCalendar';

interface Props {
  missionList: any;
  todayTh: number;
}

const MissionCalendarSection = ({ missionList, todayTh }: Props) => {
  return (
    <section className="mt-4 rounded-xl border border-[#E4E4E7] px-10 pb-10 pt-6">
      <h2 className="text-lg font-semibold">
        오늘은&nbsp;
        <strong className="font-semibold text-primary">
          {todayTh}일차
        </strong>{' '}
        미션 날이에요
      </h2>
      <MissionCalendar
        className="mt-2"
        missionList={missionList}
        todayTh={todayTh}
      />
    </section>
  );
};

export default MissionCalendarSection;
