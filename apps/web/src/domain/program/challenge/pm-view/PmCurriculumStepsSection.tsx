import LexicalContent from '@/common/lexical/LexicalContent';
import { ChallengeContent } from '@/types/interface';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';
import { PmContentGrid, PmMentoring, PmSeminar } from './PmCurriculumSteps';

type PmCurriculumStepsSectionProps = {
  content: ChallengeContent | null;
};

const curriculumSteps = (
  lectures?: Array<{
    topic: string;
    mentorImage: string;
    mentorName: string;
    schedule: string;
    companyLogo: string;
  }>,
) => [
  {
    title: 'PM 현직자 LIVE 세미나',
    description: (
      <>
        5명의 PM 현직자 선배들이 어떻게 <br className="md:hidden" />
        PM 커리어를 시작했는지,
        <br />그 이야기를 직접 들려드릴게요
      </>
    ),
    visualExplanation: <PmSeminar lectures={lectures} />,
  },
  {
    title: '평생소장 6회차 학습콘텐츠',
    description: (
      <>
        검증된 렛츠커리어 학습 콘텐츠로{` `}
        <br className="md:hidden" />
        자소서·포트폴리오까지 한번에 완성해요
      </>
    ),
    visualExplanation: <PmContentGrid />,
  },
  {
    title: '현직자 1:1 맞춤 멘토링',
    description: (
      <>
        채용 공고에 바로 지원할 수 있도록,
        <br />
        1:1 Live 멘토링으로 현직자가 나에게 맞는{` `}
        <br className="md:hidden" />
        서류 검토를 도와드려요
      </>
    ),
    visualExplanation: <PmMentoring />,
  },
];

const Badge = ({ index }: { index: number }) => (
  <div className="flex items-center justify-center rounded-md border border-[#A8EAD1] bg-[#E8F9F2] px-6 py-3">
    <span className="text-xsmall16 md:text-medium24 font-bold text-[#1BC47D]">
      STEP {index}
    </span>
  </div>
);

const CurriculumStep = ({
  index,
  title,
  description,
  visualExplanation,
}: {
  index: number;
  title: ReactNode;
  description: ReactNode;
  visualExplanation: ReactNode;
}) => (
  <div className="flex flex-col items-center">
    <Badge index={index} />
    <MainTitle className="text-small20 text-neutral-0 md:text-xlarge28 mb-3 mt-5 tracking-[-0.5px] md:mb-6">
      {title}
    </MainTitle>
    <p className="text-xsmall14 text-neutral-35 md:text-medium22 mb-[84px] whitespace-pre-line text-center font-normal">
      {description}
    </p>
    {visualExplanation}
  </div>
);

const PmCurriculumStepsSection: React.FC<PmCurriculumStepsSectionProps> = ({
  content,
}) => {
  const lectures = content?.lectures;

  return (
    <section className="mb-[90px] flex w-full scroll-mt-[56px] flex-col items-center gap-[120px] px-5 md:mb-[120px] md:scroll-mt-[60px] md:px-0">
      {curriculumSteps(lectures).map((item, index) => (
        <article key={index} className="w-full max-w-[1440px]">
          <CurriculumStep index={index + 1} {...item} />
        </article>
      ))}
      {content?.mainDescription?.root &&
        typeof content.mainDescription.root === 'object' &&
        'type' in content.mainDescription.root && (
          <section className="flex w-full max-w-[1000px] flex-col px-5 md:px-10 lg:px-0">
            <LexicalContent node={content.mainDescription.root} />
          </section>
        )}
    </section>
  );
};

export default PmCurriculumStepsSection;
