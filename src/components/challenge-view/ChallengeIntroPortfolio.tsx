import { FaCheck } from 'react-icons/fa6';

import Description from '@components/common/program/program-detail/Description';
import Heading2 from '@components/common/program/program-detail/Heading2';

const templates: Template[] = [
  {
    title: '포트폴리오 미션 템플릿 예시 1',
    content: [
      {
        description: '핵심 역량과 강점 정리',
        src: '/images/portfolio-mission-template1-1.png',
      },
      {
        description: '문제 해결 과정부터 결과 정리',
        src: '/images/portfolio-mission-template1-2.png',
      },
      {
        description: '경험 브레인 스토밍',
        src: '/images/portfolio-mission-template1-3.png',
      },
    ],
  },
  {
    title: '포트폴리오 미션 템플릿 예시 2',
    content: [
      {
        description: '기본 정보 정리하기',
        src: '/images/portfolio-mission-template2-1.png',
      },
      {
        description: '진행 단계별로 정리하기',
        src: '/images/portfolio-mission-template2-2.png',
      },
      {
        description: '성과로 보여주는 나의 경험 정리',
        src: '/images/portfolio-mission-template2-3.png',
      },
    ],
  },
];

type Template = {
  title: string;
  content: {
    description: string;
    src: string;
  }[];
};

function ChallengeIntroPortfolio() {
  return (
    <section>
      <div className="mb-20 md:mb-52">
        <Heading2 className="mb-3 md:mb-8">
          포트폴리오, 어떻게 시작해야 하나요? <br />
          경험 정리와 백지 템플릿을 통한 <br />
          <span className="text-[#4A76FF]">나만의 캐치프라이즈</span> 완성!
        </Heading2>
        <Description className="mb-10 md:mb-20 md:text-center">
          경험 정리 템플릿, 백지 템플릿으로 <br />
          미션을 수행하면서 나만의 차별화된 캐치프라이즈를{' '}
          <br className="md:hidden" />
          만들어 보세요!
        </Description>
        <TemplateItem template={templates[0]} />
      </div>

      <div>
        <Heading2 className="mb-3 md:mb-8">
          포트폴리오, <span className="text-[#4A76FF]">디자인보다 구조화</span>
          입니다.
          <br />
          가독성과 구조화를 고려한 포트폴리오 가이드
        </Heading2>
        <Description className="mb-10 md:mb-20 md:text-center">
          가장 중요한 건 핵심 내용을 어떻게 도식화 하는냐죠. <br />내 경험에
          맞는 다양한 구조화 템플릿, 최소한의 디자인을 도와줄 폰트/디자인
          가이드까지 모두 드려요!
        </Description>
        <TemplateItem template={templates[1]} />
      </div>
    </section>
  );
}

function TemplateItem({ template }: { template: Template }) {
  return (
    <div key={template.title}>
      <div className="mb-5 flex items-center gap-2 md:mb-8 md:justify-center">
        <img
          className="h-auto w-8 md:w-10"
          src="/icons/Folder.svg"
          alt="폴더 아이콘"
        />
        <span className="text-xsmall16 font-semibold text-neutral-30 md:text-small20">
          {template.title}
        </span>
      </div>
      <div className="flex flex-col gap-5 md:flex-row md:gap-2.5">
        {template.content.map((item) => (
          <div
            key={item.description}
            className="relative h-[270px] overflow-hidden rounded-md bg-[#4A76FF] p-5 md:flex-1"
          >
            <div className="flex items-center gap-2">
              <FaCheck size={20} color="#F8AE00" />
              <span className="text-xsmall16 font-semibold text-white">
                {item.description}
              </span>
            </div>
            <img
              className="absolute left-10 top-16 md:left-16"
              src={item.src}
              alt={item.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengeIntroPortfolio;
