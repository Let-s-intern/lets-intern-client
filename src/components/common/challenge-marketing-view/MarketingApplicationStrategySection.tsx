import SectionHeader from '@components/ui/SectionHeader';
import Image from 'next/image';
import MainTitle from './MainTitle';
const strategyCards = [
  {
    step: 'STEP 1 | 경험 분석 & 컨셉 잡기',
    title: (
      <>
        마케팅 직무 탐색부터 합격을 위한
        <br className="md:hidden" />
        경험 소재 파악하기
      </>
    ),
    subTitle: <>이 스펙으로 마케터가 될 수 있을까요?</>,
    bullets: [
      '전 분야 현직자와 함께 하나씩 완성하는 이력서/자소서/포트폴리오',
      '채용공고와 매칭되는 나의 경험 찾기',
      '경험을 역량으로 연결하는 구조화 연습하기',
    ],
    image: '/images/marketing/strategy-step1.svg',
    alt: '채용 공고 분석 이미지',
  },
  {
    step: 'STEP 2 | 경험 분석 & 컨셉 잡기',
    title: (
      <>
        기업이 원하는 마케터가 되기 위한
        <br className="md:hidden" />
        나만의 컨셉 브랜딩하기
      </>
    ),
    subTitle: <>채용 담당자는 어떤 마케터를 원할까요?</>,
    bullets: [
      '현직자의 합격 사례 살펴보기',
      '혼한 마케터 취준생이 아닌, 고객을 설득하는 마케터의 컨셉 잡기',
      '채용 공고에서 요구하는 역량을 컨셉으로 풀어내기',
    ],
    image: '/images/marketing/strategy-step2.svg',
    alt: '경험 STAR 정리 이미지',
  },
  {
    step: 'STEP 3 | 이력서 & 자기소개서 완성',
    title: (
      <>
        핵심 역량이 돋보이는
        <br className="md:hidden" />
        K-STAR-K 구조의 서류 작성하기
      </>
    ),
    subTitle: (
      <>
        {'"열심히 하겠습니다"로 끝나는 서류는 그만!'}
        <br className="md:hidden" />
        합격을 위한 핵심 역량의 구조화가 필요합니다.
      </>
    ),
    bullets: [
      '대외활동/동아리/경험 나열 X',
      '경험을 성과로 표현하는 방법',
      '문제-해결 관점에서 드러내는 나만의 역량',
    ],
    image: '/images/marketing/strategy-step3.svg',
    alt: '이력서 예시 이미지',
  },
  {
    step: 'STEP 4 | 포트폴리오 완성',
    title: (
      <>
        문제-전략-성과의 구조를 시각화
        <br className="md:hidden" />
        하는 포트폴리오 제작하기
      </>
    ),
    subTitle: (
      <>
        이미지 캡쳐는 그만! → 포트폴리오는 성과를 <br className="md:hidden" />
        보여주는 장표입니다.
      </>
    ),
    bullets: [
      '합격하는 포트폴리오의 공통점',
      '내 포트폴리오의 문제 파악하기',
      '디자인보다 중요한 구조화 역량 쌓기',
    ],
    image: '/images/marketing/strategy-step4.svg',
    alt: '포트폴리오 Before-After 예시 이미지',
  },
  {
    step: 'STEP 5 | 현직자 피드백',
    title: (
      <>
        현직자의 시선에서 서류를 점검받고
        <br className="md:hidden" />
        서류 완성하기
      </>
    ),
    subTitle: <>제가 만든 서류, 현직자가 보기에 매력적인가요?</>,
    bullets: [
      '경험과 서류에 대한 현직자 피드백',
      '직무별 현직자 멘토만의 합격하는 서류 작성',
      '정확하고 세심한 피드백으로 문제 진단',
    ],
    image: '/images/marketing/strategy-step5.gif',
    alt: '멘토 피드백 예시 이미지',
  },
];

const StrategyCard = ({
  step,
  title,
  subTitle,
  bullets,
  image,
  alt,
}: (typeof strategyCards)[0]) => {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-sm bg-[#F1F4FF] p-4 md:items-start md:gap-6 md:p-6">
      {subTitle && (
        <div className="text-small14 w-full rounded-xxs bg-static-100 p-2 py-2 text-center font-medium text-[#4A76FF] md:text-small18">
          {subTitle}
        </div>
      )}
      <div className="flex w-full flex-col md:flex-row">
        <div className="w-full md:mr-10 md:max-w-[386px]">
          <Image
            src={image}
            alt={alt}
            width={386}
            height={267}
            className="mb:mb-0 mb-3 w-full rounded-sm border border-[#eee] object-cover"
          />
        </div>
        <div className="flex w-full flex-col items-start justify-center md:w-auto">
          <div className="md:text-small16 mb-1 rounded-xxs bg-[#4A76FF] px-3 py-1 text-xsmall14 font-semibold text-static-100 md:mb-2">
            {step}
          </div>
          <h3 className="mb-2 whitespace-pre-line text-left text-small18 font-bold md:mb-3 md:text-medium22">
            {title}
          </h3>
          <ul className="text-left text-xsmall14 text-[#333] md:text-small18">
            {bullets.map((b, i) => (
              <li key={i} className="mb-1 flex items-center gap-1 md:mb-2">
                <Image
                  src="/images/marketing/blue-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span className="">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const MarketingApplicationStrategySection: React.FC = () => {
  return (
    <section
      id="differentiators"
      className="flex scroll-mt-[56px] flex-col items-center bg-static-100 px-5 py-[60px] md:scroll-mt-[60px] md:px-0 md:py-[100px]"
    >
      <SectionHeader className="mb-6 font-semibold text-neutral-45 md:mb-12">
        차별점
      </SectionHeader>
      <span className="mb-3 flex items-center justify-center text-center font-bold text-[#4A76FF] md:text-small20">
        A기업에 제출 후 시간이 없어서 <br className="md:hidden" />
        그대로 B기업에 서류를 제출해오셨나요?
      </span>
      <MainTitle className="text-center">
        반복적인 서류 지원은 멈추고 <br />
        나만의 무기를 완성하는 4주의 시간
      </MainTitle>
      <div className="mt-12 flex w-full max-w-[1000px] flex-col gap-6">
        {strategyCards.map((card, idx) => (
          <StrategyCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
};

export default MarketingApplicationStrategySection;
