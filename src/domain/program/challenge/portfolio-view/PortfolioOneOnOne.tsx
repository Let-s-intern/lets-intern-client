import benefitImg1 from '@/assets/benefit1.jpg';
import benefitImg2 from '@/assets/benefit2.jpg';
import benefitImg3 from '@/assets/benefit3.jpg';
import { challengeColors } from '@/domain/program/challenge/ChallengeView';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { Break } from '@components/common/Break';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { useMediaQuery } from '@mui/material';
import { ReactNode, useMemo } from 'react';

export interface CardProps {
  order: number;
  title: ReactNode;
  description: ReactNode;
  imageUrl?: {
    desktop: string;
    mobile: string;
  };
  styles: {
    primaryColor: string;
    primaryLightColor: string;
    borderColor: string;
  };
}

const Card = ({ order, title, description, imageUrl, styles }: CardProps) => {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div
      className="mx-auto flex w-full max-w-[1000px] flex-col gap-x-[50px] gap-y-6 rounded-md border p-4 pb-[26px] text-black md:flex-row md:items-center md:px-10 md:pt-6"
      style={{
        backgroundColor: styles.primaryLightColor,
        borderColor: styles.borderColor,
      }}
    >
      {imageUrl && (
        <img
          src={isDesktop ? imageUrl.desktop : imageUrl.mobile}
          alt="1:1 멘토링 이미지"
          className="w-full flex-none rounded-t-md md:w-[288px] md:rounded-md lg:w-[464px] lg:translate-y-[26px] lg:rounded-b-none"
          style={{ width: isDesktop ? '464px' : '288px' }}
        />
      )}
      <div className="flex w-full flex-col gap-y-3">
        {order && (
          <p
            className="flex w-fit rounded-md px-[14px] py-1.5 text-xsmall14 font-semibold text-white lg:text-small18"
            style={{
              backgroundColor: styles.primaryColor,
            }}
          >{`Point ${order}`}</p>
        )}
        <div className="flex w-full flex-col gap-y-4">
          <h4 className="whitespace-pre-line text-small18 font-bold lg:text-medium22">
            {title}
          </h4>
          <div className="flex w-full flex-col md:gap-y-1">{description}</div>
        </div>
      </div>
    </div>
  );
};

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

const PortfolioOneOnOne = ({
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

  const list: CardProps[] = [
    {
      order: 1,
      title: (
        <>
          포폴 만들면서 궁금했던 점<Break />
          멘토님과 바로 해결할 수 있어요!
        </>
      ),
      description: (
        <>
          기존 포폴에 대한 코멘트와 딱 맞춘
          <Break />
          개선 방안까지 멘토링에서 가져갈 수 있어요.
        </>
      ),

      imageUrl: {
        desktop: '/images/포폴-피드백-388-210.gif',
        mobile: '/images/포폴-피드백-388-210.gif',
      },
      styles,
    },
    {
      order: 2,
      title: '실제 합격 자료 예시도 함께 해요!',
      description: (
        <>
          내 포폴 상황에서 참고할 수 있는
          <Break />
          실제 합격 자료도 함께 다뤄요.
        </>
      ),
      imageUrl: {
        desktop: '/images/포폴-피드백(합격자료)-666-352.gif',
        mobile: '/images/포폴-피드백(합격자료)-666-352.gif',
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
      id="portfolio-one-on-one"
      className="flex w-full flex-col gap-y-[70px] px-5 py-16 md:gap-y-40 md:px-10 md:pb-40"
    >
      {/* 차별점 */}
      <div className="flex w-full flex-col gap-y-8 md:gap-y-20">
        <div className="flex w-full flex-col gap-y-6">
          <SuperTitle style={{ color: styles.primaryColor }}>
            혼자 만들면서 겪었던 어려움과 고민
          </SuperTitle>
          <div className="flex flex-col gap-y-3 md:items-center">
            <div className="break-keep text-[22px] font-bold text-black md:text-center md:text-xlarge28">
              1:1 실시간 첨삭으로 <Break />
              나에게 <span className="text-[#4A76FF]">딱 맞춘 피드백</span>{' '}
              받고, 포폴 완성도 높이자!
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-6">
          {list.map((item, index) => (
            <Card
              key={index}
              order={item.order}
              description={item.description}
              title={item.title}
              imageUrl={item.imageUrl}
              styles={styles}
            />
          ))}
          {/* {deposit >= 10000 && (
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
          )} */}
        </div>
      </div>

      {/* 혜택 */}
      {/* <div className="flex w-full flex-col gap-y-8 md:items-center md:gap-y-16">
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
      </div> */}
    </section>
  );
};

export default PortfolioOneOnOne;
