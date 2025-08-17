import { Schedule } from '@/schema';
import clsx from 'clsx';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '@/utils/convert';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

const linkStyle = {
  clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%, 0 30%)',
};

interface Props {
  className?: string;
  schedule: Schedule;
  isDone: boolean;
}

const MissionIcon = ({ className, schedule, isDone }: Props) => {
  const mission = schedule.missionInfo;
  const params = useParams();
  const attendance = schedule.attendanceInfo;

  const { error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });
  const { setSelectedMission } = useMissionStore();

  const isAttended =
    (attendance.result === 'WAITING' || attendance.result === 'PASS') &&
    attendance.status !== 'ABSENT';

  const handleMissionClick = () => {
    if (!isDone && mission.th !== null && isValid()) {
      setSelectedMission(mission.id, mission.th);
    }
  };

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

  return (
    <>
      <div
        onClick={handleMissionClick}
        className={clsx(
          'relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md text-white',
          {
            'bg-[#d0cfcf]': !isAttended,
            'bg-[#928DF8]': isAttended,
          },
          {
            'cursor-default': isDone,
          },
          className,
        )}
        onClick={handleClick}
        style={linkStyle}
      >
        <div
          className={clsx(
            'absolute left-0 top-0 aspect-square w-[30%] rounded-br-md',
            {
              'bg-[#c0c0c0]': !isAttended,
              'bg-primary': isAttended,
            },
          )}
        />
        {isAttended ? (
          <i className="mb-[10%] mt-2 h-[30%] min-h-[1.5rem] w-[20%] min-w-[1.5rem]">
            <img
              src="/icons/check-icon.svg"
              alt="check-icon"
              className="w-full object-cover"
            />
          </i>
        ) : (
          <i className="mb-[10%] mt-2 h-[30%] min-h-[1.5rem] w-[20%] min-w-[1.5rem]">
            <img
              src="/icons/x-icon.svg"
              alt="not-started-icon"
              className="w-full object-cover"
            />
          </i>
        )}
        <span className="text-sm font-semibold">
          {mission.th === BONUS_MISSION_TH ? '보너스' : `${mission.th}회차`}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-xs px-2 py-[0.125rem] text-sm',
            missionSubmitToBadge({
              status: attendance.status || 'ABSENT',
              result: attendance.result,
            }).style,
          )}
        >
          {
            missionSubmitToBadge({
              status: attendance.status || 'ABSENT',
              result: attendance.result,
            }).text
          }
        </span>
      </div>
    </>
  );
};

export default MissionIcon;
