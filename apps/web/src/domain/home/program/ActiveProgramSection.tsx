'use client';

import { useGetUserProgramQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import { useMemo } from 'react';
import {
  getBadgeText,
  getDuration,
  getProgramUrl,
} from '../banner/MainCurationSection';
import ProgramContainer from './ProgramContainer';

const ActiveProgramSection = () => {
  const { data } = useGetUserProgramQuery({
    pageable: {
      size: 20,
      page: 1,
    },
    searchParams: {
      status: ['PROCEEDING'],
    },
  });

  const filteredData = useMemo(() => {
    return (
      data?.programList
        /*
        타입 술어로 좁힌다. 아래에서 `programType` 을 `CurationType` 을 받는 헬퍼
        (`getProgramUrl` 등)에 넘기는데, 일반 `filter` 로는 좁혀지지 않아 챌린지·라이브가
        아닌 값까지 타입상 통과해 버린다.
      */
        .filter(
          (
            p,
          ): p is typeof p & {
            programInfo: { programType: 'CHALLENGE' | 'LIVE' };
          } =>
            p.programInfo.programType === 'CHALLENGE' ||
            p.programInfo.programType === 'LIVE',
        )
        .sort((a, b) => {
          return (
            dayjs(a.programInfo.deadline).unix() -
            dayjs(b.programInfo.deadline).unix()
          );
        })
        .slice(0, 10)
    );
  }, [data]);

  if (!filteredData || filteredData.length === 0) return null;

  return (
    <>
      <section className="md:mt-21 mt-16 flex w-full max-w-[1120px] flex-col">
        <ProgramContainer
          gaItem="proceeding_program"
          gaTitle="지금 모집 중인 프로그램을 한눈에 확인해보세요"
          showGrid
          title={
            <>
              지금 모집 중인 프로그램을 <br className="md:hidden" />
              한눈에 확인해 보세요 📢
            </>
          }
          moreUrl="/program?status=PROCEEDING"
          isDeadline={false}
          programs={filteredData.map((program) => ({
            thumbnail: program.programInfo.thumbnail ?? '',
            title: program.programInfo.title ?? '',
            url: getProgramUrl({
              type: program.programInfo.programType,
              programId: program.programInfo.id ?? undefined,
            }),
            duration: getDuration({
              type: program.programInfo.programType,
              startDate: program.programInfo.startDate ?? '',
              endDate: program.programInfo.endDate ?? '',
            }),
            badge: {
              text: getBadgeText({
                type: program.programInfo.programType,
                deadline: program.programInfo.deadline ?? '',
              }),
            },
          }))}
        />
      </section>
    </>
  );
};

export default ActiveProgramSection;
