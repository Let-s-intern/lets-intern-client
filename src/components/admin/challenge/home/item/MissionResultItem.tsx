import clsx from 'clsx';

import { formatToMonthDate } from '../../../../../utils/formatDateString';
import MissionTopStatusBar from '../status-bar/MissionTopStatusBar';
import { missionStatusToBadge } from '../../../../../utils/convert';

interface Props {
  mission: any;
  todayTh: number;
  isLastMission: boolean;
}

const MissionResultItem = ({ mission, todayTh, isLastMission }: Props) => {
  return (
    <div className="font-pretendard">
      <div className="relative flex items-center">
        {mission.missionTh === todayTh ? (
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
        ) : mission.missionTh > todayTh ? (
          <>
            <div className="h-[1px] w-full flex-1 bg-gray-200" />
          </>
        ) : (
          mission.missionTh < todayTh && (
            <>
              <div className="h-[2px] w-full flex-1 bg-primary" />
            </>
          )
        )}
      </div>
      <div
        className={clsx('mt-2 text-center text-sm', {
          'font-medium text-primary': mission.missionTh === todayTh,
        })}
      >
        {formatToMonthDate(mission.missionStartDate)}
        <br />~ {formatToMonthDate(mission.missionEndDate)}
      </div>
      <div
        className={clsx('mx-1 mt-1 pb-2', {
          'rounded bg-[#F2F1F1]': mission.missionTh === todayTh,
        })}
      >
        <div className="py-2 text-center text-sm">{mission.missionTh}회차</div>
        <div
          className={clsx('flex items-end justify-center text-3xl font-bold', {
            'opacity-0': todayTh < mission.missionTh && todayTh !== 0,
          })}
        >
          {mission.attendanceCount}
        </div>
        <div
          className={clsx('text-center text-sm', {
            'opacity-0': todayTh < mission.missionTh && todayTh !== 0,
          })}
        >
          지각 {mission.lateAttendanceCount}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-md px-2 py-[0.125rem] text-xs ',
            missionStatusToBadge[mission.missionStatus].style,
            { 'opacity-0': todayTh < mission.missionTh },
          )}
        >
          {missionStatusToBadge[mission.missionStatus].text}
        </span>
      </div>
    </div>
  );
};

export default MissionResultItem;
