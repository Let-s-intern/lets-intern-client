import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import DoneMissionDetailMenu from './DoneMissionDetailMenu';
import { missionSubmitToBadge } from '../../../../../utils/convert';
import { Schedule, userChallengeMissionDetail } from '../../../../../schema';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';

interface Props {
  schedule: Schedule;
}

const DoneMissionItem = ({ schedule }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;
  const { currentChallenge } = useCurrentChallenge();

  const itemRef = useRef<HTMLLIElement>(null);

  const [isDetailShown, setIsDetailShown] = useState(false);

  // const {
  //   data: missionDetail,
  //   isLoading: isDetailLoading,
  //   error: detailError,
  // } = useQuery({
  //   queryKey: ['mission', mission.id, 'detail', { status: mission.status }],
  //   queryFn: async () => {
  //     const res = await axios.get(`/mission/${mission.id}/detail`, {
  //       // TODO: 체크 필요
  //       params: { status: mission.status },
  //     });
  //     const data = res.data;
  //     console.log(data);
  //     return data;
  //   },
  //   enabled: isDetailShown,
  // });
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
      schedule.missionInfo.id,
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
  }, [searchParams, setSearchParams, isDetailShown]);

  return (
    <li
      key={mission.id}
      className="scroll-mt-[calc(6rem+1rem)] rounded-xl bg-white p-6"
      ref={itemRef}
    >
      <div className="flex gap-6 px-3">
        <div
          className={clsx('h-12 w-[5px] rounded-lg', {
            'bg-[#fff961]': attendance.result === 'WAITING',
            'bg-primary': attendance.result === 'PASS',
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
                  status: attendance.status,
                  result: attendance.result,
                }).style,
              )}
            >
              {
                missionSubmitToBadge({
                  status: attendance.status,
                  result: attendance.result,
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
          : !isDetailLoading && missionDetail && (
              <DoneMissionDetailMenu missionDetail={missionDetail } />
            ))}
    </li>
  );
};

export default DoneMissionItem;
