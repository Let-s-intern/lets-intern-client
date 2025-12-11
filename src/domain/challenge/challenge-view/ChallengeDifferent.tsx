import benefitImg1 from '@/assets/benefit1.jpg';
import benefitImg2 from '@/assets/benefit2.jpg';
import benefitImg3 from '@/assets/benefit3.jpg';
import { challengeColors } from '@/domain/challenge/challenge-view/ChallengeView';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import BenefitCard from '@components/common/program/program-detail/different/BenefitCard';
import DifferentCard, {
  DifferentCardProps,
} from '@components/common/program/program-detail/different/DifferentCard';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { useMemo } from 'react';

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  ETC,
} = challengeTypeSchema.enum;

export const tripleBenefits = [
  {
    title: '챌린지 수료시, 챌린지 3종 할인 쿠폰 제공',
    options: [
      '미션 80점 이상 완료 시 이력서, 자기소개서, 포트폴리오 완성 챌린지 할인 쿠폰 발급!\n(챌린지 3종 중 1회 적용 가능)',
    ],
    imgUrl: { src: '/images/benefit0.svg' },
  },
  {
    title: '온라인 대시보드',
    options: [
      `학습부터 미션 수행까지 올인원으로 관리할 수 있는 전용 대시보드`,
      `미션 현황과 기수별 주요 공지도 함께 열람할 수 있어 몰입감 UP!`,
    ],
    imgUrl: benefitImg1,
  },
  {
    title: '프로그램 수료증 발급',
    options: [
      `프로그램 종료 시, 참여자분들께 렛츠커리어에서 인증하는 참여 수료증을 발급해드립니다.`,
    ],
    imgUrl: benefitImg2,
  },
  {
    title: '네트워킹 파티',
    options: [
      `주니어 PM, 제조업 대기업 재직자 등이 포함된 커리어 선배들과의 온/오프라인 네트워킹 파티에 초대합니다.`,
    ],
    imgUrl: benefitImg3,
  },
];

