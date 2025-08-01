import { useMissionStore } from '@/store/useMissionStore';
import clsx from 'clsx';
import { Link, useLocation, useParams } from 'react-router-dom';
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

  const handleClick = () => {
    setSelectedMission(mission.id, mission.th ?? 0);
  };

  return (
    <div className={className}>
      <MissionTopStatusBar mission={schedule.missionInfo} todayTh={todayTh} />
      <Link
        to={`/challenge/${programId}/dashboard/${applicationId}/missions`}
        replace
        onClick={handleClick}
        className={clsx(
          'block aspect-[75/104] h-[104px] rounded-xxs border px-2 py-2.5 md:mt-2',
          !isLast && 'mr-2',
          mission.th === todayTh ? 'border-neutral-70' : 'border-neutral-80',
          'cursor-pointer hover:border-primary',
          isSelected && isMissionPage && 'border-primary bg-primary/5',
        )}
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
          (mission.th ?? 0) < todayTh && <MissionIcon schedule={schedule} />
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
      </Link>
    </div>
  );
};

export default MissionCalendarItem;
