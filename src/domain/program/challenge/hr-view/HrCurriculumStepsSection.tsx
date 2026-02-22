import LexicalContent from '@/domain/blog/ui/LexicalContent';
import { ChallengeContent } from '@/types/interface';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';
import { Contents, Portfolio, Seminar } from './CurriculumSteps';

type HrCurriculumStepsSectionProps = {
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
    title: 'HR 직무를 이해하는 학습 콘텐츠',
    description: (
      <>
        막연한 HR 관심에서 벗어나,
        <br />
        조직 안에서 HR이 어떤 역할을 맡고{` `}
        <br className="md:hidden" />
        어떤 문제를 해결하는지 구조적으로 학습해요
      </>
    ),
    visualExplanation: <Contents />,
  },
  {
    title: 'HR 현직자의 LIVE 세미나부터 피드백까지',
    description: (
      <>
        현직자와 직접 만나 실무 관점을 직접 듣고
        <br />
        희망 직무 / 산업, 고민 맞춤형으로 멘토를 배정하여 통해{` `}
        <br className="md:hidden" />
        HR 직무 준비의 완성도를 한 단계 올려보세요
      </>
    ),
    visualExplanation: <Seminar lectures={lectures} />,
  },
  {
    title: (
      <>
        경험은 많은데,{` `}
        <br className="md:hidden" />
        HR 언어로 정리되지 않았다면
      </>
    ),
    description: (
      <>
        실제 공고 분석부터 직무 스토리 재구성,{` `}
        <br className="md:hidden" />
        포트폴리오 완성까지
        <br />
        단순한 관심을 증명된 실력으로 바꿔보세요
      </>
    ),
    visualExplanation: <Portfolio />,
  },
];

const Badge = ({ index }: { index: number }) => {
  return (
    <div className="flex items-center justify-center rounded-md border border-[#FED9C4] bg-[#FEEEE5] px-6 py-3">
      <span className="text-xsmall16 font-bold text-[#FF5E00] md:text-medium24">
        STEP {index}
      </span>
    </div>
  );
};

const CurriculumSteps = ({
  index,
  title,
  description,
  visualExplanation,
}: {
  index: number;
  title: ReactNode;
  description: ReactNode;
  visualExplanation: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center">
      <Badge index={index} />
      <MainTitle className="mb-3 mt-5 text-small20 tracking-[-0.5px] text-neutral-0 md:mb-6 md:text-xlarge28">
        {title}
      </MainTitle>
      <p className="mb-[30px] whitespace-pre-line text-center text-xsmall14 font-normal text-neutral-35 md:text-medium22">
        {description}
      </p>
      {visualExplanation}
    </div>
  );
};

const HrCurriculumStepsSection: React.FC<HrCurriculumStepsSectionProps> = ({
  content,
}) => {
  const lectures = content?.lectures;

  return (
    <section className="mb-[90px] flex w-full scroll-mt-[56px] flex-col items-center gap-[120px] px-5 md:mb-[120px] md:scroll-mt-[60px] md:px-0">
      {curriculumSteps(lectures).map((item, index) => (
        <article key={index} className="w-full max-w-[1440px]">
          <CurriculumSteps index={index + 1} {...item} />
        </article>
      ))}
      {/* 상세 설명 렉시컬 컨텐츠 */}
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

export default HrCurriculumStepsSection;
