import Check from '@/assets/icons/chevron-down.svg?react';
import HoleIcon from '@/assets/icons/hole.svg?react';
import Heading2 from '@/common/header/Heading2';
import { LOCALIZED_YYYY_MDdd_HHmm } from '@/data/dayjsFormat';
import ProgramRecommendSlider from '@/domain/program-recommend/ProgramRecommendSlider';
import Box from '@/domain/program/challenge/challenge-view/challenge-point-view/Box';
import BoxItem from '@/domain/program/challenge/challenge-view/challenge-point-view/BoxItem';
import {
  CAREER_START,
  ETC,
  EXPERIENCE_SUMMARY,
  MARKETING,
  MISSION,
  PERSONAL_STATEMENT,
  PERSONAL_STATEMENT_LARGE_CORP,
  PORTFOLIO,
  description,
} from '@/domain/program/challenge/challenge-view/challenge-point-view/constants';
import { getProgramNotice } from '@/domain/program/challenge/challenge-view/challenge-point-view/getProgramNotice';
import IntroHeading from '@/domain/program/challenge/challenge-view/challenge-point-view/IntroHeading';
import PointList from '@/domain/program/challenge/challenge-view/challenge-point-view/PointList';
import ProgressItem from '@/domain/program/challenge/challenge-view/challenge-point-view/ProgressItem';
import PaybackTicket from '@/domain/program/challenge/challenge-view/PaybackTicket';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { ChallengeType } from '@/schema';
import { ChallengePoint, ProgramRecommend } from '@/types/interface';
import { Dayjs } from 'dayjs';
import { josa } from 'es-hangul';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const ChallengePointView = ({
  point,
  startDate,
  endDate,
  challengeType,
  challengeTitle,
  programRecommend,
  curationCard,
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
  /** 챌린지 상세: 추천 슬라이더 큐레이션 카드 노출 토글 (undefined → true 규약) */
  curationCard?: { visible: boolean };
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

  // 큐레이션 카드 노출 시 추천은 최대 2개로 제한 (사용자 페이지 안전장치)
  const effectiveList = useMemo(() => {
    const list = programRecommend?.list ?? [];
    const isVisible = curationCard?.visible ?? true;
    return isVisible ? list.slice(0, 2) : list;
  }, [curationCard?.visible, programRecommend?.list]);

  const slideList = useMemo(() => {
    const list = [];

    for (const item of effectiveList) {
      const to = `/program/${item.programInfo.programType.toLowerCase()}/${item.programInfo.id}`;

      list.push({
        id: item.programInfo.id,
        backgroundImage: item.programInfo.thumbnail ?? '',
        title: item.recommendTitle ?? '',
        cta: item.recommendCTA ?? '',
        to,
        onClickButton: () => {
          router.push(to);
        },
      });
    }

    return list;
  }, [effectiveList, router]);

  // 큐레이션 진입 카드 — `memo` 비교 유지를 위해 useMemo로 안정화
  const curationTrailingSlide = useMemo(() => {
    const isVisible = curationCard?.visible ?? true;
    if (!isVisible) return undefined;
    return {
      id: 'curation' as const,
      backgroundImage: '/images/curation-entry-card.png',
      title: '',
      cta: '나에게 맞는 프로그램을 찾자!',
      to: '/curation',
      onClickButton: () => router.push('/curation'),
      eventName: 'curation_entry_click',
      ariaLabel: '맞춤 챌린지 탐색 큐레이션 페이지로 이동',
    };
  }, [curationCard?.visible, router]);

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

  const weekText = point?.weekText ?? '2주';

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
            weekText={weekText}
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
            <p className="text-xsmall14 text-neutral-40 md:text-xsmall16 font-semibold md:text-center">
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
              trailingSlide={curationTrailingSlide}
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
                className="text-xsmall16 md:text-small20 font-bold"
                style={{ color: styles.primaryColor }}
              >
                진행 방식
              </p>
              <Heading2 className="py-3 pt-2 text-white md:pt-3">
                {josa(challengeTitle, '은/는')}
                <br className="md:hidden" /> {weekText}간 아래와 같이 진행돼요
              </Heading2>
              <span className="text-xsmall14 mb-10 text-neutral-50 md:mb-20">
                {description}
              </span>
            </div>
            <div className="mb-[30px] flex w-full flex-col md:mb-[23px]">
              <div
                className="text-xsmall14 flex w-full items-center rounded-t-md px-4 py-2.5 font-semibold text-white md:justify-center md:px-2.5"
                style={{ backgroundColor: styles.primaryColor }}
              >
                {weekText} 과정
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
                {challengeType === PERSONAL_STATEMENT ? (
                  <PaybackTicket
                    deposit={deposit}
                    className="absolute bottom-0 right-0 h-auto w-44 md:w-48"
                  />
                ) : (
                  paypackImgSrc && (
                    <img
                      className="absolute bottom-0 right-0 h-auto w-44 md:w-48"
                      src={paypackImgSrc}
                      alt={`페이백 ${deposit / 10000}만원`}
                    />
                  )
                )}
              </Box>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengePointView;
