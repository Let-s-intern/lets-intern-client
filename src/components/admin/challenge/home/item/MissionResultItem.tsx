import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Mission } from '../../../../../schema';
import { missionStatusToBadge } from '../../../../../utils/convert';

const MissionResultItem = ({ mission }: { mission: Mission }) => {
  return (
    <div>
      <div className="relative flex items-center"></div>
      <div className="mt-2 max-w-[80px] text-center text-sm">
        {dayjs(mission.startDate).format('MM/DD(dd)') +
          ' ~ ' +
          dayjs(mission.endDate).format('MM/DD(dd)')}
      </div>
      <div className="mx-1 mt-1 pb-2">
        <div className="py-2 text-center text-sm">{mission.th}회차</div>
        <div className="flex items-end justify-center text-3xl font-bold">
          {mission.attendanceCount}
        </div>
        <div className="text-center text-sm">
          지각 {mission.lateAttendanceCount}
        </div>
        <div className="text-center text-sm">
          반려 {mission.wrongAttendanceCount}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={twMerge(
            'rounded-md px-2 py-[0.125rem] text-xs',
            missionStatusToBadge[mission.missionStatusType].style,
          )}
        >
          {missionStatusToBadge[mission.missionStatusType].text}
        </span>
      </div>
    </div>
  );
};

export default MissionResultItem;
