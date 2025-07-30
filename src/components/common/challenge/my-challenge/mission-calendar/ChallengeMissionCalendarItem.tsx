import clsx from 'clsx';
import { Schedule } from '../../../../../schema';
import MissionIcon from './ChallengeMissionIcon';
import MissionNotStartedIcon from './ChallengeMissionNotStartedIcon';
import MissionTodayIcon from './ChallengeMissionTodayIcon';
import MissionTopStatusBar from './ChallengeMissionTopStatusBar';

interface Props {
  schedule: Schedule;
  todayTh: number;
  className?: string;
  isDone: boolean;
  isLast: boolean;
  onMissionClick?: (missionId: number) => void;
  selectedMissionId?: number;
}

// 새로운 버전
const MissionCalendarItem = ({
  schedule,
  todayTh,
  className,
  isDone,
  isLast,
  onMissionClick,
  selectedMissionId,
}: Props) => {
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;
  const isSelected = selectedMissionId === mission.id;

  const handleClick = () => {
    if (onMissionClick && mission.id) {
      onMissionClick(mission.id);
    }
  };

  return (
    <div className={className}>
      <MissionTopStatusBar mission={schedule.missionInfo} todayTh={todayTh} />
      <div
        className={clsx(
          'aspect-[75/104] h-[104px] rounded-xxs border px-2 py-2.5 md:mt-2',
          !isLast && 'mr-2',
          mission.th === todayTh ? 'border-neutral-70' : 'border-neutral-80',
          onMissionClick && 'cursor-pointer hover:border-primary',
          isSelected && 'border-primary bg-primary/5',
        )}
        onClick={handleClick}
      >
        {mission.th === todayTh ? (
          <MissionTodayIcon
            mission={mission}
            attendance={attendance}
            isDone={isDone}
          />
        ) : (mission.th ?? 0) > todayTh ? (
          <MissionNotStartedIcon schedule={schedule} />
        ) : (
          (mission.th ?? 0) < todayTh && (
            <MissionIcon className="mt-3" schedule={schedule} />
          )
        )}
        {/* 일정 */}
        <span
          className={clsx('mt-1.5 block w-full text-left text-[10px]', {
            'text-primary':
              mission.th === todayTh &&
              (attendance.result === 'WAITING' || attendance.result == null),
          })}
        >
          {mission.startDate?.format('MM.DD(ddd)')}
          <br />~{mission.endDate?.format('MM.DD(ddd)')}
        </span>
      </div>
    </div>
  );
};

export default MissionCalendarItem;
