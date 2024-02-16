import MissionCalendar from '../mission-calendar/MissionCalendar';

interface Props {
  missionList: any;
  todayTh: number;
}

const MissionSection = ({ missionList, todayTh }: Props) => {
  return (
    <section className="flex-1 rounded-xl border border-[#E4E4E7] px-10 py-8">
      <h2 className="text-xl font-semibold text-[#4A495C]">
        일정 및 미션 제출 현황
      </h2>
      <MissionCalendar
        className="mt-2"
        missionList={missionList}
        todayTh={todayTh}
      />
    </section>
  );
};

export default MissionSection;
