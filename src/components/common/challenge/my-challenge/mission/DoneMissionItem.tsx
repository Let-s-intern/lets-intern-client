import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';
import {
  MyChallengeMissionByType, userChallengeMissionDetail
} from '../../../../../schema';
import axios from '../../../../../utils/axios';
import { missionSubmitToBadge } from '../../../../../utils/convert';
import DoneMissionDetailMenu from './DoneMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
}

const DoneMissionItem = ({ mission }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentChallenge } = useCurrentChallenge();

  const itemRef = useRef<HTMLLIElement>(null);

  const [isDetailShown, setIsDetailShown] = useState(false);

  const {
    data: missionDetail,
    isLoading: isDetailLoading,
    error: detailError,
    refetch,
  } = useQuery({
    enabled: Boolean(currentChallenge?.id) && isDetailShown,
    queryKey: [
      'challenge',
      currentChallenge?.id,
      'mission',
      mission.id,
      'detail',
      // { status: schedule.attendanceInfo.status },
    ],
    queryFn: async () => {
      const res = await axios.get(
        `challenge/${currentChallenge?.id}/missions/${mission.id}`,
      );
      return userChallengeMissionDetail.parse(res.data.data).missionInfo;
    },
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
          })}
        />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold">
              {/* TODO: 아래로 변경 */}
              {/* {mission.th}회차. {mission.title} */}
              {mission.th}회차.
            </h4>
            <span
              className={clsx(
                'rounded-md px-2 py-[0.125rem] text-xs',
                missionSubmitToBadge({
                  status: mission.attendanceStatus,
                  result: mission.attendanceResult,
                }).style,
              )}
            >
              {
                missionSubmitToBadge({
                  status: mission.attendanceStatus,
                  result: mission.attendanceResult,
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
            missionDetail && (
              <DoneMissionDetailMenu missionDetail={missionDetail} />
            ))}
    </li>
  );
};

export default DoneMissionItem;
