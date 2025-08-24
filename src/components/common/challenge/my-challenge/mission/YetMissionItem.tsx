import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { MyChallengeMissionByType, userChallengeMissionDetail } from '@/schema';
import axios from '@/utils/axios';
import { BONUS_MISSION_TH } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import YetMissionDetailMenu from './YetMissionDetailMenu';

/** 아직 시작하지 않은 미션 */
interface Props {
  mission: MyChallengeMissionByType;
}

const YetMissionItem = ({ mission }: Props) => {
  const [isDetailShown, setIsDetailShown] = useState(false);
  const { currentChallenge } = useCurrentChallenge();

  const th =
    mission?.th === BONUS_MISSION_TH ? '보너스' : `  ${mission?.th}회차`;

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

  return (
    <li key={mission.id} className="rounded-xl bg-white p-6">
      <div className="flex items-center justify-between px-3">
        <h4 className="text-lg font-semibold">
          {th}. {mission?.title}
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
