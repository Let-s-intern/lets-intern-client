import SectionHeader from '@/common/header/SectionHeader';
import { ChallengeIdPrimitive } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import MainTitle from '../ui/MainTitle';
import HrCurriculumCalendar from './HrCurriculumCalendar';
import HrCurriculums from './HrCurriculums';

interface HrCurriculumSectionProps {
  challenge: ChallengeIdPrimitive;
  content: ChallengeContent | null;
}

const HrCurriculumSection: React.FC<HrCurriculumSectionProps> = ({
  challenge,
  content,
}) => {
  if (
    !content ||
    !content.curriculum ||
    content.curriculum.length === 0
  ) {
    return null;
  }

  const weekText = content?.challengePoint?.weekText ?? '3주';

  return (
    <section
      id="curriculum"
      className="flex scroll-mt-[56px] flex-col items-center bg-[#FFF7F2] px-5 pb-32 pt-16 md:scroll-mt-[60px] md:px-0 md:pb-24 md:pt-[140px]"
    >
      <SectionHeader className="relative -top-[100px] mb-6 w-full text-left md:mb-[42px] md:text-center">
        커리큘럼
      </SectionHeader>
      <MainTitle className="flex flex-col items-center gap-1">
        <span>
          6회의 미션 <br className="md:hidden" />+ 현직자 LIVE 세미나 4회와 함께
        </span>
        <span>만드는 밀도 있는 {weekText}간의 여정</span>
      </MainTitle>
      <div className="text-small14 mb-[60px] mt-3 text-center text-neutral-0 md:mt-5 md:text-small18">
        막연한 HR 관심에서 끝나지 않도록, 직무 탐색부터 경험 정리, 결과물
        완성까지 함께합니다.
      </div>
      <HrCurriculums
        curriculum={content.curriculum}
        content={content}
      />
      <HrCurriculumCalendar
        challenge={challenge}
        curriculumImage={content.curriculumImage}
      />
    </section>
  );
};

export default HrCurriculumSection;
