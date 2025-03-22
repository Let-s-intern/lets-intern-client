import { useMediaQuery } from '@mui/material';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { RxCheckbox } from 'react-icons/rx';

import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
import { ChallengeColor } from '@components/ChallengeView';
import Box from '@components/common/program/program-detail/Box';
import Description from '@components/common/program/program-detail/Description';
import OutlinedBox from '@components/common/program/program-detail/OutlineBox';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';
import { josa } from 'es-hangul';
import { twMerge } from 'tailwind-merge';

const superTitle = '취업 준비 현황 체크리스트';
const title = [
  '지금 내 현황을 체크해 보세요.',
  '체크하는 순간 솔루션을 드립니다!',
];
const PERSONAL_STATEMENT_CHECK_LIST = [
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

const PORTFOLIO_CHECK_LIST = [
  {
    title: ['포트폴리오를 어떻게 만들어야 할지', '감이 안 잡혀요…'],
    content: [
      ['포트폴리오에는 어떤 경험을 넣어서', '만들어야 하나요?'],
      ['포트폴리오에 넣지 말아야 할 것과', '넣어야 할 것을 구분하고 싶어요.'],
      [
        '체계적으로, 기초적인 뼈대부터 잡아가며',
        '포트폴리오를 완성하고 싶어요!',
      ],
    ],
    solution: [
      '→ 체계적인 커리큘럼으로 내용부터 디자인',
      '까지 순차적으로 포트폴리오 완성!',
    ],
  },
  {
    title: [
      '포트폴리오 초안은 만들었는데,',
      '잘 만든 건지 확신이 서지 않아요.',
    ],
    content: [
      [
        '다른 직무의 합격 포트폴리오 예시가 필요해요.',
        '합격 자료가 너무 부족해요.',
      ],
      ['경험은 채웠는데, 디자인을 못해서', '구조화 하는 게 너무 어려워요!'],
      [
        '초안을 만들었는데 서비스 기획안처럼',
        '느껴져요. 어떻게 작성해야 하나요?',
      ],
    ],
    solution: [
      '→ 내 경험에 맞는 다양한 구조화 템플릿',
      ' 예시로, 가독성 있는 포트폴리오로 변신!',
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

const CAREER_START_CHECK_LIST = [
  {
    title: ['본격적인 취업 준비 시작! …', '그런데 어떤 거 부터 해야 하죠?'],
    content: [
      ['이력서도, 자기소개서도, 포트폴리오도', '한 번도 써본 적이 없어요'],
      ['취업 정보가 너무 분산되어 있어서', '어떤 말을 따라야 할지 모르겠어요.'],
      ['아직 구체적인 직무도 정하지 못했는데', '서류부터 작성해도 괜찮을까요?'],
    ],
    solution: [
      '→ 체계적인 2주 커리큘럼으로 경험',
      '분석-직무 탐색-서류 준비 3step 완료!',
    ],
  },
  {
    title: ['서류를 완성했는데, 계속 서류에서', '부터 떨어지고 있어요…'],
    content: [
      ['회사 맞춤형 서류를 쓰는 데 시간이', '너무 오래 걸려요.'],
      [
        '채용 공고를 분석하고 내 경험을 바탕으로',
        '어필하는 방법을 잘 모르겠어요.',
      ],
    ],
    solution: [
      '→ 나의 경험과 ‘강점’을 채용공고와',
      '연결짓는 퍼스널 브랜딩 비결 배우기!',
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

const EXPERIENCE_SUMMARY_CHECK_LIST = [
  {
    title: ['서류 제출 전까지 어떤 경험을', '써야할지 고민하고 있어요.. '],
    content: [
      ['어떤 기준으로 경험을 정리해야할지', ' 모르겠어요.'],
      ['경험을 논리적으로 정리하는게 어려워요.'],
    ],
    solution: ['→ 경험정리에서 서류로 발전시킨 사례 공유!'],
  },
  {
    title: ['제가 한 경험들이 의미있는', '활동인지 모르겠어요.'],
    content: [
      ['어떤 점을 강조해야 할지 모르겠어요'],
      ['일상적인 경험까지 정리해야 하나요?'],
    ],
    solution: [
      '→ 경험 재해석과 자가 점검을 도와줄',
      '경험정리 특화 질문지, 체크리스트 제공',
    ],
  },
  {
    title: ['경험정리, 계속 미루고 있어서', '강제성이 필요해요!'],
    content: [['혼자 하려니까 미루게 돼요'], ['중간에 자꾸 포기하게 돼요']],
    solution: [
      '→ 오픈카톡방 실시간 소감 및 작업물 공유와',
      '미션 동기부여 페이백으로 강제성 부여',
    ],
  },
];

interface ChallengeCheckListProps {
  colors: ChallengeColor;
  challengeType: ChallengeIdSchema['challengeType'];
  challengeTitle: string;
}

function ChallengeCheckList({
  colors,
  challengeType,
  challengeTitle,
}: ChallengeCheckListProps) {
  const description = [
    '취업 준비를 하면서 어떤 고민들을 가지고 계셨나요?',
    `아래 고민 중 1개라도 해당한다면 ${josa(challengeTitle, '을/를')} 추천해요!`,
  ];

  const checkList = useMemo(() => {
    const { PORTFOLIO, CAREER_START, ETC } = challengeTypeSchema.enum;
    switch (challengeType) {
      case CAREER_START:
        return CAREER_START_CHECK_LIST;
      case PORTFOLIO:
        return PORTFOLIO_CHECK_LIST;
      case ETC:
        return EXPERIENCE_SUMMARY_CHECK_LIST;
      default:
        return PERSONAL_STATEMENT_CHECK_LIST;
    }
  }, [challengeType]);

  return (
    <section className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:px-10 md:pb-[140px] md:pt-[130px] lg:px-0">
      <div className="mb-16 md:mb-20">
        <SuperTitle
          className="mb-3 md:text-center"
          style={{ color: colors.primary }}
        >
          {superTitle}
        </SuperTitle>
        <Heading2>{title.join('\n')}</Heading2>
        <Description className="mt-3 md:mt-8 md:text-center">
          {description.join('\n')}
        </Description>
      </div>

      <div className="flex w-full flex-col gap-16 md:gap-32 md:px-16">
        {checkList.map((item, index) => (
          <div
            key={item.title[0]}
            className="flex w-full flex-col gap-6 md:items-center md:gap-10"
          >
            <Box
              className="relative flex w-full max-w-[860px] flex-col py-6 text-small18 font-bold md:flex-row md:justify-center md:gap-1 md:p-10 md:text-medium24"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Badge style={{ backgroundColor: colors.primary }}>
                Check {index + 1}
              </Badge>
              {item.title.map((ele) => (
                <span key={ele} className="shrink-0">
                  {ele}
                </span>
              ))}
            </Box>
            <div className="flex w-fit flex-col gap-5 px-5 md:items-center md:px-0">
              {item.content.map((group) => (
                <CheckList
                  key={group[0]}
                  colors={colors}
                  className={
                    group.length > 1 ? 'justify-start' : 'items-center'
                  }
                >
                  {group.map((ele) => (
                    <span
                      key={ele}
                      className="shrink-0 text-xsmall14 font-semibold text-neutral-35 xs:text-xsmall16 md:text-small20"
                    >
                      {ele}
                    </span>
                  ))}
                </CheckList>
              ))}
            </div>
            <OutlinedBox
              className="flex w-full max-w-[860px] flex-col items-center md:p-10 lg:flex-row lg:justify-center lg:gap-1"
              style={{
                backgroundColor: colors.secondaryLight,
                borderColor: colors.secondary,
                color: colors.secondary,
              }}
            >
              {item.solution.map((ele) => (
                <span
                  className="shrink-0 text-center text-xsmall16 font-semibold md:text-medium24"
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

function Badge({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      className="absolute -top-6 left-6 z-10 -rotate-12 rounded-sm bg-[#14BCFF] px-2.5 py-1 text-xsmall16 font-bold text-white md:px-4 md:text-small20 md:font-semibold"
      style={style}
    >
      {children}
    </span>
  );
}

function CheckList({
  children,
  colors,
  className,
}: {
  children?: ReactNode;
  colors: ChallengeColor;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div className={twMerge('flex w-full gap-4 md:items-center', className)}>
      <div>
        <RxCheckbox color={colors.primary} size={isDesktop ? 36 : 24} />
      </div>
      <div className="flex flex-col md:flex-row md:gap-1">{children}</div>
    </div>
  );
}

export default ChallengeCheckList;
