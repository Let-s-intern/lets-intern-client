import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyChallengeMissionByType, userChallengeMissionDetail } from '@/schema';
import axios from '@/utils/axios';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AbsentMissionDetailMenu from './AbsentMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
  isDone: boolean;
  setOpenReviewModal?: (value: boolean) => void;
}

const AbsentMissionItem = ({ mission, isDone, setOpenReviewModal }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentChallenge, schedules } = useCurrentChallenge();

  const th =
    mission?.th === BONUS_MISSION_TH ? '보너스' : `  ${mission?.th}회차`;
  const currentSchedule = schedules.find((schedule) => {
    return schedule.missionInfo.id === mission.id;
  });

  const itemRef = useRef<HTMLLIElement>(null);

  const [isDetailShown, setIsDetailShown] = useState(false);

  const {
    data: missionDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery({
    enabled: Boolean(currentChallenge?.id),
    queryKey: [
      'challenge',
      currentChallenge?.id,
      'mission',
      mission.id,
      'detail',
    ],
    queryFn: async () => {
      const res = await axios.get(
        `challenge/${currentChallenge?.id}/missions/${mission.id}`,
      );
      return userChallengeMissionDetail.parse(res.data.data).missionInfo;
    },
  });

  const toggle = () => {
    if (!isDetailShown && !isValid()) return;
    setIsDetailShown(!isDetailShown);
  };

  const isValid = () => {
    if (isAxiosError(detailError)) {
      const errorCode = detailError?.response?.data.status;
      if (errorCode === 400) {
        alert('0회차 미션을 먼저 완료해주세요.');
        setIsDetailShown(false);
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isDone) {
      router.replace(window.location.pathname);
      return;
    }
    const scrollToMission = searchParams.get('scroll_to_mission');
    if (scrollToMission) {
      if (mission.id === Number(scrollToMission)) {
        setIsDetailShown(true);
        if (isDetailShown) {
          itemRef.current?.scrollIntoView({ behavior: 'smooth' });
          router.replace(window.location.pathname);
        }
      }
    }
  }, [searchParams, router, isDetailShown, isDone, mission.id]);

  return (
    <li
      key={mission.id}
      className="scroll-mt-[7rem] rounded-xl bg-white p-6"
      ref={itemRef}
    >
      <div className="flex gap-6 px-3">
        <div className="h-12 w-[5px] rounded-lg bg-[#CECECE]" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold">
              {th}. {mission.title}
            </h4>
            <span
              className={clsx(
                'rounded-md px-2 py-0.5 text-xs',
                'bg-[#E3E3E3] text-[#9B9B9B]',
              )}
            >
              {mission.attendanceStatus === 'PRESENT' ||
              mission.attendanceStatus === 'LATE'
                ? '반려'
                : '결석'}
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
              <AbsentMissionDetailMenu
                missionDetail={missionDetail}
                currentSchedule={currentSchedule}
                setOpenReviewModal={setOpenReviewModal}
              />
            ))}
    </li>
  );
};

export default AbsentMissionItem;
