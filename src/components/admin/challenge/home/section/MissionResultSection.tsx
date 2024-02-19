import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import RoundedBox from '../box/RoundedBox';
import Button from '../../ui/button/Button';
import SectionHeading from '../heading/SectionHeading';
import MissionResultItem from '../item/MissionResultItem';
import axios from '../../../../../utils/axios';

const MissionResultSection = () => {
  const params = useParams();

  const [missionList, setMissionList] = useState<any>();

  const getMissionResult = useQuery({
    queryKey: ['mission', params.programId, 'simple'],
    queryFn: async () => {
      const res = await axios.get(`/mission/${params.programId}/simple`);
      const data = res.data;
      setMissionList(data.missionList);
      return data;
    },
  });

  const isLoading = getMissionResult.isLoading || !missionList;

  if (isLoading) {
    return <></>;
  }

  return (
    <RoundedBox as="section" className="px-8 py-6">
      <div className="flex items-center justify-between">
        <SectionHeading>미션 제출 현황</SectionHeading>
        <Button to={`/admin/challenge/${params.programId}/submit-check`}>
          환급하기
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-6">
        {missionList.map((mission: any) => (
          <MissionResultItem key={mission.missionId} mission={mission} />
        ))}
      </div>
    </RoundedBox>
  );
};

export default MissionResultSection;
