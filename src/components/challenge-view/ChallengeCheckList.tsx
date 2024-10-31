import { useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import { RxCheckbox } from 'react-icons/rx';

import Box from '@components/common/program/program-detail/Box';
import Description from '@components/common/program/program-detail/Description';
import Heading2 from '@components/common/program/program-detail/Heading2';
import OutlinedBox from '@components/common/program/program-detail/OutlineBox';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

const superTitle = '취업 준비 현황 체크리스트';
const title = [
  '지금 내 현황을 체크해 보세요.',
  '체크하는 순간 솔루션을 드립니다!',
];
const description = [
  '취업 준비를 하면서 어떤 고민들을 가지고 계셨나요?',
  '아래 고민 중 1개라도 해당한다면 자소서 챌린지를 추천해요!',
];
const CHECK_LIST = [
  {
    title: ['서류를 단 한 번도 써본 적이 없는데', '괜찮을까요?'],
    content: [
      [
        '마스터 자기소개서를 써본 적이 없어요!',
        '어떤 문항으로 준비해야 하나요?',
      ],
      [
        '지원 동기도 어렵고, 회사가 원하는',
        '직무 경험이 무엇인지 감이 안 잡혀요.',
      ],
      ['자소서에 대한 기본적인 뼈대를', '처음부터 잘 만들어 나가고 싶어요.'],
    ],
    solution: [
      '→ 체계적인 커리큘럼으로 지원동기,',
      '직무역량 등 포함한 마스터 자소서 완성!',
    ],
  },
  {
    title: ['서류를 완성했는데, 계속 서류에서', '부터 떨어지고 있어요…'],
    content: [
      ['제 경험을 얼마나 구체적으로', '작성해야 하는지 잘 모르겠어요.'],
      [
        '제 자소서가 특색 없고 구구절절 쓰는 거',
        '같아요. 차별성을 높이고 싶어요.',
      ],
      ['회사와 나의 연결고리를 찾아서 FIT하게', '만들기가 가장 어려워요!'],
    ],
    solution: [
      '→ 채용 공고 분석과 경험-역량 연결로',
      '차별화된 강점을 어필하는 자소서로 변신!',
    ],
  },
  {
    title: [
      '미리 취업을 준비하고 싶은데,',
      '지금 너무 바빠서 강제성이 필요해요!',
    ],
    content: [
      ['4학년 막학기인데 취업 준비와 병행해서', '준비할 수 있을까요?'],
      [
        '직장에 근무 중인데 퇴근하면 너무 힘들어서,',
        '꾸준히 취준을 독려해 줄 시스템이 필요해요',
      ],
    ],
    solution: [
      '→ 오픈카톡방 실시간 소감 및 작업물 공유와',
      '미션 동기부여 페이백으로 강제성 제공',
    ],
  },
];

function ChallengeCheckList() {
  return (
    <section>
      <div className="mb-16 md:mb-20">
        <SuperTitle className="mb-1 text-[#00A8EB] md:text-center">
          {superTitle}
        </SuperTitle>
        <Heading2>{title.join('\n')}</Heading2>
        <Description className="mt-3 md:mt-8 md:text-center">
          {description.join('\n')}
        </Description>
      </div>

      <div className="flex flex-col gap-16 md:gap-32">
        {CHECK_LIST.map((item, index) => (
          <div
            key={item.title[0]}
            className="flex w-full flex-col gap-6 md:items-center md:gap-10"
          >
            <Box className="relative flex w-full max-w-[860px] flex-col py-6 text-small18 font-bold md:flex-row md:justify-center md:gap-1 md:p-10 md:text-medium24">
              <Badge>Check {index + 1}</Badge>
              {item.title.map((ele) => (
                <span key={ele}>{ele}</span>
              ))}
            </Box>
            <div className="flex flex-col gap-5">
              {item.content.map((group) => (
                <CheckList key={group[0]}>
                  {group.map((ele) => (
                    <span
                      key={ele}
                      className="text-xsmall16 font-semibold text-neutral-35 md:text-small20"
                    >
                      {ele}
                    </span>
                  ))}
                </CheckList>
              ))}
            </div>
            <OutlinedBox className="flex w-full max-w-[860px] flex-col items-center border-[#E77700] bg-[#FFF7EF] text-[#E77700] md:flex-row md:justify-center md:gap-1 md:p-10">
              {item.solution.map((ele) => (
                <span
                  className="text-center text-xsmall16 font-semibold md:text-medium24"
                  key={ele}
                >
                  {ele}
                </span>
              ))}
            </OutlinedBox>
          </div>
        ))}
      </div>
    </section>
  );
}

function Badge({ children }: { children?: ReactNode }) {
  return (
    <span className="absolute -top-6 left-6 z-10 -rotate-12 rounded-sm bg-[#14BCFF] px-2.5 py-1 text-xsmall16 font-bold text-white md:px-4 md:text-small20 md:font-semibold">
      {children}
    </span>
  );
}

function CheckList({ children }: { children?: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 991px)');
  return (
    <div className="flex gap-4 md:items-center">
      <div className="pt-1 md:pt-0">
        <RxCheckbox color="#14BCFF" size={isDesktop ? 36 : 24} />
      </div>
      <div className="flex flex-col md:flex-row md:gap-1">{children}</div>
    </div>
  );
}

export default ChallengeCheckList;
