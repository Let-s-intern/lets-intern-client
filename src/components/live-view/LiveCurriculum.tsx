import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { PROGRAM_CURRICULUM_ID } from '@components/ProgramDetailNavigation';

const superTitle = '현직자 멘토가 들려주는 생생한 이야기';
const title = 'PM이 되기 위한 모든 것을 알려드려요';

interface LiveCurriculumProps {
  curriculum: LiveContent['curriculum'];
  mentorJob: LiveIdSchema['mentorJob'];
}

function LiveCurriculum({ curriculum, mentorJob }: LiveCurriculumProps) {
  return (
    <section className="py-20 md:pb-[130px]" id={PROGRAM_CURRICULUM_ID}>
      <SuperTitle className="mb-6 font-bold text-primary md:mb-10">
        커리큘럼
      </SuperTitle>
      <SuperTitle className="mb-1 text-primary">{superTitle}</SuperTitle>
      <Heading2 className="mb-8 md:mb-20">{title}</Heading2>

      <div className="flex flex-col gap-5 md:items-center">
        {curriculum.map((item, index) => (
          <div
            key={item.id}
            className="w-full max-w-[900px] overflow-hidden rounded-md md:flex"
          >
            <div className="flex gap-3 bg-primary px-6 py-4 md:w-2/5 md:p-6">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-30 text-xxsmall12 font-semibold text-primary">
                {index + 1}
              </div>
              <div className="flex w-full justify-between md:flex-col md:gap-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xxsmall12 font-medium text-primary-10 md:text-xsmall14">
                    {mentorJob}
                  </span>
                  <span className="text-small18 font-semibold text-white md:text-small20">
                    {item.title}
                  </span>
                </div>
                <span className="text-xsmall16 font-medium text-white md:text-small20">
                  {item.time}
                </span>
              </div>
            </div>
            <div className="whitespace-pre-line bg-neutral-95 px-8 py-4 text-xsmall14 text-neutral-0 md:w-full md:py-6 md:text-small20">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveCurriculum;
