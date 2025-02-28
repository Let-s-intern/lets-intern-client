import { useGetUserProgramQuery } from '@/api/program';
import { useMemo } from 'react';
import ProgramContainer from '../ProgramContainer';
import {
  getBadgeText,
  getDuration,
  getProgramUrl,
} from './MainCurationSection';

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
    return data?.programList
      .filter(
        (p) =>
          p.programInfo.programType === 'CHALLENGE' ||
          p.programInfo.programType === 'LIVE',
      )
      .slice(0, 10);
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
              지금 모집 중인 프로그램을
              <br className="md:hidden" />
              한눈에 확인해보세요 📢
            </>
          }
          moreUrl="/program?status=PROCEEDING"
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
