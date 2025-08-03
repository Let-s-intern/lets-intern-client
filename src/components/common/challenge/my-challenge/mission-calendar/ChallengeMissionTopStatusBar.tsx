import { ScheduleMission } from '@/schema';

interface Props {
  mission: ScheduleMission;
  todayTh: number;
}
// 새로운 버전
const MissionTopStatusBar = ({ mission, todayTh }: Props) => {
  return (
    <div className="relative flex items-center">
      {mission.th === todayTh ? (
        <>
          <div className="w-full flex-1 bg-primary md:h-1" />
          <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-primary md:h-[8px] md:w-[8px]" />
          <div className="w-full flex-1 bg-gray-200 md:h-1" />
        </>
      ) : (mission.th ?? 0) > todayTh ? (
        <div className="w-full flex-1 bg-gray-200 md:h-1" />
      ) : (
        (mission.th ?? 0) < todayTh && (
          <div className="w-full flex-1 bg-primary md:h-1" />
        )
      )}
    </div>
  );
};

export default MissionTopStatusBar;
