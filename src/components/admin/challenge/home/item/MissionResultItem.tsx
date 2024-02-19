import clsx from 'clsx';

import { formatToMonthDate } from '../../../../../utils/formatDateString';

interface Props {
  mission: any;
}

const MissionResultItem = ({ mission }: Props) => {
  return (
    <div className="font-pretendard">
      <div className="text-center text-sm">
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
    </div>
  );
};

export default MissionResultItem;
