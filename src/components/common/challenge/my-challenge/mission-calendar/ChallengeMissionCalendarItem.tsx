import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import MissionIcon from './ChallengeMissionIcon';
import MissionNotStartedIcon from './ChallengeMissionNotStartedIcon';
import MissionTodayIcon from './ChallengeMissionTodayIcon';

interface Props {
  schedule: Schedule;
  todayTh: number;
  className?: string;
  isDone: boolean;
  isLast: boolean;
  selectedMissionId?: number;
}

// 새로운 버전
const MissionCalendarItem = ({
  schedule,
  todayTh,
  className,
  isDone,
  isLast,
}: Props) => {
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  const { selectedMissionId, setSelectedMission } = useMissionStore();
  const isSelected = selectedMissionId === mission.id;

  const location = useLocation();
  const isMissionPage = location.pathname.includes('/mission');

  const { programId, applicationId } = useParams();

  const handleClick = useCallback(() => {
    setSelectedMission(mission.id, mission.th ?? 0);
  }, [setSelectedMission, mission.id, mission.th]);

  const today = dayjs();
  const isTextPrimary =
    (mission.th === todayTh && attendance.result == null) ||
    attendance.result === 'WAITING';

  return (
    <div className={className}>
      <Link
        to={`/challenge/${programId}/dashboard/${applicationId}/missions`}
        replace
        onClick={handleClick}
        className={clsx(
          'block aspect-[75/104] h-[104px] rounded-xxs border border-neutral-80 px-2 py-2.5',
          !isLast && 'mr-2',
          today.isBetween(mission.startDate, mission.endDate, 'day', '[]') &&
            !isMissionPage
            ? 'border-primary-50 bg-primary-5'
            : 'border-neutral-80',
          'cursor-pointer hover:bg-primary-5',
          isSelected && isMissionPage && 'border-primary-50 bg-primary/5',
        )}
      >
        {mission.startDate && mission.endDate ? (
          today.isBetween(mission.startDate, mission.endDate, 'day', '[]') &&
          mission.th === todayTh ? (
            <MissionTodayIcon
              mission={mission}
              attendance={attendance}
              isDone={isDone}
            />
          ) : (mission.th ?? 0) < todayTh &&
            today.isAfter(mission.endDate, 'day') ? (
            <MissionIcon schedule={schedule} />
          ) : (
            <MissionNotStartedIcon schedule={schedule} />
          )
        ) : (
          <MissionNotStartedIcon schedule={schedule} />
        )}

        {/* 일정 */}
        <span
          className={clsx('mt-1.5 block w-full text-left text-[10px]', {
            'text-primary': isTextPrimary,
          })}
        >
          {mission.startDate?.format('MM.DD(ddd)')}
          <br />~{mission.endDate?.format('MM.DD(ddd)')}
        </span>
      </Link>
    </div>
  );
};

export default MissionCalendarItem;
