import { getVod } from '@/api/program';
import Check from '@/assets/icons/chevron-down.svg?react';
import HoleIcon from '@/assets/icons/hole.svg?react';
import {
  LOCALIZED_YYYY_MDdd_HH,
  LOCALIZED_YYYY_MDdd_HHmm,
} from '@/data/dayjsFormat';
import { ChallengeType, challengeTypeSchema, ProgramTypeEnum } from '@/schema';
import { ChallengePoint, ProgramRecommend } from '@/types/interface';
import { ChallengeColor } from '@components/ChallengeView';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';
import ProgramRecommendSlider from '@components/common/ui/ProgramRecommendSlider';
import { josa } from 'es-hangul';
import { ReactNode, useMemo } from 'react';

// const Balancer = clientOnly(() => import('react-wrap-balancer'));
import { twMerge } from '@/lib/twMerge';
import { Dayjs } from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Balancer = dynamic(() => import('react-wrap-balancer'), { ssr: false });

type ProgressItemType = {
  index: number;
  title: string;
  subTitle?: string;
};

const description = '*더 자세한 내용은 상단 메뉴에서 커리큘럼을 클릭해주세요.';

const MISSION = {
  title: '미션 수행 방법',
  content: [
    '챌린지 대시보드를 통해 미션수행',
    '매 회차별 챌린지 가이드북 및\n미션 템플릿과 함께 미션 공개',
    '모든 미션은 시간과 장소에 구애받지 않고, 나의 일정에 맞춰 미션 별 마감일까지만 제출하면 완료',
  ],
};

const {
  CAREER_START,
  PERSONAL_STATEMENT,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
} = challengeTypeSchema.enum;

