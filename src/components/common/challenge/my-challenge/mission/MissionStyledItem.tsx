import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import MissionDetailMenu from './MissionDetailMenu';

interface Props {
  mission: any;
  status: 'YET' | 'DONE' | 'ABSENT';
}

const MissionStyledItem = ({ mission, status }: Props) => {
  const [isDetailShown, setIsDetailShown] = useState(false);

  const {
    data: missionDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery({
    queryKey: ['mission', mission.id, 'detail', { status }],
    queryFn: async () => {
      const res = await axios.get(`/mission/${mission.id}/detail`, {
        params: { status },
      });
      const data = res.data;
      console.log(data);
      return data;
    },
    enabled: isDetailShown,
  });

  return (
    <li key={mission.id} className="rounded-xl bg-white p-6">
      <div className="flex items-center justify-between px-3">
        <h3 className="text-lg font-semibold">
          {mission.th}일차. {mission.title}
        </h3>
        <button onClick={() => setIsDetailShown(!isDetailShown)}>
          {!isDetailShown || isDetailLoading ? '미션보기' : '닫기'}
        </button>
      </div>
      {isDetailShown &&
        (detailError
          ? '에러 발생'
          : !isDetailLoading && (
              <MissionDetailMenu missionDetail={missionDetail} />
            ))}
    </li>
  );
};

export default MissionStyledItem;
