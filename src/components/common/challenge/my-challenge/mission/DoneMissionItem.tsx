import { useChallengeMissionAttendanceInfoQuery } from '@/api/challenge';
import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyChallengeMissionByType } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { missionSubmitToBadge } from '@/utils/convert';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DoneMissionDetailMenu from './DoneMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
}

const DoneMissionItem = ({ mission }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { applicationId, programId } = useParams<{
    applicationId: string;
    programId: string;
  }>();
  const { currentChallenge, schedules } = useCurrentChallenge();
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

  useEffect(() => {
    const scrollToMission = searchParams.get('scroll_to_mission');
    if (scrollToMission) {
      if (mission.id === Number(scrollToMission)) {
        setIsDetailShown(true);
        if (isDetailShown) {
          itemRef.current?.scrollIntoView({ behavior: 'smooth' });
          setSearchParams({}, { replace: true });
        }
      }
    }
  }, [searchParams, setSearchParams, isDetailShown, mission.id]);

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
          <button onClick={() => setIsDetailShown(!isDetailShown)}>
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
