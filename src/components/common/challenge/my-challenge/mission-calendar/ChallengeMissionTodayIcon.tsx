import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';

import { Schedule, ScheduleMission } from '../../../../../schema';
import { challengeMissionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  mission: ScheduleMission;
  attendance: Schedule['attendanceInfo'];
  className?: string;
  isDone: boolean;
}
// 새로운 버전
const MissionTodayIcon = ({
  mission,
  className,
  attendance,
  isDone,
}: Props) => {
  const params = useParams();
  return (
    <>
      <Link
        to={
          !isDone
            ? `/challenge/${params.applicationId}/${params.programId}/me?scroll_to=daily-mission`
            : '#'
        }
        replace
        className={clsx(
          'flex cursor-pointer flex-col',
          {
            'cursor-default': isDone,
          },
          className,
        )}
      >
        {attendance.status === 'ABSENT' ||
        attendance.result === 'WRONG' ||
        attendance.result === null ? (
          <i className="block h-3.5 w-3.5">
            <img
              src="/icons/check-gray-outline.svg"
              alt="general mission icon"
              className="w-full"
            />
          </i>
        ) : (
          <i className="block h-3.5 w-3.5">
            <img
              src="/icons/waiting-purple-outline.svg"
              alt="general mission icon"
              className="w-full"
            />
          </i>
        )}
      </Link>
      <div className="justify-left mt-1 flex text-sm font-semibold">
        <span
          className={clsx(
            'text-[13px] leading-4',
            challengeMissionSubmitToBadge({
              status: attendance.status,
              result: attendance.result,
            }).style,
          )}
        >
          {mission.th}회차
          <br />
          {
            challengeMissionSubmitToBadge({
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
