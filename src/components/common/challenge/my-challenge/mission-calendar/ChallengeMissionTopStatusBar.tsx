import { ScheduleMission } from '../../../../../schema';

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
          <div className="h-[4px] w-full flex-1 bg-primary" />
          <div className="absolute left-1/2 h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-primary" />
          <div className="h-[4px] w-full flex-1 bg-gray-200" />
        </>
      ) : (mission.th ?? 0) > todayTh ? (
        <div className="h-[4px] w-full flex-1 bg-gray-200" />
      ) : (
        (mission.th ?? 0) < todayTh && (
          <div className="h-[4px] w-full flex-1 bg-primary" />
        )
      )}
    </div>
  );
};

export default MissionTopStatusBar;
