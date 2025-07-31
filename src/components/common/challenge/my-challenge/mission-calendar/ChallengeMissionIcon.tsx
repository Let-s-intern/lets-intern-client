import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { Schedule } from '../../../../../schema';

import { challengeMissionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  className?: string;
  schedule: Schedule;
}
// 새로운 버전
const MissionIcon = ({ className, schedule }: Props) => {
  const params = useParams();
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  const { text, style, icon } = challengeMissionSubmitToBadge({
    status: attendance.status || 'ABSENT',
    result: attendance.result,
  });
  const isWaiting = attendance.result === 'WAITING';
  const isBonus = mission.th === 100;

  return (
    <>
      <Link
        to={`/challenge/${params.programId}/dashboard/${params.applicationId}/missions`}
        replace
        className={clsx('relative aspect-square cursor-pointer', className)}
      >
        <i className="block h-3.5 w-3.5">
          <img
            src={icon}
            alt="mission status icon"
            className="w-full object-cover"
          />
        </i>
        <div className="justify-left mt-1 flex text-sm font-semibold">
          <span
            className={clsx(
              'text-[13px] leading-4',
              style,
              attendance.status === 'PRESENT' || attendance.result === 'WAITING'
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
    </>
  );
};

export default MissionIcon;
