import { Break } from '@/common/Break';
import Heading2 from '@/common/header/Heading2';
import MoreReviewButton from '@/common/review/MoreReviewButton';
import Description from '@/domain/program/program-detail/Description';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa6';

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
    <section className="w-full bg-[#F3F7FF] px-5 py-20 md:px-10 md:py-32 lg:px-0">
      <div className="mb-20 md:mb-52">
        <Heading2 className="mb-3 md:mb-8">
          포트폴리오, 어떻게 시작해야 하나요? <br />
          경험 정리와 백지 템플릿을 통한 <br className="md:hidden" />
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

      <div className="mb-20 md:mb-52">
        <Heading2 className="mb-3 md:mb-8">
          포트폴리오, <span className="text-[#4A76FF]">디자인보다 구조화</span>
          입니다.
          <br />
          가독성과 구조화를 고려한 포트폴리오 가이드
          <br className="md:hidden" /> 모두 제공!
        </Heading2>
        <Description className="mb-10 md:mb-20 md:text-center">
          가장 중요한 건 핵심 내용을 어떻게 도식화하는가인데요. <Break />내
          경험에 맞춰 적용할 수 있도록 다양한 구조화 템플릿, 최소한의 디자인을
          도와줄 폰트/디자인 가이드까지 모두 드려요!
        </Description>
        <TemplateItem template={templates[1]} />
      </div>

      <div className="mb-20 md:mb-52">
        <Heading2 className="mb-3 break-keep md:mb-8">
          포트폴리오, 혼자 만들면 자꾸 미루게 되니까
          <Break />
          <span className="text-[#4A76FF]">
            함께 공유하며 성장하는 오픈채팅방
          </span>
          에서 달려요!
        </Heading2>
        <Description className="mb-10 md:mb-20 md:text-center">
          사람들과 함께 매 미션이 끝날 때마다 느낀 점을 공유하고 질문하며
          <Break />
          성장하는 오픈 카톡 커뮤니티를 활용하기 때문에 2주 동안 힘내서 달릴 수
          있어요
        </Description>
        <Image
          src="/images/community_desktop-1000-672.gif"
          alt="오픈채팅방에서 미션을 공유하는 모습"
          unoptimized
          width={1000}
          height={672}
          className="mx-auto h-auto w-full max-w-[1000px] rounded-md"
        />
      </div>

      <div>
        <Heading2 className="mb-6 break-keep md:mb-16">
          실제 참가자들의 후기에서도 직접 확인할 수 있어요!
        </Heading2>

        <div className="mx-auto flex max-w-[876px] flex-col items-start gap-[30px] font-medium">
          <p className="relative mb-[30px] w-fit rounded-xl bg-[#1A2A5D] px-5 py-3 text-xxsmall12 text-white md:px-10 md:py-6 md:text-small20">
            2주간의 포트폴리오 챌린지, 어떠셨나요?
            <Image
              src="/images/말꼬리표-남-18-18.svg"
              alt="말꼬리표 아이콘"
              unoptimized
              width={18}
              height={18}
              aria-hidden="true"
              className="absolute -bottom-[18px] left-[60px]"
            />
          </p>
        </div>

        <div className="mx-auto flex max-w-[876px] flex-col items-end gap-[30px] text-right font-medium">
          <p className="relative w-fit break-keep rounded-xl bg-white px-5 py-3 text-xxsmall12 md:px-10 md:py-6 md:text-small20">
            각 프로젝트의 배경-문제-해결-결과 흐름을 다시 재정립하면서{' '}
            <span className="font-bold">
              스스로의 역량을
              <Break />
              객관적으로 돌아볼 수 있었고, 실제 포트폴리오 문서 완성에 큰 도움
            </span>
            이 되었습니다.
            <Image
              src="/images/말꼬리표-18-18.svg"
              alt="말꼬리표 아이콘"
              unoptimized
              width={18}
              height={18}
              aria-hidden="true"
              className="absolute -bottom-[18px] right-[60px]"
            />
          </p>

          <p className="relative w-fit break-keep rounded-xl bg-white px-5 py-3 text-xxsmall12 md:px-10 md:py-6 md:text-small20">
            포폴이 디자인이라고 생각해서 정말 막막했는데{' '}
            <span className="font-bold">
              경험을 먼저 정리하고
              <Break />
              구조화하고 백지 피피티를 완성하니 훨씬 더 만들기가 쉬웠던 것
              같아요!
            </span>
            <Image
              src="/images/말꼬리표-18-18.svg"
              alt="말꼬리표 아이콘"
              unoptimized
              width={18}
              height={18}
              aria-hidden="true"
              className="absolute -bottom-[18px] right-[60px]"
            />
          </p>

          <p className="relative w-fit break-keep rounded-xl bg-white px-5 py-3 text-xxsmall12 md:px-10 md:py-6 md:text-small20">
            기존에는 사진만 마구 넣은 포트폴리오였는데, 챌린지 이후로{' '}
            <span className="font-bold">
              가시성도 정말
              <Break />
              많이 좋아졌고,
            </span>{' '}
            필살기 경험만 넣어서{' '}
            <span className="font-bold">
              직무 관련성도 훨씬 높아진 것 같아요!
            </span>
            <Image
              src="/images/말꼬리표-18-18.svg"
              alt="말꼬리표 아이콘"
              unoptimized
              width={18}
              height={18}
              aria-hidden="true"
              className="absolute -bottom-[18px] right-[60px]"
            />
          </p>

          <p className="relative w-fit break-keep rounded-xl bg-white px-5 py-3 text-xxsmall12 md:px-10 md:py-6 md:text-small20">
            <span className="font-bold">
              혼자 했더라면 아직도 완성하지 못했을텐데
              <Break />
              챌린지를 통해 여기까지 올 수 있었어요!
            </span>

            <Image
              src="/images/말꼬리표-18-18.svg"
              alt="말꼬리표 아이콘"
              unoptimized
              width={18}
              height={18}
              aria-hidden="true"
              className="absolute -bottom-[18px] right-[60px]"
            />
          </p>
        </div>
        <MoreReviewButton
          type="CHALLENGE"
          challengeType={'PORTFOLIO'}
          mainColor="#1A2A5D"
          subColor="#F8AE00"
        />
      </div>
    </section>
  );
}

function TemplateItem({ template }: { template: Template }) {
  return (
    <div key={template.title} className="md:flex md:flex-col md:items-center">
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
      <div className="flex w-full max-w-[1000px] flex-col gap-5 md:flex-row md:gap-2.5">
        {template.content.map((item) => (
          <div
            key={item.description}
            className="h-fit overflow-hidden rounded-md bg-[#4A76FF] pl-6 pt-5 md:flex-1"
          >
            <div className="mb-5 flex items-center gap-2">
              <FaCheck size={20} color="#F8AE00" />
              <span className="text-xsmall16 font-semibold text-white">
                {item.description}
              </span>
            </div>
            <img
              className="h-auto w-full"
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
