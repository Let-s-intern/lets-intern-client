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
      className={clsx('flex cursor-pointer flex-col', className)}
    >
      <i className="block h-3.5 w-3.5">
        <img
          src="/icons/submit_absent.svg"
          alt="not-started-icon"
          className="object-cover"
        />
      </i>
      <span className="mb-[6px] mt-1 block text-[13px] font-semibold leading-4 text-neutral-30">
        {schedule.missionInfo.th === BONUS_MISSION_TH
          ? '보너스'
          : `${schedule.missionInfo.th}회차`}
        <br />
        미션
      </span>
    </div>
  );
};

export default MissionNotStartedIcon;
