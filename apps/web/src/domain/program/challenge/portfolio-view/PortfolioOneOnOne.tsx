import { Break } from '@/common/Break';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import SuperTitle from '@/domain/program/program-detail/SuperTitle';
import { ChallengeType, challengeTypeSchema } from '@/schema';
import { useMemo } from 'react';
import Card from './portfolio-one-on-one/Card';
import { getPortfolioList } from './portfolio-one-on-one/portfolio-one-on-one.data';

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  PERSONAL_STATEMENT,
  ETC,
} = challengeTypeSchema.enum;

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

  const list = getPortfolioList(styles);

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
            <div className="md:text-xlarge28 break-keep text-[22px] font-bold text-black md:text-center">
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
