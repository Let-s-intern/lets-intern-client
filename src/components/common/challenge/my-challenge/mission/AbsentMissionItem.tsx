import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';
import {
  MyChallengeMissionByType,
  userChallengeMissionDetail,
} from '../../../../../schema';
import axios from '../../../../../utils/axios';
import AbsentMissionDetailMenu from './AbsentMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
  isDone: boolean;
}

const AbsentMissionItem = ({ mission, isDone }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentChallenge, schedules } = useCurrentChallenge();
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
    enabled: Boolean(currentChallenge?.id) && isDetailShown,
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

  useEffect(() => {
    if (isDone) {
      setSearchParams({}, { replace: true });
      return;
    }
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
  }, [searchParams, setSearchParams, isDetailShown, isDone, mission.id]);

  return (
    <li
      key={mission.id}
      className="scroll-mt-[calc(6rem+1rem)] rounded-xl bg-white p-6"
      ref={itemRef}
    >
      <div className="flex gap-6 px-3">
        <div className="h-12 w-[5px] rounded-lg bg-[#CECECE]" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold">
              {mission.th}회차. {mission.title}
            </h4>
            <span
              className={clsx(
                'rounded-md px-2 py-[0.125rem] text-xs',
                'bg-[#E3E3E3] text-[#9B9B9B]',
              )}
            >
              {mission.attendanceStatus === 'PRESENT' ||
              mission.attendanceStatus === 'LATE'
                ? '반려'
                : '결석'}
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
              <AbsentMissionDetailMenu missionDetail={missionDetail} />
            ))}
    </li>
  );
};

export default AbsentMissionItem;
