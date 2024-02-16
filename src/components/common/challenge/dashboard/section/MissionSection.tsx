import MissionGridItem from '../../mission/MissionGridItem';

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
      <div className="mt-6 grid grid-cols-7 gap-x-2 gap-y-4">
        {missionList.map((mission: any, index: number) => (
          <MissionGridItem key={index} mission={mission} todayTh={todayTh} />
        ))}
      </div>
    </section>
  );
};

export default MissionSection;
