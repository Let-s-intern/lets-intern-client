import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { isAxiosError } from 'axios';
import { MouseEventHandler, useCallback } from 'react';
import { Schedule, ScheduleMission } from '../../../../../schema';
import { missionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  mission: ScheduleMission;
  attendance: Schedule['attendanceInfo'];
  className: string;
  isDone: boolean;
}

const MissionTodayIcon = ({
  mission,
  className,
  attendance,
  isDone,
}: Props) => {
  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, error } = useChallengeMissionAttendanceInfoQuery({
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

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    if (isLoading || isDone) return;
    if (isValid()) {
      navigate(
        `/challenge/${params.applicationId}/${params.programId}/me?scroll_to=daily-mission`,
      );
    }
  };

  return (
    <>
      <Link
        to="#"
        replace
        className={clsx(
          'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
          {
            'cursor-default': isDone,
          },
          className,
        )}
        onClick={handleClick}
      >
        {attendance.status === 'ABSENT' ||
        attendance.result === 'WRONG' ||
        attendance.result === null ? (
          <div className="mb-[10%] flex h-[30%] w-[50%] min-w-[2.5rem] items-center justify-center">
            <img
              src="/icons/general-mission.svg"
              alt="general mission icon"
              className="w-full"
            />
          </div>
        ) : (
          <div className="mb-[10%] flex h-[30%] w-[50%] min-w-[2.5rem] items-center justify-center rounded-full bg-primary">
            <i className="text-2xl text-white">
              <FaCheck />
            </i>
          </div>
        )}
        <span className="text-sm font-semibold text-primary">
          {mission.th === BONUS_MISSION_TH ? '보너스' : `${mission.th}회차`}
        </span>
      </Link>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-xs px-2 py-[0.125rem] text-sm',
            missionSubmitToBadge({
              status: attendance.status,
              result: attendance.result,
            }).style,
            {
              'opacity-0':
                attendance.status === 'ABSENT' || attendance.result === null,
            },
          )}
        >
          {
            missionSubmitToBadge({
              status: attendance.status,
              result: attendance.result,
            }).text
          }
        </span>
      </div>
    </>
  );
};

export default MissionTodayIcon;
