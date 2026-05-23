import SectionHeader from '@/common/header/SectionHeader';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import MainTitle from '../ui/MainTitle';
import CurriculumCalendar from './CurriculumCalendar';
import Curriculums from './Curriculums';
import { CurriculumSectionConfig } from './types';

interface Props {
  challenge: ChallengeIdPrimitive;
  content: ChallengeContent | null;
  config: CurriculumSectionConfig;
}

function CurriculumSection({ challenge, content, config }: Props) {
  if (!content || !content.curriculum || content.curriculum.length === 0) {
    return null;
  }

  const weekText = content.challengePoint?.weekText ?? '3주';
  const lectureCount = content.lectures?.length ?? 5;

  return (
    <section
      id="curriculum"
      className="flex scroll-mt-[56px] flex-col items-center px-5 pb-32 pt-16 md:scroll-mt-[60px] md:px-0 md:pb-24 md:pt-[140px]"
      style={{ backgroundColor: config.lightAccentColor }}
    >
      <SectionHeader className="relative -top-[100px] mb-6 w-full text-left md:mb-[42px] md:text-center">
        커리큘럼
      </SectionHeader>
      <MainTitle className="flex flex-col items-center gap-1">
        {config.getTitle(lectureCount, weekText)}
      </MainTitle>
      <div className="text-small14 text-neutral-0 md:text-small18 mb-[60px] mt-3 text-center md:mt-5">
        {config.description}
      </div>
      <Curriculums
        curriculum={content.curriculum}
        content={content}
        primaryColor={config.primaryColor}
        lightAccentColor={config.lightAccentColor}
      />
      <CurriculumCalendar
        challenge={challenge}
        config={config}
        curriculumImage={content.curriculumImage}
        lectureCount={lectureCount}
      />
    </section>
  );
}

export default CurriculumSection;
