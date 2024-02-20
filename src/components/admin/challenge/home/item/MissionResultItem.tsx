import clsx from 'clsx';

import { formatToMonthDate } from '../../../../../utils/formatDateString';
import MissionTopStatusBar from '../status-bar/MissionTopStatusBar';
import { missionStatusToBadge } from '../../../../../utils/convert';

interface Props {
  mission: any;
}

const MissionResultItem = ({ mission }: Props) => {
  return (
    <div className="font-pretendard">
      <MissionTopStatusBar mission={mission} todayTh={4} />
      <div className="mt-2 text-center text-sm">
        {formatToMonthDate(mission.missionStartDate)}
      </div>
      <div className="py-2 text-center text-sm">{mission.missionTh}일차</div>
      <div
        className={clsx('flex items-end justify-center text-3xl font-bold', {
          // invisible: status === 'NOT_STARTED',
        })}
      >
        {mission.attendanceCount}
      </div>
      <div
        className={clsx('text-center text-sm', {
          // invisible: status === 'NOT_STARTED',
        })}
      >
        지각 {mission.lateAttendanceCount}
      </div>
      <div className="mt-1 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-md px-2 py-[0.125rem] text-xs ',
            missionStatusToBadge[mission.missionStatus]?.style ||
              'bg-[#E7E6FD] text-primary',
          )}
        >
          {missionStatusToBadge[mission.missionStatus]?.text || '기타'}
        </span>
      </div>
    </div>
  );
};

export default MissionResultItem;
