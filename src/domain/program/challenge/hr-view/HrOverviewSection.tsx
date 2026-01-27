import Image from 'next/image';
import { ReactNode } from 'react';

interface StepItem {
  step: string;
  title: string;
  description: ReactNode;
  src: string;
}

const OVERVIEW_STEPS: StepItem[] = [
  {
    step: 'Step 1',
    title: '프로그램 참여자 등록',
    description: (
      <>챌린지 상세페이지에서 플랜을 선택한 후 프로그램을 신청해요.</>
    ),
    src: '/images/1-프로그램 참여자 등록.gif',
  },
  {
    step: 'Step 2',
    title: '대시보드 입장',
    description: (
      <>
        개인 전용 대시보드에 입장하여 모든 미션에 참여할 수 있어요. <br />
        입장 시 작성하는 정보들은 이후 맞춤형 피드백 등에 활용해요.
      </>
    ),
    src: '/images/2-프로그램 대시보드 입장.gif',
  },
  {
    step: 'Step 3-1',
    title: '챌린지 참여 - OT',
    description: (
      <>
        오리엔테이션으로 챌린지 진행 방식, 제출 규칙, 합격 기준 등을
        <br />
        확인해요.
      </>
    ),
    src: '/images/3-1-프로그램 참여-OT.gif',
  },
  {
    step: 'Step 3-2',
    title: '챌린지 참여 - 미션 수행',
    description: <>회차별 미션을 수행하며 서류를 완성해요.</>,
    src: '/images/3-2-프로그램 참여-미션 수행.gif',
  },
  {
    step: 'Step 3-3',
    title: '챌린지 참여 - 미션 인증',
    description: (
      <>
        수행한 미션을 대시보드에 업로드하고 챌린지 오픈채팅방에서 인증을
        <br />
        완료해요.
      </>
    ),
    src: '/images/3-3-프로그램 참여-미션 인증.gif',
  },
  {
    step: 'Step 3-4',
    title: '챌린지 참여 - 1:1 Live 멘토링',
    description: <>렛츠커리어 멘토링 예약 시스템을 활용해 멘토링을 진행해요.</>,
    src: '/images/3-4프로그램 참여-멘토링.gif',
  },
  {
    step: 'Step 4',
    title: '챌린지 종료',
    description: (
      <>
        모든 미션·인증·피드백이 완료되면 프로그램이 종료되고 수료증
        <br />을 받을 수 있어요.
      </>
    ),
    src: '/images/4-프로그램 종료.gif',
  },
];

interface StepCardProps {
  step: string;
  title: string;
  description: ReactNode;
  src: string;
  index: number;
}

const StepCard = ({ step, title, description, src, index }: StepCardProps) => {
  return (
    <div className="flex min-w-[424px] flex-col gap-3 md:gap-4">
      <div className="flex items-center justify-start gap-3">
        <span
          className="rounded-full px-4 py-2 text-xsmall16 font-semibold text-[##212121] md:text-medium22"
          style={{ backgroundColor: '#FFBD96' }}
        >
          {step}
        </span>
        <h3 className="text-medium22 font-semibold text-white">{title}</h3>
      </div>
      <Image
        src={src}
        alt={`프로그램 참여 과정 ${index + 1}`}
        width={424}
        height={270}
        unoptimized
        className="h-auto w-full rounded-md"
      />
      <div className="break-keep px-2 pt-4 text-xsmall16 text-neutral-100 md:px-4">
        {description}
      </div>
    </div>
  );
};

const HrOverviewSection: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center bg-[#290F00] px-5 pt-[60px] md:mb-16 md:px-10 md:pt-[120px] lg:px-0">
      <div className="mb-8 flex w-full max-w-[1000px] flex-col md:mb-16">
        <p className="mx-auto flex w-fit items-center gap-3 rounded-md bg-[#FF5E00] px-3.5 py-2.5 font-bold text-white md:text-medium24">
          <Image
            unoptimized
            src="/images/hr-calendar.svg"
            alt="캘린더 아이콘"
            width={30}
            height={30}
          />
          <span>2주 여정 한 번에 보기</span>
        </p>
      </div>
      <div className="mb-16 w-screen md:mb-36">
        <div className="custom-scrollbar flex w-full gap-5 overflow-x-auto px-[max(1.5rem,calc((100vw-1000px)/2))] pb-4">
          {OVERVIEW_STEPS.map((item, index) => (
            <StepCard key={index} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HrOverviewSection;
