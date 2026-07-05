import { useOldCurrentChallenge } from '@/context/OldCurrentChallengeProvider';
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
  const { currentChallenge } = useOldCurrentChallenge();

  const th =
    mission?.th === BONUS_MISSION_TH ? '보너스' : `  ${mission?.th}회차`;

  // NOTE: 추상화 목표는 useSuspenseQuery 통일이지만 이 컴포넌트는 의도적으로 useQuery 유지.
  // ① 리스트 아이템(<li>)별 상세를 각자 조회 → suspense화하면 로딩 중 제목까지 사라짐(회귀).
  // ② detailError(400) 를 읽어 "0회차 먼저 완료" 인라인 안내를 처리 → suspense는 throw라
  //    이 에러코드 분기가 error boundary로 밀려 UX가 깨진다. (AbsentMissionItem도 동일)
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
