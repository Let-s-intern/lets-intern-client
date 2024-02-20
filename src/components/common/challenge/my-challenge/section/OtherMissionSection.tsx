import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import axios from '../../../../../utils/axios';
import MissionItem from '../mission/MissionItem';
import MissionStyledItem from '../mission/MissionStyledItem';
import { useParams, useSearchParams } from 'react-router-dom';

const OtherMissionSection = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionRef = useRef<HTMLElement>(null);

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
      const yetMissionsRes = await axios.get(
        `/mission/${params.programId}/list`,
        {
          params: {
            status: 'YET',
          },
        },
      );
      const doneMissionsRes = await axios.get(
        `/mission/${params.programId}/list`,
        {
          params: {
            status: 'DONE',
          },
        },
      );
      const newMissionList = {
        ABSENT: absentMissionsRes.data.missionList,
        YET: yetMissionsRes.data.missionList,
        DONE: doneMissionsRes.data.missionList,
      };
      return newMissionList;
    },
  });

  useEffect(() => {
    const scrollTo = searchParams.get('scroll_to');

    if (scrollTo === 'other-mission') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSearchParams({}, { replace: true });
    }
  }, [sectionRef, searchParams, setSearchParams]);

  if (isLoading || !missionList) {
    return <section>로딩 중...</section>;
  }

  return (
    <section
      className="mb-20 mt-8 scroll-mt-[calc(6rem+1rem)]"
      ref={sectionRef}
    >
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
          {missionList['YET'].length === 0 ? (
            <span className="font-medium">남은 미션이 없습니다.</span>
          ) : (
            missionList['YET'].map((mission: any) => (
              <MissionItem key={mission.id} mission={mission} status="YET" />
            ))
          )}
        </ul>
      ) : (
        tabIndex === 1 &&
        (missionList['ABSENT'].length + missionList['DONE'].length === 0 ? (
          <span className="font-medium">지난 미션이 없습니다.</span>
        ) : (
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
        ))
      )}
    </section>
  );
};

export default OtherMissionSection;
