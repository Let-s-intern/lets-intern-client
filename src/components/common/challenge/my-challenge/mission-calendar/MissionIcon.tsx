import { Schedule } from '@/schema';
import clsx from 'clsx';

import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '@/utils/convert';

interface Props {
  className?: string;
  schedule: Schedule;
  isDone: boolean;
}

const MissionIcon = ({ className, schedule, isDone }: Props) => {
  const { currentChallenge } = useCurrentChallenge();

  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;
  const isZerothMissionPassed =
    mission.th === 0 && attendance.result === 'PASS';

  const { text, style, icon } = missionSubmitToBadge({
    status: isZerothMissionPassed ? 'PRESENT' : (attendance.status ?? 'ABSENT'),
    result: attendance.result,
    challengeEndDate: currentChallenge?.endDate,
  });

  const isWaiting = attendance.result === 'WAITING';

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col justify-center rounded-md',
          {
            'cursor-default': isDone,
          },
          className,
        )}
      >
        <i className="block h-3.5 w-3.5">
          <img
            src={icon}
            alt="mission status icon"
            className="w-full object-cover"
          />
        </i>
      </div>
      <div
        className={clsx(
          'mb-[6px] mt-1 flex flex-col justify-center font-semibold leading-4',
          style,
        )}
      >
        {mission.th === BONUS_MISSION_TH
          ? '보너스'
          : isWaiting
            ? `제출`
            : `${mission.th}회차`}
        <br />
        {text}
      </div>
    </>
  );
};

export default MissionIcon;
