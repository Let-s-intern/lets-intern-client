import { Schedule } from '@/schema';
import clsx from 'clsx';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MissionIcon from './MissionIcon';
import MissionNotStartedIcon from './MissionNotStartedIcon';
import MissionTodayIcon from './MissionTodayIcon';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useMissionStore } from '@/store/useMissionStore';
import { isAxiosError } from 'axios';
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

  const { selectedMissionId, setSelectedMission } = useMissionStore();
  const isSelected = selectedMissionId === mission.id;

  const location = useLocation();
  const isMissionPage = location.pathname.includes('/me');

  const handleMissionClick = async () => {
    if (mission.th !== null && isValid()) {
      setSelectedMission(mission.id, mission.th);
      navigate(`/challenge/${params.applicationId}/${params.programId}/me`);
    }
  };

  const isValid = () => {
    if (isAxiosError(error)) {
      console.log('error:', error);
      const errorCode = error?.response?.data.status;
      if (errorCode === 400) {
        alert('0회차 미션을 먼저 완료해주세요.');
      }
      return false;
    }
    return true;
  };

  const isCardActive = () => {
    if (!isMissionPage) {
      // 대시보드 페이지: todayTh 활성화
      return mission.th === todayTh;
    } else {
      if (selectedMissionId) {
        // 특정 미션이 선택된 경우: 선택된 미션 활성화
        return isSelected;
      } else {
        // 직접 진입한 경우: todayTh 활성화
        return mission.th === todayTh;
      }
    }
  };

  return (
    <div className={className} onClick={handleMissionClick}>
      <div
        className={clsx(
          'h-[104px] w-[74.8px] rounded-xxs border px-2 py-2.5 hover:bg-primary-5',
          isCardActive()
            ? 'border-[#A6AAFA] bg-primary-5'
            : 'border-neutral-80',
        )}
      >
        {mission.th === 100 && attendance?.submitted ? (
          <MissionIcon schedule={schedule} isDone={isDone} />
        ) : mission.th === todayTh ? (
          <MissionTodayIcon
            mission={mission}
            attendance={attendance}
            isDone={isDone}
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
