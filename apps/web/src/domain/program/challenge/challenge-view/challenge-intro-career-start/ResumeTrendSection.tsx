import Heading2 from '@/common/header/Heading2';
import TrendItem from './TrendItem';

// 이력서 템플릿용 트렌드 섹션
const ResumeTrendSection = ({ primaryColor }: { primaryColor: string }) => (
  <div className="flex w-full max-w-[1000px] flex-col gap-y-[50px] px-5 py-[70px] md:gap-y-20 md:px-10 md:py-[120px] lg:px-0">
    <div className="flex w-full flex-col gap-y-3 md:items-center">
      <p
        className="text-xsmall16 md:text-small20 font-bold"
        style={{ color: primaryColor }}
      >
        서류 작성의 시작, 이력서
      </p>
      <Heading2>
        {new Date().getFullYear()} 합격 이력서 트렌드는{' '}
        <span className="text-primary">핵심 역량 강조</span>
        <br />
        지원한 직무에 Fit한 역량을 드러내야 해요.
      </Heading2>
    </div>
    <div className="flex w-full flex-col gap-y-[60px] md:gap-y-[70px]">
      <TrendItem
        number={1}
        title={
          <>
            경험 나열만 하는 이력서가 아닌
            <br />
            <span className="text-primary">직무 역량이 돋보이는</span> 이력서가
            필요해요.
          </>
        }
        description={
          <>
            지원한 직무의 역량을 정의 후 핵심 역량을 강조하며 <br />
            스스로의 Fit함을 요약적으로 제시하며 시작해요.
          </>
        }
        imageSrc="/images/challenge-trend-143.svg"
        imageAlt="직무정의, 역량강조, 직무와의fit"
      />
      <TrendItem
        number={2}
        title={
          <>
            이력서의 핵심은 How!
            <br />
            <span className="text-primary">
              내가 어떻게 일하는 사람인지 드러내야 해요.
            </span>
          </>
        }
        description={
          <>
            경험을 드러낼 때는 과업의 배경부터 솔루션 도출까지
            <br />
            과정에서 어떻게 일했는지 드러나는 이력서가 필요해요.
          </>
        }
        imageSrc="/images/challenge-trend-2-143.svg"
        imageAlt="이력서의 핵심은 HOW! 내가 어떻게 일하는 사람인지 드러내야 해요."
      />
      <TrendItem
        number={3}
        title={
          <>
            최대한 구체적으로 작성!
            <br />
            <span className="text-primary">경험이 구체적일수록</span> 지원자의
            Fit을 쉽게 파악해요.
          </>
        }
        description={
          <>
            구체성은 곧 차별화!
            <br />
            경험이 구체적일수록 다른 지원자와의 차별화가 가능해요.
          </>
        }
        imageSrc="/images/challenge-trend-3.svg"
        imageAlt="구체적인 경험이 곧 차별화입니다."
      />
    </div>
  </div>
);

export default ResumeTrendSection;
