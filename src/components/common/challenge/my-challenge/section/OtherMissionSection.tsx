import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../../../utils/axios';
import YetMissionItem from '../mission/YetMissionItem';
import DoneMissionItem from '../mission/DoneMissionItem';
import AbsentMissionItem from '../mission/AbsentMissionItem';

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

  useEffect(() => {
    getMissionList.refetch();
  }, [tabIndex]);

  let lastMissionList =
    missionList && missionList.filter((mission: any) => mission.th < todayTh);

  let absentMissionList =
    lastMissionList &&
    lastMissionList
      .filter((mission: any) => mission.attendanceStatus === 'ABSENT')
      .map((mission: any) => ({ ...mission, status: 'ABSENT' }))
      .sort((a: any, b: any) => a.th - b.th);

  lastMissionList =
    lastMissionList &&
    lastMissionList
      .filter((mission: any) => mission.attendanceStatus !== 'ABSENT')
      .map((mission: any) => ({ ...mission, status: 'DONE' }))
      .sort((a: any, b: any) => a.th - b.th);

  let remainedMissionList =
    missionList &&
    missionList
      .filter((mission: any) => mission.th > todayTh)
      .map((mission: any) => ({ ...mission, status: 'YET' }))
      .sort((a: any, b: any) => a.th - b.th);

  useEffect(() => {
    const scrollToMission = searchParams.get('scroll_to_mission');
    if (scrollToMission && lastMissionList) {
      let isExist = false;
      lastMissionList.forEach((mission: any) => {
        if (mission.th === Number(scrollToMission)) {
          isExist = true;
          return;
        }
      });
      setTabIndex(isExist ? 1 : 0);
    }
  }, [searchParams, setSearchParams, lastMissionList]);

  if (isLoading) {
    return <></>;
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
          제출한 미션
        </div>
      </div>
      {tabIndex === 0 ? (
        <div className="mt-2 bg-[#F6F8FB] p-8">
          <ul className="flex flex-col gap-4">
            {remainedMissionList.length === 0 ? (
              <span className="font-medium">남은 미션이 없습니다.</span>
            ) : (
              remainedMissionList.map((mission: any) => (
                <YetMissionItem key={mission.id} mission={mission} />
              ))
            )}
          </ul>
          {absentMissionList.length !== 0 && (
            <div className="mt-12">
              <h3 className="pl-6 font-semibold text-[#868686]">미제출 미션</h3>
              <ul className="mt-2 flex flex-col gap-4">
                {absentMissionList.map((mission: any) => (
                  <AbsentMissionItem key={mission.id} mission={mission} />
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        tabIndex === 1 && (
          <div className="mt-2 bg-[#F6F8FB] p-8">
            {lastMissionList.length === 0 ? (
              <span className="font-medium">제출한 미션이 없습니다.</span>
            ) : (
              <ul className="flex flex-col gap-4">
                {lastMissionList.map((mission: any) => {
                  if (mission.attendanceResult === 'WRONG') {
                    return (
                      <AbsentMissionItem key={mission.id} mission={mission} />
                    );
                  } else {
                    return (
                      <DoneMissionItem key={mission.id} mission={mission} />
                    );
                  }
                })}
              </ul>
            )}
          </div>
        )
      )}
    </section>
  );
};

export default OtherMissionSection;
