import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';
import {
  MyChallengeMissionByType, userChallengeMissionDetail
} from '../../../../../schema';
import axios from '../../../../../utils/axios';
import YetMissionDetailMenu from './YetMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
}

const YetMissionItem = ({ mission }: Props) => {
  const [isDetailShown, setIsDetailShown] = useState(false);
  // const mission = schedule.missionInfo;
  const { currentChallenge } = useCurrentChallenge();

  // const {
  //   data: missionDetail,
  //   isLoading: isDetailLoading,
  //   error: detailError,
  // } = useQuery({
  //   queryKey: ['mission', mission.id, 'detail', { status: mission.status }],
  //   queryFn: async () => {
  //     const res = await axios.get(`/mission/${mission.id}/detail`, {
  //       params: { status: mission.status },
  //     });
  //     const data = res.data;
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

  return (
    <li key={mission.id} className="rounded-xl bg-white p-6">
      <div className="flex items-center justify-between px-3">
        <h4 className="text-lg font-semibold">
          {mission?.th}회차. {mission?.title}
        </h4>
        <button onClick={() => setIsDetailShown(!isDetailShown)}>
          {!isDetailShown || isDetailLoading ? '미션보기' : '닫기'}
        </button>
      </div>
      {isDetailShown &&
        (detailError
          ? '에러 발생'
          : !isDetailLoading &&
            missionDetail && (
              <YetMissionDetailMenu missionDetail={missionDetail} />
            ))}
    </li>
  );
};

export default YetMissionItem;
