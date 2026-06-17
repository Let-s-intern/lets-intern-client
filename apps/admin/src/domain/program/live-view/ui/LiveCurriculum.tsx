import Heading2 from '@/common/header/Heading2';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { LiveContent } from '@/types/interface';

const superTitle = '현직자 멘토가 들려주는 생생한 이야기';

interface LiveCurriculumProps {
  curriculum: LiveContent['curriculum'];
  curriculumTitle: LiveContent['curriculumTitle'];
}

function LiveCurriculum({ curriculum, curriculumTitle }: LiveCurriculumProps) {
  return (
    <section className="py-20 md:pb-[130px]">
      <SuperTitle className="text-primary mb-6 font-bold md:mb-10">
        커리큘럼
      </SuperTitle>
      <SuperTitle className="text-primary mb-1">{superTitle}</SuperTitle>
      <Heading2 className="mb-8 md:mb-20">{curriculumTitle}</Heading2>

      <div className="flex flex-col gap-5 md:items-center">
        {curriculum.map((item, index) => (
          <div
            key={item.id}
            className="w-full max-w-[900px] overflow-hidden rounded-md md:flex"
          >
            <div className="bg-primary flex items-center gap-3 px-6 py-4 md:h-36 md:w-2/5 md:items-start md:p-6">
              <div className="bg-primary-30 text-xxsmall12 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-semibold md:mt-1">
                {index + 1}
              </div>
              <div className="flex w-full justify-between md:h-full md:flex-col">
                <span className="text-small18 md:text-small20 font-semibold text-white">
                  {item.title}
                </span>
                <span className="text-xsmall16 md:text-small20 font-medium text-white">
                  {item.time}
                </span>
              </div>
            </div>
            <div className="bg-neutral-95 text-xsmall14 text-neutral-0 md:text-small20 whitespace-pre-line px-8 py-4 md:w-full md:py-6">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveCurriculum;
