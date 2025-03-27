import { ChallengeType, challengeTypeSchema } from '@/schema';
import { ContentReviewType } from '@/types/interface';
import ProgramDetailReviewItem from '@components/common/program/program-detail/review/ProgramDetailReviewItem';
import { useMemo } from 'react';
import { challengeColors } from './ChallengeView';

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

interface ProgramBestReviewSectionProps {
  type: 'challenge' | 'live';
  reviews?: ContentReviewType[];
  challengeType?: ChallengeType;
}

const ProgramBestReviewSection = ({
  type,
  reviews,
  challengeType,
}: ProgramBestReviewSectionProps) => {
  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          primaryLightColor: challengeColors.F3F4FF,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          primaryLightColor: challengeColors.F0F4FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF0ED,
        };
      case ETC:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF0ED,
        };
      // 자소서
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
        };
    }
  }, [challengeType]);

  if (!reviews || reviews.length === 0) return;

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-y-8">
      <div className="flex flex-col gap-y-6 px-5 md:items-center md:gap-y-[50px] md:px-10 lg:px-0">
        <p
          className="text-xsmall14 font-semibold text-primary md:text-small20"
          style={
            type === 'challenge' ? { color: styles.primaryColor } : undefined
          }
        >
          후기
        </p>
        <div
          className={`flex flex-col ${type === 'challenge' ? 'gap-y-1' : 'gap-y-2.5'} md:items-center md:gap-y-3`}
        >
          <p
            className={`text-xsmall14 font-semibold md:text-small18 ${type === 'challenge' ? '' : 'w-fit rounded-[10px] bg-[#FFEACC] px-2 py-1'}`}
            style={{
              color: type === 'challenge' ? styles.primaryColor : '#E98900',
            }}
          >
            참여 만족도 4.9점
          </p>
          <p className="whitespace-pre text-small20 font-bold text-neutral-0 md:text-center md:text-xlarge28">{`참여자들의 진심이 담긴\n100% 솔직 후기`}</p>
        </div>
      </div>

      {/* 슬라이드 */}
      <div className="custom-scrollbar w-full overflow-x-auto px-5 md:px-10 md:pt-5 lg:px-0">
        <div className="flex w-fit gap-x-3">
          {reviews.map((review, index) => (
            <ProgramDetailReviewItem
              key={index}
              type={type}
              review={review}
              color={type === 'challenge' ? styles.primaryColor : '#4d55f5'}
              bgColor={
                type === 'challenge' ? styles.primaryLightColor : '#edeefe'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramBestReviewSection;
