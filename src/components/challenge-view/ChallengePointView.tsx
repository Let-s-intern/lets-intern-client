import { Dayjs } from 'dayjs';
import { ReactNode, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { clientOnly } from 'vike-react/clientOnly';

import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengePoint } from '@/types/interface';
import { ChallengeColor } from '@components/ChallengeView';
import Heading2 from '@components/common/program/program-detail/Heading2';
import { josa } from '@toss/hangul';

const Balancer = clientOnly(() => import('react-wrap-balancer'));

type ProgressItemType = {
  index: number;
  title: string;
  subTitle?: string;
};

const description = '*더 자세한 내용은 상단 메뉴에서 커리큘럼을 클릭해주세요.';
const progress = [
  {
    index: 1,
    title: '신청 완료',
  },
  {
    index: 2,
    title: '챌린지 대시보드 및\n오픈채팅방 초대',
  },
  {
    index: 3,
    title: 'OT',
    subTitle: '*실시간 진행',
  },
  {
    index: 4,
    title: '회차별 미션 수행',
    subTitle: '*2주간, 총 8개 미션',
  },
  {
    index: 5,
    title: '챌린지 종료 및 평가',
    subTitle: '*총 챌린지 참여 점수 80점 이상시,\n3만원 페이백 및 수료증 발급',
  },
];

const MISSION = {
  title: '미션 수행 방법',
  content: [
    '렛츠커리어 챌린지 대시보드를 통해 미션 수행',
    '매 회차별 미션 시작일 00시에 미션 공개',
    '모든 미션은 시간과 장소에 구애받지 않고, 내 일정에 맞춰 미션별 마감일까지만 제출하면 미션 완료',
  ],
};

const REWARD = {
  title: '챌린지에 성공해 뿌듯함과\n리워드까지 가져가세요!',
  content: '챌린지 참여 점수 80점 이상시,\n3만원 페이백 및 수료증 발급',
};

