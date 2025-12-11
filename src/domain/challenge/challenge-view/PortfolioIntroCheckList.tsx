import { useMediaQuery } from '@mui/material';
import { CSSProperties, ReactNode } from 'react';
import { RxCheckbox } from 'react-icons/rx';

import { challengeColors } from '@/domain/challenge/challenge-view/ChallengeView';
import { ChallengeIdSchema, challengeTypeSchema } from '@/schema';
import Box from '@components/common/program/program-detail/Box';
import Description from '@components/common/program/program-detail/Description';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';
import { josa } from 'es-hangul';
import { twMerge } from 'tailwind-merge';

const superTitle = '프로그램 소개';
const title = [
  '포트폴리오 2주 완성 챌린지',
  '바로 이런 분들을 위해 추천드려요',
];

const PORTFOLIO_CHECK_LIST = [
  {
    title: ['혼자 만들다 보니', '자꾸 완성을 미루게 돼요.'],
    content: [
      ['학기/인턴 병행 중인 사람, 휴학 중인 사람,', '직장 근무 중인 사람'],
      ['혼자 하려고 하니 집중도 잘 안 되고,', '포폴 완성까지 하기 힘든 사람'],
      ['꾸준히 취준을 독려해주고 같이 달릴', '시스템이 필요한 사람'],
    ],
    // solution: [
    //   '→ 체계적인 커리큘럼으로 내용부터 디자인',
    //   '까지 순차적으로 포트폴리오 완성!',
    // ],
  },
  {
    title: ['포트폴리오에 지금까지 했던', '경험들 나열만 했어요.'],
    content: [
      ['체계적으로 기초적인 뼈대부터 잡아가며 완성하고 싶은 사람'],
      ['포트폴리오에 내 경험과 장점 녹이는 방법을 모르고 있는 사람'],
      [
        '포트폴리오에 넣어야 할 경험과 넣지 말아야 할 경험을 구분하고 싶은 사람',
      ],
    ],
    // solution: [
    //   '→ 내 경험에 맞는 다양한 구조화 템플릿',
    //   ' 예시로, 가독성 있는 포트폴리오로 변신!',
    // ],
  },
  {
    title: ['포트폴리오 초안은 만들었는데, ', '잘 만든 건지 모르겠어요.'],
    content: [
      ['내 서류에서 어떤 것이 문제인지 감도 안 잡히는 사람'],
      ['실제 합격 포트폴리오 예시를 보고 제작에 참고하고 싶은 사람'],
    ],
    // solution: [
    //   '→ 오픈카톡방 실시간 소감 및 작업물 공유와',
    //   '미션 동기부여 페이백으로 강제성 제공',
    // ],
  },
];

const styles = {
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

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

interface PortfolioIntroCheckListProps {
  challengeType: ChallengeIdSchema['challengeType'];
  challengeTitle: string;
  isResumeTemplate: boolean;
  challengeId: number;
}

function PortfolioIntroCheckList({
  challengeType,
  challengeTitle,
  isResumeTemplate,
}: PortfolioIntroCheckListProps) {
  const description = [
    '취업 준비를 하면서 어떤 고민들을 가지고 계셨나요?',
    `아래 고민 중 1개라도 해당한다면 ${josa(challengeTitle, '을/를')} 추천해요!`,
  ];

  const checkList = PORTFOLIO_CHECK_LIST;

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
              <Badge style={styles.badgeStyle}>추천 {index + 1}</Badge>
              {item.title.map((ele) => (
                <span key={ele} className="shrink-0">
                  {ele}
                </span>
              ))}
            </Box>
            <div className="flex w-full flex-col gap-5 px-5 md:pr-0 lg:pl-[min(calc(12vw-30px),120px)]">
              {item.content.map((group, index) => (
                <CheckList
                  key={group[0]}
                  checkboxColor={styles.checkboxColor}
                  className={twMerge(
                    'text-neutral-35',
                    group.length > 1 ? 'justify-start' : 'items-center',
                    item.content.length - 1 === index && 'text-neutral-10',
                  )}
                >
                  {group.map((ele) => (
                    <span
                      key={ele}
                      className={twMerge(
                        'shrink-0 text-xsmall14 font-semibold xs:text-xsmall16 md:text-small20',
                      )}
                    >
                      {ele}
                    </span>
                  ))}
                </CheckList>
              ))}
            </div>
            {/* <OutlinedBox
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
            </OutlinedBox> */}
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
      className="absolute -top-6 left-6 z-10 -rotate-12 rounded-sm bg-[#14BCFF] px-3 py-2 text-xsmall16 font-bold text-white md:px-4 md:text-small20 md:font-semibold"
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

export default PortfolioIntroCheckList;
