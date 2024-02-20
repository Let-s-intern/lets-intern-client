import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import YetMissionDetailMenu from './YetMissionDetailMenu';

interface Props {
  mission: any;
}

const YetMissionItem = ({ mission }: Props) => {
  const [isDetailShown, setIsDetailShown] = useState(false);

  const {
    data: missionDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery({
    queryKey: ['mission', mission.id, 'detail', { status: mission.status }],
    queryFn: async () => {
      const res = await axios.get(`/mission/${mission.id}/detail`, {
        params: { status: mission.status },
      });
      const data = res.data;
      return data;
    },
    enabled: isDetailShown,
  });

  return (
    <li key={mission.id} className="rounded-xl bg-white p-6">
      <div className="flex items-center justify-between px-3">
        <h4 className="text-lg font-semibold">
          {mission.th}일차. {mission.title}
        </h4>
        <button onClick={() => setIsDetailShown(!isDetailShown)}>
          {!isDetailShown || isDetailLoading ? '미션보기' : '닫기'}
        </button>
      </div>
      {isDetailShown &&
        (detailError
          ? '에러 발생'
          : !isDetailLoading && (
              <YetMissionDetailMenu missionDetail={missionDetail} />
            ))}
    </li>
  );
};

export default YetMissionItem;
