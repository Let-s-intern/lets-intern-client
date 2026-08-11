import useChallengeNav from '@/domain/challenge/hooks/useChallengeNav';
import { Schedule } from '@/schema';
import clsx from 'clsx';
import { useParams, usePathname, useRouter } from 'next/navigation';
import MissionIcon from './ui/MissionIcon';
import MissionNotStartedIcon from './ui/MissionNotStartedIcon';
import MissionTodayIcon from './ui/MissionTodayIcon';

import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge/challenge';
import { logMissionAccess } from '@/domain/challenge/api/missionAccessLog';
import { getMissionTimeState } from '@/domain/challenge/utils/missionTimeState';
import { useMissionStore } from '@/store/useMissionStore';
import { BONUS_MISSION_TH, TALENT_POOL_MISSION_TH } from '@/utils/constants';
import { isAxiosError } from 'axios';
import { Dayjs } from 'dayjs';
interface Props {
  schedule: Schedule;
  /** 캘린더가 한 번 만들어 내려준다. 카드마다 다른 시각을 보면 안 된다. */
  now: Dayjs;
  className?: string;
  isDone: boolean;
}

const MissionCalendarItem = ({ schedule, now, className, isDone }: Props) => {
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  // 카드 상태는 회차 번호 대소비교가 아니라 미션 날짜로 정한다. 번호로 정하면
  // 오늘 회차가 없는 시간대에 전 회차가 '지나간 회차' 가 된다(LC-3207).
  const timeState = getMissionTimeState(mission, now);
  const isInProgress = timeState === 'IN_PROGRESS';

  const params = useParams<{ applicationId: string; programId: string }>();
  const router = useRouter();
  const { withTestDate } = useChallengeNav();

  const { error } = useChallengeMissionAttendanceInfoQuery({
    challengeId: params.programId,
    missionId: mission.id,
  });

  const { selectedMissionId, setSelectedMission } = useMissionStore();
  const isSelected = selectedMissionId === mission.id;

  const pathname = usePathname();
  const isMissionPage = pathname.includes('/me');

  const handleMissionClick = async () => {
    if (mission.th !== null && isValid()) {
      // 사용자가 실제로 누른 미션만 이용으로 남긴다. 상세 조회는 달력이 항목을 그리며
      // 미리 부르므로 거기에 기록을 걸면 누르지 않은 미션까지 전부 잡힌다(LC-3201).
      logMissionAccess({
        challengeId: Number(params.programId),
        missionId: mission.id,
      });

      setSelectedMission(mission.id, mission.th);
      router.push(
        withTestDate(
          `/challenge/${params.applicationId}/${params.programId}/me`,
        ),
      );
    }
  };

  const isValid = () => {
    if (isAxiosError(error)) {
      // eslint-disable-next-line no-console
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
      // 대시보드 페이지: 진행 중인 미션 활성화
      return isInProgress;
    } else {
      if (selectedMissionId) {
        // 특정 미션이 선택된 경우: 선택된 미션 활성화
        return isSelected;
      } else {
        // 직접 진입한 경우: 진행 중인 미션 활성화
        return isInProgress;
      }
    }
  };

  return (
    <div className={className} onClick={handleMissionClick}>
      <div
        className={clsx(
          'rounded-xxs hover:bg-primary-5 h-[104px] w-[74.8px] border px-2 py-2.5',
          isCardActive()
            ? 'bg-primary-5 border-[#A6AAFA]'
            : 'border-neutral-80',
        )}
      >
        {(mission.th === BONUS_MISSION_TH ||
          mission.th === TALENT_POOL_MISSION_TH) &&
        attendance?.submitted ? (
          <MissionIcon
            schedule={schedule}
            isDone={isDone}
            timeState={timeState}
          />
        ) : isInProgress ? (
          <MissionTodayIcon
            mission={mission}
            attendance={attendance}
            isDone={isDone}
          />
        ) : timeState === 'UPCOMING' ? (
          <MissionNotStartedIcon schedule={schedule} />
        ) : (
          <MissionIcon
            schedule={schedule}
            isDone={isDone}
            timeState={timeState}
          />
        )}
        <span
          className={clsx('text-xxsmall10 block w-full leading-3', {
            'text-primary': isInProgress,
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
