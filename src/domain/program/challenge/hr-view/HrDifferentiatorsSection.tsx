import SectionHeader from '@/common/header/SectionHeader';
import MainTitle from '../ui/MainTitle';
import {
  Differentiator,
  differentiators,
  FeedbackBenefit,
  feedbackBenefits,
} from './Differentiators';

const HrDifferentiatorsSection: React.FC = () => {
  return (
    <section
      id="differentiators"
      className="flex scroll-mt-[56px] flex-col items-center px-5 pb-10 pt-16 md:scroll-mt-[100px] md:px-0 md:pb-[120px] md:pt-[140px]"
    >
      <SectionHeader className="mb-6 w-full text-left md:mb-[42px] md:text-center">
        차별점
      </SectionHeader>
      <div className="text-small14 mb-3 text-center text-neutral-35 md:text-small18">
        HR/인사 직무 챌린지, 왜 다를까요?
      </div>
      <MainTitle className="mb-12 flex flex-col items-center">
        <span>단순한 정보 전달이 아닌,</span>
        <span>
          지원 가능한 상태까지 <br className="md:hidden" />
          만드는 구조로 설계했습니다.
        </span>
      </MainTitle>

      <div className="flex w-full min-w-[320px] max-w-[1130px] flex-col gap-10">
        {differentiators.map((item, index) => (
          <article key={index} className="w-full">
            <Differentiator {...item} />
          </article>
        ))}
      </div>

      <div className="mb-8 mt-[60px] w-full md:mb-12 md:mt-[120px]">
        <div className="text-left text-[18px] font-bold md:text-center md:text-[30px]">
          <span>여기서 끝이 아니죠</span>
          <br />
          <span>HR 현직자에게 직접 피드백을 듣는 혜택까지!</span>
        </div>
      </div>

      <div className="flex w-full min-w-[320px] flex-col gap-3.5 md:max-w-[1000px]">
        <div className="mx-auto w-full min-w-[320px] max-w-[500px] overflow-hidden rounded-md md:h-[300px] md:w-[500px] md:flex-shrink-0">
          <img
            src="/images/hr-feedback.gif"
            alt="HR 현직자에게 직접 피드백을 듣는 혜택"
            className="h-full w-full object-cover object-center"
          />
        </div>
        {feedbackBenefits.map((benefit, index) => (
          <FeedbackBenefit key={index} {...benefit} />
        ))}
      </div>
    </section>
  );
};

export default HrDifferentiatorsSection;
