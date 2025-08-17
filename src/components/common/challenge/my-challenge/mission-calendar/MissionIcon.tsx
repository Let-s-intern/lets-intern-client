import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { Schedule } from '../../../../../schema';

import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  className?: string;
  schedule: Schedule;
  isDone: boolean;
}

const MissionIcon = ({ className, schedule, isDone }: Props) => {
  const params = useParams();
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  const isAttended =
    (attendance.result === 'WAITING' || attendance.result === 'PASS') &&
    attendance.status !== 'ABSENT';

  return (
    <>
      <Link
        to={
          !isDone
            ? `/challenge/${params.applicationId}/${params.programId}/me?scroll_to_mission=${mission.id}`
            : '#'
        }
        replace
        className={clsx(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-md',
          {
            'cursor-default': isDone,
          },
          className,
        )}
      >
        <div className={clsx('absolute left-0 top-0 rounded-br-md')} />
        {/* {isAttended ? (
          <i className="mb-[10%] mt-2">
            <img
              src="/icons/check-icon.svg"
              alt="check-icon"
              className="w-full object-cover"
            />
          </i>
        ) : (
          <i className="mb-[10%] mt-2">
            <img
              src="/icons/x-icon.svg"
              alt="not-started-icon"
              className="w-full object-cover"
            />
          </i>
        )} */}
        <span className="text-sm font-semibold">
          {mission.th === BONUS_MISSION_TH ? '보너스' : `${mission.th}회차`}
        </span>
      </Link>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-xs text-sm',
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
