import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { formatMissionDateString } from '../../../../../utils/formatDateString';
import axios from '../../../../../utils/axios';

interface Props {
  mission: any;
}

const MissionDateItem = ({ mission }: Props) => {
  const [content, setContent] = useState('');

  const getMissionContent = useQuery({
    queryKey: ['mission', 'admin', 'detail', mission.id],
    queryFn: async () => {
      const res = await axios.get(`/mission/admin/detail/${mission.id}`);
      const data = res.data.contents;
      setContent(data);
      return data;
    },
  });

  const isLoading = getMissionContent.isLoading || !content;

  return (
    <li className="cursor-pointer px-8 py-2 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <span>
          {mission.th}회차. {mission.title}
        </span>
        <span className="text-sm">
          {formatMissionDateString(mission.startDate)} 진행
        </span>
      </div>
      {isLoading ? (
        <p className="mt-1 text-sm opacity-0">place holder</p>
      ) : (
        <p className="mt-1 text-sm">{content}</p>
      )}
    </li>
  );
};

export default MissionDateItem;
