import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyChallengeMissionByType, userChallengeMissionDetail } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import YetMissionDetailMenu from './YetMissionDetailMenu';

interface Props {
  mission: MyChallengeMissionByType;
}

const YetMissionItem = ({ mission }: Props) => {
  const [isDetailShown, setIsDetailShown] = useState(false);
  const { currentChallenge } = useCurrentChallenge();

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

  const toggle = () => {
    if (!isDetailShown && isAxiosError(detailError)) {
      const errorCode = detailError?.response?.data.status;
      if (errorCode === 400) {
        alert('0회차 미션을 먼저 완료해주세요.');
        setIsDetailShown(false);
      }
      return;
    }
    setIsDetailShown(!isDetailShown);
  };

  return (
    <li key={mission.id} className="rounded-xl bg-white p-6">
      <div className="flex items-center justify-between px-3">
        <h4 className="text-lg font-semibold">
          {mission?.th}회차. {mission?.title}
        </h4>
        <button onClick={toggle}>
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
