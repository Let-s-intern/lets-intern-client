import clsx from 'clsx';
import { useParams } from 'react-router-dom';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';
import { Schedule, ScheduleMission } from '../../../../../schema';
import { useMissionStore } from '../../../../../store/useMissionStore';
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
  const { setSelectedMission } = useMissionStore();
  const params = useParams();
  const handleMissionClick = () => {
    if (!isDone && mission.th !== null && isValid()) {
      setSelectedMission(mission.id, mission.th);
    }
  };

  const { error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });

  const isValid = useCallback(() => {
    if (isAxiosError(error)) {
      const errorCode = error?.response?.data.status;
      if (errorCode === 400) {
        alert('0회차 미션을 먼저 완료해주세요.');
      }
      return false;
    }
    return true;
  }, [error]);

  const { text, style, icon } = missionSubmitToBadge({
    status: attendance.status,
    result: attendance.result,
  });

  const isWaiting = attendance.result === 'WAITING';

  return (
    <div>
      <div
        onClick={handleMissionClick}
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
