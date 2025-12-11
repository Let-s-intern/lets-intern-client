import { useMediaQuery } from '@mui/material';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { RxCheckbox } from 'react-icons/rx';

import { challengeColors } from '@/domain/program/challenge/ChallengeView';
import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
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

const PERSONAL_STATEMENT_LARGE_CORP_CHECK_LIST = [
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
      '미션 동기부여로 강제성 제공',
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

const getCareerStartCheckList = (challengeId: number) => {
  if (challengeId >= 143) {
    return [
      {
        title: [
          '제 경험이 부족한 걸까요?',
          '막상 이력서를 쓰려니 할 말이 없는 것 같아요...',
        ],
        content: [
          [
            '동아리, 학회, 학생회 등의 경험을 ',
            '어떻게 풀어내야 할 지 모르겠어요.',
          ],
          ['부트캠프 들었는데', '이력서에 녹여내는 방법이 어려워요.'],
          ['경험들이 있는데', '실무 경험이라고 하기에는 애매해요.'],
        ],
        solution: [
          '→ 멘토 코멘트를 통해 객관적인 시선에서',
          '경험을 점검할 수 있어요.',
        ],
      },
      {
        title: [
          '경험을 잘 풀어내지 못하는 걸까요?',
          '구체적으로 쓰려니 막막해요...',
        ],
        content: [
          ['인턴 경험이 있긴 한데 ', '이력서에 어떻게 써야 할 지 막연해요.'],
          ['경험에서 어떤 역량을 강조해야 하는지', '판단하는 게 어려워요.'],
        ],
        solution: [
          '→ 2025년 주요 기업/직무 합격 이력서를 통해',
          '경험을 Fit하게 풀어내는 방법을 배워요.',
        ],
      },
      {
        title: [
          '반복되는 서류 탈락에 지쳐요.',
          '합격률을 높이는 방법이 궁금해요...',
        ],
        content: [
          ['채용 공고를 보고 최대한 노력했는데', '자꾸 서류에서 떨어져요.'],
          ['경험이 부족한 건지', '취업 준비 자체가 너무 어려워요.'],
        ],
        solution: [
          '→ 이력서에서 꼭 해야 하는 일을 확인 후 ',
          '서류 준비를 시작할 수 있어요.',
        ],
      },
    ];
  }

  return [
    {
      title: ['본격적인 취업 준비 시작! …', '그런데 어떤 거 부터 해야 하죠?'],
      content: [
        ['이력서도, 자기소개서도, 포트폴리오도', '한 번도 써본 적이 없어요'],
        [
          '취업 정보가 너무 분산되어 있어서',
          '어떤 말을 따라야 할지 모르겠어요.',
        ],
        [
          '아직 구체적인 직무도 정하지 못했는데',
          '서류부터 작성해도 괜찮을까요?',
        ],
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
};

const EXPERIENCE_SUMMARY_CHECK_LIST = [
  {
    title: ['서류 제출 전까지 어떤 경험을', '써야할지 고민하고 있어요.. '],
    content: [
      ['어떤 기준으로 경험을 정리해야할지', ' 모르겠어요.'],
      ['경험을 논리적으로 정리하는게 너무', '어려워요.'],
    ],
    solution: ['→ 합격 STAR 사례와', '논리적인 작성 방법 콘텐츠 제공!'],
  },
  {
    title: ['제가 한 경험들이 의미있는', '활동인지 모르겠어요.'],
    content: [
      ['경험 중에 어떤 부분을 강조해야 할지', '감조차 안 와요.'],
      ['사소하다고 생각하는 일상적인 경험까지', '정리해야 하나요?'],
    ],
    solution: [
      '→ 경험 재해석과 자가 점검을 도와줄',
      '경험정리 특화 질문지, 체크리스트 제공',
    ],
  },
  {
    title: ['경험정리, 계속 미루고 있어서', '강제성이 필요해요!'],
    content: [
      ['혼자 하려니까 동기부여도 안돼고 자꾸', '미루게 돼요.'],
      ['처음에는 의욕이 넘쳤는데 결국 중간에', '포기하게 돼요.'],
    ],
    solution: [
      '→ 오픈카톡방 실시간 소감 및 작업물 공유와',
      '미션 동기부여 페이백으로 강제성 부여',
    ],
  },
];

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

interface ChallengeCheckListProps {
  challengeType: ChallengeIdSchema['challengeType'];
  challengeTitle: string;
  isResumeTemplate: boolean;
  challengeId: number;
}

function ChallengeCheckList({
  challengeType,
  challengeTitle,
  isResumeTemplate,
  challengeId,
}: ChallengeCheckListProps) {
  const description = [
    '취업 준비를 하면서 어떤 고민들을 가지고 계셨나요?',
    `아래 고민 중 1개라도 해당한다면 ${josa(challengeTitle, '을/를')} 추천해요!`,
  ];

  const checkList = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return getCareerStartCheckList(challengeId);
      case PORTFOLIO:
        return PORTFOLIO_CHECK_LIST;
      case EXPERIENCE_SUMMARY:
        return EXPERIENCE_SUMMARY_CHECK_LIST;
      case ETC:
        return EXPERIENCE_SUMMARY_CHECK_LIST;
      case PERSONAL_STATEMENT_LARGE_CORP:
        return PERSONAL_STATEMENT_LARGE_CORP_CHECK_LIST;
      default:
        return PERSONAL_STATEMENT_CHECK_LIST;
    }
  }, [challengeType, challengeId]);

  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          superTitleStyle: { color: challengeColors._4D55F5 },
          boxStyle: {
            backgroundColor: challengeColors.F3F4FF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._4D55F5,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FDF6FF,
            borderColor: challengeColors.E45BFF,
            color: challengeColors.E45BFF,
          },
          checkboxColor: challengeColors._4D55F5,
        };
      case PORTFOLIO:
        return {
          superTitleStyle: { color: challengeColors._4A76FF },
          boxStyle: {
            backgroundColor: challengeColors.F0F4FF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._4A76FF,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF9EA,
            borderColor: challengeColors.F8AE00,
            color: challengeColors.F8AE00,
          },
          checkboxColor: challengeColors._4A76FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          boxStyle: {
            backgroundColor: challengeColors.EEFAFF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._14BCFF,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.FF9C34,
          },
          checkboxColor: challengeColors._14BCFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          boxStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          badgeStyle: {
            backgroundColor: challengeColors.F26646,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.EB7900,
          },
          checkboxColor: challengeColors.F26646,
        };
      case ETC:
        return {
          superTitleStyle: { color: challengeColors.F26646 },
          boxStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          badgeStyle: {
            backgroundColor: challengeColors.F26646,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.EB7900,
          },
          checkboxColor: challengeColors.F26646,
        };
      default:
        return {
          superTitleStyle: { color: challengeColors._14BCFF },
          boxStyle: {
            backgroundColor: challengeColors.EEFAFF,
          },
          badgeStyle: {
            backgroundColor: challengeColors._14BCFF,
          },
          outlinedBoxStyle: {
            backgroundColor: challengeColors.FFF7EF,
            borderColor: challengeColors.FF9C34,
            color: challengeColors.FF9C34,
          },
          checkboxColor: challengeColors._14BCFF,
        };
    }
  }, [challengeType]);

  return (
    <section className="flex w-full max-w-[1000px] flex-col px-5 py-20 md:px-10 md:pb-[140px] md:pt-[130px] lg:px-0">
      <div className="mb-16 md:mb-20">
        <SuperTitle
          className="mb-3 md:text-center"
          style={styles.superTitleStyle}
        >
          {isResumeTemplate
            ? '이력서 1주 완성 챌린지가 필요한 이유'
            : superTitle}
        </SuperTitle>
        <Heading2>
          {isResumeTemplate
            ? '이력서는 취업의 필수!\n채용 담당자가 가장 먼저 나를 판단하게 되는 서류입니다.'
            : title.join('\n')}
        </Heading2>
        <Description className="mt-3 md:mt-8 md:text-center">
          {isResumeTemplate
            ? '가장 중요한 서류임에도 불구하고 자꾸 미뤄두셨다면\n이번 챌린지를 통해 함께 1주 만에 꼭 완성해요!'
            : description.join('\n')}
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
              style={styles.boxStyle}
            >
              <Badge style={styles.badgeStyle}>Check {index + 1}</Badge>
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
                  checkboxColor={styles.checkboxColor}
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
              style={styles.outlinedBoxStyle}
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
  checkboxColor,
  className,
}: {
  children?: ReactNode;
  checkboxColor?: string;
  className?: string;
}) {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div className={twMerge('flex w-full gap-4 md:items-center', className)}>
      <div>
        <RxCheckbox color={checkboxColor} size={isDesktop ? 36 : 24} />
      </div>
      <div className="flex flex-col md:flex-row md:gap-1">{children}</div>
    </div>
  );
}

export default ChallengeCheckList;
