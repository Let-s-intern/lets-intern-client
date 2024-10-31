import { LiveIdSchema } from '@/schema';
import { LiveContent } from '@/types/interface';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

const superTitle = '현직자 멘토가 들려주는 생생한 이야기';
const title = 'PM이 되기 위한 모든 것을 알려드려요';

interface LiveCurriculumProps {
  curriculum: LiveContent['curriculum'];
  mentorJob: LiveIdSchema['mentorJob'];
}

function LiveCurriculum({ curriculum, mentorJob }: LiveCurriculumProps) {
  return (
    <section className="py-16 lg:py-32">
      <SuperTitle className="mb-6 text-neutral-45 lg:mb-10">
        커리큘럼
      </SuperTitle>
      <SuperTitle className="mb-1 text-primary">{superTitle}</SuperTitle>
      <Heading2 className="mb-8 lg:mb-20">{title}</Heading2>

      <div className="flex flex-col gap-5 lg:items-center">
        {curriculum.map((item, index) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-md lg:flex lg:h-[148px]"
          >
            <div className="flex gap-3 bg-primary px-6 py-4 lg:w-[264px] lg:p-6">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-30 text-xxsmall12 font-semibold text-primary">
                {index + 1}
              </div>
              <div className="flex w-full justify-between lg:flex-col">
                <div className="flex flex-col gap-1">
                  <span className="text-xxsmall12 font-medium text-primary-10 lg:text-xsmall14">
                    {mentorJob}
                  </span>
                  <span className="text-small18 font-semibold text-white lg:text-small20">
                    {item.title}
                  </span>
                </div>
                <span className="text-xsmall16 font-medium text-white lg:text-small20">
                  {item.time}
                </span>
              </div>
            </div>
            <div className="whitespace-pre-line bg-neutral-95 px-8 py-4 text-xsmall14 text-neutral-0 lg:w-[620px] lg:py-6 lg:text-small20">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveCurriculum;
