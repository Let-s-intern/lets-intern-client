import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import clsx from 'clsx';

interface Props {
  className?: string;
  schedule: Schedule;
}

const MissionNotStartedIcon = ({ className, schedule }: Props) => {
  const { setSelectedMission } = useMissionStore();

  const handleMissionClick = () => {
    if (schedule.missionInfo.th !== null) {
      setSelectedMission(schedule.missionInfo.id, schedule.missionInfo.th);
    }
  };

  return (
    <div
      onClick={handleMissionClick}
      className={clsx(
        'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md',
        className,
      )}
    >
      <div className="mb-[10%] flex h-[30%] min-h-[2.5rem] w-[30%] min-w-[2.5rem] rounded-full bg-[#D0CFCF]" />
      <span className="block text-sm font-semibold text-[#D0CFCF]">
        {schedule.missionInfo.th === BONUS_MISSION_TH
          ? '보너스'
          : `${schedule.missionInfo.th}회차`}
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