const ChallengePointView = ({
  point,
  startDate,
  endDate,
  colors,
  challengeType,
  challengeTitle,
  programRecommend,
}: {
  point: ChallengePoint;
  startDate: Dayjs;
  endDate: Dayjs;
  colors: ChallengeColor;
  challengeType: ChallengeType;
  challengeTitle: string;
  programRecommend?: ProgramRecommend;
}) => {
  const router = useRouter();

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
      title: '회차별 챌린지 가이드북\n및 미션 템플릿 제공',
    },
    {
      index: 5,
      title: '회차별 미션 수행',
    },
    {
      index: 6,
      title: '챌린지 종료 및 평가',
      subTitle:
        '*총 챌린지 참여 점수 80점 이상시,\n' +
        (challengeType === PERSONAL_STATEMENT_LARGE_CORP ||
        challengeTitle.includes('마케팅')
          ? '수료증 발급'
          : '3만원 페이백 및 수료증 발급'),
    },
  ];

  const reward = {
    title: '챌린지에 성공해 뿌듯함과\n리워드까지 가져가세요!',
    content:
      '챌린지 참여 점수 80점 이상시,\n' +
      (challengeType === PERSONAL_STATEMENT_LARGE_CORP ||
      challengeTitle.includes('마케팅')
        ? '수료증 발급'
        : '3만원 페이백 및 수료증 발급'),
  };

  const programSchedule = [
    {
      title: '진행 기간',
      content: `${startDate.format(LOCALIZED_YYYY_MDdd_HHmm)}\n~ ${endDate.format(LOCALIZED_YYYY_MDdd_HHmm)}`,
    },
    {
      title: 'OT 일자',
      content: (
        <>
          {/* 정각이면 'mm분' 생략 */}
          {startDate.get('minute') === 0
            ? startDate.format(LOCALIZED_YYYY_MDdd_HH)
            : startDate.format(LOCALIZED_YYYY_MDdd_HHmm)}{' '}
          ~ {startDate.add(40, 'minute').format('HH시 mm분')}
          <br />
          *실시간 참여 권장
          <br className="hidden md:block" />{' '}
          <span className="text-xxsmall12 text-neutral-35 md:text-xsmall14">
            (불참시 녹화본 제공 가능)
          </span>
        </>
      ),
    },
    {
      title: '진행 방식',
      content: '100% 온라인(챌린지 대시보드, 오픈채팅방)',
    },
  ];

  const [paypackImgSrc, recommendLogoSrc] = useMemo(() => {
    switch (challengeType) {
      case PORTFOLIO:
        return [
          '/images/payback-portfolio.png',
          '/icons/bg-logo-portfolio.svg',
        ];
      case CAREER_START:
        return [
          '/images/payback-career-start.png',
          '/icons/bg-logo-career-start.svg',
        ];
      default:
        return [
          '/images/payback-personal-statement.png',
          '/icons/bg-logo-personal-statement.svg',
        ];
    }
  }, [challengeType]);

  const slideList = useMemo(() => {
    const list = [];

    for (const item of programRecommend?.list ?? []) {
      let to = '';
      if (item.programInfo.programType === ProgramTypeEnum.enum.VOD) {
        getVod(item.programInfo.id).then((data) => {
          to = data.vodInfo.link ?? '';
        });
      } else {
        to = `/program/${item.programInfo.programType.toLowerCase()}/${item.programInfo.id}`;
      }

      list.push({
        id: item.programInfo.id,
        backgroundImage: item.programInfo.thumbnail ?? '',
        title: item.recommendTitle ?? '',
        cta: item.recommendCTA ?? '',
        to,
        onClickButton: async () => {
          if (item.programInfo.programType === ProgramTypeEnum.enum.VOD) {
            // VOD 링크로 이동
            const data = await getVod(item.programInfo.id);
            window.open(data.vodInfo.link ?? '');
            return;
          }

          router.push(
            `/program/${item.programInfo.programType.toLowerCase()}/${item.programInfo.id}`,
          );
        },
      });
    }

    return list;
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      {/* 프로그램 소개 */}
      {point && (
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
                본 프로그램은 취업의 기초가 되는
                <br className="md:hidden" />{' '}
                <span className="font-bold">
                  퍼스널 브랜딩과 마스터 이력서 작성
                </span>
                을 다룹니다.
                <br />
                자기소개서 및 포트폴리오 완성 프로그램은
                <br className="md:hidden" /> 별도로 준비되어 있습니다.
              </p>
            )}
            {challengeType === PERSONAL_STATEMENT ||
              (challengeType === PERSONAL_STATEMENT_LARGE_CORP && (
                <p className="text-xsmall14 font-semibold text-neutral-40 md:text-center md:text-xsmall16">
                  본 프로그램은 취업의 기초가 되는
                  <br className="md:hidden" />{' '}
                  <span className="font-bold">자기소개서 작성</span>을 다룹니다.
                  <br /> 서류 기초 완성 및 포트폴리오 완성 프로그램은
                  <br className="md:hidden" /> 별도로 준비되어 있습니다.
                </p>
              ))}
            {challengeType === PORTFOLIO && (
              <p className="text-xsmall14 font-semibold text-neutral-40 md:text-center md:text-xsmall16">
                본 프로그램은 나만의 필살기를 만들 수 있는
                <br className="md:hidden" />{' '}
                <span className="font-bold">포트폴리오 제작 방법</span>을
                다룹니다.
                <br /> 서류 기초 작성 및 자기소개서 프로그램은
                <br className="md:hidden" /> 별도로 준비되어 있습니다.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 프로그램 추천 */}
      {programRecommend && programRecommend.list.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: colors.recommendBg }}
        >
          <div className="relative z-10 mx-7 flex justify-between">
            <HoleIcon className="h-auto w-4 md:w-5" />
            <HoleIcon className="h-auto w-4 md:w-5" />
            <HoleIcon className="h-auto w-4 md:w-5" />
            <HoleIcon className="h-auto w-4 md:w-5" />
            <HoleIcon className="h-auto w-4 md:w-5" />
            <HoleIcon className="h-auto w-4 md:w-5" />
            {/* Desktop */}
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
            <HoleIcon className="hidden h-auto w-4 md:block md:w-5" />
          </div>
          <img
            className="absolute -right-14 top-8 h-auto w-[362px] md:-top-12 md:w-[838px] lg:right-48"
            src={recommendLogoSrc}
          />

          {/* 본문 */}
          <div className="relative z-10 px-5 py-16 md:py-32 lg:px-0">
            <Heading2>
              잠깐, 다른 커리어 고민이 있으신가요?
              <br /> 커리어 단계에 맞는 프로그램을
              <br className="md:hidden" /> 추천드려요
            </Heading2>
            <ProgramRecommendSlider
              className="-mx-5 mt-8 max-w-[1000px] px-5 md:mx-auto md:mt-16 lg:px-0"
              list={slideList}
            />
          </div>
        </div>
      )}

      {/* 진행 방식 */}
      {point && (
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
                {point.weekText} 과정
              </div>
              <div className="flex flex-col gap-5 rounded-b-md bg-white px-4 py-[30px] md:flex-row md:justify-between md:gap-0 md:pb-[30px] md:pt-9 lg:px-7">
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
                  <ul className="flex flex-col gap-1">
                    {MISSION.content.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          width={24}
                          height={24}
                          className="shrink-0"
                          style={{ color: colors.primary }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </BoxItem>
              </Box>
              <Box className="relative overflow-hidden md:flex-1">
                <BoxItem title={reward.title}>{reward.content}</BoxItem>
                {challengeType !== PERSONAL_STATEMENT_LARGE_CORP &&
                  !challengeTitle.includes('마케팅') && (
                    <img
                      className="absolute bottom-0 right-0 h-auto w-44 md:w-48"
                      src={paypackImgSrc}
                      alt="페이백 3만원"
                    />
                  )}
              </Box>
            </div>
          </div>
        </div>
      )}
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
    <div key={item.index} className="flex gap-2">
      <div
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xsmall14 font-semibold text-white"
        style={{ backgroundColor: bgColor }}
      >
        {item.index}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="whitespace-pre-line text-xsmall16 font-bold text-neutral-0">
          {item.title}
        </span>
        {item.subTitle && (
          <span className="whitespace-pre-line text-xsmall14 text-neutral-45">
            {item.subTitle}
          </span>
        )}
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
