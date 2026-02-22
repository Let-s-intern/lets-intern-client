import Image from 'next/image';
import { ReactNode } from 'react';

interface ChecklistItem {
  text: string;
}

interface DifferentiatorData {
  number: string;
  title: string;
  before: ChecklistItem[];
  after: ChecklistItem[];
}

export const differentiators: DifferentiatorData[] = [
  {
    number: '01',
    title: 'HR 직무를 아는 수준에서 설명할 수 있는 수준으로',
    before: [
      {
        text: 'HRM과 HRD의 차이를 명확히 구분하기 어렵다',
      },
      {
        text: '조직 내 HR 직무가 어떤 역할을 하는지 모호하다',
      },
      {
        text: '"HR은 무슨 일을 하나요?"라는 질문에 답변이 막힌다',
      },
    ],
    after: [
      {
        text: 'HR의 세부 직무를 구조적으로 정리할 수 있다',
      },
      {
        text: '각 직무의 역할과 책임을 명확히 이해한다',
      },
      {
        text: 'HR 직무를 본인만의 언어로 설명할 수 있다',
      },
    ],
  },
  {
    number: '02',
    title: 'HR 트렌드를 정보가 아닌 성장 방향으로 연결',
    before: [
      {
        text: '최신 HR 트렌드를 단편적인 정보로만 알고 있다',
      },
      {
        text: '현재 시장이 요구하는 HR의 핵심 역량을 모른다',
      },
      {
        text: '앞으로 어떤 커리어를 쌓아야 할지 막연하다',
      },
    ],
    after: [
      {
        text: '트렌드와 실제 HR 과제를 연결하여 이해한다',
      },
      {
        text: '조직이 기대하는 HR의 역할을 구체적으로 인식한다',
      },
      {
        text: '나만의 성장 방향과 커리어 로드맵을 그릴 수 있다',
      },
    ],
  },
  {
    number: '03',
    title: '채용 공고를 기준으로 설계된 실전 구조',
    before: [
      {
        text: 'HR 관련 경험을 직무 역량으로 풀어내기 어렵다',
      },
      {
        text: '서류나 면접에서 직무에 대한 진심을 보여주기 힘들다',
      },
      {
        text: '내 경험과 공고를 연결하지 못한다',
      },
    ],
    after: [
      {
        text: 'HR 탐색 및 아카이빙을 통한 실무 데이터가 쌓인다',
      },
      {
        text: '자소서와 포트폴리오에 구체적인 방향성을 담아낸다',
      },
      {
        text: '지원 시 설득력 있는 스토리 구성 할 수 있다',
      },
    ],
  },
];

interface ChecklistProps {
  items: ChecklistItem[];
  isActive: boolean;
}

export const Checklist = ({ items, isActive }: ChecklistProps) => {
  const checkboxSrc = isActive
    ? '/images/hr-checkbox.svg'
    : '/images/hr-checkbox-disable.svg';
  const bgColor = isActive ? 'bg-[#FEEEE5]' : 'bg-[#F3F3F3]';

  return (
    <div
      className={`flex flex-col gap-3 rounded-xs p-5 md:gap-5 md:rounded-md ${bgColor} md:px-[34px] md:py-[35px]`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <Image
            src={checkboxSrc}
            alt={isActive ? '체크됨' : '체크 안됨'}
            width={20}
            height={20}
            className="h-5 w-5 flex-shrink-0 md:h-9 md:w-9"
            unoptimized
          />
          <span className="text-xxsmall12 text-neutral-35 md:text-small20">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
};

interface DifferentiatorProps {
  number: string;
  title: string;
  before: ChecklistItem[];
  after: ChecklistItem[];
}

export const Differentiator = ({
  number,
  title,
  before,
  after,
}: DifferentiatorProps) => {
  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-medium32 font-semibold text-neutral-0 md:text-medium24">
          {number}
        </span>
        <h3 className="text-small16 font-bold text-neutral-0 md:text-medium24 md:font-semibold">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div className="flex flex-col gap-2">
          <span className="pl-[6px] text-xsmall14 font-semibold text-neutral-50 md:text-small20">
            Before
          </span>
          <Checklist items={before} isActive={false} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="pl-[6px]text-xsmall14 font-semibold text-[#FF5E00] md:text-small20">
            After
          </span>
          <Checklist items={after} isActive={true} />
        </div>
      </div>
    </div>
  );
};

interface FeedbackBenefitData {
  title: string;
  description: ReactNode;
}

export const feedbackBenefits: FeedbackBenefitData[] = [
  {
    title: 'HR 현직자의 1:1 멘토',
    description: (
      <span>
        현직 HR 담당자에게 나의 서류와 커리어 고민을{' '}
        <br className="md:hidden" />
        직접 공유하고, 직무 관점에서 구체적인 개선
        <br className="md:hidden" />
        방향을 피드백받을 수 있어요!
        <br />
        (스탠다드 및 프리미엄 구매 시)
      </span>
    ),
  },
  {
    title: 'HR 현직자의 LIVE 서류 및 커리어 피드백',
    description: (
      <span>
        라이브 세미나를 통해 실제 채용 기준과 사례를 바탕으로, 많은 지원자들이
        놓치는 <br className="md:hidden" />
        서류 포인트와 커리어 방향을 함께 점검해요!
        <br />
        (스탠다드 및 프리미엄 구매 시)
      </span>
    ),
  },
];

interface FeedbackBenefitProps {
  title: string;
  description: ReactNode;
}

export const FeedbackBenefit = ({
  title,
  description,
}: FeedbackBenefitProps) => {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-md bg-neutral-95 px-5 py-10 md:min-h-[186px] md:min-w-[532px] md:gap-6 md:px-[30px] md:py-10">
      <h4 className="text-small18 font-bold text-neutral-0 md:text-medium22">
        {title}
      </h4>
      <div className="flex items-start">
        <Image
          src="/images/hr-check.svg"
          alt="체크"
          width={24}
          height={24}
          className="h-6 w-6 flex-shrink-0"
          unoptimized
        />
        <span className="text-xsmall14 text-neutral-30 md:text-small18">
          {description}
        </span>
      </div>
    </div>
  );
};
