import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import axios from '../../../../../utils/axios';
import MissionItem from '../mission/MissionItem';
import MissionStyledItem from '../mission/MissionStyledItem';
import { useParams } from 'react-router-dom';

const OtherMissionSection = () => {
  const params = useParams();

  const [tabIndex, setTabIndex] = useState(0);

  const { data: missionList, isLoading } = useQuery({
    queryKey: ['mission', params.programId, 'list'],
    queryFn: async () => {
      const absentMissionsRes = await axios.get(
        `/mission/${params.programId}/list`,
        {
          params: {
            status: 'ABSENT',
          },
        },
      );
      const yetMissionsRes = await axios.get('/mission/19/list', {
        params: {
          status: 'YET',
        },
      });
      const doneMissionsRes = await axios.get('/mission/19/list', {
        params: {
          status: 'DONE',
        },
      });
      const newMissionList = {
        ABSENT: absentMissionsRes.data.missionList,
        YET: yetMissionsRes.data.missionList,
        DONE: doneMissionsRes.data.missionList,
      };
      return newMissionList;
    },
  });

  if (isLoading || !missionList) {
    return <section>로딩 중...</section>;
  }

  return (
    <section className="mb-20 mt-8">
      <div className="flex gap-2">
        <div
          className={clsx('cursor-pointer p-2 font-bold', {
            'border-b-2 border-[#333333] text-[#333333]': tabIndex === 0,
            'text-[#868686]': tabIndex !== 0,
          })}
          onClick={() => setTabIndex(0)}
        >
          남은 미션
        </div>
        <div
          className={clsx('cursor-pointer p-2 font-bold', {
            'border-b-2 border-[#333333] text-[#333333]': tabIndex === 1,
            'text-[#868686]': tabIndex !== 1,
          })}
          onClick={() => setTabIndex(1)}
        >
          지난 미션
        </div>
      </div>
      {tabIndex === 0 ? (
        <ul className="mt-2 flex flex-col gap-6 bg-[#F6F8FB] p-8">
          {missionList['YET'].map((mission: any) => (
            <MissionItem key={mission.id} mission={mission} status="YET" />
          ))}
        </ul>
      ) : (
        tabIndex === 1 && (
          <ul className="mt-2 flex flex-col gap-6 bg-[#F6F8FB] p-8">
            {missionList['ABSENT'].map((mission: any) => (
              <MissionStyledItem
                key={mission.id}
                mission={mission}
                status="ABSENT"
              />
            ))}
            {missionList['DONE'].map((mission: any) => (
              <MissionStyledItem
                key={mission.id}
                mission={mission}
                status="DONE"
              />
            ))}
          </ul>
        )
      )}
    </section>
  );
};

export default OtherMissionSection;
