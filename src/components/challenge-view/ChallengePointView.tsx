import Check from '@/assets/icons/chevron-down.svg?react';
import { twMerge } from '@/lib/twMerge';
import { Dayjs } from 'dayjs';
import { ReactNode, useMemo } from 'react';
import { clientOnly } from 'vike-react/clientOnly';

import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ChallengePoint } from '@/types/interface';
import { ChallengeColor } from '@components/ChallengeView';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
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

const { PORTFOLIO, PERSONAL_STATEMENT, CAREER_START } =
  challengeTypeSchema.enum;

const ChallengePointView = ({
  point,
  startDate,
  endDate,
  colors,
  challengeType,
  challengeTitle,
}: {
  point: ChallengePoint;
  startDate: Dayjs;
  endDate: Dayjs;
  colors: ChallengeColor;
  challengeType: ChallengeType;
  challengeTitle: string;
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
      case PORTFOLIO:
        return '/images/payback-portfolio.svg';
      case PERSONAL_STATEMENT:
        return '/images/payback-statement.svg';
      default:
        return '/images/payback-basic.svg';
    }
  }, [challengeType]);

  if (point === undefined) return <></>;

  return (
    <div className="flex w-full flex-col items-center">
      {/* 프로그램 소개 */}
      <div className="flex w-full max-w-[1000px] flex-col px-5 md:items-center md:px-10">
        <h2 className="sr-only">챌린지 포인트</h2>
        <SuperTitle
          className="mb-6 lg:mb-10"
          style={{
            color: colors.primary,
          }}
        >
          프로그램 소개
        </SuperTitle>
        <Heading2 className="mb-10 break-keep lg:mb-20">
          {josa(challengeTitle, '을/를')} 통해
          <br />
          <span
            style={{
              color:
                challengeType === CAREER_START
                  ? colors.primary
                  : colors.subTitle,
            }}
          >
            하루 30분
          </span>
          , 단 {point.weekText}만에 서류 준비를 <br className="lg:hidden" />
          끝낼 수 있어요
        </Heading2>

        <div className="mb-[70px] w-full space-y-10 md:mb-[120px] md:space-y-[60px] md:px-14">
          <ul className="max-w-[826px] space-y-4 md:space-y-6">
            {point.list?.map((item, index) => (
              <PointList
                key={item.id}
                item={item}
                index={index}
                colors={colors}
              />
            ))}
          </ul>
          {challengeType === CAREER_START && (
            <p className="text-xsmall14 font-semibold text-neutral-40 md:text-center md:text-xsmall16">
              본 프로그램은 취업의 기초가 되는 퍼스널 브랜딩과 마스터 이력서
              작성을 다룹니다.
              <br />
              자기소개서 및 포트폴리오 완성 프로그램은 별도로 준비되어 있습니다.
            </p>
          )}
        </div>
      </div>

      {/* 진행 방식 */}
      <div
        className="flex w-full flex-col items-center"
        style={{
          backgroundColor: colors.dark,
        }}
      >
        <div className="flex w-full max-w-[1000px] flex-col px-5 py-[60px] md:px-10 md:py-[120px] lg:px-0">
          <div className="flex w-full flex-col md:items-center">
            <p
              className="text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary }}
            >
              진행 방식
            </p>
            <Heading2 className="py-3 pt-2 text-white md:pt-3">
              {josa(challengeTitle, '은/는')}
              <br className="md:hidden" /> {point.weekText}간 아래와 같이
              진행돼요
            </Heading2>
            <span className="mb-10 text-xsmall14 text-neutral-50 md:mb-20">
              {description}
            </span>
          </div>
          <div className="mb-[30px] flex w-full flex-col md:mb-[23px]">
            <div
              className="flex w-full items-center rounded-t-md px-4 py-2.5 text-xsmall14 font-semibold text-white md:justify-center md:px-2.5"
              style={{ backgroundColor: colors.primary }}
            >
              2 Weeks
            </div>
            <div className="flex flex-col gap-5 rounded-b-md bg-white px-4 py-[30px] md:flex-row md:justify-between md:pb-[30px] md:pt-9 lg:px-10">
              {progress.map((item) => (
                <ProgressItem
                  key={item.index}
                  item={item}
                  bgColor={colors.primary}
                />
              ))}
            </div>
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
                <ul className="flex flex-col gap-1 pl-1">
                  {MISSION.content.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        width={24}
                        height={24}
                        className="mt-1 shrink-0"
                        style={{ color: colors.primary }}
                      />
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
        </div>
      </div>
    </div>
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
      className="mx-auto flex w-full flex-col items-center gap-5 self-stretch rounded-md p-8 md:pb-10"
      style={{ backgroundColor: colors.primaryLight }}
    >
      <div className="break-keep text-center">
        <span
          className="rounded-md px-3.5 py-1.5 text-xsmall14 font-semibold text-white md:text-small18"
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
        'flex min-h-60 flex-col gap-2.5 rounded-md bg-neutral-95 p-5',
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
      <span className="whitespace-pre-line font-bold">{title}</span>
      <span className="whitespace-pre-line break-keep">{children}</span>
    </div>
  );
}

export default ChallengePointView;
