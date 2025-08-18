import { Schedule } from '@/schema';
import clsx from 'clsx';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';

interface Props {
  schedule: Schedule;
  todayTh: number;
  className?: string;
  isDone: boolean;
}

const MissionCalendarItem = ({
  schedule,
  todayTh,
  className,
  isDone,
}: Props) => {
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  return (
    <div className={className}>
      <div
        className={clsx(
          'h-[104px] w-[75px] rounded-xxs border px-2 py-2.5',
          mission.th === todayTh
            ? 'border-[#A6AAFA] bg-primary-5'
            : 'border-neutral-80',
        )}
      >
        {mission.th === todayTh ? (
          <MissionTodayIcon
            mission={mission}
            attendance={attendance}
            isDone={isDone}
            className="bg-primary-5"
          />
        ) : (mission.th ?? 0) > todayTh ? (
          <MissionNotStartedIcon schedule={schedule} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            <MissionIcon schedule={schedule} isDone={isDone} />
          )
        )}
        <span
          className={clsx('block w-full text-xxsmall10 leading-3', {
            'text-primary': mission.th === todayTh,
          })}
        >
          {mission.startDate?.format('MM.DD(ddd)')}
          <br />~ {mission.endDate?.format('MM.DD(ddd)')}
        </span>
      </div>
    </div>
  );
};

export default MissionCalendarItem;
