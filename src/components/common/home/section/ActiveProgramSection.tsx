import { useGetUserProgramQuery } from '@/api/program';
import ProgramContainer from '../ProgramContainer';
import {
  getBadgeText,
  getDuration,
  getProgramUrl,
} from './MainCurationSection';

const ActiveProgramSection = () => {
  const { data } = useGetUserProgramQuery({
    pageable: {
      size: 10,
      page: 1,
    },
    searchParams: {
      status: ['PROCEEDING'],
    },
  });

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1160px] flex-col md:mt-24">
        {!data ? null : (
          <ProgramContainer
            showGrid
            title={
              <>
                지금 모집 중인 프로그램을
                <br className="md:hidden" />
                한눈에 확인해보세요 📢
              </>
            }
            moreUrl="/program?status=PROCEEDING"
            programs={data.programList.map((program) => ({
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
        )}
      </section>
    </>
  );
};

export default ActiveProgramSection;
