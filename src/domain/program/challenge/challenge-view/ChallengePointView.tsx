import { getVod } from '@/api/program';
import Check from '@/assets/icons/chevron-down.svg?react';
import HoleIcon from '@/assets/icons/hole.svg?react';
import { LOCALIZED_YYYY_MDdd_HHmm } from '@/data/dayjsFormat';
import { challengeColors } from '@/domain/program/challenge/ChallengeView';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema, ProgramTypeEnum } from '@/schema';
import { ChallengePoint, ProgramRecommend } from '@/types/interface';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';
import ProgramRecommendSlider from '@components/common/ui/ProgramRecommendSlider';
import { Dayjs } from 'dayjs';
import { josa } from 'es-hangul';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

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
  MARKETING,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

const getProgramNotice = (
  challengeType: ChallengeType,
  isResumeTemplate: boolean,
) => {
  if (isResumeTemplate) {
    return (
      <>
        본 프로그램은 취업의 기초가 되는
        <br className="md:hidden" />{' '}
        <span className="font-bold">경험 구조화 및 이력서 작성</span>을
        다룹니다.
        <br />
        자기소개서 및 포트폴리오 완성 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (challengeType === CAREER_START) {
    return (
      <>
        본 프로그램은 취업의 기초가 되는
        <br className="md:hidden" />{' '}
        <span className="font-bold">퍼스널 브랜딩과 마스터 이력서 작성</span>을
        다룹니다.
        <br />
        자기소개서 및 포트폴리오 완성 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (
    challengeType === PERSONAL_STATEMENT ||
    challengeType === PERSONAL_STATEMENT_LARGE_CORP
  ) {
    return (
      <>
        본 프로그램은 취업의 기초가 되는
        <br className="md:hidden" />{' '}
        <span className="font-bold">자기소개서 작성</span>을 다룹니다.
        <br /> 서류 기초 완성 및 포트폴리오 완성 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (challengeType === PORTFOLIO) {
    return (
      <>
        본 프로그램은 나만의 필살기를 만들 수 있는
        <br className="md:hidden" />{' '}
        <span className="font-bold">포트폴리오 제작 방법</span>을 다룹니다.
        <br /> 서류 기초 작성 및 자기소개서 프로그램은
        <br className="md:hidden" /> 별도로 준비되어 있습니다.
      </>
    );
  }

  if (challengeType === EXPERIENCE_SUMMARY || challengeType === ETC) {
    return (
      <>
        본 프로그램은 서류 준비의 기초가 되는 경험정리를 다룹니다.
        <br className="hidden md:block" /> 이력서, 자기소개서, 포트폴리오
        프로그램에 앞서 수강하기를 권장드립니다.
      </>
    );
  }

  return null;
};

const IntroHeading = ({
  challengeType,
  challengeTitle,
  weekText,
  isResumeTemplate,
  introHeadingColor,
}: {
  challengeType: ChallengeType;
  challengeTitle: string;
  weekText: ChallengePoint['weekText'];
  isResumeTemplate: boolean;
  introHeadingColor: string;
}) => {
  if (isResumeTemplate) {
    return (
      <Heading2 className="mb-10 break-keep lg:mb-20">
        매력적인 이력서를 완성하는 {weekText}
        <br />
        <span style={{ color: introHeadingColor }}>
          합격 서류 확인하고 멘토 코멘트와 함께
        </span>{' '}
        이력서 완성해요!
      </Heading2>
    );
  }

  const isExperienceSummary =
    challengeType === EXPERIENCE_SUMMARY || challengeType === ETC;
  const taskText = isExperienceSummary ? '경험 정리' : '서류 준비';

  return (
    <Heading2 className="mb-10 break-keep lg:mb-20">
      {josa(challengeTitle, '을/를')} 통해
      <br />
      <span style={{ color: introHeadingColor }}>하루 30분</span>, 단 {weekText}
      만에 {taskText}를 <br className="lg:hidden" />
      끝낼 수 있어요
    </Heading2>
  );
};

const ChallengePointView = ({
  point,
  startDate,
  endDate,
  challengeType,
  challengeTitle,
  programRecommend,
  deposit,
  challengeId,
  isResumeTemplate,
}: {
  point: ChallengePoint;
  startDate: Dayjs;
  endDate: Dayjs;
  challengeType: ChallengeType;
  challengeTitle: string;
  programRecommend?: ProgramRecommend;
  deposit: number;
  challengeId: number;
  isResumeTemplate: boolean;
}) => {
  const router = useRouter();

  const progress = [
    { index: 1, title: '신청 완료' },
    { index: 2, title: '챌린지 대시보드 및\n오픈채팅방 초대' },
    { index: 3, title: 'OT' },
    { index: 4, title: '회차별 챌린지 가이드북\n및 미션 템플릿 제공' },
    { index: 5, title: '회차별 미션 수행' },
    {
      index: 6,
      title: '챌린지 종료 및 평가',
      subTitle:
        '*총 챌린지 참여 점수 80점 이상시,\n' +
        (challengeType === PERSONAL_STATEMENT_LARGE_CORP ||
        challengeType === MARKETING
          ? '수료증 발급'
          : `${deposit / 10000}만원 페이백 및 수료증 발급`),
    },
  ];

  const reward = {
    title:
      challengeType === EXPERIENCE_SUMMARY || challengeType === ETC
        ? '단돈 9,900원으로 완성하는\n나만의 경험&역량 데이터베이스!'
        : '챌린지에 성공해 뿌듯함과\n리워드까지 가져가세요!',
    content:
      '챌린지 참여 점수 80점 이상시,\n' +
      (challengeType === PERSONAL_STATEMENT_LARGE_CORP ||
      challengeType === MARKETING
        ? '수료증 발급'
        : `${deposit / 10000}만원 페이백 및 수료증 발급`),
  };

  const programSchedule = [
    {
      title: '진행 기간',
      content: `${startDate.format(LOCALIZED_YYYY_MDdd_HHmm)}\n~ ${endDate.format(LOCALIZED_YYYY_MDdd_HHmm)}`,
    },
    {
      title: 'OT 안내',
      content: (
        <>
          챌린지 대시보드 입장 후 0회차 미션을 통해 OT 영상 시청 부탁드립니다.
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
          challengeId >= 143
            ? '/images/payback-career-start157.png'
            : '/images/payback-career-start.png',
          '/icons/bg-logo-career-start.svg',
        ];
      case EXPERIENCE_SUMMARY:
        return [
          '/images/payback-experience-summary.svg',
          '/icons/bg-logo-experience-summary.svg',
        ];
      case ETC:
        return [
          '/images/payback-experience-summary.svg',
          '/icons/bg-logo-experience-summary.svg',
        ];
      case PERSONAL_STATEMENT:
        return [
          '/images/payback-personal-statement.png',
          '/icons/bg-logo-personal-statement.svg',
        ];
      default:
        return [null, null];
    }
  }, [challengeType, challengeId]);

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
  }, [programRecommend?.list, router]);

  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          introHeadingColor: challengeColors._4D55F5,
          darkColor: challengeColors._1A1D5F,
          recommendBgColor: challengeColors.EDEEFE,
          primaryLightColor: challengeColors.F3F4FF,
          buttonBgColor: challengeColors._4D55F5,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          introHeadingColor: challengeColors.F8AE00,
          darkColor: challengeColors._1A2A5D,
          recommendBgColor: challengeColors.F0F4FF,
          primaryLightColor: challengeColors.F0F4FF,
          buttonBgColor: challengeColors._4A76FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,
          introHeadingColor: challengeColors.FF9C34,
          darkColor: challengeColors._20304F,
          recommendBgColor: challengeColors.F1FBFF,
          primaryLightColor: challengeColors.EEFAFF,
          buttonBgColor: challengeColors._14BCFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          introHeadingColor: challengeColors.F26646,
          darkColor: challengeColors._261F1E,
          recommendBgColor: challengeColors.FFF6F4,
          primaryLightColor: challengeColors.FFF6F4,
          buttonBgColor: challengeColors.F26646,
        };
      case ETC:
        return {
          primaryColor: challengeColors.F26646,
          introHeadingColor: challengeColors.F26646,
          darkColor: challengeColors._261F1E,
          recommendBgColor: challengeColors.FFF6F4,
          primaryLightColor: challengeColors.FFF6F4,
          buttonBgColor: challengeColors.F26646,
        };
      // 자소서
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          introHeadingColor: challengeColors.FF9C34,
          darkColor: challengeColors._20304F,
          recommendBgColor: challengeColors.F1FBFF,
          primaryLightColor: challengeColors.EEFAFF,
          buttonBgColor: challengeColors._14BCFF,
        };
    }
  }, [challengeType]);

  return (
    <div className="flex w-full flex-col items-center">
      {/* 프로그램 소개 */}
      {point && (
        <div className="flex w-full max-w-[1000px] flex-col px-5 md:items-center md:px-10">
          <h2 className="sr-only">챌린지 포인트</h2>
          <SuperTitle
            className="mb-6 lg:mb-10"
            style={{
              color: styles.primaryColor,
            }}
          >
            프로그램 소개
          </SuperTitle>
          <IntroHeading
            challengeType={challengeType}
            challengeTitle={challengeTitle}
            weekText={point.weekText}
            isResumeTemplate={isResumeTemplate}
            introHeadingColor={styles.introHeadingColor}
          />
          <div className="mb-[70px] w-full space-y-10 md:mb-[120px] md:space-y-[60px] md:px-14">
            <ul className="max-w-[826px] space-y-4 md:space-y-6">
              {point.list?.map((item, index) => (
                <PointList
                  key={item.id}
                  item={item}
                  index={index}
                  listBgColor={styles.primaryLightColor}
                  listPointBgColor={styles.primaryColor}
                />
              ))}
            </ul>
            <p className="text-xsmall14 font-semibold text-neutral-40 md:text-center md:text-xsmall16">
              {getProgramNotice(challengeType, isResumeTemplate)}
            </p>
          </div>
        </div>
      )}

      {/* 프로그램 추천 */}
      {programRecommend && programRecommend.list.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: styles.recommendBgColor }}
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
          {recommendLogoSrc && (
            <img
              className="absolute -right-14 top-8 h-auto w-[362px] md:-top-12 md:w-[838px] lg:right-48"
              src={recommendLogoSrc}
              alt=""
            />
          )}

          {/* 본문 */}
          <div className="relative z-10 px-5 py-16 md:py-32 lg:px-0">
            <Heading2>
              잠깐, 다른 커리어 고민이 있으신가요?
              <br /> 커리어 단계에 맞는 프로그램을
              <br className="md:hidden" /> 추천드려요
            </Heading2>
            <ProgramRecommendSlider
              buttonStyle={{ backgroundColor: styles.buttonBgColor }}
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
            backgroundColor: styles.darkColor,
          }}
        >
          <div className="flex w-full max-w-[1000px] flex-col px-5 py-[60px] md:px-10 md:py-[120px] lg:px-0">
            <div className="flex w-full flex-col md:items-center">
              <p
                className="text-xsmall16 font-bold md:text-small20"
                style={{ color: styles.primaryColor }}
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
                style={{ backgroundColor: styles.primaryColor }}
              >
                {point.weekText} 과정
              </div>
              <div className="flex flex-col gap-5 rounded-b-md bg-white px-4 py-[30px] md:flex-row md:justify-between md:gap-0 md:pb-[30px] md:pt-9 lg:px-7">
                {progress.map((item) => (
                  <ProgressItem
                    key={item.index}
                    item={item}
                    bgColor={styles.primaryColor}
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
                          style={{ color: styles.primaryColor }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </BoxItem>
              </Box>
              <Box className="relative overflow-hidden md:flex-1">
                <BoxItem title={reward.title}>{reward.content}</BoxItem>
                {paypackImgSrc && (
                  <img
                    className="absolute bottom-0 right-0 h-auto w-44 md:w-48"
                    src={paypackImgSrc}
                    alt={`페이백 ${deposit / 10000}만원`}
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
  listBgColor,
  listPointBgColor,
}: {
  item: {
    id: string;
    title: string;
    subtitle: string;
  };
  index: number;
  listBgColor: string;
  listPointBgColor: string;
}) {
  return (
    <li
      key={item.id}
      className="mx-auto flex w-full flex-col items-center gap-5 self-stretch rounded-md p-8 md:pb-10"
      style={{ backgroundColor: listBgColor }}
    >
      <div className="break-keep text-center">
        <span
          className="rounded-md px-3.5 py-1.5 text-xsmall14 font-semibold text-white md:text-small18"
          style={{ backgroundColor: listPointBgColor }}
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
        'flex min-h-60 flex-col gap-2.5 rounded-md bg-neutral-100 p-5',
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
