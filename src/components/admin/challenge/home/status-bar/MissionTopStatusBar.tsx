interface Props {
  mission: any;
  todayTh: number;
  isLastMission: boolean;
}

const MissionTopStatusBar = ({ mission, todayTh, isLastMission }: Props) => {
  return (
    <div className="relative flex items-center">
      {mission.missionTh === todayTh ? (
        <>
          <div className="h-[2px] w-full flex-1 bg-primary" />
          <div className="absolute left-1/2 h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-primary" />
          <div className="h-[1px] w-full flex-1 bg-gray-200" />
        </>
      ) : todayTh === 0 ? (
        <>
          <div className="h-[2px] w-full flex-1 bg-primary" />
          {isLastMission && (
            <div className="absolute right-0 h-[8px] w-[8px] translate-x-1/2 rounded-full bg-primary" />
          )}
        </>
      ) : mission.missionTh > todayTh ? (
        <>
          <div className="h-[1px] w-full flex-1 bg-gray-200" />
        </>
      ) : (
        mission.missionTh < todayTh && (
          <>
            <div className="h-[2px] w-full flex-1 bg-primary" />
          </>
        )
      )}
    </div>
  );
};

export default MissionTopStatusBar;
