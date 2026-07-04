import Heading2 from '@/common/header/Heading2';
import TrendItem from './TrendItem';

// 일반 트렌드 섹션
const GeneralTrendSection = ({ primaryColor }: { primaryColor: string }) => (
  <div className="flex w-full max-w-[1000px] flex-col gap-y-[50px] px-5 py-[70px] md:gap-y-20 md:px-10 md:py-[120px] lg:px-0">
    <div className="flex w-full flex-col gap-y-3 md:items-center">
      <p
        className="text-xsmall16 md:text-small20 font-bold"
        style={{ color: primaryColor }}
      >
        취업 성공 전략
      </p>
      <Heading2>
        {new Date().getFullYear()} 채용 트렌드는{' '}
        <span className="text-primary">직무 연관성</span>,{' '}
        <br className="hidden md:block" />
        나에 <br className="md:hidden" />
        대한 이해를 직무와 결합시켜야 해요
      </Heading2>
    </div>
    <div className="flex w-full flex-col gap-y-[60px] md:gap-y-[70px]">
      <TrendItem
        number={1}
        title={
          <>
            스펙 나열하기는 그만!
            <br className="hidden md:block" /> 나만의 경험에서{' '}
            <br className="md:hidden" />
            <span className="text-primary">차별화 포인트</span>부터 찾아야 해요
          </>
        }
        description={
          <>
            직무에서 선호하는 K(지식) / S(스킬) / A(태도)에 맞춰 <br />
            쌓아 온 경험을 재구성하면 경쟁력을 갖출 수 있어요
          </>
        }
        imageSrc="/images/challenge-trend-1.svg"
        imageAlt="K(지식), S(스킬), A(태도)"
      />
      <TrendItem
        number={2}
        title={
          <>
            뻔한 말은 그만!
            <br className="hidden md:block" />{' '}
            <span className="text-primary">나만의 컨셉</span>이 있어야{' '}
            <br className="md:hidden" />더 보고 싶은 서류가 완성돼요
          </>
        }
        description={
          <>
            흔한 키워드가 아닌 채용 공고에서 강조하는 역량 키워드에 <br />
            맞춰 정리하면, 다른 지원자들과의 차이를 만들 수 있어요
          </>
        }
        imageSrc="/images/challenge-trend-2.svg"
        imageAlt="형식적이고 뻔한 내용이 아니라 역량 키워드에 맞춰 서류를 정리해야 합니다."
      />
    </div>
  </div>
);

export default GeneralTrendSection;