const ChallengeDifferent = ({
  challengeType,
  challengeTitle,
  deposit,
  isResumeTemplate,
}: {
  challengeType: ChallengeType;
  challengeTitle: string;
  deposit: number;
  isResumeTemplate: boolean;
}) => {
  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          primaryLightColor: challengeColors.F3F4FF,
          borderColor: challengeColors._4D55F5,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          primaryLightColor: challengeColors.F0F4FF,
          borderColor: challengeColors._4A76FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors._14BCFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC6B9,
        };
      case ETC:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC6B9,
        };
      // 자소서
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors._14BCFF,
        };
    }
  }, [challengeType]);

  const differentList: DifferentCardProps[] = isResumeTemplate
    ? [
        {
          order: 1,
          title: `취업 준비가 더 이상 막막하지 않도록\nA부터 Z까지 알려주는 학습 콘텐츠`,
          options: [
            '초보 취준생도 따라갈 수 있는 친절한 길라잡이',
            '합격자 예시를 포함하여 서류 작성 스킬 UP',
            '2025년 주요 기업/직무 합격 자료로 파악하는 채용 트렌드',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/contents_desktop.gif',
            mobile: '/challenge-detail/different/mobile/contents_mobile.gif',
          },
          styles,
        },
        {
          order: 2,
          title: `서류와 면접의 기초 베이스가 되어줄\n미션 템플릿으로 나만의 이력서 완성`,
          options: [
            '하루 30분, 경험 정리부터 이력서까지 완성하는 실습',
            '누구나 쉽게 채울 수 있는 노션 템플릿',
            '수료 후에도 자산으로 남는 경험 회고록',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/template_desktop.gif',
            mobile: '/challenge-detail/different/mobile/template_mobile.gif',
          },
          styles,
        },
        {
          order: 3,
          title: `함께라서 할 수 있어요.\n챌린지 참여자들과 함께 동기부여!`,
          options: [
            '취업 여정의 동료들과 함께 지치지 않고 완성해요.',
            '자유로운 커뮤니티를 통해 스터디 함께할 수 있어요.',
            '서류 작성을 통해 커리어 고민 함께 나눠요.',
          ],
          imageUrl: {
            desktop:
              '/challenge-detail/different/desktop/community_desktop.gif',
            mobile: '/challenge-detail/different/mobile/community_mobile.gif',
          },
          styles,
        },
      ]
    : [
        {
          order: 1,
          title: `취업 준비가 더 이상 막막하지 않도록\nA부터 Z까지 알려주는 학습 콘텐츠`,
          options: [
            '초보 취준생도 따라갈 수 있는 친절한 길라잡이',
            '합격자 예시를 포함하여 콘텐츠 이해도 UP',
            'PDF 30페이지 분량의 추가 콘텐츠 제공',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/contents_desktop.gif',
            mobile: '/challenge-detail/different/mobile/contents_mobile.gif',
          },
          styles,
        },
        {
          order: 2,
          title: `서류와 면접의 기초 베이스가 되어줄\n미션 템플릿으로 나만의 취업 가이드북 완성`,
          options: [
            '하루 30분, 서류를 완성하는 실습',
            '누구나 쉽게 채울 수 있는 노션 템플릿',
            '수료 후에도 자산으로 남는 취업 가이드북',
          ],
          imageUrl: {
            desktop: '/challenge-detail/different/desktop/template_desktop.gif',
            mobile: '/challenge-detail/different/mobile/template_mobile.gif',
          },
          styles,
        },
        {
          order: 3,
          title: `시간은 어느새 흐르고,\n혼자 하기 어렵다면 사람들과\n함께 공유하며 성장하는 동기부여 시스템`,
          options: [
            `사람들과 함께 공유하며 성장하는\n오픈 카톡 커뮤니티`,
            '미션 80점 이상 완료 시, 수료증 지급',
          ],
          imageUrl: {
            desktop:
              '/challenge-detail/different/desktop/community_desktop.gif',
            mobile: '/challenge-detail/different/mobile/community_mobile.gif',
          },
          styles,
        },
      ];

  const paypackImgSrc = (() => {
    if (isResumeTemplate) return '/images/payback-career-start157.png';
    switch (challengeType) {
      case PORTFOLIO:
        return '/images/payback-portfolio.png';
      case CAREER_START:
        return '/images/payback-career-start.png';
      case EXPERIENCE_SUMMARY:
        return '/images/payback-experience-summary.svg';
      case ETC:
        return '/images/payback-experience-summary.svg';
      // 자소서
      case PERSONAL_STATEMENT:
        return '/images/payback-personal-statement.png';
      default:
        return undefined;
    }
  })();

  const iconName = useMemo(() => {
    switch (challengeType) {
      case PORTFOLIO:
        return 'different-icon-portfolio.svg';
      case CAREER_START:
        return 'different-icon-career-start.svg';
      case EXPERIENCE_SUMMARY:
        return 'different-icon-experience-summary.svg';
      case ETC:
        return 'different-icon-experience-summary.svg';
      case PERSONAL_STATEMENT:
        return 'different-icon-personal-statement.svg';
      default:
        return undefined;
    }
  }, [challengeType]);

  return (
    <section
      id="different"
      className="flex w-full flex-col gap-y-[70px] py-16 md:gap-y-40 md:py-40"
    >
      {/* 차별점 */}
      <div className="flex w-full flex-col gap-y-8 md:gap-y-20">
        <div className="flex w-full flex-col gap-y-6 md:gap-y-12">
          <SuperTitle style={{ color: styles.primaryColor }}>차별점</SuperTitle>
          <div className="flex flex-col gap-y-3 md:items-center">
            <p
              className="text-xsmall16 font-bold md:text-small18"
              style={{ color: styles.primaryColor }}
            >
              {isResumeTemplate
                ? `${challengeTitle}에서 얻어갈 수 있는 것들`
                : '비교 불가!'}
            </p>
            <div className="whitespace-pre text-[22px] font-bold text-black md:text-center md:text-xlarge28">
              {isResumeTemplate ? (
                <>
                  <span>렛츠커리어 챌린지만의 차별점</span>
                  <br />
                </>
              ) : (
                <>
                  <span>{challengeTitle}만의</span>
                  <br />
                </>
              )}
              <span>
                {isResumeTemplate ? '이 모든걸 ' : '차별점, 이 모든걸 '}
                <img
                  className="inline-block h-auto w-8 md:w-10"
                  src={`/icons/${iconName}`}
                  alt=""
                />{' '}
                얻어가실 수 있어요!
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-6">
          {differentList.map((different) => (
            <DifferentCard
              key={different.title}
              order={different.order}
              title={different.title}
              options={different.options}
              imageUrl={different.imageUrl}
              styles={styles}
            />
          ))}
          {deposit >= 10000 && (
            <div
              className="relative flex w-full gap-x-2 overflow-hidden rounded-md px-5 pb-10 pt-[30px] text-small18 font-bold md:px-10 md:py-[50px] md:text-medium22"
              style={{
                backgroundColor: styles.primaryLightColor,
                color: styles.primaryLightColor,
              }}
            >
              <span style={{ color: styles.primaryColor }}>혜택</span>
              <p className="z-10 whitespace-pre text-black">
                모든 커리큘럼을 따라오기만 하면,
                <br className="md:hidden" /> {deposit / 10000}
                만원을 페이백해드려요!
              </p>
              <img
                className="absolute bottom-0 right-0 h-auto w-28 md:top-0 md:w-48"
                src={paypackImgSrc}
                alt={`페이백 ${deposit / 10000}만원`}
              />
            </div>
          )}
        </div>
      </div>

      {/* 혜택 */}
      <div className="flex w-full flex-col gap-y-8 md:items-center md:gap-y-16">
        <p className="whitespace-pre-line text-small20 font-bold md:text-center md:text-xlarge28">
          여기서 끝이 아니죠
          <br />
          {challengeTitle}
          <br className="md:hidden" /> 참여자만을 위한{' '}
          {isResumeTemplate ? '' : '트리플'} 혜택!
        </p>

        <div
          className="-mx-5 flex w-fit flex-col gap-y-4 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:px-0"
          style={{ color: styles.primaryColor }}
        >
          {(challengeType === EXPERIENCE_SUMMARY || challengeType === ETC) && (
            <BenefitCard
              title={tripleBenefits[0].title}
              options={tripleBenefits[0].options}
              imgUrl={tripleBenefits[0].imgUrl.src}
            />
          )}
          <BenefitCard
            title={tripleBenefits[1].title}
            options={tripleBenefits[1].options}
            imgUrl={tripleBenefits[1].imgUrl.src}
          />
          {!isResumeTemplate && (
            <BenefitCard
              title={tripleBenefits[2].title}
              options={tripleBenefits[2].options}
              imgUrl={tripleBenefits[2].imgUrl.src}
            />
          )}
          <BenefitCard
            title={tripleBenefits[3].title}
            options={tripleBenefits[3].options}
            imgUrl={tripleBenefits[3].imgUrl.src}
          />
        </div>
      </div>
    </section>
  );
};

export default ChallengeDifferent;
