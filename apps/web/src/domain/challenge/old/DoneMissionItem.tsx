import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge/challenge';
import { useOldCurrentChallenge } from '@/context/OldCurrentChallengeProvider';
import { MyChallengeMissionByType } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '@/utils/convert';
import clsx from 'clsx';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { logMissionAccess } from '../api/missionAccessLog';
import DoneMissionDetailMenu from './DoneMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
}

const DoneMissionItem = ({ mission }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { applicationId, programId } = useParams<{
    applicationId: string;
    programId: string;
  }>();
  const { currentChallenge, schedules } = useOldCurrentChallenge();
  const itemRef = useRef<HTMLLIElement>(null);
  const [isDetailShown, setIsDetailShown] = useState(false);

  const th =
    mission?.th === BONUS_MISSION_TH ? '보너스' : `  ${mission?.th}회차`;

  const {
    data: missionDetailData,
    isLoading: isDetailLoading,
    error: detailError,
  } = useChallengeMissionAttendanceInfoQuery({
    challengeId: currentChallenge?.id ?? '',
    missionId: mission.id,
  });

  const missionDetail = missionDetailData?.missionInfo;
  const attendanceInfo = missionDetailData?.attendanceInfo;

  const currentSchedule = schedules.find((schedule) => {
    return schedule.missionInfo.id === mission.id;
  });

  const toggle = () => {
    // 펼치는 순간에만 이용으로 남긴다. 상세 조회는 이 목록이 항목을 그리며 미리 부르므로
    // 거기에 기록을 걸면 누르지 않은 미션까지 전부 이용으로 잡힌다(LC-3201).
    if (!isDetailShown) {
      logMissionAccess({
        challengeId: currentChallenge?.id,
        missionId: mission.id,
      });
    }

    setIsDetailShown(!isDetailShown);
  };

  useEffect(() => {
    const scrollToMission = searchParams.get('scroll_to_mission');
    if (scrollToMission) {
      if (mission.id === Number(scrollToMission)) {
        setIsDetailShown(true);
        if (isDetailShown) {
          itemRef.current?.scrollIntoView({ behavior: 'smooth' });
          // Next.js에서는 쿠리 파라미터를 제거하여 대체
          const pathname = window.location.pathname;
          router.replace(pathname);
        }
      }
    }
  }, [searchParams, router, isDetailShown, mission.id]);

  return (
    <li
      key={mission.id}
      className="scroll-mt-[calc(6rem+1rem)] rounded-xl bg-white p-6"
      ref={itemRef}
    >
      <div className="flex gap-6 px-3">
        <div
          className={clsx('h-12 w-[5px] rounded-lg', {
            'bg-[#fff961]': mission.attendanceResult === 'WAITING',
            'bg-primary': mission.attendanceResult === 'PASS',
            'bg-[#CECECE]': mission.attendanceResult === 'WRONG',
          })}
        />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold">
              {th}. {mission.title}
            </h4>
            <span
              className={clsx(
                'rounded-md px-2 py-[0.125rem] text-xs',
                missionSubmitToBadge({
                  status: mission.attendanceStatus,
                  result: mission.attendanceResult,
                  challengeEndDate: currentChallenge?.endDate,
                }).style,
              )}
            >
              {
                missionSubmitToBadge({
                  status: mission.attendanceStatus,
                  result: mission.attendanceResult,
                  challengeEndDate: currentChallenge?.endDate,
                }).text
              }
            </span>
          </div>
          <button onClick={toggle}>
            {!isDetailShown || isDetailLoading ? '미션보기' : '닫기'}
          </button>
        </div>
      </div>
      {isDetailShown &&
        (detailError
          ? '에러 발생'
          : !isDetailLoading &&
            missionDetail &&
            currentSchedule && (
              <DoneMissionDetailMenu
                missionDetail={missionDetail}
                schedule={currentSchedule}
                missionByType={mission}
                applicationId={applicationId}
                programId={programId}
                challengeId={currentChallenge?.id}
                isFeedbackConfirmed={
                  attendanceInfo?.feedbackStatus === 'CONFIRMED'
                }
              />
            ))}
    </li>
  );
};

export default DoneMissionItem;
