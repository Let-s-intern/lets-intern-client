import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../../../utils/axios';
import MissionItem from '../mission/MissionItem';
import MissionStyledItem from '../mission/MissionStyledItem';

interface Props {
  todayTh: number;
}

const OtherMissionSection = ({ todayTh }: Props) => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionRef = useRef<HTMLElement>(null);

  const [missionList, setMissionList] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);

  const getMissionList = useQuery({
    queryKey: ['mission', params.programId, 'list'],
    queryFn: async () => {
      const res = await axios.get(`/mission/${params.programId}/list`);
      const data = res.data;
      console.log(data);
      setMissionList(data.missionList);
      return data;
    },
  });

  useEffect(() => {
    const scrollTo = searchParams.get('scroll_to');

    if (scrollTo === 'other-mission') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSearchParams({}, { replace: true });
    }
  }, [sectionRef, searchParams, setSearchParams]);

  const isLoading = getMissionList.isLoading || !missionList;

  if (isLoading) {
    return <></>;
  }

  let lastMissionList = missionList.filter(
    (mission: any) => mission.th < todayTh,
  );

  let remainedMissionList = missionList
    .filter((mission: any) => mission.th > todayTh)
    .map((mission: any) => ({ ...mission, status: 'YET' }));

  remainedMissionList = remainedMissionList.concat(
    lastMissionList
      .filter(
        (mission: any) =>
          mission.attendanceStatus === 'ABSENT' ||
          mission.missionStatus === 'WRONG',
      )
      .map((mission: any) => ({ ...mission, status: 'ABSENT' })),
  );

  lastMissionList = lastMissionList
    .filter(
      (mission: any) =>
        mission.attendanceStatus !== 'ABSENT' &&
        mission.missionStatus !== 'WRONG',
    )
    .map((mission: any) => ({ ...mission, status: 'DONE' }));

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
          {remainedMissionList.length === 0 ? (
            <span className="font-medium">남은 미션이 없습니다.</span>
          ) : (
            remainedMissionList.map((mission: any) => (
              <MissionItem
                key={mission.id}
                mission={mission}
                todayTh={todayTh}
              />
            ))
          )}
        </ul>
      ) : (
        tabIndex === 1 &&
        (lastMissionList.length === 0 ? (
          <span className="font-medium">지난 미션이 없습니다.</span>
        ) : (
          <ul className="mt-2 flex flex-col gap-6 bg-[#F6F8FB] p-8">
            {lastMissionList.map((mission: any) => (
              <MissionStyledItem key={mission.id} mission={mission} />
            ))}
          </ul>
        ))
      )}
    </section>
  );
};

export default OtherMissionSection;
