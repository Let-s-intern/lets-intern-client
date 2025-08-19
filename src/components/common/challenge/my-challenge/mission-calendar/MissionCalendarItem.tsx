import { Schedule } from '@/schema';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useMissionStore } from '@/store/useMissionStore';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';
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

  const params = useParams();
  const navigate = useNavigate();

  const { error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });
  const { setSelectedMission } = useMissionStore();

  const handleMissionClick = () => {
    if (!isDone && mission.th !== null && isValid()) {
      setSelectedMission(mission.id, mission.th);
      navigate(`/challenge/${params.applicationId}/${params.programId}/me`);
    }
  };

  const isValid = useCallback(() => {
    if (isAxiosError(error)) {
      const errorCode = error?.response?.data.status;
      if (errorCode === 400) {
        alert('0회차 미션을 먼저 완료해주세요.');
      }
      return false;
    }
    return true;
  }, [error]);

  return (
    <div className={className} onClick={handleMissionClick}>
      <div
        className={clsx(
          'h-[104px] w-[74.8px] rounded-xxs border px-2 py-2.5',
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
