import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';

interface Props {
  mission: any;
  todayTh: number;
}

const MissionCalendarItem = ({ mission, todayTh }: Props) => {
  return (
    <div>
      {/* <span className="block w-full text-center text-xs">2/4</span> */}
      {mission.missionTh === todayTh ? (
        <MissionTodayIcon className="mt-3" mission={mission} />
      ) : mission.missionTh > todayTh ? (
        <MissionNotStartedIcon className="mt-3" mission={mission} />
      ) : (
        mission.missionTh < todayTh && (
          <MissionIcon className="mt-3" mission={mission} />
        )
      )}
    </div>
  );
};

export default MissionCalendarItem;
