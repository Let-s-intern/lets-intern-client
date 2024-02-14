import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import RoundedBox from '../box/RoundedBox';
import Button from '../../ui/button/Button';
import SectionHeading from '../heading/SectionHeading';
import MissionDateItem from '../item/MissionDateItem';
import { useQuery } from '@tanstack/react-query';
import axios from '../../../../../utils/axios';

const MissionDateSection = () => {
  const params = useParams();

  const [missionList, setMissionList] = useState<any>();

  const getMissionList = useQuery({
    queryKey: ['mission', params.programId],
    queryFn: async () => {
      const res = await axios.get(`/mission/${params.programId}`);
      const data = res.data;
      console.log(data);
      setMissionList(data.missionList);
      return data;
    },
  });

  const isLoading = getMissionList.isLoading || !missionList;

  return (
    <RoundedBox as="section" className="flex w-[50%] flex-col gap-2">
      <div className="flex items-center justify-between px-8 py-6 pb-0">
        <SectionHeading>미션 일정</SectionHeading>
        <Button to={`/admin/challenge/${params.programId}/mission`}>
          미션관리
        </Button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <ul className="divide-y divide-neutral-200">
          {!isLoading &&
            missionList.map((mission: any) => (
              <MissionDateItem key={mission.id} mission={mission} />
            ))}
        </ul>
        <div className="pointer-events-none absolute bottom-0 flex h-20 w-full items-end bg-gradient-to-b from-transparent to-white">
          <Link
            to="/admin/challenge/mission"
            className="pointer-events-auto flex w-full cursor-pointer justify-center bg-white pb-2 pt-1"
          >
            <i>
              <IoMdArrowDropdown />
            </i>
          </Link>
        </div>
      </div>
    </RoundedBox>
  );
};

export default MissionDateSection;
