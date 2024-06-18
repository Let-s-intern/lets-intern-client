import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

import axios from '../../../../../utils/axios';
import YetMissionItem from '../mission/YetMissionItem';
import DoneMissionItem from '../mission/DoneMissionItem';
import AbsentMissionItem from '../mission/AbsentMissionItem';
import { Schedule, userChallengeMissionDetail } from '../../../../../schema';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';

interface Props {
  todayTh: number;
  isDone: boolean;
}

const OtherMissionSection = ({ todayTh, isDone }: Props) => {
  const params = useParams();
  const { schedules } = useCurrentChallenge();
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionRef = useRef<HTMLElement>(null);

  // const [missionList, setMissionList] = useState<any>();
  const [tabIndex, setTabIndex] = useState(isDone ? 1 : 0);

  // const getMissionList = useQuery({
  //   queryKey: ['mission', params.programId, 'list'],
  //   queryFn: async () => {
  //     const res = await axios.get(`/mission/${params.programId}/list`);
  //     const data = res.data;
  //     console.log(data);
  //     setMissionList(data.missionList);
  //     return data;
  //   },
  // });

  

  // const isLoading = getMissionList.isLoading || !missionList;

  // useEffect(() => {
  //   getMissionList.refetch();
  // }, [tabIndex]);

  let lastScheduleList =
    schedules &&
    schedules.filter((schedule) => (schedule.missionInfo.th ?? 0) < todayTh);

  let absentMissionList =
    lastScheduleList &&
    lastScheduleList
      .filter((schedule) => schedule.attendanceInfo.status === 'ABSENT')
      .map((schedule) => ({ ...schedule, status: 'ABSENT' }))
      .sort((a, b) => (a.missionInfo?.th ?? 0) - (b.missionInfo?.th ?? 0));

  lastScheduleList =
    lastScheduleList &&
    lastScheduleList
      .filter((schedule) => schedule.attendanceInfo.status !== 'ABSENT')
      .map((schedule) => ({ ...schedule, status: 'DONE' }))
      .sort((a, b) => (a.missionInfo?.th ?? 0) - (b.missionInfo?.th ?? 0));

  let remainedMissionList =
    schedules &&
    schedules
      .filter((schedule) => (schedule.missionInfo.th ?? 0) > todayTh)
      .map((schedule) => ({ ...schedule, status: 'YET' }))
      .sort((a, b) => (a.missionInfo?.th ?? 0) - (b.missionInfo?.th ?? 0));

  useEffect(() => {
    const scrollToMission = searchParams.get('scroll_to_mission');
    if (scrollToMission && lastScheduleList) {
      let isExist = false;
      lastScheduleList.forEach((mission: any) => {
        if (mission.id === Number(scrollToMission)) {
          isExist = true;
          return;
        }
      });
      setTabIndex(isExist ? 1 : 0);
    }
  }, [searchParams, setSearchParams, lastScheduleList]);

  // if (isLoading) {
  //   return <></>;
  // }

  return (
    <section
      className="mb-20 mt-8 scroll-mt-[calc(6rem+1rem)]"
      ref={sectionRef}
    >
      <div className="flex gap-2">
        {!isDone && (
          <div
            className={clsx('cursor-pointer p-2 font-bold', {
              'border-b-2 border-[#333333] text-[#333333]': tabIndex === 0,
              'text-[#868686]': tabIndex !== 0,
            })}
            onClick={() => setTabIndex(0)}
          >
            남은 미션
          </div>
        )}
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
              remainedMissionList.map((schedule) => (
                <YetMissionItem key={schedule.missionInfo.id} schedule={schedule} />
              ))
            )}
          </ul>
          {absentMissionList.length !== 0 && (
            <div className="mt-12">
              <h3 className="pl-6 font-semibold text-[#868686]">미제출 미션</h3>
              <ul className="mt-2 flex flex-col gap-4">
                {absentMissionList.map((mission: any) => (
                  <AbsentMissionItem
                    key={mission.id}
                    schedule={mission}
                    isDone={isDone}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        tabIndex === 1 && (
          <div className="mt-2 bg-[#F6F8FB] p-8">
            {lastScheduleList.length === 0 ? (
              <span className="font-medium">제출한 미션이 없습니다.</span>
            ) : (
              <ul className="flex flex-col gap-4">
                {lastScheduleList.map((lastSchedule) => {
                  if (lastSchedule.attendanceInfo.result === 'WRONG') {
                    return (
                      <AbsentMissionItem
                        key={lastSchedule.missionInfo.id}
                        schedule={lastSchedule}
                        isDone={isDone}
                      />
                    );
                  } else {
                    return (
                      <DoneMissionItem
                        key={lastSchedule.missionInfo.id}
                        schedule={lastSchedule}
                      />
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
