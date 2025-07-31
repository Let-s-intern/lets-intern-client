import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';

import { Schedule, ScheduleMission } from '../../../../../schema';
import { challengeMissionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  mission: ScheduleMission;
  attendance: Schedule['attendanceInfo'];
  className?: string;
  isDone?: boolean;
}
// 새로운 버전
const MissionTodayIcon = ({ mission, className, attendance }: Props) => {
  const params = useParams();
  const { text, style, icon } = challengeMissionSubmitToBadge({
    status: attendance.status,
    result: attendance.result,
  });
  const isWaiting = attendance.result === 'WAITING';
  const isBonus = mission.th === 100;

  return (
    <Link
      to={`/challenge/${params.programId}/dashboard/${params.applicationId}/missions`}
      replace
      className={clsx('flex cursor-pointer flex-col', className)}
    >
      <i className="block h-3.5 w-3.5">
        <img src={icon} alt="mission status icon" className="w-full" />
      </i>
      <div className="justify-left mt-1 flex text-sm font-semibold">
        <span
          className={clsx(
            'text-[13px] leading-4',
            style,
            attendance.status === 'PRESENT' ||
              attendance.result === 'WAITING' ||
              attendance.result == null
              ? 'text-[14px]'
              : '',
          )}
        >
          {isWaiting ? (
            <>
              제출
              <br />
            </>
          ) : isBonus ? (
            <>
              보너스
              <br />
            </>
          ) : (
            <>
              {mission.th}회차
              <br />
            </>
          )}
          {text}
        </span>
      </div>
    </Link>
  );
};

export default MissionTodayIcon;
