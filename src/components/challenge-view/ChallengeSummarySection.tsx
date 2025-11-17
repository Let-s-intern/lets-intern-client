import { ChallengeType } from '@/schema';
import MainTitle from '@components/common/challenge-marketing-view/MainTitle';

interface ChallengeResultProps {
  challengeType: ChallengeType;
  isResumeTemplate?: boolean;
}

interface SummaryItemData {
  title: string;
  description: string;
  icon: string;
}

const SUMMARY_ITEMS: SummaryItemData[] = [
  {
    title: '현직자 코멘트와 함께\n현황 점검해요.',
    description:
      '경험이 부족한 것인지, 서류로 잘 풀어내지 못하는 것인지\n미션에 대한 피드백으로 현황 점검해요.',
    icon: '/images/marketing/summary-icon1.svg',
  },
  {
    title:
      '4회에 걸친 학습 콘텐츠와 미션으로 \n역량을 강조하는 이력서 완성해요.',
    description:
      '합격하는 이력서의 Do, Don’t\n챌린지에서 확실하게 짚고 넘어가요.',
    icon: '/images/marketing/summary-icon2.svg',
  },
  {
    title:
      '2025년 주요 기업/직무 합격 이력서 10선으로 \n합격하는 이력서의 공통점 확인!',
    description: '합격하는 이력서의 공통점,\n최신 합격 자료로 확인해요.',
    icon: '/images/marketing/summary-icon3.svg',
  },
  {
    title: '미루던 습관은 이제 그만!\n챌린지 참여자들과 동기부여하며 함께해요.',
    description:
      '챌린지 참여자들과 함께\n자유롭게 고민을 나누거나 스터디를 할 수 있어요.',
    icon: '/images/marketing/summary-icon4.svg',
  },
];

const SummaryItem = ({ title, description, icon }: SummaryItemData) => {
  return (
    <div className="flex flex-row items-center gap-5 rounded-xs bg-white p-5 md:flex-col md:items-start md:gap-4 md:p-6">
      <div className="mb-2 shrink-0 md:mb-0 md:h-12 md:w-12">
        <img
          src={icon}
          alt=""
          className="h-[42px] w-[42px] md:h-[54px] md:w-[54px]"
        />
      </div>
      <div className="flex flex-col gap-1 text-left">
        <div className="whitespace-pre-line text-xsmall16 font-bold text-neutral-10 md:text-small20">
          {title}
        </div>
        <div className="whitespace-pre-line text-xsmall14 text-neutral-30 md:text-small18">
          {description}
        </div>
      </div>
    </div>
  );
};

const SummaryGrid = ({ items }: { items: SummaryItemData[] }) => {
  return (
    <div className="grid w-full max-w-[1000px] grid-cols-1 gap-2.5 md:grid-cols-2">
      {items.map((item, idx) => (
        <SummaryItem key={idx} {...item} />
      ))}
    </div>
  );
};

// challengeType이 'CAREER_START'이고
// isResumeTemplate이 true일 때만 표시
function ChallengeSummarySection({
  challengeType,
  isResumeTemplate = false,
}: ChallengeResultProps) {
  if (challengeType !== 'CAREER_START' || !isResumeTemplate) return null;

  return (
    <section className="flex w-full flex-col items-center bg-[#F1F4FF] px-5 pb-12 pt-[60px] text-center md:px-0 md:pb-[120px] md:pt-[100px]">
      <div className="md:small20 mb-2 text-xsmall16 font-bold text-[#4A76FF] md:mb-3">
        수많은 취준생의 어려움을 해결하고자 기획했습니다.
      </div>
      <MainTitle className="mb-6">
        경험 정리부터 <br className="md:hidden" />
        <span className="text-bold mx-1 bg-[#4A76FF] px-2 py-1 text-medium22 text-white md:text-xlarge30">
          이력서 완성
        </span>
        까지 함께합니다.
        <br className="md:hidden" />
        <br />
        기업/직무에 Fit한 이력서를{` `}
        <br className="md:hidden" />
        작성하는 1주의 시간
      </MainTitle>

      <div className="flex w-full max-w-[1000px] flex-col gap-2.5">
        <SummaryGrid items={SUMMARY_ITEMS.slice(0, 2)} />
        <SummaryGrid items={SUMMARY_ITEMS.slice(2)} />
      </div>
    </section>
  );
}

export default ChallengeSummarySection;
