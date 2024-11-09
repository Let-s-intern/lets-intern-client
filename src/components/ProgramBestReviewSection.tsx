import { ContentReviewType } from '@/types/interface';
import ProgramDetailReviewItem from '@components/common/program/program-detail/review/ProgramDetailReviewItem';
import { ChallengeColor } from './ChallengeView';

interface ProgramBestReviewSectionProps {
  type: 'challenge' | 'live';
  reviews?: ContentReviewType[];
  colors?: ChallengeColor;
}

const ProgramBestReviewSection = ({
  type,
  reviews,
  colors,
}: ProgramBestReviewSectionProps) => {
  if (!reviews || reviews.length === 0) return;

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-y-8 md:items-center">
      <div className="flex flex-col gap-y-6 px-5 md:items-center md:gap-y-[50px] md:px-10">
        <p
          className="text-xsmall14 font-semibold text-primary md:text-small20"
          style={{ color: colors?.primary }}
        >
          후기
        </p>
        <div
          className={`flex flex-col ${type === 'challenge' ? 'gap-y-1' : 'gap-y-2.5'} md:items-center md:gap-y-5`}
        >
          <p
            className={`text-xsmall14 font-semibold md:text-small18 ${type === 'challenge' ? '' : 'w-fit rounded-[10px] bg-[#FFEACC] px-2 py-1'}`}
            style={{
              color: type === 'challenge' ? colors?.primary : '#E98900',
            }}
          >
            참여 만족도 4.9점
          </p>
          <p className="whitespace-pre text-small20 font-bold text-neutral-0 md:text-center md:text-xlarge28">{`참여자들의 진심이 담긴\n100% 솔직 후기`}</p>
        </div>
      </div>
      <div className="custom-scrollbar w-full gap-x-3 overflow-x-auto px-5 md:px-10 md:pt-5 lg:px-0">
        <div className="flex w-fit gap-x-3">
          {reviews.map((review, index) => (
            <ProgramDetailReviewItem
              key={index}
              type={type}
              review={review}
              color={
                type === 'challenge' && colors ? colors.primary : '#4d55f5'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramBestReviewSection;
