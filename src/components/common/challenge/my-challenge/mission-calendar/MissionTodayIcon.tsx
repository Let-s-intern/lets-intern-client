import clsx from 'clsx';

import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { Schedule, ScheduleMission } from '../../../../../schema';
import { missionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  mission: ScheduleMission;
  attendance: Schedule['attendanceInfo'];
  className?: string;
  isDone: boolean;
}

const MissionTodayIcon = ({
  mission,
  className,
  attendance,
  isDone,
}: Props) => {
  const { currentChallenge } = useCurrentChallenge();
  const { text, style, icon } = missionSubmitToBadge({
    status: attendance.status,
    result: attendance.result,
    challengeEndDate: currentChallenge?.endDate,
  });

  const isWaiting = attendance.result === 'WAITING';

  return (
    <div>
      <div
        className={clsx(
          'relative flex cursor-pointer flex-col justify-center rounded-md',
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
          'mb-[6px] mt-1 flex flex-col justify-center text-sm font-semibold leading-4',
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
    </div>
  );
};

export default MissionTodayIcon;
