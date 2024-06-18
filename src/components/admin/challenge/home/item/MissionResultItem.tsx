import clsx from 'clsx';

import { formatToMonthDate } from '../../../../../utils/formatDateString';
import MissionTopStatusBar from '../status-bar/MissionTopStatusBar';
import { missionStatusToBadge } from '../../../../../utils/convert';
import { Mission } from '../../../../../schema';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

const MissionResultItem = ({ mission }: { mission: Mission }) => {
  return (
    <div className="font-pretendard">
      <div className="relative flex items-center">
        {/* {mission.th === todayTh ? (
          <>
            <div className="h-[2px] w-full flex-1 bg-primary" />
            <div className="absolute left-1/2 h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-primary" />
            <div className="h-[1px] w-full flex-1 bg-gray-200" />
          </>
        ) : todayTh === 0 ? (
          <>
            <div className="h-[2px] w-full flex-1 bg-primary" />
            {isLastMission && (
              <div className="absolute right-0 h-[8px] w-[8px] translate-x-1/2 rounded-full bg-primary" />
            )}
          </>
        ) : mission.th > todayTh ? (
          <>
            <div className="h-[1px] w-full flex-1 bg-gray-200" />
          </>
        ) : (
          mission.th < todayTh && (
            <>
              <div className="h-[2px] w-full flex-1 bg-primary" />
            </>
          )
        )} */}
      </div>
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
      </div>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={twMerge(
            'rounded-md px-2 py-[0.125rem] text-xs ',
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
