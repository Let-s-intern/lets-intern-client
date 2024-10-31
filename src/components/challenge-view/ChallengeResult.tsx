import { twMerge } from '@/lib/twMerge';
import { FaCheck } from 'react-icons/fa6';

import Description from '@components/common/program/program-detail/Description';
import Heading2 from '@components/common/program/program-detail/Heading2';
import OutlinedBox from '@components/common/program/program-detail/OutlineBox';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { useMediaQuery } from '@mui/material';

const superTitle = '이 모든 고민을 한번에 해결!';
const title = ['서류 합격률을 300% 높일 수 있는', '렛츠커리어 챌린지'];
const description = '디테일의 차이로 서류 합격률이 올라가요!';
const CONTENT = [
  {
    before:
      '저는 어릴 때부터 교육 산업에 관심이 있었고, 계속 발전해나가는 A사에 매력을 느낍니다. A사는 특히 한국뿐 아니라 글로벌 시장에서도 영향력을 발휘하고 있어 성장 가능성이 크다고 생각합니다. 유명무실한 A사의 실적에 제가 기여하여 함께 성장하는 직원이 되도록 하겠습니다.',
    beforeCaption: '누구나 쓸 수 있는 추상적인 지원동기',
    after:
      '[A사 가치의 실현에 동참]\n교육에서 상생 가치의 중요성을 깊이 인식하고, 이를 실천하는 과정에서 보람을 느끼기 때문에, A사의 ESG 가치의 실현 과정에 동참하고 싶습니다. 저소득 중고등학교 멘토링 봉사 활동을 주기적으로 참여하며, 프로그램을 기획·운영한 경험이 있습니다.',
    afterCaption: 'A사의 가치 기술과 관련된 경험 연결',
  },
  {
    before:
      '저는 서비스 기획자가 되기 위해서 이제까지 다양한 활동을 해왔습니다. IT 연합 동아리를 통해 팀 프로젝트로 앱 기획을 진행했습니다. 또한, 학교 경영학 수업 조별과제에서 리더를 맡아 효율적으로 업무를 분배해서 A+를 받았습니다. 그리고…',
    beforeCaption: '직무 경험을 구구절절 나열하는 방식',
    after:
      '서비스 기획을 하기 위해서는 데이터 기반의 논리적인 의사 결정 역량이 가장 중요하다고 생각합니다. 실제로 저는 IT 연합 동아리에서 사용자 인터뷰를 바탕으로 pain point를 도출한 이후 서비스 기획안을 작성하여 설득력을 높인 적 있습니다.',
    afterCaption: '나만의 장단점 및 역량 키워드 도출',
  },
];

function ChallengeResult() {
  return (
    <section>
      <SuperTitle className="mb-1 text-[#00A8EB]">{superTitle}</SuperTitle>
      <Heading2>{title.join('\n')}</Heading2>
      <Description className="mb-10 mt-3 md:mb-20 md:mt-9 md:text-center">
        {description}
      </Description>

      <div className="z-10 -mx-5 overflow-x-auto pl-5 sm:mx-0 sm:pl-0">
        <div className="flex w-fit flex-col gap-8 md:gap-16">
          {CONTENT.map((content) => (
            <CardList key={content.before} content={content} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Content {
  before: string;
  beforeCaption: string;
  after: string;
  afterCaption: string;
}

function CardList({ content }: { content: Content }) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div
      key={content.before}
      className="flex flex-nowrap items-center gap-2 md:gap-3"
    >
      <div className="flex flex-1 flex-col items-center gap-4">
        <BadgedBox badgeContent="Before" boxContent={content.before} />
        <span className="text-xsmall14 font-semibold text-neutral-0 md:text-small20">
          {content.beforeCaption}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center gap-4">
        <BadgedBox
          badgeContent="After"
          boxContent={content.after}
          color="blue"
        />
        <div className="flex items-center gap-1">
          <FaCheck color="#14BCFF" size={isDesktop ? 20 : 16} />
          <span className="text-xsmall14 font-semibold text-neutral-0 md:text-small20">
            {content.afterCaption}
          </span>
        </div>
      </div>
    </div>
  );
}

function BadgedBox({
  badgeContent,
  boxContent,
  color = 'gray',
}: {
  badgeContent: string;
  boxContent: string;
  color?: 'gray' | 'blue';
}) {
  return (
    <OutlinedBox
      className={twMerge(
        'relative h-48 min-w-[260px] overflow-hidden border-2 pb-0 pt-12 sm:w-full md:h-[350px] md:px-8 md:pt-16',
        color === 'gray'
          ? 'border-neutral-50 bg-neutral-85'
          : 'border-[#39C7FF] bg-[#E1F6FF]',
      )}
    >
      <div
        className={twMerge(
          'absolute left-0 top-0 rounded-br-xxs px-2.5 py-1 text-center text-xsmall16 font-semibold text-white md:w-28 md:rounded-br-md md:py-2.5 md:text-small20',
          color === 'gray' ? 'bg-neutral-50' : `bg-[#39C7FF]`,
        )}
      >
        {badgeContent}
      </div>
      <p className="h-full whitespace-pre-line bg-white px-6 pt-7 text-[8px] font-medium md:px-12 md:pt-16 md:text-xsmall16 md:text-xxsmall12">
        {boxContent}
      </p>
    </OutlinedBox>
  );
}

export default ChallengeResult;