const ChallengePointView = ({
  point,
  challengeTitle,
  startDate,
  endDate,
  colors,
  challengeType,
  className,
}: {
  className?: string;
  point: ChallengePoint;
  challengeTitle: string;
  startDate: Dayjs;
  endDate: Dayjs;
  colors: ChallengeColor;
  challengeType: ChallengeType;
}) => {
  const programSchedule = [
    {
      title: '진행 기간',
      content: `${startDate.format('YYYY년 M월 D일(dd) H시 m분')} ~ ${endDate.format('YYYY년 M월 D일(dd) H시 m분')}`,
    },
    {
      title: 'OT 일자',
      content: `${startDate.format('YYYY년 M월 D일(dd) H시 m분')} *실시간 참여`,
    },
    {
      title: '진행 방식',
      content: '100% 온라인(챌린지 대시보드, 오픈채팅방)',
    },
  ];

  const imgSrc = useMemo(() => {
    switch (challengeType) {
      case challengeTypeSchema.enum.PORTFOLIO:
        return '/images/payback-portfolio.svg';
      case challengeTypeSchema.enum.PERSONAL_STATEMENT:
        return '/images/payback-statement.svg';
      default:
        return '/images/payback-basic.svg';
    }
  }, [challengeType]);

  if (point === undefined) return <></>;

  return (
    <section className={className}>
      <h2 className="sr-only">챌린지 포인트</h2>
      <Heading2 className="mb-10 break-keep lg:mb-20">
        이력서 & 자기소개서 챌린지를 통해
        <br />
        <span style={{ color: colors.secondary }}>하루 30분</span>, 단{' '}
        {point.weekText} 안에 이런걸
        <br className="lg:hidden" />
        얻어갈 수 있어요
      </Heading2>

      <div className="mb-[70px] space-y-4 md:mb-52">
        <ul className="space-y-4">
          {point.list?.map((item, index) => (
            <PointList
              key={item.id}
              item={item}
              index={index}
              colors={colors}
            />
          ))}
        </ul>
        {challengeType === challengeTypeSchema.enum.CAREER_START && (
          <p className="mt-10 text-xsmall14 font-semibold text-neutral-40 md:mt-16 md:text-center md:text-xsmall16">
            본 프로그램은 취업의 기초가 되는 퍼스널 브랜딩과 마스터 이력서
            작성을 다룹니다.
            <br />
            자기소개서 및 포트폴리오 완성 프로그램은 별도로 준비되어 있습니다.
          </p>
        )}
      </div>

      <Heading2 className="mb-10 md:mb-8">
        {josa(challengeTitle, '은/는')}
        <br className="md:hidden" /> 2주간 아래와 같이 진행돼요
      </Heading2>
      <span className="hidden text-center text-xsmall14 text-neutral-30 md:mb-20 md:block">
        {description}
      </span>

      <div className="mb-8 flex flex-col gap-5 md:mb-14 md:flex-row md:justify-between md:px-8">
        {progress.map((item) => (
          <ProgressItem key={item.index} item={item} bgColor={colors.primary} />
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Box className="md:flex-1">
          {programSchedule.map((item) => (
            <BoxItem key={item.title} title={item.title}>
              {item.content}
            </BoxItem>
          ))}
        </Box>
        <Box className="md:flex-1">
          <BoxItem title={MISSION.title}>
            <ul className="flex flex-col gap-1 pl-6">
              {MISSION.content.map((item) => (
                <li className="list-disc" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </BoxItem>
        </Box>
        <Box className="relative overflow-hidden md:flex-1">
          <BoxItem title={REWARD.title}>{REWARD.content}</BoxItem>
          <img
            className="absolute bottom-0 right-2 scale-110"
            src={imgSrc}
            alt="페이백 3만원"
          />
        </Box>
      </div>
    </section>
  );
};

function PointList({
  item,
  index,
  colors,
}: {
  item: {
    id: string;
    title: string;
    subtitle: string;
  };
  index: number;
  colors: ChallengeColor;
}) {
  return (
    <li
      key={item.id}
      className="mx-auto flex max-w-[886px] flex-col items-center gap-4 self-stretch rounded-md px-8 pb-10 pt-8"
      style={{ backgroundColor: colors.primaryLight }}
    >
      <div className="break-keep text-center">
        <span
          className="rounded-md px-3.5 py-1.5 text-small18 font-semibold text-white"
          style={{ backgroundColor: colors.primary }}
        >
          Point {index + 1}
        </span>
      </div>
      <div>
        <h3 className="mb-2 break-keep text-center text-small20 font-bold text-neutral-0">
          <Balancer fallback={<span>{item.title}</span>}>{item.title}</Balancer>
        </h3>
        <p className="break-keep text-center text-xsmall16 font-medium text-neutral-40">
          <Balancer fallback={<span>{item.subtitle}</span>}>
            {item.subtitle}
          </Balancer>
        </p>
      </div>
    </li>
  );
}

function ProgressItem({
  item,
  bgColor,
}: {
  item: ProgressItemType;
  bgColor?: string;
}) {
  return (
    <div key={item.index}>
      <div className="flex gap-2">
        <div
          className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#14BCFF] text-xsmall14 font-semibold text-white"
          style={{ backgroundColor: bgColor }}
        >
          {item.index}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="whitespace-pre-line text-small18 font-semibold text-neutral-0">
            {item.title}
          </span>
          {item.subTitle && (
            <span className="whitespace-pre-line text-xsmall14 text-neutral-45">
              {item.subTitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Box({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'flex min-h-60 flex-col gap-2.5 bg-neutral-95 p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

function BoxItem({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-xsmall16 text-neutral-0">
      <span className="whitespace-pre-line font-semibold">{title}</span>
      <span className="whitespace-pre-line">{children}</span>
    </div>
  );
}

export default ChallengePointView;
