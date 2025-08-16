import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { Schedule } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '@/utils/convert';
import { isAxiosError } from 'axios';
import clsx from 'clsx';
import { MouseEventHandler, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const linkStyle = {
  clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%, 0 30%)',
};

interface Props {
  className?: string;
  schedule: Schedule;
  isDone: boolean;
}

const MissionIcon = ({ className, schedule, isDone }: Props) => {
  const params = useParams();
  const navigate = useNavigate();

  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  const { isLoading, error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });

  const isAttended =
    (attendance.result === 'WAITING' || attendance.result === 'PASS') &&
    attendance.status !== 'ABSENT';

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

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    if (isLoading || isDone) return;
    if (isValid()) {
      navigate(
        `/challenge/${params.applicationId}/${params.programId}/me?scroll_to_mission=${mission.id}`,
      );
    }
  };

  return (
    <>
      <Link
        to="#"
        replace
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
      </Link>
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
