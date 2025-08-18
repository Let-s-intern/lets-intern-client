import { Schedule } from '@/schema';
import clsx from 'clsx';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '@/utils/convert';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  className?: string;
  schedule: Schedule;
  isDone: boolean;
}

const MissionIcon = ({ className, schedule, isDone }: Props) => {
  const params = useParams();
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  const { text, style, icon } = missionSubmitToBadge({
    status: attendance.status || 'ABSENT',
    result: attendance.result,
  });

  const { error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });
  const { setSelectedMission } = useMissionStore();

  // const isAttended =
  //   (attendance.result === 'WAITING' || attendance.result === 'PASS') &&
  //   attendance.status !== 'ABSENT';
  const isWaiting = attendance.result === 'WAITING';

  const navigate = useNavigate();

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
    <>
      <div
        onClick={handleMissionClick}
        className={clsx(
          'relative flex cursor-pointer flex-col justify-center rounded-md',
          {
            'cursor-default': isDone,
          },
          className,
        )}
      >
        <i className="block h-3.5 w-3.5">
          <img
            src={icon}
            alt="mission status icon"
            className="w-full object-cover"
          />
        </i>
      </div>
      <div
        className={clsx(
          'mb-[6px] mt-1 flex flex-col justify-center font-semibold leading-4',
          style,
        )}
      >
        {mission.th === BONUS_MISSION_TH
          ? '보너스'
          : isWaiting
            ? `제출`
            : `${mission.th}회차`}
        <br />
        {text}
      </div>
    </>
  );
};

export default MissionIcon;
